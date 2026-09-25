import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "Soul Good Pathway Finder";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "Find the bowls that fit your days.", subline: "12 quick questions · bowls, salads & sides matched to you", main: "main-quiz.jpg", side: "side-quiz.jpg" });
}
