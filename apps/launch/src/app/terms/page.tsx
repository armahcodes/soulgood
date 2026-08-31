import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";
import { BRAND_NAME, BUSINESS, CONTACT, FEES, LEGAL_VERSION, PRICING, TAX } from "@/lib/brand";
import { CURRENT_BOWLS, CURRENT_OFFER } from "@/lib/current-offer";

export const metadata = {
  title: `Terms of Service — ${BRAND_NAME}`,
  description: `Terms governing Soul Bowls™ one-time and weekly pickup or delivery orders operated by ${BUSINESS.legalName}.`,
};

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow={`Effective ${LEGAL_VERSION}`}
      title="Terms of Service"
      intro={`These Terms govern your use of Soul Bowls™ and your relationship with ${BUSINESS.legalName}, a California limited liability company.`}
    >
      <section>
        <h2>1. Agreement and operator</h2>
        <p>
          Soul Bowls™ is a food ordering and subscription service operated by
          {` ${BUSINESS.legalName}`} (“Soul Goods,” “we,” “us,” or “our”). By using
          this website, creating an order, or starting a subscription, you agree
          to these Terms and, for purchases, the <Link href="/customer-agreement">Customer Agreement</Link>.
          If you do not agree, do not use the service or place an order.
        </p>
      </section>

      <section>
        <h2>2. Eligibility and service area</h2>
        <p>
          You must be at least 18 years old and able to enter a binding contract.
          Delivery is available only to verified addresses within {BUSINESS.serviceArea}.
          We may decline, pause, or cancel service when an address is outside the
          service area, unsafe or inaccessible, or beyond current delivery capacity.
          If we charge an order and then determine the address is outside our service
          area, we will cancel that order and return the affected charge.
        </p>
      </section>

      <section>
        <h2>3. One-time orders and weekly subscriptions</h2>
        <p>
          A standard order includes five chef-made Soul Bowls™ in
          {` ${CURRENT_OFFER.format}`} for {PRICING.oneTime}. At checkout, you may
          choose a one-time order with no automatic renewal or a weekly subscription
          at {PRICING.weekly} per week. A weekly subscription continues and renews
          every seven days until you cancel. By starting a weekly plan, you expressly
          authorize recurring weekly charges at the disclosed price, plus the selected
          fulfillment charge and applicable sales tax.
        </p>
        <p>
          You may cancel future renewals online at any time through our <Link href="/cancel">cancellation page</Link>.
          Cancellation stops future renewals; it does not reverse an order that
          has already been charged and committed to production.
        </p>
      </section>

      <section>
        <h2>4. Pricing and fees</h2>
        <p>
          The five-bowl order price is {PRICING.oneTime}, whether purchased once or
          through the {PRICING.weekly} weekly plan. {FEES.delivery.label}:
          {` ${FEES.delivery.disclosure}`} Sunday pickup has no fulfillment fee.
          {` ${FEES.containerDeposit.label}`}:
          {` ${FEES.containerDeposit.disclosure}`} Order and fulfillment amounts due
          at checkout will be displayed before payment. We do not add undisclosed
          handling or service fees.
        </p>
        <p>
          {TAX.disclosure} Tax is added to the displayed subtotal where required.
          Returnable-container deposits are treated as nontaxable where California
          law provides, but customers remain responsible for any tax legally due.
        </p>
        <p>
          California Redemption Value applies to eligible beverage containers,
          not food or other non-beverage containers. Any Soul Bowls™ reusable-container
          deposit is a separate business return program, not CRV.
        </p>
      </section>

      <section>
        <h2>5. Pickup and delivery</h2>
        <p>
          Sunday pickup has no fulfillment fee. We will provide the pickup location
          and available window before fulfillment. LA County delivery costs
          $8.88 per order and is generally scheduled for Sunday. Pickup and delivery windows
          are estimates and may change because of traffic, weather, building access,
          safety conditions, or events outside our reasonable control.
        </p>
        <p>
          Delivery customers are responsible for providing a complete address, access
          instructions, a safe delivery location, and a working phone number. If no
          one is available, you authorize us to leave the order in the safest
          reasonably available location unless you give different instructions.
          Pickup and delivery orders should be retrieved promptly and refrigerated.
          We are not responsible for deterioration caused by delayed retrieval,
          incorrect instructions, or unsafe storage.
        </p>
      </section>

      <section>
        <h2>6. Menu changes and availability</h2>
        <p>
          Customers may choose any five bowls from the current lineup:
          {` ${CURRENT_BOWLS.map((bowl) => bowl.name).join(", ")}`}. The mix confirmed
          at checkout applies to the order. Ingredients or builds may change based on
          quality, seasonality, supply, and kitchen capacity. We may make reasonable
          substitutions of comparable quality and will disclose material changes when
          practical. Website photos are illustrative and do not guarantee exact
          presentation.
        </p>
      </section>

      <section>
        <h2>7. Allergies and food safety</h2>
        <p>
          Our kitchen handles common allergens, including milk, eggs, fish, shellfish,
          tree nuts, peanuts, wheat, soy, and sesame. We cannot guarantee an allergen-free
          environment or prevent all cross-contact. Customers with severe or life-threatening
          allergies should not order. Ingredient and dietary information is not medical advice.
        </p>
      </section>

      <section>
        <h2>8. No-refund and exchange policy</h2>
        <p>
          Because our products are perishable and prepared for a specific delivery,
          completed orders are final and nonrefundable, including for change of mind,
          taste preference, missed pickup or delivery, or failure to retrieve an order promptly.
        </p>
        <p>
          If an item is missing, incorrect, damaged, or spoiled when delivered, contact
          us within 24 hours with your order details and, when reasonably available,
          a photo. After verification, our remedy is an exchange, replacement, or
          account credit of comparable value at our discretion. Nothing in this policy
          limits rights that cannot legally be waived.
        </p>
      </section>

      <section>
        <h2>9. Reusable containers</h2>
        <p>
          When a reusable-container deposit applies, its amount and return terms are
          disclosed before the containers are issued and the deposit is collected
          separately from the order or subscription. Eligible deposits are returned as
          an account credit or refund after the corresponding containers are returned reasonably clean
          and undamaged through the return method we provide. Lost, unreturned, or
          materially damaged containers are not eligible for deposit credit.
        </p>
      </section>

      <section>
        <h2>10. Acceptable use and intellectual property</h2>
        <p>
          You may use this site only for lawful personal purposes. The Soul Bowls™ name,
          logo, recipes, copy, illustrations, photography, and site content belong to
          {` ${BUSINESS.legalName}`} or its licensors and may not be copied, sold, or
          commercially exploited without written permission.
        </p>
      </section>

      <section>
        <h2>11. Disclaimers and limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, the website and service are provided
          “as is” and “as available.” We do not guarantee uninterrupted site access,
          specific health outcomes, or uninterrupted availability of any menu item.
          Our liability for a claim relating to an order will not exceed the amount
          paid for the affected order, except where a different limitation is required
          by law. These Terms do not exclude liability or consumer rights that cannot
          legally be excluded.
        </p>
      </section>

      <section>
        <h2>12. Governing law</h2>
        <p>
          California law governs these Terms. Any dispute not resolved informally will
          be brought in a court of competent jurisdiction in Los Angeles County,
          California, subject to any non-waivable right to bring a claim elsewhere or
          in small claims court.
        </p>
      </section>

      <section>
        <h2>13. Changes and contact</h2>
        <p>
          We may update these Terms prospectively. Material subscription changes will
          be communicated as required by law before they take effect. Questions may be
          sent to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </section>
    </LegalShell>
  );
}
