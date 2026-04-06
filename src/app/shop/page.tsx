import type { Metadata } from "next";
import { ShopContent } from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop All | Soul Good",
  description:
    "Shop Soul Good's chef-crafted seasonings, cold-pressed juices, and wellness bundles. Premium wellness products made with intention by Chef Kyla.",
  openGraph: {
    title: "Shop All | Soul Good",
    description:
      "Shop Soul Good's chef-crafted seasonings, cold-pressed juices, and wellness bundles. Premium wellness products made with intention by Chef Kyla.",
  },
};

export default function ShopPage() {
  return <ShopContent />;
}
