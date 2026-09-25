import type { MetadataRoute } from "next";
import { LEGAL_VERSION } from "@/lib/brand";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";
import { DELIVERY_AREAS } from "@/lib/delivery-areas";
import { MENU_EXTRAS } from "@/lib/menu-extras";
import { SITE_URL } from "@/lib/seo";

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; images?: string[] };

const LEGAL = ["/terms", "/customer-agreement", "/privacy", "/privacy-choices"];
const bowlImages = AVAILABLE_BOWLS.map((bowl) => `/products/${bowl.id}.webp`);
const menuImages = [...bowlImages, ...MENU_EXTRAS.map((item) => item.imagePath)];

/** Public, indexable pages (private pages are noindex and left out), with image sitemap entries. */
const PAGES: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", images: bowlImages },
  { path: "/menu", priority: 0.9, changeFrequency: "weekly", images: menuImages },
  { path: "/checkout", priority: 0.8, changeFrequency: "weekly" },
  { path: "/delivery", priority: 0.6, changeFrequency: "monthly" },
  ...DELIVERY_AREAS.map((area) => ({ path: `/delivery/${area.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  { path: "/quiz", priority: 0.7, changeFrequency: "monthly" },
  { path: "/eat-now", priority: 0.7, changeFrequency: "weekly" },
  { path: "/quote", priority: 0.7, changeFrequency: "monthly", images: ["/gatherings/plated-dinner.webp", "/gatherings/team-lunch.webp", "/gatherings/garden-gathering.webp", "/gatherings/chef-plating.webp"] },
  { path: "/food-for-the-soul", priority: 0.6, changeFrequency: "weekly" },
  { path: "/food-for-the-soul/host", priority: 0.5, changeFrequency: "monthly" },
  ...LEGAL.map((path) => ({ path, priority: 0.2, changeFrequency: "yearly" as const })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const legalDate = new Date(`${LEGAL_VERSION}T00:00:00Z`);
  return PAGES.map((page) => ({
    url: `${SITE_URL}${page.path === "/" ? "" : page.path}`,
    lastModified: LEGAL.includes(page.path) ? legalDate : new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    ...(page.images ? { images: page.images.map((image) => `${SITE_URL}${image}`) } : {}),
  }));
}
