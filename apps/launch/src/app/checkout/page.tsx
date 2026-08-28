import { ReserveButton } from "@/components/checkout/ReserveButton";
import { Logo } from "@/components/ui/Logo";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import {
  BRAND_NAME,
  BUSINESS,
  FEES,
  formatCents,
  PLAN,
  PRICING,
} from "@/lib/brand";

export const metadata = {
  title: `Start Your Plan — ${BRAND_NAME}`,
  description: `${PLAN.bowlsPerWeek} chef-made Soul Bowls™ delivered every ${PLAN.deliveryDay} for ${PRICING.weekly}/week, plus disclosed delivery and deposit charges.`,
};

const PLAN_ITEMS = [
  `${PLAN.bowlsPerWeek} chef-made bowls`,
  PLAN.deliveryNote,
  BUSINESS.serviceArea,
  "A rotating seasonal menu",
  "Pause or cancel future renewals anytime",
];

export default function CheckoutPage() {
  const feesReady =
    FEES.delivery.amountCents !== null &&
    FEES.containerDeposit.amountCents !== null;
  const weeklyTotalCents = feesReady
    ? PRICING.weeklyCents + FEES.delivery.amountCents!
    : null;
  const firstChargeCents = feesReady
    ? weeklyTotalCents! + FEES.containerDeposit.amountCents!
    : null;

  return (
    <>
      <main className="min-h-screen bg-gold/25">
        <header className="mx-auto flex w-full max-w-5xl px-5 py-6 sm:px-8">
          <Wordmark href="/" className="text-forest" />
        </header>

        <div className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:py-20">
          <section className="flex flex-col gap-6">
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">
              One simple plan
            </p>
            <h1 className="max-w-[9ch] text-5xl leading-[0.94] font-semibold tracking-[-0.05em] text-forest sm:text-7xl">
              Start your bowl week.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-forest/68">
              Five fresh Soul Bowls™ for the week, delivered together every
              Sunday. Available only to delivery addresses in Los Angeles County.
            </p>

            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {PLAN_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-forest/75">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage/15 text-sage">
                    <Logo size={16} title="" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] bg-oat p-6 shadow-[0_22px_80px_rgba(32,53,47,0.10)] sm:p-8">
            <div className="border-b border-forest/10 pb-6">
              <p className="font-serif text-2xl font-semibold text-forest">
                Weekly Soul Bowls™
              </p>
              <p className="mt-1 text-sm text-forest/55">
                {PLAN.bowlsPerWeek} bowls · renews every 7 days
              </p>
            </div>

            <dl className="grid gap-3 border-b border-forest/10 py-6 text-sm text-forest/70">
              <div className="flex items-start justify-between gap-4">
                <dt>Weekly base plan</dt>
                <dd className="font-semibold text-forest">{PRICING.weekly}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt>Delivery each week</dt>
                <dd className="text-right font-semibold text-forest">
                  {formatCents(FEES.delivery.amountCents)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt>
                  Reusable-container deposit
                  <span className="block text-xs font-normal text-forest/50">
                    One time · refundable on eligible return
                  </span>
                </dt>
                <dd className="text-right font-semibold text-forest">
                  {formatCents(FEES.containerDeposit.amountCents)}
                </dd>
              </div>
              <div className="mt-2 flex items-end justify-between gap-4 border-t border-forest/10 pt-4">
                <dt className="font-semibold text-forest">
                  First charge
                  <span className="block text-xs font-normal text-forest/50">
                    Then {formatCents(weeklyTotalCents)} each week
                  </span>
                </dt>
                <dd className="font-serif text-3xl font-semibold text-forest">
                  {formatCents(firstChargeCents)}
                </dd>
              </div>
            </dl>

            {!feesReady && (
              <div className="my-6 rounded-2xl border border-clay/25 bg-clay/8 p-4 text-sm leading-relaxed text-forest/72">
                Online payment is paused until Soul Goods LLC approves the exact
                delivery and refundable container-deposit amounts. You will see
                every charge before payment is enabled.
              </div>
            )}

            <div className="pt-6">
              <ReserveButton />
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-forest/50">
              No separate handling fee. The container charge is a voluntary,
              refundable reusable-container deposit—not California Redemption Value.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
