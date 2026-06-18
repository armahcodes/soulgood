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
