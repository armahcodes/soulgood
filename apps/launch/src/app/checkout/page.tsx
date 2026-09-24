import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { ReserveButton } from "@/components/checkout/ReserveButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
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
      <SiteHeader
        variant="focus"
        aside={
          <Link
            href="/account"
            className="inline-flex min-h-11 items-center text-[0.7rem] font-bold tracking-[0.1em] text-forest/70 uppercase transition-colors hover:text-clay"
          >
            My orders
          </Link>
        }
      />
      <main className="min-h-screen bg-oat">
        <div className="border-b border-forest/12 bg-sand/25 px-5 py-3 text-center text-sm leading-6 text-forest/75">
          A bowl for today?{" "}
          <a href={EAT_NOW.menuUrl} className="inline-flex min-h-11 items-center font-semibold text-forest underline underline-offset-4">Order from the Eat Now menu</a>
          . Here, build your weekly nourishment order.
        </div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-8 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16 lg:py-20">
          <section className="min-w-0 flex flex-col gap-5 text-center lg:sticky lg:top-28 lg:gap-6 lg:text-left">
            <div aria-hidden="true" className="mx-auto flex -space-x-5 lg:mx-0">
              {AVAILABLE_BOWLS.map((bowl, index) => (
                <div
                  key={bowl.id}
                  className="relative size-16 overflow-hidden rounded-full border-4 border-oat bg-sand shadow-sm sm:size-[4.5rem]"
                  style={{ zIndex: AVAILABLE_BOWLS.length - index }}
                >
                  <Image src={bowl.imagePath} alt="" fill unoptimized sizes="72px" className="scale-150 object-cover object-[50%_60%]" />
                </div>
              ))}
            </div>
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

            <Link
              href="/quiz"
              className="group mx-auto flex w-fit items-center gap-3 rounded-full border border-forest/15 bg-card py-1.5 pr-4 pl-1.5 text-sm text-forest transition-colors hover:border-forest/40 lg:mx-0"
            >
              <span className="shrink-0 rounded-full bg-sage px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.14em] whitespace-nowrap text-oat uppercase">2 min</span>
              <span className="hidden sm:inline">Not sure which bowls?</span>{" "}
              <span className="font-semibold whitespace-nowrap underline underline-offset-4 group-hover:text-clay">Find your pathway</span>
            </Link>

            <ul className="mt-2 hidden gap-3 border-t border-forest/10 pt-6 text-left sm:grid sm:grid-cols-2">
              {PLAN_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-forest/75"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="min-w-0 rounded-lg border border-forest/12 bg-white/40 p-4 shadow-[0_30px_60px_-45px_rgb(44_58_52/0.5)] sm:p-9">
            <div className="border-b border-forest/10 pb-5 text-center sm:pb-6 sm:text-left">
              <p className="font-serif text-2xl font-semibold text-forest">
                Your nourishment, your way.
              </p>
              <p className="mt-1 text-sm text-forest/55">
                One-time or weekly · 5 to {MAX_BOWLS_PER_ORDER} bowls
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
