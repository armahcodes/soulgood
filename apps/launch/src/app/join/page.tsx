import { Logo } from "@/components/ui/Logo";
import { BrandFooter } from "@/components/ui/BrandFooter";
import { SignupForm } from "@/components/join/SignupForm";

const PLAN_CONTENTS = [
  "5 chef-made meals per week",
  "5 functional juices per week",
  "1 meal each week donated to the community",
];

export const metadata = {
  title: "Preorder Your Spot — Soul Good",
  description:
    "Preorder the Founding 50 with a $50 deposit to reserve your spot. First delivery sometime in July. $111/week: 5 meals + 5 functional juices, with 1 meal donated each week.",
};

export default function JoinPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-5 py-6">
      <header className="flex items-center gap-2">
        <Logo size={28} className="text-forest" />
        <span className="font-serif text-sm tracking-[0.18em] text-forest uppercase">
          Soul Good
        </span>
      </header>

      {/* Scarcity framing — capped founding cohort, preorder */}
      <section className="flex flex-col gap-2">
        <span className="w-fit rounded-full bg-clay/12 px-3 py-1 text-xs font-medium tracking-[0.18em] text-clay uppercase">
          Founding 50 · Preorder
        </span>
        <h1 className="text-3xl leading-tight font-medium text-forest">
          Reserve your founding spot
        </h1>
        <p className="max-w-[40ch] text-sm leading-relaxed text-forest/75">
          A $50 deposit holds your place in the Founding 50 — one of just 50 spots.
          Your first delivery arrives sometime in July, and we&rsquo;ll notify you
          when launch is ready to complete your payment.
        </p>
      </section>

      {/* Compact $111/week price banner (full plan details below the form). */}
      <section className="flex flex-col gap-2 rounded-2xl border border-sage/25 bg-sand/30 px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl font-medium text-forest">$111</span>
            <span className="text-sm text-forest/70">/ week</span>
          </div>
          <span className="text-right text-xs leading-snug text-forest/70">
            5 meals + 5 juices
            <br />1 meal donated weekly
          </span>
        </div>
        <p className="text-xs leading-relaxed text-forest/60">
          $111/week is what you&rsquo;ll pay later — today it&rsquo;s just a $50
          deposit to hold your spot.
        </p>
      </section>

      {/* Capture form (capture-first: persists before checkout). */}
      <section className="flex flex-col gap-4">
        <SignupForm />
      </section>

      {/* Full plan details + give-back, surfaced below the capture form. */}
      <section className="flex flex-col gap-4 rounded-3xl border border-sage/25 bg-sand/30 p-6">
        <h2 className="font-serif text-xl font-medium text-forest">
          What&rsquo;s in your week
        </h2>
        <ul className="flex flex-col gap-2">
          {PLAN_CONTENTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-base text-forest/80"
            >
              <Logo size={18} className="mt-0.5 text-sage" title="" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="rounded-2xl bg-sage/12 px-4 py-3 text-sm leading-relaxed text-forest/80">
          <span className="font-medium text-forest">The give-back:</span> every
          plan donates 1 meal each week to someone in the community. Nourishment
          that reaches further than your table.
        </p>
      </section>

      <BrandFooter />
    </main>
  );
}
