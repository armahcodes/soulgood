import type { Metadata } from "next";
import { FAQContent } from "@/components/faq/FAQContent";

export const metadata: Metadata = {
  title: "FAQ | Soul Good",
  description:
    "Find answers to frequently asked questions about Soul Good meal plans, delivery, subscriptions, dietary accommodations, and more.",
  openGraph: {
    title: "FAQ | Soul Good",
    description:
      "Find answers to frequently asked questions about Soul Good meal plans, delivery, subscriptions, dietary accommodations, and more.",
  },
};

export default function FAQPage() {
  return (
    <main className="flex-1">
      <FAQContent />
    </main>
  );
}
