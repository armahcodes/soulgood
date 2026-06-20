import type { Metadata } from "next";
import { CannabisChefContent } from "@/components/cannabis-chef/CannabisChefContent";

export const metadata: Metadata = {
  title: "Chef Kyla x Cannabis | Soul Good",
  description:
    "Explore Chef Kyla's cannabis chef background — infused dining experiences, Kyla's Taste legacy, and the art of elevated cannabis cuisine crafted with intention.",
  openGraph: {
    title: "Chef Kyla x Cannabis | Soul Good",
    description:
      "Explore Chef Kyla's cannabis chef background — infused dining experiences, Kyla's Taste legacy, and the art of elevated cannabis cuisine crafted with intention.",
  },
};

export default function CannabisChefPage() {
  return (
    <main className="flex-1">
      <CannabisChefContent />
    </main>
  );
}
