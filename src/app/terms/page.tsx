import type { Metadata } from "next";
import { LegalPageContent } from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: "Terms & Conditions | Soul Good",
  description:
    "Read Soul Good's Terms & Conditions. Understand the terms governing your use of our website and services.",
  openGraph: {
    title: "Terms & Conditions | Soul Good",
    description:
      "Read Soul Good's Terms & Conditions. Understand the terms governing your use of our website and services.",
  },
};

const TERMS_SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing and using the Soul Good website and services, you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, you should not use our website or services.",
      "Soul Good reserves the right to update or modify these Terms and Conditions at any time without prior notice. Your continued use of the website following any changes constitutes your acceptance of the new terms. It is your responsibility to review these Terms and Conditions periodically.",
    ],
  },
  {
    title: "Use of Services",
    content: [
      "Soul Good provides premium wellness meal plans, food products, catering services, and related content through our website. Our services are available to individuals who are at least 18 years of age and reside within our delivery area in the Greater Los Angeles region.",
      "You agree to use our website and services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that could damage, disable, overburden, or impair our servers or networks, or interfere with any other party's use of our services.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify Soul Good immediately of any unauthorized use of your account.",
    ],
  },
  {
    title: "Orders & Payments",
    content: [
      "All orders placed through the Soul Good website are subject to our acceptance. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in product or pricing information, or issues identified by our fraud detection systems.",
      "Prices for our products and meal plans are listed on our website and are subject to change without notice. All prices are in US dollars and do not include applicable taxes or delivery fees, which will be calculated and displayed at checkout.",
      "Payment is required at the time of purchase. We accept major credit cards and other payment methods as displayed during checkout. For subscription meal plans, your payment method will be charged automatically on each renewal date unless you cancel before the renewal.",
    ],
  },
  {
    title: "Meal Plans & Subscriptions",
    content: [
      "Soul Good meal plan subscriptions automatically renew on a weekly basis unless cancelled. You may cancel your subscription at any time by logging into your account or contacting our customer support team at least 48 hours before your next scheduled delivery.",
      "Meal plan selections and dietary preferences can be updated through your account settings. Changes must be made at least 48 hours before your scheduled preparation date to be reflected in your upcoming delivery.",
      "Soul Good takes reasonable precautions to prevent cross-contamination; however, our meals are prepared in a facility that handles common allergens including nuts, dairy, gluten, soy, and shellfish. We cannot guarantee that any item is completely free of allergens.",
    ],
  },
  {
    title: "Delivery",
    content: [
      "Soul Good currently delivers to the Greater Los Angeles area, including Long Beach to Malibu, the Valley, and Downtown Los Angeles. Delivery schedules and availability are subject to change based on demand and operational capacity.",
      "You are responsible for providing accurate and complete delivery information. Soul Good is not responsible for delays or failures in delivery caused by incorrect addresses, inaccessible delivery locations, or circumstances beyond our control.",
      "Perishable items should be refrigerated immediately upon delivery. Soul Good is not responsible for food quality or safety issues arising from improper storage after delivery.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All content on the Soul Good website, including text, graphics, logos, images, recipes, meal plan descriptions, and software, is the property of Soul Good or its content suppliers and is protected by United States and international copyright, trademark, and other intellectual property laws.",
      "You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any content from our website without the express written consent of Soul Good.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Soul Good provides its website and services on an \"as is\" and \"as available\" basis. We make no warranties or representations about the accuracy, reliability, completeness, or timeliness of the content, services, or other information provided on or through our website.",
      "To the fullest extent permitted by applicable law, Soul Good shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.",
      "In no event shall Soul Good's total liability to you for all claims arising out of or relating to these Terms or our services exceed the amount you paid to Soul Good in the twelve (12) months preceding the claim.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Los Angeles County, California.",
      "If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="flex-1">
      <LegalPageContent
        eyebrow="LEGAL"
        title="Terms &amp; Conditions"
        lastUpdated="January 1, 2025"
        sections={TERMS_SECTIONS}
      />
    </main>
  );
}
