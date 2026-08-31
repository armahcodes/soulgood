import Link from "next/link";
import { ConfirmedBowlMix } from "@/components/checkout/ConfirmedBowlMix";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Wordmark } from "@/components/ui/Wordmark";
import { BRAND_NAME, FEES, formatCents, PLAN, PRICING } from "@/lib/brand";

export const metadata = {
  title: `Order confirmed — ${BRAND_NAME}`,
  description: `Your ${BRAND_NAME} reservation or order is saved. We'll text you before your Sunday pickup or delivery.`,
};

const NEXT_STEPS = [
  "We review your pickup or delivery details.",
  "We text you to confirm your first week.",
  `${PLAN.bowlsPerWeek} fresh 32 oz jarred bowls are ready on ${PLAN.deliveryDay}.`,
];

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ purchased?: string; subscribed?: string; type?: string }>;
}) {
  const params = await searchParams;
  const purchased = params.purchased === "1" || params.subscribed === "1";
  const weekly = params.type === "weekly" || params.subscribed === "1";
  const nextSteps = purchased
    ? [
        `${weekly ? "Your weekly plan" : "Your one-time order"} and five-bowl mix are confirmed.`,
        "We text you to confirm your first Sunday window.",
        `${PLAN.bowlsPerWeek} fresh 32 oz jarred bowls are prepared for ${PLAN.deliveryDay}.`,
      ]
    : NEXT_STEPS;

  return (
    <main className="flex min-h-screen flex-col bg-oat">
      <header className="border-b border-forest/12">
        <div className="mx-auto flex min-h-20 w-full max-w-5xl items-center px-5 sm:px-8">
          <Wordmark href="/" />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="mb-8 flex h-20 w-20 items-center justify-center bg-forest">
          <Logo size={46} title="" variant="cream" />
        </div>
        <p className="mb-5 text-xs font-bold tracking-[0.18em] text-clay uppercase">
          {purchased ? (weekly ? "Weekly plan active" : "Order confirmed") : "You’re on the list"}
        </p>
        <h1 className="max-w-[11ch] text-5xl leading-[0.94] font-normal tracking-[-0.05em] text-forest sm:text-7xl">
          {purchased ? "Your five are confirmed." : "Your bowls are almost ready."}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest/68">
          {purchased ? (weekly ? "Thanks for starting" : "Thanks for ordering") : "Thanks for reserving"}{" "}
          Soul Bowls™. We&rsquo;ll text you before your {weekly ? "first " : ""}
          pickup or delivery. {weekly ? "The plan" : "This order"} stays simple:
          {` ${PLAN.bowlsPerWeek}`} 32 oz jarred bowls for {weekly ? `${PRICING.weekly}/week` : PRICING.oneTime},
          with free pickup or $8.88 LA County delivery.
          Applicable California sales tax is itemized on the checkout receipt. Your
          one-time refundable container deposit is
          {FEES.containerDeposit.amountCents === null
            ? " confirmed separately before containers are issued"
            : ` ${formatCents(FEES.containerDeposit.amountCents)}`}.
        </p>

        {purchased ? <ConfirmedBowlMix /> : null}

        <ol className="mt-12 grid w-full gap-3 text-left sm:grid-cols-3">
          {nextSteps.map((step, index) => (
            <li key={step} className="border border-forest/12 bg-white/35 p-5">
              <span className="mb-5 flex h-7 w-7 items-center justify-center bg-gold text-xs font-bold text-forest">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-forest/72">{step}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 max-w-2xl border border-forest/12 bg-white/35 p-5 text-sm leading-relaxed text-forest/68">
          {weekly
            ? "Your plan renews every seven days until canceled."
            : "This order is charged once and does not renew automatically."}{" "}
          Keep a copy of the{" "}
          <Link href="/customer-agreement" className="font-semibold underline underline-offset-2">
            Customer Agreement
          </Link>{" "}
          {weekly ? (
            <>
              {" "}and use the{" "}
              <Link href="/cancel" className="font-semibold underline underline-offset-2">
                online cancellation page
              </Link>{" "}
              anytime to stop future renewals.
            </>
          ) : (
            <> for the exchange, pickup, and delivery terms.</>
          )}
        </div>

        <Button as="a" href="/" variant="secondary" className="mt-10">
          Back to Soul Bowls™
        </Button>
      </section>
    </main>
  );
}
