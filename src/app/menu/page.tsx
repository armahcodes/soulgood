import type { Metadata } from "next";
import { WeeklyMenuContent } from "@/components/menu/WeeklyMenuContent";

export const metadata: Metadata = {
  title: "Weekly Menu | Soul Good",
  description:
    "Explore this week's chef-crafted menu from Soul Good. Breakfast juices, lunches, dinners, and functional snacks — made with intention by Chef Kyla.",
  openGraph: {
    title: "Weekly Menu | Soul Good",
    description:
      "Explore this week's chef-crafted menu from Soul Good. Breakfast juices, lunches, dinners, and functional snacks — made with intention by Chef Kyla.",
  },
};

export default function WeeklyMenuPage() {
  return (
    <main className="flex-1">
      <WeeklyMenuContent />
    </main>
  );
}
