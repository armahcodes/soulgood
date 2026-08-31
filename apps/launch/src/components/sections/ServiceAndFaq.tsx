import Link from "next/link";
import { BUSINESS, FEES, formatCents, PLAN, PRICING, TAX } from "@/lib/brand";
import { CURRENT_OFFER } from "@/lib/current-offer";

const FAQS = [
  {
    question: "What comes in the weekly plan?",
    answer: `${PLAN.bowlsPerWeek} chef-made 32 oz jarred bowls—one of each current recipe—prepared together for ${PLAN.deliveryDay} pickup or delivery.`,
  },
  {
    question: "How do I store and serve the bowls?",
    answer: `${CURRENT_OFFER.storage} Plate and enjoy cold, or remove the lid, transfer the food to a microwave-safe bowl, and warm before serving.`,
  },
  {
    question: "Where do you deliver?",
    answer: `Delivery is $8.88 per week to verified addresses throughout ${BUSINESS.serviceArea}. We confirm eligibility before activating the first delivery.`,
  },
  {
    question: "Can I pick up my bowls?",
    answer: "Yes. Sunday pickup has no fulfillment fee. We confirm the pickup location and window before fulfillment.",
  },
  {
    question: "How does billing work?",
    answer: `The base plan renews every seven days at ${PRICING.weekly} until canceled. Pickup is free or LA County delivery is $8.88 per week. Applicable sales tax and any refundable reusable-container deposit are disclosed before payment.`,
  },
  {
    question: "Can I cancel?",
    answer: "Yes. Cancel future renewals online at any time. An order already charged and committed to production remains final.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Perishable orders are nonrefundable. If an item arrives missing, incorrect, damaged, or spoiled, report it within 24 hours for a verified exchange, replacement, or account credit.",
  },
  {
    question: "Can you accommodate severe allergies?",
    answer: "The current line includes sesame, soy, and wheat-related risks, and our kitchen handles other major allergens. We cannot guarantee against cross-contact. Customers with severe or life-threatening allergies should not order.",
  },
];

export function ServiceAndFaq() {
  return (
    <section id="delivery" className="bg-sand/45">
      <div className="mx-auto grid w-full max-w-7xl gap-16 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full bg-clay px-4 py-2 text-xs font-bold tracking-[0.16em] text-oat uppercase">
            Pickup or LA County delivery
          </span>
          <h2 className="max-w-[10ch] text-5xl leading-[0.94] font-semibold tracking-[-0.045em] text-forest sm:text-6xl">
            Local by design.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-forest/68">
            Pick up your Sunday bowls at no extra charge, or choose $8.88 weekly
            delivery throughout Los Angeles County. Delivery addresses are verified.
          </p>

          <div className="mt-2 w-full max-w-md rounded-3xl border border-forest/12 bg-oat/75 p-6">
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-forest/45 uppercase">
              Transparent charges
            </p>
            <dl className="grid gap-4 text-sm">
              <div className="flex items-start justify-between gap-6">
                <dt className="font-bold text-forest">Weekly plan</dt>
                <dd className="text-right text-forest/65">{PRICING.weekly}</dd>
              </div>
              <div className="flex items-start justify-between gap-6 border-t border-forest/10 pt-4">
                <dt className="font-bold text-forest">Sunday pickup</dt>
                <dd className="max-w-[16rem] text-right text-forest/65">$0.00</dd>
              </div>
              <div className="flex items-start justify-between gap-6 border-t border-forest/10 pt-4">
                <dt className="font-bold text-forest">{FEES.delivery.label}</dt>
                <dd className="max-w-[16rem] text-right text-forest/65">
                  {formatCents(FEES.delivery.amountCents)} per week
                </dd>
              </div>
              <div className="flex items-start justify-between gap-6 border-t border-forest/10 pt-4">
                <dt className="font-bold text-forest">Container deposit</dt>
                <dd className="max-w-[16rem] text-right text-forest/65">
                  {FEES.containerDeposit.amountCents === null
                    ? "Confirmed separately"
                    : formatCents(FEES.containerDeposit.amountCents)}{" "}
                  · one-time refundable
                </dd>
              </div>
              <div className="flex items-start justify-between gap-6 border-t border-forest/10 pt-4">
                <dt className="font-bold text-forest">California sales tax</dt>
                <dd className="max-w-[16rem] text-right text-forest/65">Calculated at checkout</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-forest/50">
              Food containers are not subject to California CRV. The reusable-container
              deposit is a separate Soul Goods LLC return program.
              {` `}{TAX.disclosure}
            </p>
          </div>
        </div>

        <div id="faq">
          <p className="mb-5 text-xs font-bold tracking-[0.18em] text-clay uppercase">
            Common questions
          </p>
          <div className="border-t border-forest/15">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group border-b border-forest/15 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold text-forest">
                  {faq.question}
                  <span className="text-2xl font-normal text-clay transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-relaxed text-forest/65">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-sm text-forest/55">
            Read the <Link href="/customer-agreement" className="font-bold text-clay underline underline-offset-4">Customer Agreement</Link>
            {` `}for complete purchase and delivery terms.
          </p>
        </div>
      </div>
    </section>
  );
}
