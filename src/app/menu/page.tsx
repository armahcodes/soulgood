import type { Metadata } from "next";
import { WeeklyMenuContent } from "@/components/menu/WeeklyMenuContent";

export const metadata: Metadata = {
  title: "The Menu | Soul Good",
  description:
    "Explore the Soul Good menu — Mindful, Performance, Detox, and Alignment collections of wraps, bowls, breakfast & essentials, and juices & hydration, made with intention by Chef Kyla.",
  openGraph: {
    title: "The Menu | Soul Good",
    description:
      "Explore the Soul Good menu — Mindful, Performance, Detox, and Alignment collections of wraps, bowls, breakfast & essentials, and juices & hydration, made with intention by Chef Kyla.",
  },
};

export default function WeeklyMenuPage() {
  return (
    <main className="flex-1">
      <WeeklyMenuContent />
    </main>
  );
}
