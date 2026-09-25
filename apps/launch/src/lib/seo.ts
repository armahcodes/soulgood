import type { Metadata } from "next";

/**
 * One place for page titles, descriptions, canonical URLs, and share settings.
 * Titles lead with what people search for (and where), then " | Soul Good" is
 * added by the root layout's template. Descriptions stay under ~155 characters
 * and describe food, service, and area facts only — no health claims.
 */

export const SITE_URL = "https://www.soulgood.kitchen";
export const SITE_NAME = "Soul Good";

export const DEFAULT_TITLE = "Soul Good | Chef-Made Meal Prep Delivery in LA & Orange County";
export const DEFAULT_DESCRIPTION =
  "Chef-made Soul Bowls™, salads, and sides by Chef Kyla. Delivered Sundays across Los Angeles and Orange County; free delivery over $100.";

type PageSeo = { title: string; description: string; index?: boolean; ogImage?: boolean };

export const PAGE_SEO = {
  "/menu": {
    title: "Menu: Soul Bowls™, Salads & Veggie Sides",
    description: "Every Soul Bowl™, made-to-order salad, veggie cup, and snack, with prices, ingredients, and allergens. Build your own salad your way.",
    ogImage: true,
  },
  "/checkout": {
    title: "Order Weekly Meal Prep, Delivered Sundays",
    description: "Build a one-time or weekly order of chef-made Soul Bowls™ and sides. Sunday delivery across LA and Orange County, $50 minimum, free over $100.",
    ogImage: true,
  },
  "/quiz": {
    title: "Pathway Finder: Bowls Matched to You",
    description: "Answer 12 quick questions about your days and tastes, and we’ll suggest Soul Bowls™, salads, and sides to start with. About 2 minutes.",
    ogImage: true,
  },
  "/eat-now": {
    title: "Take Out & On-Demand Delivery near Long Beach",
    description: "Single Soul Bowls™ Thursday–Sunday: pickup, or on-demand delivery by partners like Uber Direct or DoorDash within about 20 miles of Long Beach.",
    ogImage: true,
  },
  "/quote": {
    title: "Los Angeles Catering: Bowl Delivery & Plated Dinners",
    description: "Plan a gathering in LA County: Soul Bowls™ delivered from 10 bowls, or plated dinners from $55 per guest. Get an itemized estimate in minutes.",
    ogImage: true,
  },
  "/food-for-the-soul": {
    title: "Food for the Soul: Free Community Meal Drives",
    description: "Soul Good’s community initiative bringing free, chef-made meals to neighborhoods in LA and Orange County. Open to all, first come, first served.",
    ogImage: true,
  },
  "/food-for-the-soul/host": {
    title: "Host a Free Community Meal Drive",
    description: "Organizations in Los Angeles and Orange County can apply to host a Food for the Soul meal drive. Free meals, open to all, first come, first served.",
    ogImage: true,
  },
  "/terms": {
    title: "Terms of Service",
    description: "Terms for Soul Good meal prep, Take Out, gatherings, the newsletter, and Food for the Soul meal drives, operated by Soul Goods LLC.",
  },
  "/customer-agreement": {
    title: "Customer Agreement",
    description: "Purchase terms for Soul Good orders and weekly plans: pricing, salads and sides, renewal, cancellation, delivery, and exchanges.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "How Soul Goods LLC collects, uses, shares, and protects personal information, and the privacy choices and rights available to you.",
  },
  "/privacy-choices": {
    title: "Your Privacy Choices",
    description: "Opt out of sale or sharing, manage marketing email, clear data saved on this device, and make a privacy request.",
  },
  "/newsletter": { title: "Newsletter", description: "New menus, Food for the Soul meal drives, and news from the Soul Good kitchen.", index: false },
  "/login": { title: "Sign in", description: "Sign in by email to view your Soul Good orders and manage weekly plans.", index: false },
  "/account": { title: "My orders", description: "Review your Soul Good orders and weekly plans.", index: false },
  "/cancel": { title: "Manage weekly plans", description: "View your weekly plans and cancel future renewals online.", index: false },
  "/welcome": { title: "Order status", description: "Your Soul Good checkout confirmation and next steps.", index: false },
  "/join": { title: "Order Soul Bowls™", description: "Start a Soul Good order.", index: false },
} satisfies Record<string, PageSeo>;

export type SeoPath = keyof typeof PAGE_SEO;

/** Metadata for a page: title (templated), description, canonical, robots, and Open Graph/Twitter. */
export function pageMetadata(path: SeoPath | string, seo: PageSeo = PAGE_SEO[path as SeoPath]): Metadata {
  const index = seo.index !== false;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  // A page-level openGraph replaces the layout's, so keep the right share image attached:
  // pages with their own opengraph-image file get it automatically; others use the site card.
  const images = seo.ogImage ? undefined : [{ url: "/opengraph-image", width: 1200, height: 630, alt: DEFAULT_TITLE }];
  return {
    title: seo.title,
    description: seo.description,
    ...(index ? { alternates: { canonical: path } } : { robots: { index: false, follow: true } }),
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url, title: `${seo.title} | ${SITE_NAME}`, description: seo.description, ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title: `${seo.title} | ${SITE_NAME}`, description: seo.description, ...(images ? { images: images.map((image) => image.url) } : {}) },
  };
}
