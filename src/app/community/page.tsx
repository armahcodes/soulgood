import type { Metadata } from "next";
import { CommunityContent } from "@/components/community/CommunityContent";

export const metadata: Metadata = {
  title: "Community | Soul Good",
  description:
    "Discover Soul Good's community impact — food desert initiatives, farms in Watts, wellness center in Compton, and hydroponic plant distribution. Learn how to get involved.",
  openGraph: {
    title: "Community | Soul Good",
    description:
      "Discover Soul Good's community impact — food desert initiatives, farms in Watts, wellness center in Compton, and hydroponic plant distribution.",
  },
};

export default function CommunityPage() {
  return (
    <main className="flex-1">
      <CommunityContent />
    </main>
  );
}
