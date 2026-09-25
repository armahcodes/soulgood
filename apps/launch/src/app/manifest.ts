import type { MetadataRoute } from "next";
import { BRAND_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND_NAME} by Soul Good`,
    short_name: "Soul Good",
    description: "Chef-made Soul Bowls™: weekly Sunday delivery across LA and Orange County, or on demand Thursday–Sunday.",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    background_color: "#F8F3EC",
    theme_color: "#F8F3EC",
    categories: ["food", "health", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Build your ritual", url: "/checkout", description: "Plan weekly nourishment" },
      { name: "Find your pathway", url: "/quiz", description: "Get bowls matched to you" },
      { name: "My orders", url: "/account", description: "Receipts and weekly plans" },
    ],
  };
}
