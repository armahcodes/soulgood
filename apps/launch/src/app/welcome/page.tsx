import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/welcome/ShareButton";
import { PathwayBadge } from "@/components/welcome/PathwayBadge";
import { FOUNDER, TAGLINE } from "@/lib/brand";

export const metadata = {
  title: "You're in — Welcome to Soul Good",
  description:
    "You reserved your Founding 50 spot. Here's what happens next, when your first delivery arrives in July, and the founders building Soul Good with you.",
};

const WHAT_HAPPENS_NEXT = [
  {
    title: "We'll text you",
    body: "Watch for a welcome text confirming your founding spot and pathway.",
  },
  {
    title: "Complete your payment when launch is ready",
    body: "We'll notify you to complete your full payment ($111/week) when launch is ready — sometime in July.",
  },
  {
    title: "Your menu is matched",
    body: "Meals and juices are curated to the pathway you found in the quiz.",
  },
];

/** A warm, anonymized founders-wall — the cohort you're joining. */
const FOUNDERS_WALL = [
  "A.R.",
  "Jordan",
  "M.",
  "Priya",
  "Dev",
  "Lena",
  "Chris",
  "Sam",
  "Noor",
  "T.J.",
  "Ada",
  "You",
];

export default function WelcomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col gap-9 overflow-hidden px-5 py-10">
      {/* Soft celebratory wash so arriving feels like an event. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -10%, var(--color-sand) 0%, var(--color-oat) 55%, var(--color-oat) 100%)",
        }}
      />

      {/* The "you joined something" moment */}
      <section className="flex flex-col items-center gap-5 pt-4 text-center">
        <Logo size={56} className="text-sage" />
        <PathwayBadge />
        <p className="text-sm font-medium tracking-[0.22em] text-clay uppercase">
          You&rsquo;re one of the Founding 50
        </p>
        <h1 className="max-w-[16ch] text-4xl leading-[1.1] font-medium text-forest">
          You just joined something
        </h1>
        <p className="max-w-[34ch] text-base leading-relaxed text-forest/75">
          This isn&rsquo;t a checkout receipt — it&rsquo;s the start of eating with
          intention, together. Welcome to Soul Good.
        </p>
        <p className="text-sm font-medium tracking-[0.22em] text-sage">
          {TAGLINE}
        </p>
      </section>

      {/* What happens next */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-medium text-forest">
          What happens next
        </h2>
        <ol className="flex flex-col gap-3">
          {WHAT_HAPPENS_NEXT.map((step, i) => (
            <li
              key={step.title}
              className="flex items-start gap-3 rounded-2xl border border-sage/20 bg-oat/70 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-medium text-oat">
                {i + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-forest">{step.title}</p>
                <p className="text-sm leading-relaxed text-forest/70">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* First delivery */}
      <section className="flex flex-col gap-2 rounded-3xl border border-clay/25 bg-clay/10 p-6">
        <span className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
          Your first delivery
        </span>
        <p className="font-serif text-2xl font-medium text-forest">
          Sometime in July
        </p>
        <p className="max-w-[36ch] text-sm leading-relaxed text-forest/75">
          Your first box of 5 chef-made meals and 5 functional juices lands
          sometime in July — we&rsquo;ll confirm your delivery window by text.
        </p>
      </section>

      {/* Founders wall */}
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-medium text-forest">
          The founders wall
        </h2>
        <p className="max-w-[36ch] text-sm leading-relaxed text-forest/70">
          You&rsquo;re building Soul Good alongside this first cohort. Your name
          belongs here too.
        </p>
        <ul className="flex flex-wrap gap-2">
          {FOUNDERS_WALL.map((name, i) => {
            const isYou = name === "You";
            return (
              <li
                key={`${name}-${i}`}
                className={[
                  "rounded-full px-3.5 py-1.5 text-sm",
                  isYou
                    ? "bg-forest font-medium text-oat"
                    : "bg-sand/60 text-forest/75",
                ].join(" ")}
              >
                {name}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Follow / share affordance */}
      <section className="flex flex-col gap-3 pt-1">
        <ShareButton />
        <Button
          as="a"
          href="https://instagram.com/soulgood"
          variant="link"
          className="w-full justify-center"
        >
          Follow @soulgood on Instagram
        </Button>
        <p className="pt-2 text-center text-xs leading-relaxed text-forest/55">
          Crafted with care by {FOUNDER}
        </p>
      </section>
    </main>
  );
}
