import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";
import { BRAND_NAME, BUSINESS, CONTACT, LEGAL_VERSION } from "@/lib/brand";
import { PRIVACY_RESPONSE_DAYS } from "@/lib/privacy-shared";

export const metadata = {
  alternates: { canonical: "/privacy" },
  title: `Privacy Policy — ${BRAND_NAME}`,
  description: `How ${BUSINESS.legalName} collects, uses, shares, and protects personal information, and the privacy choices and rights available to you.`,
};

const CATEGORIES = [
  {
    category: "Contact details and identifiers",
    examples: "Name, email, phone number, and account sign-in email.",
    purposes: "Orders, subscriptions, account sign-in, bookings, support, and messages you request.",
  },
  {
    category: "Addresses",
    examples: "Delivery, billing, gathering, and meal-drive site addresses; ZIP code.",
    purposes: "Delivery, service-area checks, sales-tax calculation, and planning.",
  },
  {
    category: "Orders and preferences",
    examples: "Bowls, salads and sides, choices like dressings and toppings, plan type, pickup or delivery.",
    purposes: "Preparing and delivering food, reorders, and suggestions.",
  },
  {
    category: "Pathway quiz answers",
    examples: "Your answers about your days, food preferences, dietary lifestyle, allergies or sensitivities, sides, and optional reflections.",
    purposes: "Suggesting a pathway, bowls, and sides, and helping our team support your first order.",
  },
  {
    category: "Payment and transaction details",
    examples: "Payment status, amounts, receipts, and Square order or subscription IDs. Card numbers are entered into and processed by Square; we don’t receive or store them.",
    purposes: "Charging for orders and plans, refunds or credits, taxes, and accounting.",
  },
  {
    category: "Gatherings and meal-drive applications",
    examples: "Event date, time, guest count, menu, notes, company; organization, contact role, site, community-need indicators, and logistics.",
    purposes: "Estimates, invoices, and planning bookings and community meal drives.",
  },
  {
    category: "Communications and choices",
    examples: "Newsletter status and consent, privacy requests, and messages you send us.",
    purposes: "Sending newsletters you’ve confirmed, honoring choices, and keeping required records.",
  },
  {
    category: "Device and technical information",
    examples: "IP address (stored only in hashed form for abuse protection), request logs kept by our host, and browser storage on your device.",
    purposes: "Security, preventing abuse, keeping the site working, and remembering your cart.",
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      eyebrow={`Effective ${LEGAL_VERSION}`}
      title="Privacy Policy"
      intro={`This policy explains how ${BUSINESS.legalName} (“Soul Good,” “we,” or “us”) collects, uses, shares, and protects personal information when you use soulgood.kitchen, order Soul Bowls™, take the Pathway Finder, book a gathering, apply to host a meal drive, or join our newsletter.`}
    >
      <section>
        <h2>1. Summary</h2>
        <ul>
          <li>We collect what we need to prepare, sell, and deliver food, run accounts and plans, plan gatherings and community meal drives, and send messages you ask for.</li>
          <li>We don’t sell your personal information, share it for cross-context behavioral (targeted) advertising, or use advertising or analytics cookies.</li>
          <li>Allergies and dietary answers are used only to suggest food and serve you safely.</li>
          <li>You can see, correct, copy, or delete your information and manage marketing email on <Link href="/privacy-choices">Your Privacy Choices</Link>.</li>
        </ul>
      </section>

      <section>
        <h2>2. Information we collect and why</h2>
        <p>We collect information directly from you, from your device when you use the site, and from service providers that process orders and payments for us (for example, Square order and payment status). This section also serves as our notice at collection.</p>
        <div tabIndex={0} role="region" aria-label="Information we collect, scrollable table" className="not-prose mt-5 overflow-x-auto rounded-lg border border-forest/12">
          <table className="w-full min-w-[40rem] text-left text-sm leading-6">
            <thead className="bg-sand/35 text-forest">
              <tr>
                <th scope="col" className="p-3 font-semibold">Category</th>
                <th scope="col" className="p-3 font-semibold">Examples</th>
                <th scope="col" className="p-3 font-semibold">Why we use it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10 text-forest/75">
              {CATEGORIES.map((row) => (
                <tr key={row.category} className="align-top">
                  <th scope="row" className="p-3 font-semibold text-forest">{row.category}</th>
                  <td className="p-3">{row.examples}</td>
                  <td className="p-3">{row.purposes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          We also use information to secure and improve the service, prevent fraud and abuse, keep business and tax
          records, comply with law, and enforce our <Link href="/terms">Terms of Service</Link>. We don’t use it for
          automated decisions that have legal or similarly significant effects on you.
        </p>
      </section>

      <section>
        <h2>3. Sensitive personal information</h2>
        <p>
          Some answers can be sensitive: food allergies or sensitivities may relate to health, and dietary lifestyles
          such as halal may reveal religious beliefs. We use them only to suggest food, flag allergens, and prepare what
          you ask for; we don’t use them to infer characteristics about you, and we never sell or share them. Food-group
          information on our menu and quiz describes ingredients only and isn’t medical or nutrition advice.
        </p>
        <p>
          Meal-drive applications ask about organizations and community-level need only. We don’t collect information
          about people who receive meals, and we don’t ask for demographic or protected-characteristic information.
        </p>
      </section>

      <section>
        <h2>4. How we share information</h2>
        <p>We share personal information only as needed to run the service, with providers who are contractually limited to using it for us:</p>
        <ul>
          <li><strong>Square</strong> — payments, orders, subscriptions, gathering invoices, customer profiles, and our Take Out menu at checkout.soulgood.kitchen (Square’s own privacy notice also applies there).</li>
          <li><strong>Delivery partners</strong> — for Take Out on-demand delivery, couriers such as Uber Direct or DoorDash receive the name, address, phone number, and instructions needed to deliver.</li>
          <li><strong>Resend</strong> — sending sign-in codes, order and booking emails, and newsletters you confirm.</li>
          <li><strong>Vercel</strong> (hosting) and <strong>MongoDB Atlas</strong> (database) — running the site and storing records.</li>
          <li><strong>California Department of Tax and Fee Administration</strong> — we send a delivery or event address to its public tax-rate service to calculate sales tax.</li>
        </ul>
        <p>
          We may also disclose information to comply with law or valid legal process, to protect the rights and safety of
          our customers, team, or the public, or as part of a merger, financing, or sale of our business, subject to this
          policy. We don’t sell personal information, including of anyone under 16.
        </p>
      </section>

      <section>
        <h2>5. Cookies and browser storage</h2>
        <p>
          We use a secure session cookie to keep you signed in to your account and security features to prevent abuse.
          Your cart, salads and sides, quiz answers, and last order are saved in your browser’s storage so you don’t lose
          your place; they stay on your device and you can clear them on <Link href="/privacy-choices#device">Your Privacy Choices</Link>.
          We don’t use advertising, analytics, or social-media tracking cookies or pixels. If that ever changes, we’ll update
          this policy first and respect your choices, including Global Privacy Control.
        </p>
      </section>

      <section>
        <h2>6. Email and newsletters</h2>
        <p>
          The newsletter is opt-in: we email a confirmation link and only send it after you confirm. Every newsletter
          includes a one-click unsubscribe link and our postal address. Unsubscribing doesn’t stop transactional messages
          about orders, plans, bookings, sign-in, or applications you make. We don’t send text messages.
        </p>
      </section>

      <section>
        <h2>7. How long we keep information</h2>
        <ul>
          <li>Orders, payments, and invoices: as long as needed for tax and accounting, generally at least four years.</li>
          <li>Accounts: while your account is active, then as required for records.</li>
          <li>Pathway quiz contacts, gathering quotes, community interest, and meal-drive applications: up to 24 months after our last contact, unless they become an order or booking.</li>
          <li>Newsletter: until you unsubscribe; we then keep your address on a suppression list so you aren’t emailed again.</li>
          <li>Privacy requests: at least 24 months, as California law requires.</li>
          <li>Abuse-prevention records: automatically deleted within days.</li>
        </ul>
      </section>

      <section>
        <h2>8. Your privacy rights</h2>
        <p>
          If you live in California, the California Consumer Privacy Act (as amended by the CPRA) gives you the right to
          know what personal information we collect, use, and disclose; to get a copy in a portable format; to delete
          it; to correct inaccurate information; to opt out of sale or sharing and targeted advertising; to limit the use
          of sensitive personal information; and not to be discriminated against for exercising these rights. Residents
          of other states may have similar rights, and we extend these choices to all customers.
        </p>
        <p>
          Make a request on <Link href="/privacy-choices#request">Your Privacy Choices</Link>, by email at{" "}
          <a href={`mailto:${CONTACT.email}?subject=Privacy%20request`}>{CONTACT.email}</a>, or by mail to {BUSINESS.legalName},{" "}
          {BUSINESS.mailingAddress}. We’ll verify your identity by matching information we already have, usually by
          email, and respond within {PRIVACY_RESPONSE_DAYS} days (or tell you if we need up to 45 more). An authorized
          agent may submit a request with your signed permission. We honor Global Privacy Control signals as a valid
          opt-out. If we deny a request, we’ll explain why and how to ask us to reconsider.
        </p>
        <p>
          California’s “Shine the Light” law lets residents ask whether we disclose personal information to third parties
          for their direct marketing. We don’t.
        </p>
      </section>

      <section>
        <h2>9. Children</h2>
        <p>
          Our services are for adults 18 and older. We don’t knowingly collect personal information from children under
          16. If you believe a child has given us information, contact us and we’ll delete it.
        </p>
      </section>

      <section>
        <h2>10. Security</h2>
        <p>
          We use encryption in transit, access controls, hashed tokens, and trusted providers to protect information. Card
          details are handled by Square. No system is perfectly secure, so please contact us right away if you suspect
          misuse of your account.
        </p>
      </section>

      <section>
        <h2>11. Changes and contact</h2>
        <p>
          We’ll post updates here with a new effective date and, for material changes, notify you by email or on the site.
          Questions: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or {BUSINESS.legalName}, {BUSINESS.mailingAddress}.
        </p>
      </section>
    </LegalShell>
  );
}
