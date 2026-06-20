import type { Metadata } from "next";
import { MealPlansContent } from "@/components/meal-plans/MealPlansContent";

export const metadata: Metadata = {
  title: "Compare Meal Plans | Soul Good",
  description:
    "Compare Soul Good's chef-crafted meal plans — Performance Fuel and Full Alignment Fuel. Nutrient-dense meals delivered to your door in Los Angeles.",
  openGraph: {
    title: "Compare Meal Plans | Soul Good",
    description:
      "Compare Soul Good's chef-crafted meal plans — Performance Fuel and Full Alignment Fuel. Nutrient-dense meals delivered to your door in Los Angeles.",
  },
};

export default function MealPlansPage() {
  return (
    <main className="flex-1">
      <MealPlansContent />
    </main>
  );
}
