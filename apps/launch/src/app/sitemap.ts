import type { MetadataRoute } from "next";
import { LEGAL_VERSION } from "@/lib/brand";

const BASE = "https://www.soulgood.kitchen";

/** Public, indexable pages. Account, checkout-result, and API routes are excluded. */
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/menu", priority: 0.9, changeFrequency: "weekly" },
  { path: "/checkout", priority: 0.8, changeFrequency: "weekly" },
  { path: "/quiz", priority: 0.7, changeFrequency: "monthly" },
  { path: "/eat-now", priority: 0.7, changeFrequency: "weekly" },
  { path: "/quote", priority: 0.7, changeFrequency: "monthly" },
  { path: "/food-for-the-soul", priority: 0.6, changeFrequency: "weekly" },
  { path: "/food-for-the-soul/host", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/customer-agreement", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy-choices", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(`${LEGAL_VERSION}T00:00:00Z`);
  return PAGES.map((page) => ({
    url: `${BASE}${page.path === "/" ? "" : page.path}`,
    lastModified: ["/terms", "/customer-agreement", "/privacy", "/privacy-choices"].includes(page.path) ? legalDate : new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
