import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "Host a Food for the Soul meal drive";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "Bring a meal drive to your community.", subline: "For organizations in LA & Orange County · free meals, open to all", main: "main-ffs.jpg", side: "side-quote.jpg" });
}
