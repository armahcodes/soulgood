import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "Soul Good gatherings and catering in Los Angeles";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "Let’s plan your gathering.", subline: "Bowl delivery from 10 bowls · plated dinners from $55/guest", main: "main-quote.jpg", side: "side-quote.jpg" });
}
