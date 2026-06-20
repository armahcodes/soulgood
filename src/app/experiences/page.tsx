import type { Metadata } from "next";
import { ExperiencesContent } from "@/components/experiences/ExperiencesContent";

export const metadata: Metadata = {
  title: "Experiences & Events | Soul Good",
  description:
    "Join Chef Kyla's Tastemakers pop-up dinner series, private chef events, and culinary experiences across Los Angeles. Intimate gatherings that nourish the body and feed the soul.",
  openGraph: {
    title: "Experiences & Events | Soul Good",
    description:
      "Join Chef Kyla's Tastemakers pop-up dinner series, private chef events, and culinary experiences across Los Angeles.",
  },
};

export default function ExperiencesPage() {
  return (
    <main className="flex-1">
      <ExperiencesContent />
    </main>
  );
}
