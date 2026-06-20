import type { Metadata } from "next";
import { CateringContent } from "@/components/catering/CateringContent";

export const metadata: Metadata = {
  title: "Private Chef & Catering | Soul Good",
  description:
    "Book Chef Kyla for your next event. Private chef experiences, catering, tray-passed hors d'oeuvres, and corporate events crafted with intention and seasoned with love.",
  openGraph: {
    title: "Private Chef & Catering | Soul Good",
    description:
      "Book Chef Kyla for your next event. Private chef experiences, catering, tray-passed hors d'oeuvres, and corporate events crafted with intention and seasoned with love.",
  },
};

export default function CateringPage() {
  return (
    <main className="flex-1">
      <CateringContent />
    </main>
  );
}
