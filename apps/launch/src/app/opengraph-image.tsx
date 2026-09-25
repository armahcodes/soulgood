import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "Soul Good: chef-made Soul Bowls™, salads, and sides, delivered Sundays across Los Angeles and Orange County";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "Chef-made nourishment, ready when you are.", subline: "Soul Bowls™, salads & sides · Sundays across LA & Orange County" });
}
