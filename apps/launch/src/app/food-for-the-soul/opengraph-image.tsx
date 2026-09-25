import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "Food for the Soul community meal drives by Soul Good";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "Food for the Soul.", subline: "Free community meal drives · open to all, first come, first served", main: "main-ffs.jpg", side: "side-ffs.jpg" });
}
