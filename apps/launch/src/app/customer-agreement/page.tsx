import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";
import { BRAND_NAME, BUSINESS, CONTACT, FEES, LEGAL_VERSION, PLAN, PRICING, TAX } from "@/lib/brand";
import { AVAILABLE_BOWLS, CURRENT_OFFER, SOLD_OUT_BOWLS } from "@/lib/current-offer";

export const metadata = {
  title: `Customer Agreement — ${BRAND_NAME}`,
  description: `Purchase, delivery, renewal, cancellation, and exchange terms for ${BRAND_NAME} one-time and weekly orders.`,
};

export default function CustomerAgreementPage() {
  return (
    <LegalShell
      eyebrow={`Purchase terms · Version ${LEGAL_VERSION}`}
      title="Customer Agreement"
      intro={`This agreement applies when you reserve, order, or subscribe to Soul Bowls™ from ${BUSINESS.legalName}. Please read it before authorizing payment.`}
    >
      <section className="rounded-3xl bg-gold/25 p-6 sm:p-8">
        <h2>Important order and recurring-payment terms</h2>
        <ul>
          <li>{PLAN.bowlsPerWeek} chef-made 32 oz jarred bowls per order.</li>
          <li>Choose a {PRICING.oneTime} one-time order or a {PRICING.weekly} weekly plan.</li>
          <li>Only the weekly plan renews and charges every seven days until you cancel.</li>
          <li>Pickup is free or LA County delivery is $8.88 per order.</li>
          <li>Applicable sales tax is shown at checkout; any reusable-container deposit is disclosed and collected separately.</li>
          <li>Cancel future renewals online at any time; orders already charged remain final.</li>
          <li>Service is limited to verified addresses in {BUSINESS.serviceArea}.</li>
        </ul>
      </section>

      <section>
        <h2>1. Your five-bowl order</h2>
        <p>
          Each purchase or renewal creates one order containing {PLAN.bowlsPerWeek}
          chef-made Soul Bowls™ in {CURRENT_OFFER.format}. At checkout, you may
          choose any five from {` ${AVAILABLE_BOWLS.map((bowl) => bowl.name).join(", ")}`}.
          Items marked sold out, including
          {` ${SOLD_OUT_BOWLS.map((bowl) => bowl.name).join(", ")}`}, cannot be selected.
          The confirmed mix applies to the order and, for weekly plans, remains
          attached to the plan unless a later selection-change option is provided. Exact recipes,
          proteins, sides, and ingredients may vary. Reasonable substitutions may be
          made for seasonal, quality, or supply reasons.
        </p>
      </section>

      <section>
        <h2>2. Payment, automatic renewal, and consent</h2>
        <p>
          A one-time order is charged once and does not renew automatically. A weekly
          plan begins when payment is authorized and renews automatically every seven
          days until canceled. By checking the consent box at checkout and submitting
          payment, you authorize Soul Goods LLC and its payment processor to charge the
          displayed one-time total or, when you choose weekly, the displayed initial
          and recurring amounts.
        </p>
      </section>

      <section>
        <h2>3. Charges</h2>
        <p>
          The base five-bowl order is {PRICING.oneTime}; the weekly plan is
          {` ${PRICING.weekly}`} per week. {FEES.delivery.label}:
          {` ${FEES.delivery.disclosure}`} Pickup has no fulfillment fee.
          {` ${FEES.containerDeposit.label}`}:
          {` ${FEES.containerDeposit.disclosure}`} The container deposit is not part
          of the Square checkout. Government-imposed taxes or fees, if applicable,
          are shown separately. The order or subscription amount is displayed
          before you authorize payment.
        </p>
        <p>{TAX.disclosure} Tax is added to the subtotal where required.</p>
      </section>

      <section>
        <h2>4. Cancellation</h2>
        <p>
          This section applies only to weekly plans. You may cancel future automatic
          renewals immediately through the
          {` `}<Link href="/cancel">online cancellation page</Link>. Cancellation does
          not undo an order that was already charged and committed to production.
          We will provide a retainable acknowledgment of the subscription terms and
          cancellation method after enrollment.
        </p>
      </section>

      <section>
        <h2>5. Pickup and Los Angeles County delivery</h2>
        <p>
          Sunday pickup has no fulfillment fee; the location and window are confirmed
          before fulfillment. If you select delivery, you represent that the address is
          within {BUSINESS.serviceArea} and
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
          food. Keep jars upright at or below 40°F and follow the eat-by date on each lid.
          Do not microwave a sealed jar. The current line includes sesame, soy, and
          wheat-related risks, and our kitchen handles other major allergens. We cannot
          guarantee against cross-contact. Do not order if you have a severe or
          life-threatening food allergy.
        </p>
      </section>

      <section>
        <h2>7. Final sale; exchange remedy</h2>
        <p>
          Perishable orders are nonrefundable and cannot be returned. For a missing,
          incorrect, damaged, or spoiled-on-arrival item, notify us within 24 hours.
          Once verified, the available remedy is an exchange, replacement, or account
          credit of comparable value. Change of mind, personal taste, missed delivery,
          and missed pickup or delivery and delayed retrieval are not eligible.
        </p>
      </section>

      <section>
        <h2>8. Reusable-container deposit</h2>
        <p>
          A disclosed reusable-container deposit is refundable or creditable when the
          corresponding containers are returned reasonably clean and undamaged through
          the provided return process. It is collected separately when reusable containers
          are issued. This business deposit is not California Redemption
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
