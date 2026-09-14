import Link from "next/link";
import { ReserveButton } from "@/components/checkout/ReserveButton";
import { Logo } from "@/components/ui/Logo";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import { BRAND_NAME, type FulfillmentMethod, NOURISHMENT, PLAN, PRICING } from "@/lib/brand";
import { MAX_BOWLS_PER_ORDER } from "@/lib/bowl-selection";
import {
  AVAILABLE_BOWLS,
  CURRENT_OFFER,
  SOLD_OUT_BOWLS,
} from "@/lib/current-offer";
import { checkoutOperationsReady } from "@/lib/checkout-readiness";
import { EAT_NOW } from "@/lib/ordering";

export const metadata = {
  title: `${NOURISHMENT.label} — ${BRAND_NAME}`,
  description: `Make nourishment part of your day with chef-crafted Soul Bowls™. Five 32 oz bowls start at ${PRICING.weekly}, once or weekly, plus applicable tax and delivery.`,
};

const PLAN_ITEMS = [
  `${PLAN.bowlsPerWeek} thoughtfully prepared 32 oz bowls`,
  "For your own rhythm or a table to share",
  "Prep and eat-by dates on every jar",
  PLAN.deliveryNote,
  "Order once or choose automatic weekly delivery",
];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ fulfillment?: string }>;
}) {
  const requestedFulfillment = (await searchParams).fulfillment;
  const initialFulfillment: FulfillmentMethod =
    requestedFulfillment === "pickup" ? "pickup" : "delivery";

  return (
    <>
      <main className="min-h-screen bg-oat">
        <header className="border-b border-forest/12">
          <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
            <Wordmark href="/" />
            <Link
              href="/account"
              className="text-[0.68rem] font-bold tracking-[0.08em] text-forest/68 uppercase transition-colors hover:text-clay"
            >
              My orders
            </Link>
          </div>
        </header>

        <div className="border-b border-forest/12 bg-sand/25 px-5 py-3 text-center text-sm leading-6 text-forest/75">
          A bowl for today?{" "}
          <a href={EAT_NOW.menuUrl} className="inline-flex min-h-11 items-center font-semibold text-forest underline underline-offset-4">Order from the Eat Now menu</a>
          . Here, build your weekly nourishment order.
        </div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16 lg:py-20">
          <section className="min-w-0 flex flex-col gap-5 text-center lg:gap-6 lg:text-left">
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">
              {NOURISHMENT.label} · Once or weekly
            </p>
            <h1 className="mx-auto max-w-[10ch] text-5xl leading-[0.9] font-normal tracking-[-0.05em] text-forest sm:text-7xl lg:mx-0 lg:max-w-[9ch]">
              Make this ritual yours.
            </h1>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-forest/68 sm:text-lg lg:mx-0">
              Thoughtfully prepared bowls, chosen around your life. Start with
              five 32 oz bowls for $88, then adjust for the people at your table
              and 1–3 meals per person, per day, across five days. Order once or
              choose weekly delivery. Sunday pickup is free for one-time orders;
              in-house LA County delivery is $8.88. Applicable tax is additional.
            </p>
            <p className="mx-auto max-w-lg text-sm font-semibold leading-6 text-forest lg:mx-0">
              {NOURISHMENT.deliveryDisclosure}
            </p>

            <p className="mx-auto hidden max-w-lg text-sm leading-relaxed text-forest/55 sm:block lg:mx-0">
              Available now:{" "}
              {AVAILABLE_BOWLS.map((bowl) => bowl.name).join(", ")}.
              {SOLD_OUT_BOWLS.length > 0
                ? ` Sold out: ${SOLD_OUT_BOWLS.map((bowl) => bowl.name).join(", ")}.`
                : ""}
              {` ${CURRENT_OFFER.storage}`}
            </p>

            <p className="text-sm font-semibold text-sage sm:hidden">
              Five bowls start at $88 · tax shown before payment
            </p>

            <ul className="mt-3 hidden gap-3 text-left sm:grid sm:grid-cols-2">
              {PLAN_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-forest/75"
                >
                  <span className="flex h-7 w-7 items-center justify-center bg-sage/12">
                    <Logo size={15} title="" variant="sage" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="min-w-0 border border-forest/14 bg-white/35 p-4 sm:p-9">
            <div className="border-b border-forest/10 pb-5 text-center sm:pb-6 sm:text-left">
              <p className="font-serif text-2xl font-semibold text-forest">
                Your nourishment, your way.
              </p>
              <p className="mt-1 text-sm text-forest/55">
                One-time or weekly · 5 to {MAX_BOWLS_PER_ORDER} bowls
              </p>
              <p className="mt-3 text-xs font-bold tracking-[0.08em] text-clay uppercase sm:hidden">
                Size · Bowls · Pickup or delivery · Details · Pay
              </p>
            </div>

            <div className="pt-6">
              <ReserveButton
                initialFulfillment={initialFulfillment}
                paymentsAvailable={checkoutOperationsReady()}
                squareApplicationId={process.env.SQUARE_APPLICATION_ID ?? ""}
                squareEnvironment={
                  process.env.SQUARE_ENVIRONMENT === "production"
                    ? "production"
                    : "sandbox"
                }
                squareLocationId={process.env.SQUARE_LOCATION_ID ?? ""}
              />
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-forest/50">
              No separate handling fee. Any reusable-container deposit is
              voluntary, refundable, not California Redemption Value, and
              collected separately when containers are issued.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
