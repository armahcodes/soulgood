import type { Metadata } from "next";
import { PodcastContent } from "@/components/podcast/PodcastContent";

export const metadata: Metadata = {
  title: "Podcast | Soul Good",
  description:
    "The Soul Good Podcast is coming soon. Sign up to be notified when Chef Kyla's podcast about soul food, healing nutrition, and intentional living launches.",
  openGraph: {
    title: "Podcast | Soul Good",
    description:
      "The Soul Good Podcast is coming soon. Sign up to be notified when Chef Kyla's podcast about soul food, healing nutrition, and intentional living launches.",
  },
};

export default function PodcastPage() {
  return (
    <main className="flex-1">
      <PodcastContent />
    </main>
  );
}
