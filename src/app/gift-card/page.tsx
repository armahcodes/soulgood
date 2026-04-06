import type { Metadata } from "next";
import { GiftCardContent } from "@/components/gift-card/GiftCardContent";

export const metadata: Metadata = {
  title: "Gift Cards | Soul Good",
  description:
    "Give the gift of Soul Good. Purchase a digital gift card for premium wellness meals by Chef Kyla — the perfect gift for any occasion.",
  openGraph: {
    title: "Gift Cards | Soul Good",
    description:
      "Give the gift of Soul Good. Purchase a digital gift card for premium wellness meals by Chef Kyla — the perfect gift for any occasion.",
  },
};

export default function GiftCardPage() {
  return (
    <main className="flex-1">
      <GiftCardContent />
    </main>
  );
}
