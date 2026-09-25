import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Private pages (account, sign-in, order status) carry a noindex meta tag instead
 * of a Disallow rule, so crawlers can read it. Only API endpoints are blocked,
 * except product photos, which should appear in image search.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: ["/", "/api/product-image/"], disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
