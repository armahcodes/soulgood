import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "The Soul Good menu: Soul Bowls™, salads, and veggie sides";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "Every bowl, salad, and snack.", subline: "Build your own salad · veggie cups · snacks & light bites", main: "main-menu.jpg", side: "side-menu.jpg" });
}
