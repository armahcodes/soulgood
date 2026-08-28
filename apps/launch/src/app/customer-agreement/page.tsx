import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";
import { BRAND_NAME, BUSINESS, CONTACT, FEES, LEGAL_VERSION, PLAN, PRICING } from "@/lib/brand";

export const metadata = {
  title: `Customer Agreement — ${BRAND_NAME}`,
  description: `Purchase, delivery, renewal, cancellation, and exchange terms for the ${BRAND_NAME} weekly plan.`,
};

export default function CustomerAgreementPage() {
  return (
    <LegalShell
      eyebrow={`Purchase terms · Version ${LEGAL_VERSION}`}
      title="Customer Agreement"
      intro={`This agreement applies when you reserve, order, or subscribe to Soul Bowls™ from ${BUSINESS.legalName}. Please read it before authorizing payment.`}
    >
      <section className="rounded-3xl bg-gold/25 p-6 sm:p-8">
        <h2>Important recurring-payment terms</h2>
        <ul>
          <li>{PLAN.bowlsPerWeek} chef-made bowls per weekly delivery.</li>
          <li>{PRICING.weekly} charged every seven days until you cancel.</li>
          <li>Delivery charges and any refundable reusable-container deposit are disclosed before payment.</li>
          <li>Cancel future renewals online at any time; orders already charged remain final.</li>
          <li>Service is limited to verified addresses in {BUSINESS.serviceArea}.</li>
        </ul>
      </section>

      <section>
        <h2>1. Your weekly order</h2>
        <p>
          Each renewal purchases one weekly delivery containing {PLAN.bowlsPerWeek}
          chef-made bowls from the rotating menu. Exact recipes, proteins, sides, and
          ingredients may vary. Reasonable substitutions may be made for seasonal or
          supply reasons.
        </p>
      </section>

      <section>
        <h2>2. Automatic renewal and consent</h2>
        <p>
          Your plan begins when payment is authorized and renews automatically every
          seven days until canceled. By checking the consent box at checkout and
          submitting payment, you expressly agree to the recurring terms and authorize
          Soul Goods LLC and its payment processor to charge your payment method for
          each renewal.
        </p>
      </section>

      <section>
        <h2>3. Charges</h2>
        <p>
          The base plan is {PRICING.weekly} per week. {FEES.delivery.label}:
          {` ${FEES.delivery.disclosure}`} {FEES.containerDeposit.label}:
          {` ${FEES.containerDeposit.disclosure}`} Government-imposed taxes or fees,
          if applicable, are shown separately. The complete amount is displayed before
          you authorize payment.
        </p>
      </section>

      <section>
        <h2>4. Cancellation</h2>
        <p>
          You may cancel future automatic renewals immediately through the
          {` `}<Link href="/cancel">online cancellation page</Link>. Cancellation does
          not undo an order that was already charged and committed to production.
          We will provide a retainable acknowledgment of the subscription terms and
          cancellation method after enrollment.
        </p>
      </section>

      <section>
        <h2>5. Los Angeles County delivery</h2>
        <p>
          You represent that the delivery address is within {BUSINESS.serviceArea} and
          that all address, access, and contact information is accurate. We verify service
          eligibility before activation. You authorize unattended delivery at the safest
          reasonably available location when no recipient is present. If we charge an
          order and then determine the address is outside the service area, we will cancel
          that order and return the affected charge.
        </p>
      </section>

      <section>
        <h2>6. Food safety and allergies</h2>
        <p>
          You are responsible for reviewing available ingredient information, disclosing
          dietary needs, retrieving the delivery promptly, and refrigerating perishable
          food. Our kitchen handles major allergens and cannot guarantee against cross-contact.
          Do not order if you have a severe or life-threatening food allergy.
        </p>
      </section>

      <section>
        <h2>7. Final sale; exchange remedy</h2>
        <p>
          Perishable orders are nonrefundable and cannot be returned. For a missing,
          incorrect, damaged, or spoiled-on-arrival item, notify us within 24 hours.
          Once verified, the available remedy is an exchange, replacement, or account
          credit of comparable value. Change of mind, personal taste, missed delivery,
          and delayed retrieval are not eligible.
        </p>
      </section>

      <section>
        <h2>8. Reusable-container deposit</h2>
        <p>
          A disclosed reusable-container deposit is refundable or creditable when the
          corresponding containers are returned reasonably clean and undamaged through
          the provided return process. This business deposit is not California Redemption
          Value. Food and non-beverage containers are not CRV containers.
        </p>
      </section>

      <section>
        <h2>9. Agreement and support</h2>
        <p>
          This Customer Agreement incorporates the <Link href="/terms">Terms of Service</Link>.
          If the two conflict about a purchase, this Customer Agreement controls for that
          purchase. Contact <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> for order support.
        </p>
      </section>
    </LegalShell>
  );
}
