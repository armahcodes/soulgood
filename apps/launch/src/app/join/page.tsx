import { Logo } from "@/components/ui/Logo";
import { BrandFooter } from "@/components/ui/BrandFooter";
import { SignupForm } from "@/components/join/SignupForm";
import { PRICING, PLAN } from "@/lib/brand";

const PLAN_CONTENTS = [
  `${PLAN.cadence} (${PLAN.mealsPerWeek} chef-made meals)`,
  `${PLAN.juicesPerWeek} functional juices per week`,
  PLAN.deliveryNote,
  "1 meal each week donated to the community",
];

export const metadata = {
  title: "Start Your Plan — Soul Good",
  description:
    "Join the Founding 50. One meal a day, Monday–Friday (5 chef-made meals) plus 5 functional juices, delivered fresh every Sunday. $88 your first week, then $111/week — 1 meal donated each week.",
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

      {/* Scarcity framing — capped founding cohort */}
      <section className="flex flex-col gap-2">
        <span className="w-fit rounded-full bg-clay/12 px-3 py-1 text-xs font-medium tracking-[0.18em] text-clay uppercase">
          Founding 50
        </span>
        <h1 className="text-3xl leading-tight font-medium text-forest">
          Start your plan
        </h1>
        <p className="max-w-[40ch] text-sm leading-relaxed text-forest/75">
          Join the Founding 50 — one of just 50 spots. One meal a day, Monday
          through Friday, delivered fresh every Sunday. Your first week is{" "}
          {PRICING.firstWeek}, then {PRICING.weekly}/week.
        </p>
      </section>

      {/* Compact price banner (full plan details below the form). */}
      <section className="flex flex-col gap-2 rounded-2xl border border-sage/25 bg-sand/30 px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl font-medium text-forest">
              {PRICING.firstWeek}
            </span>
            <span className="text-sm text-forest/70">first week</span>
          </div>
          <span className="text-right text-xs leading-snug text-forest/70">
            then {PRICING.weekly}/week
            <br />5 meals + 5 juices · delivered Sunday
          </span>
        </div>
        <p className="text-xs leading-relaxed text-forest/60">
          {PRICING.firstWeek} your first week, then {PRICING.weekly}/week. No
          charge today — reserve your spot and we&rsquo;ll reach out to start your
          plan.
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
