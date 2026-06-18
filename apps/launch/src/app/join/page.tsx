import { Logo } from "@/components/ui/Logo";
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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-8 px-5 py-8">
      <header className="flex items-center gap-2">
        <Logo size={32} className="text-forest" />
        <span className="font-serif text-sm tracking-[0.18em] text-forest uppercase">
          Soul Good
        </span>
      </header>

      {/* Scarcity framing — capped founding cohort */}
      <section className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-clay/12 px-3 py-1 text-xs font-medium tracking-[0.18em] text-clay uppercase">
          Founding 50 · Capped cohort
        </span>
        <h1 className="text-4xl leading-tight font-medium text-forest">
          Become a Founding Member
        </h1>
        <p className="max-w-[40ch] text-base leading-relaxed text-forest/75">
          We&rsquo;re opening to just 50 founding members — be one of the first to
          eat with intention, every week. Limited by design.
        </p>
      </section>

      {/* The single $111/week plan + give-back */}
      <section className="flex flex-col gap-4 rounded-3xl border border-sage/25 bg-sand/30 p-6">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-4xl font-medium text-forest">$111</span>
          <span className="text-base text-forest/70">/ week</span>
        </div>
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

      {/* Capture form (capture-first: persists before checkout) */}
      <section className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-forest/70">
          Reserve your spot below. We&rsquo;ll save your pathway and contact
          details either way — buy now, or join the list and decide later.
        </p>
        <SignupForm />
      </section>
    </main>
  );
}
