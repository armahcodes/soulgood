import { OG_SIZE, renderOgCard } from "@/lib/og-card";

export const alt = "Order Soul Good weekly meal prep";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgCard({ headline: "Weekly nourishment, delivered Sundays.", subline: "Once or weekly · LA & Orange County · free delivery over $100", main: "main-checkout.jpg", side: "side-checkout.jpg" });
}
