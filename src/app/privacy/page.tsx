import type { Metadata } from "next";
import { LegalPageContent } from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Soul Good",
  description:
    "Read Soul Good's Privacy Policy. Learn how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | Soul Good",
    description:
      "Read Soul Good's Privacy Policy. Learn how we collect, use, and protect your personal information.",
  },
};

const PRIVACY_SECTIONS = [
  {
    title: "Information Collection",
    content: [
      "Soul Good collects information you provide directly to us when you create an account, place an order, subscribe to our meal plans, sign up for our newsletter, fill out a form, or communicate with us. This information may include your name, email address, phone number, delivery address, payment information, and dietary preferences.",
      "We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referral URLs, pages viewed, links clicked, and the date and time of your visit. We collect this information using cookies, web beacons, and similar tracking technologies.",
      "When you use our meal plan services, we may collect health and dietary information you voluntarily provide, such as food allergies, dietary restrictions, and nutritional goals. This information is used solely to customize your meal plans and improve our services.",
    ],
  },
  {
    title: "Use of Information",
    content: [
      "We use the information we collect to provide, maintain, and improve our services, including processing and fulfilling your meal plan orders, managing your account, and providing customer support.",
      "Your information helps us personalize your experience, recommend meal plans and products that may interest you, and send you promotional communications about Soul Good offerings, events, and updates (you may opt out of these at any time).",
      "We also use collected information to monitor and analyze trends, usage, and activities in connection with our services; detect, investigate, and prevent fraudulent transactions, abuse, and other illegal activities; and comply with legal obligations.",
    ],
  },
  {
    title: "Sharing of Information",
    content: [
      "Soul Good does not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep your information confidential.",
      "We may share information with delivery partners to fulfill your meal plan orders, payment processors to handle transactions, and email service providers to send communications on our behalf.",
      "We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.",
    ],
  },
  {
    title: "Cookies & Tracking Technologies",
    content: [
      "Soul Good uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. Cookies are small data files stored on your device that help us remember your preferences and improve our services.",
      "We use essential cookies necessary for the website to function properly, performance cookies that help us understand how visitors interact with our site, and functionality cookies that remember your choices and preferences.",
      "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website, including placing orders or managing your meal plan subscription.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information at any time. You may update your account information by logging into your Soul Good account or by contacting our customer support team.",
      "California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and how it is used, the right to request deletion of personal information, and the right to opt-out of the sale of personal information. Soul Good does not sell personal information.",
      "If you are a resident of the European Economic Area, you have additional rights under the General Data Protection Regulation (GDPR), including the right to data portability, the right to restrict processing, and the right to lodge a complaint with a supervisory authority.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at contact@soulgood.com or write to us at Soul Good, Los Angeles, CA.",
      "We reserve the right to modify this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Your continued use of our website and services after any changes to this Privacy Policy constitutes your acceptance of such changes.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <LegalPageContent
        eyebrow="LEGAL"
        title="Privacy Policy"
        lastUpdated="January 1, 2025"
        sections={PRIVACY_SECTIONS}
      />
    </main>
  );
}
