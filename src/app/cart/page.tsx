import type { Metadata } from "next";
import { CartContent } from "@/components/cart/CartContent";

export const metadata: Metadata = {
  title: "Your Cart | Soul Good",
  description:
    "Review your Soul Good cart. Adjust quantities, remove items, and proceed to checkout.",
  openGraph: {
    title: "Your Cart | Soul Good",
    description:
      "Review your Soul Good cart. Adjust quantities, remove items, and proceed to checkout.",
  },
};

export default function CartPage() {
  return (
    <main className="flex-1">
      <CartContent />
    </main>
  );
}
