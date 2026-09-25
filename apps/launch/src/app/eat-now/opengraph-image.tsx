import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "Soul Good Take Out";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "A bowl when you want it.", subline: "On demand Thursday–Sunday near Long Beach", main: "main-eat-now.jpg", side: "side-eat-now.jpg" });
}
