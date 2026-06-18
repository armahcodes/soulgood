import { Logo } from "@/components/ui/Logo";
import { BrandFooter } from "@/components/ui/BrandFooter";
import { SignupForm } from "@/components/join/SignupForm";

const PLAN_CONTENTS = [
  "5 chef-made meals per week",
  "5 functional juices per week",
  "1 meal each week donated to the community",
];

export const metadata = {
  title: "Become a Founding Member — Soul Good",
  description:
    "Join the Founding 50 — a capped launch cohort. $111/week: 5 meals + 5 functional juices, with 1 meal donated each week.",
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
          Founding 50 · Capped cohort
        </span>
        <h1 className="text-3xl leading-tight font-medium text-forest">
          Become a Founding Member
        </h1>
        <p className="max-w-[40ch] text-sm leading-relaxed text-forest/75">
          Just 50 founding members — be one of the first to eat with intention,
          every week. Limited by design.
        </p>
      </section>

      {/* Compact $111/week price banner (full plan details below the form). */}
      <section className="flex items-center justify-between gap-3 rounded-2xl border border-sage/25 bg-sand/30 px-5 py-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-3xl font-medium text-forest">$111</span>
          <span className="text-sm text-forest/70">/ week</span>
        </div>
        <span className="text-right text-xs leading-snug text-forest/70">
          5 meals + 5 juices
          <br />1 meal donated weekly
        </span>
      </section>

      {/* Capture form (capture-first: persists before checkout) — plan toggle is
          the first control so the plan choice is visible without scrolling. */}
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
