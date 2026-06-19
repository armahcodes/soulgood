import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { FOUNDER, TAGLINE } from "@/lib/brand";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-6 py-10 text-center">
      {/* Soft botanical placeholder wash — graceful stand-in for food photography. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, var(--color-sand) 0%, var(--color-oat) 55%, var(--color-oat) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-2xl"
        style={{ backgroundColor: "var(--color-sage)" }}
      />

      {/* Brand mark */}
      <header className="flex w-full flex-col items-center gap-3">
        <Logo size={56} className="text-forest" />
        <p className="font-serif text-lg tracking-[0.18em] text-forest uppercase">
          Soul Good
        </p>
      </header>

      {/* Welcome */}
      <section className="flex flex-col items-center gap-6">
        <p className="text-sm font-medium tracking-[0.22em] text-clay">
          {TAGLINE}
        </p>
        <h1 className="max-w-[18ch] text-4xl leading-[1.1] font-medium text-forest sm:text-5xl">
          Welcome — let&rsquo;s find your pathway
        </h1>
        <p className="max-w-[34ch] text-base leading-relaxed text-forest/75">
          A few gentle questions to match you with nourishment made for where
          you are right now.
        </p>
      </section>

      {/* Primary CTA */}
      <section className="flex w-full max-w-sm flex-col gap-3">
        <Button as="a" href="/quiz" size="lg" className="w-full">
          Find your pathway
        </Button>
        <p className="text-xs tracking-wide text-forest/60">
          Crafted with care by {FOUNDER}
        </p>
      </section>
    </main>
  );
}
