import { FULFILLMENT, type FulfillmentMethod, PRICING } from "@/lib/brand";

export const SQUARE_API_VERSION = "2026-08-19";

export type CheckoutAddress = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: "CA";
  postalCode: string;
};

export type TaxQuote = {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  percentage: string;
  jurisdiction: string;
  county: "LOS ANGELES";
};

type Fetcher = typeof fetch;

type TaxQuoteCacheEntry = {
  expiresAt: number;
  value: Promise<TaxQuote>;
};

const TAX_QUOTE_CACHE_TTL_MS = 10 * 60 * 1000;
const TAX_QUOTE_CACHE_MAX_ENTRIES = 250;
const globalForSquare = globalThis as typeof globalThis & {
  _soulGoodTaxQuoteCache?: Map<string, TaxQuoteCacheEntry>;
};

function taxQuoteCache(): Map<string, TaxQuoteCacheEntry> {
  globalForSquare._soulGoodTaxQuoteCache ??= new Map();
  return globalForSquare._soulGoodTaxQuoteCache;
}

function taxQuoteCacheKey(
  fulfillmentMethod: FulfillmentMethod,
  address: CheckoutAddress | null,
  mealSets: number,
): string {
  if (!address) return `${fulfillmentMethod}|sets:${mealSets}`;
  return [
    fulfillmentMethod,
    `sets:${mealSets}`,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
  ]
    .map((part) => part.trim().toLowerCase())
    .join("|");
}

export class SquareApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly codes: string[],
  ) {
    super(message);
  }
}

function squareBaseUrl(): string {
  return process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export async function squareRequest<T>(
  path: string,
  init: RequestInit = {},
  fetcher: Fetcher = fetch,
): Promise<T> {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) throw new SquareApiError("Square is not configured", 503, []);

  const response = await fetcher(`${squareBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Square-Version": SQUARE_API_VERSION,
      ...init.headers,
    },
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as {
    errors?: Array<{ code?: string }>;
  } & T;

  if (!response.ok) {
    throw new SquareApiError(
      "Square request failed",
      response.status,
      (body.errors ?? []).flatMap((error) => (error.code ? [error.code] : [])),
    );
  }
  return body;
}

function addressToSquare(address: CheckoutAddress) {
  return {
    address_line_1: address.addressLine1,
    ...(address.addressLine2 ? { address_line_2: address.addressLine2 } : {}),
    locality: address.city,
    administrative_district_level_1: address.state,
    postal_code: address.postalCode,
    country: "US",
  };
}

export { addressToSquare };

async function getPickupAddress(fetcher: Fetcher): Promise<CheckoutAddress> {
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!locationId) throw new Error("Square location is not configured");
  const body = await squareRequest<{
    location?: {
      address?: {
        address_line_1?: string;
        address_line_2?: string;
        locality?: string;
        administrative_district_level_1?: string;
        postal_code?: string;
      };
    };
  }>(`/v2/locations/${encodeURIComponent(locationId)}`, {}, fetcher);
  const address = body.location?.address;
  if (
    !address?.address_line_1 ||
    !address.locality ||
    address.administrative_district_level_1 !== "CA" ||
    !address.postal_code
  ) {
    throw new Error("The Square pickup location needs a complete California address");
  }
  return {
    addressLine1: address.address_line_1,
    addressLine2: address.address_line_2 ?? "",
    city: address.locality,
    state: "CA",
    postalCode: address.postal_code,
  };
}

async function lookupCaliforniaTax(
  address: CheckoutAddress,
  fetcher: Fetcher,
): Promise<{ rate: number; jurisdiction: string; county: string }> {
  const params = new URLSearchParams({
    address: address.addressLine1,
    city: address.city,
    zip: address.postalCode,
  });
  const response = await fetcher(
    `https://services.maps.cdtfa.ca.gov/api/taxrate/GetRateByAddress?${params}`,
    { cache: "no-store" },
  );
  const body = (await response.json().catch(() => ({}))) as {
    taxRateInfo?: Array<{
      rate?: number;
      jurisdiction?: string;
      county?: string;
    }>;
  };
  const result = body.taxRateInfo?.[0];
  if (!response.ok || !result || typeof result.rate !== "number") {
    throw new Error("California could not verify that address or calculate its tax rate");
  }
  return {
    rate: result.rate,
    jurisdiction: result.jurisdiction ?? address.city.toUpperCase(),
    county: (result.county ?? "").toUpperCase(),
  };
}

async function calculateTaxQuote(
  fulfillmentMethod: FulfillmentMethod,
  deliveryAddress: CheckoutAddress | null,
  mealSets: number,
  fetcher: Fetcher = fetch,
): Promise<TaxQuote> {
  const taxableAddress =
    fulfillmentMethod === "pickup"
      ? await getPickupAddress(fetcher)
      : deliveryAddress;
  if (!taxableAddress) throw new Error("A delivery address is required");

  const tax = await lookupCaliforniaTax(taxableAddress, fetcher);
  if (fulfillmentMethod === "delivery" && tax.county !== "LOS ANGELES") {
    throw new Error("Delivery is currently available only in Los Angeles County");
  }
  if (!Number.isFinite(tax.rate) || tax.rate <= 0 || tax.rate >= 0.2) {
    throw new Error("California returned an invalid tax rate");
  }

  const subtotalCents =
    PRICING.weeklyCents * mealSets + FULFILLMENT[fulfillmentMethod].amountCents;
  const taxCents = Math.round(subtotalCents * tax.rate);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    percentage: (tax.rate * 100).toFixed(4).replace(/0+$/, "").replace(/\.$/, ""),
    jurisdiction: tax.jurisdiction,
    county: "LOS ANGELES",
  };
}

/**
 * Reuse a recent verified quote when checkout follows the tax-preview request.
 * This removes a duplicate CDTFA/Square lookup without trusting client totals.
 */
export async function getTaxQuote(
  fulfillmentMethod: FulfillmentMethod,
  deliveryAddress: CheckoutAddress | null,
  mealSets = 1,
  fetcher: Fetcher = fetch,
): Promise<TaxQuote> {
  if (!Number.isInteger(mealSets) || mealSets < 1 || mealSets > 6) {
    throw new Error("This online order supports between 5 and 30 bowls");
  }
  if (process.env.NODE_ENV === "test") {
    return calculateTaxQuote(fulfillmentMethod, deliveryAddress, mealSets, fetcher);
  }

  const cache = taxQuoteCache();
  const key = taxQuoteCacheKey(fulfillmentMethod, deliveryAddress, mealSets);
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) return cached.value;
  if (cached) cache.delete(key);

  if (cache.size >= TAX_QUOTE_CACHE_MAX_ENTRIES) {
    cache.delete(cache.keys().next().value as string);
  }

  const value = calculateTaxQuote(
    fulfillmentMethod,
    deliveryAddress,
    mealSets,
    fetcher,
  );
  cache.set(key, { expiresAt: now + TAX_QUOTE_CACHE_TTL_MS, value });
  value.catch(() => cache.delete(key));
  return value;
}
