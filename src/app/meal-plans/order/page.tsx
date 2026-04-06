import type { Metadata } from "next";
import { OrderConfigurator } from "@/components/meal-plans/OrderConfigurator";

export const metadata: Metadata = {
  title: "Build Your Meal Plan | Soul Good",
  description:
    "Customize your Soul Good meal plan — choose your tier, schedule, dietary preferences, and add-ons. Chef-crafted meals delivered in Los Angeles.",
  openGraph: {
    title: "Build Your Meal Plan | Soul Good",
    description:
      "Customize your Soul Good meal plan — choose your tier, schedule, dietary preferences, and add-ons. Chef-crafted meals delivered in Los Angeles.",
  },
};

export default function OrderPage() {
  return (
    <main className="flex-1">
      <OrderConfigurator />
    </main>
  );
}
