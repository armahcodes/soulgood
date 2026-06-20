/**
 * Brand constants — Soul Good (Brand Kit is the source of truth).
 *
 * The Brand Kit supersedes the old codebase tokens (the old terracotta hex and
 * serif fonts). Do not reintroduce those here.
 */

/** Canonical tagline — bullet-separated, this exact casing. */
export const TAGLINE = "Nourish • Heal • Thrive";

/** Founder name — always "Chef Kyla" (the source quote-card typo is corrected here). */
export const FOUNDER = "Chef Kyla";

/**
 * Plan pricing — single source of truth for every price shown across the
 * microsite. The weekly plan is $111/week; a member's first week is an intro
 * price of $88. There is no deposit — checkout places the first order directly.
 */
export const PRICING = {
  /** Recurring weekly price. */
  weekly: "$111",
  /** Intro price for a member's first week (the amount charged at checkout). */
  firstWeek: "$88",
  /** First-week price in cents, for the Stripe Checkout line item. */
  firstWeekCents: 8800,
} as const;

/**
 * Plan cadence & fulfillment — single source of truth for what's in a week and
 * how it's delivered. One meal per day, Monday–Friday (5 meals), plus 5
 * functional juices, delivered fresh every Sunday.
 */
export const PLAN = {
  mealsPerWeek: 5,
  juicesPerWeek: 5,
  /** Human phrasing of the meal cadence. */
  cadence: "One meal a day, Monday\u2013Friday",
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
