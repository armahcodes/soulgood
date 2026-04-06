import type { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact | Soul Good",
  description:
    "Get in touch with Soul Good. Reach out about meal plans, catering, events, or anything else. We'd love to hear from you.",
  openGraph: {
    title: "Contact | Soul Good",
    description:
      "Get in touch with Soul Good. Reach out about meal plans, catering, events, or anything else. We'd love to hear from you.",
  },
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <ContactContent />
    </main>
  );
}
