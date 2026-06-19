import { Logo } from "@/components/ui/Logo";
import { BrandFooter } from "@/components/ui/BrandFooter";
import { ReserveButton } from "@/components/checkout/ReserveButton";

export const metadata = {
  title: "Reserve Your Spot — Soul Good",
  description:
    "Reserve your Founding 50 spot with a $50 deposit. First delivery sometime in July — we'll notify you when launch is ready to complete your $111/week payment.",
};

const HOW_IT_WORKS = [
  "Your $50 deposit holds your founding spot in the capped cohort of 50.",
  "First delivery is sometime in July — we'll confirm your window by text.",
  "When launch is ready, we'll notify you to complete your full payment ($111/week).",
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
          Reserve your spot with a $50 deposit
        </h1>
        <p className="max-w-[40ch] text-base leading-relaxed text-forest/75">
          Your details are saved. A <span className="font-medium text-forest">$50
          deposit</span> holds your founding spot. Your first delivery is sometime
          in July, and we&rsquo;ll notify you when launch is ready to complete your
          full payment ($111/week).
        </p>
      </section>

      {/* How the preorder deposit works */}
      <section className="flex flex-col gap-4 rounded-3xl border border-sage/25 bg-sand/30 p-6">
        <h2 className="font-serif text-xl font-medium text-forest">
          How your deposit works
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

      {/* Secure deposit via Stripe Checkout */}
      <section
        aria-label="Secure $50 deposit"
        className="flex flex-col items-center gap-2 rounded-3xl border border-sage/25 bg-oat px-6 py-7 text-center"
      >
        <Logo size={28} className="text-sage" title="" />
        <p className="text-sm font-medium text-forest">
          Secure $50 deposit
        </p>
        <p className="max-w-[34ch] text-xs leading-relaxed text-forest/60">
          You&rsquo;ll be redirected to Stripe&rsquo;s secure checkout to place
          your deposit. Only the $50 deposit is charged today.
        </p>
      </section>

      <section className="flex flex-col gap-3 pt-1">
        <ReserveButton />
        <p className="text-center text-xs leading-relaxed text-forest/55">
          Just a $50 deposit today — your $111/week begins when launch is ready
          in July.
        </p>
      </section>

      <BrandFooter />
    </main>
  );
}
