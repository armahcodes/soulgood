import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "Meet Chef Kyla | Soul Good",
  description:
    "Discover Chef Kyla's story — from personal transformation to premium wellness food brand. Southern soul food meets functional healing nutrition.",
  openGraph: {
    title: "Meet Chef Kyla | Soul Good",
    description:
      "Discover Chef Kyla's story — from personal transformation to premium wellness food brand. Southern soul food meets functional healing nutrition.",
  },
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutContent />
    </main>
  );
}
