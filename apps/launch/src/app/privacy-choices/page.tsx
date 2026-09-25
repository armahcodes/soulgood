import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { UnsubscribePanel } from "@/components/newsletter/UnsubscribePanel";
import { ClearDeviceData, PrivacyRequestForm, SaleSharingPreference } from "@/components/privacy/PrivacyChoices";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { BRAND_NAME, BUSINESS, CONTACT } from "@/lib/brand";
import { PRIVACY_RESPONSE_DAYS } from "@/lib/privacy-shared";

export const metadata = {
  title: `Your Privacy Choices — ${BRAND_NAME}`,
  description: "Opt out of sale or sharing, manage marketing email, clear data saved on this device, and make a privacy request.",
};

const eyebrow = "text-[0.68rem] font-medium tracking-[0.22em] text-clay uppercase";
const card = "scroll-mt-28 rounded-lg border border-forest/12 bg-card p-5 sm:p-8";

const SECTIONS = [
  { id: "sale-sharing", label: "Sale & sharing" },
  { id: "email", label: "Email" },
  { id: "device", label: "This device" },
  { id: "request", label: "Privacy request" },
];

export default function PrivacyChoicesPage() {
  return (
    <>
      <SiteHeader current="/privacy-choices" />
      <main className="bg-oat">
        <div className="border-b border-forest/10 bg-card/50">
          <div className="mx-auto w-full max-w-4xl px-5 pt-12 pb-10 sm:px-8 sm:pt-16">
            <p className={eyebrow}>Privacy</p>
            <h1 className="mt-4 text-5xl leading-[1.02] tracking-[0.01em] text-forest sm:text-7xl">Your Privacy Choices</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/72">
              Choose how we use your information. We don’t sell your personal information or share it for targeted
              advertising, and we don’t use advertising or analytics cookies. Read the full{" "}
              <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.
            </p>
            <nav aria-label="Privacy choices" className="mt-8 flex flex-wrap gap-2">
              {SECTIONS.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="inline-flex min-h-10 items-center rounded-full border border-forest/15 bg-oat px-4 text-sm font-semibold text-forest hover:border-forest/40">
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-4xl gap-6 px-5 py-12 sm:px-8 sm:py-16">
          <section id="sale-sharing" aria-labelledby="sale-sharing-heading" className={card}>
            <h2 id="sale-sharing-heading" className="text-3xl text-forest">Sale, sharing, and targeted ads</h2>
            <p className="mt-3 mb-5 text-sm leading-6 text-forest/72">
              California and other states give you the right to opt out of the sale or sharing of personal information
              and of targeted advertising. We honor Global Privacy Control (GPC) signals from your browser as an opt-out.
            </p>
            <SaleSharingPreference />
          </section>

          <section id="email" aria-labelledby="email-heading" className={card}>
            <h2 id="email-heading" className="text-3xl text-forest">Marketing email</h2>
            <p className="mt-3 text-sm leading-6 text-forest/72">
              The newsletter is opt-in and every issue has an unsubscribe link. Unsubscribing doesn’t stop emails about
              orders, plans, bookings, or applications you make.
            </p>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-serif text-xl text-forest">Join the newsletter</h3>
                <NewsletterSignup source="privacy-choices" />
              </div>
              <div>
                <h3 className="mb-3 font-serif text-xl text-forest">Leave the newsletter</h3>
                <UnsubscribePanel />
              </div>
            </div>
          </section>

          <section id="device" aria-labelledby="device-heading" className={card}>
            <h2 id="device-heading" className="text-3xl text-forest">Data saved on this device</h2>
            <p className="mt-3 mb-5 text-sm leading-6 text-forest/72">
              To keep your place, this site saves your cart, salads and sides, quiz answers, and your last order in your
              browser’s storage. It stays on this device. Signing in uses a secure session cookie that’s needed for your
              account to work.
            </p>
            <ClearDeviceData />
          </section>

          <section id="request" aria-labelledby="request-heading" className={card}>
            <h2 id="request-heading" className="text-3xl text-forest">Make a privacy request</h2>
            <p className="mt-3 mb-6 text-sm leading-6 text-forest/72">
              Ask to know, get a copy of, correct, or delete your personal information, or limit the use of sensitive
              information such as allergies you’ve shared. We’ll verify your identity by email and respond within{" "}
              {PRIVACY_RESPONSE_DAYS} days. Exercising your rights never affects the price or service you receive. You
              can also email <a href={`mailto:${CONTACT.email}?subject=Privacy%20request`} className="underline underline-offset-4">{CONTACT.email}</a>{" "}
              or write to {BUSINESS.legalName}, {BUSINESS.mailingAddress}.
            </p>
            <PrivacyRequestForm />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
