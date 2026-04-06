import type { Metadata } from "next";
import { TestimonialsContent } from "@/components/testimonials/TestimonialsContent";

export const metadata: Metadata = {
  title: "Testimonials | Soul Good",
  description:
    "Read what our clients say about Soul Good — customer reviews for meal prep, events, and catering services by Chef Kyla.",
  openGraph: {
    title: "Testimonials | Soul Good",
    description:
      "Read what our clients say about Soul Good — customer reviews for meal prep, events, and catering services by Chef Kyla.",
  },
};

export default function TestimonialsPage() {
  return (
    <main className="flex-1">
      <TestimonialsContent />
    </main>
  );
}
