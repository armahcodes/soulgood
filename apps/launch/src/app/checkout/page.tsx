import { ReserveButton } from "@/components/checkout/ReserveButton";
import { Logo } from "@/components/ui/Logo";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import {
  BRAND_NAME,
  type FulfillmentMethod,
  PLAN,
  PRICING,
} from "@/lib/brand";
import { CURRENT_BOWLS, CURRENT_OFFER } from "@/lib/current-offer";

export const metadata = {
  title: `Start Your Plan — ${BRAND_NAME}`,
  description: `${PLAN.bowlsPerWeek} chef-made Soul Bowls™ every ${PLAN.deliveryDay} for ${PRICING.weekly}/week, with pickup or LA County delivery, applicable tax, and a disclosed deposit.`,
};

const PLAN_ITEMS = [
  `${PLAN.bowlsPerWeek} chef-made 32 oz jarred bowls`,
  "One of each current recipe",
  "Prep and eat-by dates on every jar",
  PLAN.deliveryNote,
  "Pause or cancel future renewals anytime",
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
          <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center px-5 sm:px-8">
            <Wordmark href="/" />
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-16 lg:py-20">
          <section className="flex flex-col gap-6">
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">
              One simple plan
            </p>
            <h1 className="max-w-[9ch] text-5xl leading-[0.9] font-normal tracking-[-0.05em] text-forest sm:text-7xl">
              Start your bowl week.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-forest/68">
              Five fresh 32 oz jarred Soul Bowls™ for the week. Choose free Sunday
              pickup or $8.88 Sunday delivery throughout Los Angeles County.
            </p>

            <p className="max-w-lg text-sm leading-relaxed text-forest/55">
              This week: {CURRENT_BOWLS.map((bowl) => bowl.name).join(", ")}.
              {` ${CURRENT_OFFER.storage}`}
            </p>

            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {PLAN_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-forest/75">
                  <span className="flex h-7 w-7 items-center justify-center bg-sage/12">
                    <Logo size={15} title="" variant="sage" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-forest/14 bg-white/35 p-6 sm:p-9">
            <div className="border-b border-forest/10 pb-6">
              <p className="font-serif text-2xl font-semibold text-forest">
                Weekly Soul Bowls™
              </p>
              <p className="mt-1 text-sm text-forest/55">
                {PLAN.bowlsPerWeek} jarred bowls · renews every 7 days
              </p>
            </div>

            <div className="pt-6">
              <ReserveButton
                initialFulfillment={initialFulfillment}
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
              No separate handling fee. Any reusable-container deposit is voluntary,
              refundable, not California Redemption Value, and collected separately
              when containers are issued.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
