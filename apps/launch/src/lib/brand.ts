/**
 * Brand constants — Soul Bowls™ (Brand Kit is the source of truth).
 *
 * The Brand Kit supersedes the old codebase tokens (the old terracotta hex and
 * serif fonts). Do not reintroduce those here.
 */

/** Product name — always include the trademark symbol in customer-facing copy. */
export const BRAND_NAME = "Soul Bowls™";

/** Company operating the Soul Bowls™ service. */
export const BUSINESS = {
  legalName: "Soul Goods LLC",
  jurisdiction: "California",
  serviceArea: "Los Angeles and Orange County, California",
  /** Postal address for legal notices, privacy requests, and marketing emails (CAN-SPAM). */
  mailingAddress: "2450 Colorado Ave, Suite 100E, Santa Monica, CA 90404",
  kitchenAddress: "456 Elm Ave, Long Beach, CA 90802",
  website: "https://www.soulgood.kitchen",
} as const;

/** Where and when each kind of delivery runs. */
export const SERVICE_AREA = {
  /** Weekly meal-prep delivery, verified server-side from the CDTFA county. */
  weeklyCounties: ["LOS ANGELES", "ORANGE"] as const,
  weekly: "Los Angeles and Orange County",
  weeklyShort: "LA & Orange County",
  weeklyDay: "Sunday",
  kitchen: "Long Beach",
} as const;

export type ServiceCounty = (typeof SERVICE_AREA.weeklyCounties)[number];

/**
 * Order rules shared by weekly nourishment and on-demand (Take Out) orders.
 * Take Out enforces these in its Square Online settings; checkout enforces them here.
 */
export const ORDER_RULES = {
  minimumOrderCents: 5000,
  freeDeliveryOverCents: 10000,
  minimumLabel: "$50 minimum order",
  freeDeliveryLabel: "Free delivery on orders over $100",
} as const;

export const CONTACT = {
  email: "contact@soulgood.com",
} as const;

/** Version saved with customer consent records. */
export const LEGAL_VERSION = "2026-09-25";

function parseFeeCents(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const cents = Number(value);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export function formatCents(amountCents: number | null): string {
  if (amountCents === null) return "Pending configuration";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

/** Delivery fee for a food subtotal (before tax). Pickup is always free. */
export function fulfillmentFeeCents(
  method: "pickup" | "delivery",
  foodSubtotalCents: number,
): number {
  if (method === "pickup") return 0;
  return foodSubtotalCents > ORDER_RULES.freeDeliveryOverCents ? 0 : FEES.delivery.amountCents;
}

/** Canonical product line. */
export const TAGLINE = "Nourish · Heal · Thrive";

/** Brand-led language for the scheduled offering, available once or weekly. */
export const NOURISHMENT = {
  label: "Weekly nourishment",
  cta: "Build your ritual",
  headline: "Nourishment for your everyday.",
  deliveryDisclosure:
    "Weekly meal prep is delivered exclusively by the Soul Good team, not third-party couriers.",
  deliverySummary:
    "Sunday delivery across Los Angeles and Orange County. $8.88, or free on orders over $100.",
} as const;

/** Founder name — always "Chef Kyla" (the source quote-card typo is corrected here). */
export const FOUNDER = "Chef Kyla";

/**
 * Plan pricing — single source of truth for every price shown across the
 * microsite. Each five-meal set is $88 for one-time and weekly checkout.
 */
export const PRICING = {
  /** One-time order price. */
  oneTime: "$88",
  /** One-time order price in cents. */
  oneTimeCents: 8800,
  /** Recurring weekly price. */
  weekly: "$88",
  /** Weekly price in cents, for the recurring Square subscription plan. */
  weeklyCents: 8800,
} as const;

export const PURCHASE_OPTIONS = {
  "one-time": {
    label: "One-time order",
    disclosure: "One charge. No automatic renewal.",
  },
  weekly: {
    label: "Weekly plan",
    disclosure: "Renews every 7 days until canceled.",
  },
} as const;

export type PurchaseType = keyof typeof PURCHASE_OPTIONS;

/**
 * Fulfillment and reusable-container charges shown throughout the experience.
 */
export const FEES = {
  delivery: {
    label: "Sunday delivery",
    amountCents: 888,
    disclosure: "$8.88 per Sunday delivery in Los Angeles and Orange County, free on orders over $100.",
  },
  containerDeposit: {
    label: "Refundable reusable-container deposit",
    amountCents: parseFeeCents(
      process.env.NEXT_PUBLIC_SOUL_BOWLS_CONTAINER_DEPOSIT_CENTS,
    ),
    disclosure: "Disclosed before containers are issued and credited when eligible containers are returned.",
  },
} as const;

export const FULFILLMENT = {
  pickup: {
    label: "Pickup",
    amountCents: 0,
    disclosure: "No fulfillment fee. Pickup location and window are confirmed before fulfillment.",
  },
  delivery: {
    label: "Sunday delivery",
    amountCents: FEES.delivery.amountCents,
    disclosure: FEES.delivery.disclosure,
  },
} as const;

export type FulfillmentMethod = keyof typeof FULFILLMENT;

export const TAX = {
  disclosure:
    "Applicable California sales tax is calculated from the official CDTFA address rate, verified server-side, and billed by Square.",
} as const;

/**
 * Plan cadence & fulfillment — single source of truth for what's in a week and
 * how it's delivered.
 */
export const PLAN = {
  bowlsPerWeek: 5,
  /** Human phrasing of the weekly plan. */
  cadence: "Five chef-made 32 oz jarred bowls each week",
  /** Day boxes are delivered. */
  deliveryDay: "Sunday",
  /** Short fulfillment line. */
  deliveryNote: "Sunday pickup, or Sunday delivery across LA & Orange County",
} as const;

/**
 * Brand Kit palette. These hex values are the single source of truth and must
 * match the `@theme` tokens declared in `globals.css`.
 */
export const PALETTE = {
  /** Sage Ritual */
  sage: "#77916F",
  /** Forest Depth */
  forest: "#2C3A34",
  /** Clay Essence */
  clay: "#C17A5E",
  /** Soft Oat */
  oat: "#F8F3EC",
  /** Golden Harvest */
  gold: "#C9A161",
  /** Warm Sand */
  sand: "#ECD6BC",
} as const;

export type BrandColor = keyof typeof PALETTE;
