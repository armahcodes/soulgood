import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Wordmark } from "@/components/ui/Wordmark";
import { BRAND_NAME, FEES, formatCents, PLAN, PRICING } from "@/lib/brand";

export const metadata = {
  title: `You're on the list — ${BRAND_NAME}`,
  description: `Your ${BRAND_NAME} reservation is saved. We'll text you before your first Sunday pickup or delivery.`,
};

const NEXT_STEPS = [
  "We review your pickup or delivery details.",
  "We text you to confirm your first week.",
  `${PLAN.bowlsPerWeek} fresh bowls are ready on ${PLAN.deliveryDay}.`,
];

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-gold/25">
      <header className="mx-auto flex w-full max-w-5xl px-5 py-6 sm:px-8">
        <Wordmark href="/" className="text-forest" />
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-forest text-oat">
          <Logo size={46} title="" />
        </div>
        <p className="mb-5 text-xs font-bold tracking-[0.18em] text-clay uppercase">
          You&rsquo;re on the list
        </p>
        <h1 className="max-w-[11ch] text-5xl leading-[0.94] font-semibold tracking-[-0.05em] text-forest sm:text-7xl">
          Your bowls are almost ready.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest/68">
          Thanks for reserving Soul Bowls™. We&rsquo;ll text you before your first
          pickup or delivery. The plan stays simple: {PLAN.bowlsPerWeek} bowls for
          {` ${PRICING.weekly}`}/week, with free pickup or $8.88 LA County delivery.
          Applicable California sales tax is itemized on the checkout receipt. Your
          one-time refundable container deposit is
          {FEES.containerDeposit.amountCents === null
            ? " confirmed separately before containers are issued"
            : ` ${formatCents(FEES.containerDeposit.amountCents)}`}.
        </p>

        <ol className="mt-12 grid w-full gap-3 text-left sm:grid-cols-3">
          {NEXT_STEPS.map((step, index) => (
            <li key={step} className="rounded-2xl bg-oat p-5 shadow-sm">
              <span className="mb-5 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-forest">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-forest/72">{step}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 max-w-2xl rounded-2xl border border-forest/12 bg-oat p-5 text-sm leading-relaxed text-forest/68">
          Your plan renews every seven days until canceled. Keep a copy of the{" "}
          <Link href="/customer-agreement" className="font-semibold underline underline-offset-2">
            Customer Agreement
          </Link>{" "}
          and use the{" "}
          <Link href="/cancel" className="font-semibold underline underline-offset-2">
            online cancellation page
          </Link>{" "}
          anytime to stop future renewals.
        </div>

        <Button as="a" href="/" variant="secondary" className="mt-10">
          Back to Soul Bowls™
        </Button>
      </section>
    </main>
  );
}
