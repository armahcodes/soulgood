import { Logo } from "@/components/ui/Logo";
import { BrandFooter } from "@/components/ui/BrandFooter";
import { ReserveButton } from "@/components/checkout/ReserveButton";
import { PRICING } from "@/lib/brand";

export const metadata = {
  title: "Place Your Order — Soul Good",
  description:
    "Place your first Soul Good order. $88 your first week, then $111/week. One meal a day, Monday–Friday, delivered fresh every Sunday.",
};

const HOW_IT_WORKS = [
  `Your first week is ${PRICING.firstWeek}, then ${PRICING.weekly}/week — cancel anytime.`,
  "One meal a day, Monday through Friday — delivered fresh every Sunday.",
  "First delivery is sometime in July — we'll confirm your window by text.",
];

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-8 px-5 py-8">
      <header className="flex items-center gap-2">
        <Logo size={32} className="text-forest" />
        <span className="font-serif text-sm tracking-[0.18em] text-forest uppercase">
          Soul Good
        </span>
      </header>

      <section className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-sage/15 px-3 py-1 text-xs font-medium tracking-[0.18em] text-sage uppercase">
          Almost there
        </span>
        <h1 className="text-4xl leading-tight font-medium text-forest">
          Place your first order
        </h1>
        <p className="max-w-[40ch] text-base leading-relaxed text-forest/75">
          Your details are saved. Your first week is{" "}
          <span className="font-medium text-forest">
            {PRICING.firstWeek}
          </span>
          , then {PRICING.weekly}/week — one meal a day, Monday through Friday,
          delivered fresh every Sunday.
        </p>
      </section>

      {/* How ordering works */}
      <section className="flex flex-col gap-4 rounded-3xl border border-sage/25 bg-sand/30 p-6">
        <h2 className="font-serif text-xl font-medium text-forest">
          How it works
        </h2>
        <ul className="flex flex-col gap-3">
          {HOW_IT_WORKS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-forest/80"
            >
              <Logo size={16} className="mt-0.5 text-sage" title="" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Secure checkout via Stripe */}
      <section
        aria-label="Secure checkout"
        className="flex flex-col items-center gap-2 rounded-3xl border border-sage/25 bg-oat px-6 py-7 text-center"
      >
        <Logo size={28} className="text-sage" title="" />
        <p className="text-sm font-medium text-forest">
          Secure checkout — {PRICING.firstWeek} first week
        </p>
        <p className="max-w-[34ch] text-xs leading-relaxed text-forest/60">
          You&rsquo;ll be redirected to Stripe&rsquo;s secure checkout. Your first
          week is {PRICING.firstWeek}; {PRICING.weekly}/week begins after.
        </p>
      </section>

      <section className="flex flex-col gap-3 pt-1">
        <ReserveButton />
        <p className="text-center text-xs leading-relaxed text-forest/55">
          {PRICING.firstWeek} today for your first week — then {PRICING.weekly}
          /week. Cancel anytime.
        </p>
      </section>

      <BrandFooter />
    </main>
  );
}
