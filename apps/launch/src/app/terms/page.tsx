import Link from "next/link";
import { LegalShell } from "@/components/legal/LegalShell";
import { BRAND_NAME, BUSINESS, CONTACT, FEES, formatCents, LEGAL_VERSION, NOURISHMENT, ORDER_RULES, PRICING, SERVICE_AREA, TAX } from "@/lib/brand";
import { AVAILABLE_BOWLS, CURRENT_OFFER, SOLD_OUT_BOWLS } from "@/lib/current-offer";
import { EAT_NOW } from "@/lib/ordering";
import { CULINARY_PRICING } from "@/lib/culinary-booking";
import { TIER_PRICE_CENTS } from "@/lib/menu-extras";
import { NON_DISCRIMINATION_STATEMENT } from "@/lib/meal-drive";

export const metadata = {
  alternates: { canonical: "/terms" },
  title: `Terms of Service — ${BRAND_NAME}`,
  description: `Terms governing Soul Bowls™ Take Out orders and weekly meal prep operated by ${BUSINESS.legalName}.`,
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
          Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal
          information. If you do not agree, do not use the service or place an order.
        </p>
      </section>

      <section>
        <h2>2. Eligibility and service area</h2>
        <p>
          You must be at least 18 years old and able to enter a binding contract.
          Weekly meal-prep delivery is available only to verified addresses within
          {` ${BUSINESS.serviceArea}`}. On-demand Take Out delivery is limited to about
          {` ${EAT_NOW.radiusMiles}`} miles from our Long Beach kitchen, as shown in Take Out checkout.
          We may decline, pause, or cancel service when an address is outside the
          service area, unsafe or inaccessible, or beyond current delivery capacity.
          If we charge an order and then determine the address is outside our service
          area, we will cancel that order and return the affected charge.
        </p>
      </section>

      <section>
        <h2>3. One-time orders and weekly subscriptions</h2>
        <p>
          For scheduled meal prep, a standard five-meal set includes five chef-made Soul Bowls™ in
          {` ${CURRENT_OFFER.format}`} for {PRICING.oneTime}. You may combine sets
          for multiple people or multiple daily meals. At checkout, you may choose a
          one-time order with no automatic renewal or a weekly subscription at the
          displayed weekly amount. A weekly subscription continues and renews every
          seven days until you cancel. By starting a weekly plan, you expressly
          authorize recurring weekly charges at the disclosed price, plus the selected
          fulfillment charge and applicable sales tax.
        </p>
        <p>
          You may cancel future renewals online at any time through our <Link href="/cancel">cancellation page</Link>.
          Cancellation stops future renewals; it does not reverse an order that
          has already been charged and committed to production.
        </p>
        <p>
          Take Out is our separate single-order menu at checkout.soulgood.kitchen.
          Bowls are sold individually at the displayed menu prices. A Take Out
          one-time purchase does not enroll you in a weekly meal-prep subscription.
        </p>
        <h3>Salads, veggie cups, and snacks</h3>
        <p>
          You may add made-to-order salads, veggie cups, snacks, and tasting trios to a
          meal-prep order at the listed prices (signature salads {formatCents(TIER_PRICE_CENTS["signature-salad"])},
          build-your-own salads {formatCents(TIER_PRICE_CENTS["build-your-own"])}, veggie cups {formatCents(TIER_PRICE_CENTS["veggie-cup"])},
          snacks {formatCents(TIER_PRICE_CENTS.snack)}, and the tasting trio {formatCents(TIER_PRICE_CENTS["tasting-trio"])}), with
          the dressings, bases, and toppings you choose. They count toward the order
          minimum and free-delivery threshold. On a weekly plan, the salads and snacks
          in your order are included in every renewal until you change or cancel the plan.
        </p>
      </section>

      <section>
        <h2>4. Pricing and fees</h2>
        <p>
          For scheduled meal prep, each five-meal set is {PRICING.oneTime}, whether purchased once or
          through a weekly plan. Multi-person and multi-meal orders contain multiple
          sets, and the displayed base price scales by the number of sets.
          {` ${FEES.delivery.label}`}:
          {` ${FEES.delivery.disclosure}`} Sunday pickup has no fulfillment fee.
          {` Every meal-prep and Take Out order is subject to a ${ORDER_RULES.minimumLabel.toLowerCase()}.`}
          {` ${FEES.containerDeposit.label}`}:
          {` ${FEES.containerDeposit.disclosure}`} Order and fulfillment amounts due
          at checkout will be displayed before payment. We do not add undisclosed
          handling or service fees.
        </p>
        <p>
          Take Out has its own item prices, courier fees, and service availability.
          On-demand courier fees are calculated by distance and shown in Take Out
          checkout; they are waived on Take Out orders over $100. Review the applicable
          charges, tax, and total in Take Out checkout before paying. The meal-prep
          delivery fee does not set Take Out courier fees.
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
        <h3>Weekly meal prep</h3>
        <p>
          {NOURISHMENT.deliveryDisclosure} Sunday pickup has no fulfillment fee for
          one-time meal-prep orders; weekly plans require delivery. We will provide
          the pickup location and available window before fulfillment. Meal-prep
          delivery is available to verified addresses in {SERVICE_AREA.weekly}, is
          scheduled for Sunday, and costs $8.88 per order, or nothing on orders over $100.
        </p>
        <h3>Take Out</h3>
        <p>{EAT_NOW.deliveryDetails}</p>
        <p>{EAT_NOW.coverage}</p>
        <p>{EAT_NOW.availability}</p>
        <h3>For all deliveries</h3>
        <p>
          Pickup and delivery windows
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
          Customers may choose the displayed number of bowls from the current lineup:
          {` ${AVAILABLE_BOWLS.map((bowl) => bowl.name).join(", ")}`}. Items marked
          sold out
          {SOLD_OUT_BOWLS.length ? `, including ${SOLD_OUT_BOWLS.map((bowl) => bowl.name).join(", ")},` : ""}
          {" "}cannot be selected. The mix confirmed
          at checkout applies to the order. Ingredients or builds may change based on
          quality, seasonality, supply, and kitchen capacity. We may make reasonable
          substitutions of comparable quality and will disclose material changes when
          practical. Website photos are illustrative and do not guarantee exact
          presentation.
        </p>
      </section>

      <section>
        <h2>7. Gatherings and culinary bookings</h2>
        <p>
          Gathering estimates are available for addresses in Los Angeles County. Bowl
          delivery starts at {CULINARY_PRICING.deliveryMinimumBowls} bowls and may include salads, veggie cups, and
          snacks at menu prices. Plated service is {formatCents(CULINARY_PRICING.platedPersonCents)} per guest with a
          {` ${formatCents(CULINARY_PRICING.platedFoodMinimumCents)}`} food minimum, plus {formatCents(CULINARY_PRICING.platedSupportCents)} culinary support.
          Delivery and sales tax are shown in the estimate.
        </p>
        <p>
          An estimate is not a reservation or invoice, and it expires after 30 minutes.
          Requesting a booking doesn’t reserve a date. After we confirm availability, we
          send a contract and Square invoice; a {CULINARY_PRICING.depositPercentage}% deposit reserves the date once
          the contract is signed, and the balance is due on the event date before our team
          arrives. There is no automatic charge. The signed contract controls for that event.
        </p>
      </section>

      <section>
        <h2>8. Pathway Finder and food information</h2>
        <p>
          The Pathway Finder and the “by food group” information on our menu suggest
          food based on your answers and on the ingredients printed on our labels. Food
          groups describe ingredients as USDA MyPlate groups them; they don’t measure
          nutrients or amounts. This information is for choosing food you’ll enjoy. It isn’t
          medical or nutrition advice, doesn’t diagnose or treat any condition, and isn’t a
          promise of any health result. Talk with a registered dietitian or healthcare
          provider about specific dietary needs, and always review ingredients and allergens
          before ordering.
        </p>
      </section>

      <section>
        <h2>9. Allergies and food safety</h2>
        <p>
          Our kitchen handles common allergens, including milk, eggs, fish, shellfish,
          tree nuts, peanuts, wheat, soy, and sesame. We cannot guarantee an allergen-free
          environment or prevent all cross-contact. Customers with severe or life-threatening
          allergies should not order. Ingredient and dietary information is not medical advice.
        </p>
      </section>

      <section>
        <h2>10. No-refund and exchange policy</h2>
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
        <h2>11. Reusable containers</h2>
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
        <h2>12. Acceptable use and intellectual property</h2>
        <p>
          You may use this site only for lawful personal purposes. The Soul Bowls™ name,
          logo, recipes, copy, illustrations, photography, and site content belong to
          {` ${BUSINESS.legalName}`} or its licensors and may not be copied, sold, or
          commercially exploited without written permission.
        </p>
      </section>

      <section>
        <h2>13. Newsletter and communications</h2>
        <p>
          We send transactional messages about sign-in, orders, plans, bookings, and
          applications you make. The Soul Good newsletter is optional and sent only after
          you confirm your subscription; every issue includes an unsubscribe link. You can
          manage email and other choices on <Link href="/privacy-choices">Your Privacy Choices</Link>.
        </p>
      </section>

      <section>
        <h2>14. Food for the Soul community meal drives</h2>
        <p>
          Food for the Soul meals are free. At every drive, meals are served first come,
          first served, while supplies last, and no one is asked for identification, proof of
          income, immigration status, residency, or membership, or required to take part in
          any program, service, sale, or religious activity. {NON_DISCRIMINATION_STATEMENT}
        </p>
        <p>
          Organizations in Los Angeles and Orange County may apply to host a drive. We
          review complete applications in the order received using our published criteria:
          community need, open access, a safe site, and workable logistics. We don’t consider
          protected characteristics of an organization or the people it serves. Applying
          doesn’t guarantee a drive. Hosts are responsible for permission to use their site,
          a safe setup, and following our food-safety and handling guidance; we may
          reschedule or cancel a drive for safety, weather, food-safety, or capacity reasons.
          Hosts may not collect personal information from meal recipients without their clear
          permission, and may not use drives for fundraising, sales, or recruitment.
        </p>
      </section>

      <section>
        <h2>15. Disclaimers and limitation of liability</h2>
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
        <h2>16. Governing law</h2>
        <p>
          California law governs these Terms. Any dispute not resolved informally will
          be brought in a court of competent jurisdiction in Los Angeles County,
          California, subject to any non-waivable right to bring a claim elsewhere or
          in small claims court.
        </p>
      </section>

      <section>
        <h2>17. Changes and contact</h2>
        <p>
          We may update these Terms prospectively. Material subscription changes will
          be communicated as required by law before they take effect. Questions may be
          sent to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or by mail to
          {` ${BUSINESS.legalName}, ${BUSINESS.mailingAddress}`}.
        </p>
      </section>
    </LegalShell>
  );
}
