import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import {
  MAX_MEALS_PER_DAY,
  MAX_MEAL_SETS_PER_ORDER,
  MAX_PEOPLE_PER_ORDER,
  mealSetCount,
} from "./bowl-selection";
import type { FulfillmentMethod } from "./brand";
import type { CheckoutAddress, TaxQuote } from "./square";

const TOKEN_TTL_MS = 15 * 60 * 1000;

type TaxQuoteTokenPayload = TaxQuote & {
  addressHash: string;
  expiresAt: number;
  fulfillmentMethod: FulfillmentMethod;
  mealsPerDay: number;
  peopleCount: number;
  version: 1;
};

function secret(): string | null {
  return process.env.CHECKOUT_QUOTE_SECRET || null;
}

function addressHash(
  fulfillmentMethod: FulfillmentMethod,
  address: CheckoutAddress | null,
): string {
  const normalized = address
    ? [
        fulfillmentMethod,
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.postalCode,
      ]
        .map((part) => part.trim().toLowerCase())
        .join("|")
    : fulfillmentMethod;
  return createHash("sha256").update(normalized).digest("base64url");
}

function validQuote(value: unknown): value is TaxQuoteTokenPayload {
  if (!value || typeof value !== "object") return false;
  const quote = value as Partial<TaxQuoteTokenPayload>;
  return (
    quote.version === 1 &&
    (quote.fulfillmentMethod === "pickup" || quote.fulfillmentMethod === "delivery") &&
    typeof quote.addressHash === "string" &&
    typeof quote.expiresAt === "number" &&
    Number.isInteger(quote.mealsPerDay) &&
    Number.isInteger(quote.peopleCount) &&
    quote.mealsPerDay! >= 1 &&
    quote.mealsPerDay! <= MAX_MEALS_PER_DAY &&
    quote.peopleCount! >= 1 &&
    quote.peopleCount! <= MAX_PEOPLE_PER_ORDER &&
    mealSetCount(quote.peopleCount!, quote.mealsPerDay!) <=
      MAX_MEAL_SETS_PER_ORDER &&
    typeof quote.subtotalCents === "number" &&
    typeof quote.taxCents === "number" &&
    typeof quote.totalCents === "number" &&
    typeof quote.percentage === "string" &&
    typeof quote.jurisdiction === "string" &&
    quote.county === "LOS ANGELES" &&
    quote.subtotalCents > 0 &&
    quote.taxCents >= 0 &&
    quote.totalCents === quote.subtotalCents + quote.taxCents
  );
}

export function createTaxQuoteToken(
  quote: TaxQuote,
  fulfillmentMethod: FulfillmentMethod,
  address: CheckoutAddress | null,
  peopleCount: number,
  mealsPerDay: number,
): string | null {
  const signingSecret = secret();
  if (!signingSecret) return null;
  const payload: TaxQuoteTokenPayload = {
    ...quote,
    addressHash: addressHash(fulfillmentMethod, address),
    expiresAt: Date.now() + TOKEN_TTL_MS,
    fulfillmentMethod,
    mealsPerDay,
    peopleCount,
    version: 1,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", signingSecret)
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyTaxQuoteToken(
  token: string,
  fulfillmentMethod: FulfillmentMethod,
  address: CheckoutAddress | null,
  peopleCount: number,
  mealsPerDay: number,
): TaxQuote | null {
  const signingSecret = secret();
  if (!signingSecret) return null;
  const [encoded, suppliedSignature, extra] = token.split(".");
  if (!encoded || !suppliedSignature || extra) return null;

  const expectedSignature = createHmac("sha256", signingSecret)
    .update(encoded)
    .digest("base64url");
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as unknown;
    if (!validQuote(payload)) return null;
    if (payload.expiresAt <= Date.now()) return null;
    if (payload.fulfillmentMethod !== fulfillmentMethod) return null;
    if (payload.peopleCount !== peopleCount) return null;
    if (payload.mealsPerDay !== mealsPerDay) return null;
    if (payload.addressHash !== addressHash(fulfillmentMethod, address)) return null;
    return {
      county: payload.county,
      jurisdiction: payload.jurisdiction,
      percentage: payload.percentage,
      subtotalCents: payload.subtotalCents,
      taxCents: payload.taxCents,
      totalCents: payload.totalCents,
    };
  } catch {
    return null;
  }
}
