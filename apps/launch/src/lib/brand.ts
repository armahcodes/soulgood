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
  serviceArea: "Los Angeles County, California",
} as const;

export const CONTACT = {
  email: "contact@soulgood.com",
} as const;

/** Version saved with customer consent records. */
export const LEGAL_VERSION = "2026-08-28";

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

/** Canonical product line. */
export const TAGLINE = "Five bowls • One easy week";

/** Founder name — always "Chef Kyla" (the source quote-card typo is corrected here). */
export const FOUNDER = "Chef Kyla";

/**
 * Plan pricing — single source of truth for every price shown across the
 * microsite. The plan is a flat $55/week with no introductory-price tier.
 */
export const PRICING = {
  /** Recurring weekly price. */
  weekly: "$55",
  /** Weekly price in cents, for the recurring Stripe Checkout line item. */
  weeklyCents: 5500,
} as const;

/**
 * Delivery and reusable-container charges remain centrally configurable. The
 * amounts must be approved by the business before online payment is activated.
 */
export const FEES = {
  delivery: {
    label: "Delivery charge",
    amountCents: parseFeeCents(
      process.env.NEXT_PUBLIC_SOUL_BOWLS_DELIVERY_FEE_CENTS,
    ),
    disclosure: "Based on the delivery address and route; disclosed before payment.",
  },
  containerDeposit: {
    label: "Refundable reusable-container deposit",
    amountCents: parseFeeCents(
      process.env.NEXT_PUBLIC_SOUL_BOWLS_CONTAINER_DEPOSIT_CENTS,
    ),
    disclosure: "Disclosed before payment and credited when eligible containers are returned.",
  },
} as const;

/**
 * Plan cadence & fulfillment — single source of truth for what's in a week and
 * how it's delivered.
 */
export const PLAN = {
  bowlsPerWeek: 5,
  /** Human phrasing of the weekly plan. */
  cadence: "Five chef-made bowls each week",
  /** Day boxes are delivered. */
  deliveryDay: "Sunday",
  /** Short fulfillment line. */
  deliveryNote: "Delivered fresh every Sunday",
} as const;

/**
 * Brand Kit palette. These hex values are the single source of truth and must
 * match the `@theme` tokens declared in `globals.css`.
 */
export const PALETTE = {
  /** Sage Ritual */
  sage: "#77916F",
  /** Forest Depth */
  forest: "#20352F",
  /** Clay Essence */
  clay: "#D86D45",
  /** Soft Oat */
  oat: "#FBF7EF",
  /** Golden Harvest */
  gold: "#F3C96B",
  /** Warm Sand */
  sand: "#ECD6BC",
} as const;

export type BrandColor = keyof typeof PALETTE;
