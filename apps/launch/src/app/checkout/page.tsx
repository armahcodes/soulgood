import { Logo } from "@/components/ui/Logo";
import { BrandFooter } from "@/components/ui/BrandFooter";
import { ReserveButton } from "@/components/checkout/ReserveButton";

export const metadata = {
  title: "Reserve Your Spot — Soul Good",
  description:
    "Reserve your Founding 50 spot. No payment today — you complete your full payment on Friday at the launch.",
};

const NEXT_AT_LAUNCH = [
  "Your spot is held the moment you reserve below — no card needed today.",
  "On Friday, June 19, you complete your full payment in person at the launch.",
  "Both subscription and one-time founding plans are settled the same way — full payment Friday, no deposit.",
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
          Reserve your founding spot
        </h1>
        <p className="max-w-[40ch] text-base leading-relaxed text-forest/75">
          Your details are saved. There&rsquo;s nothing to pay right now — Founding
          50 members settle up <span className="font-medium text-forest">in full
          on Friday</span> at the launch.
        </p>
      </section>

      {/* How the full-payment-Friday model works */}
      <section className="flex flex-col gap-4 rounded-3xl border border-sage/25 bg-sand/30 p-6">
        <h2 className="font-serif text-xl font-medium text-forest">
          Full payment Friday
        </h2>
        <ul className="flex flex-col gap-3">
          {NEXT_AT_LAUNCH.map((item) => (
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

      {/*
        ───────────────────────────────────────────────────────────────────────
        PAYMENT INTEGRATION SEAM
        ───────────────────────────────────────────────────────────────────────
        This is a deliberate, swappable placeholder. No real Square/Stripe widget
        is mounted for the Friday launch (full payment is collected in person).

        To plug in a payment provider later, replace the placeholder block below
        with the provider's hosted/embedded widget:
          • Square  → mount the Web Payments SDK card container here, then call
                      payments.card() / tokenize() on submit.
          • Stripe  → render <Elements> + <PaymentElement> here and confirm with
                      stripe.confirmPayment().
        On a successful charge, route the buyer forward to `/welcome` (the same
        destination the reserve CTA uses today). The lead is ALREADY persisted on
        /join (capture-first), so checkout never gates capture.
        ───────────────────────────────────────────────────────────────────────
      */}
      <section
        aria-label="Payment — coming Friday at the launch"
        className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-forest/25 bg-oat px-6 py-8 text-center"
      >
        <Logo size={28} className="text-forest/40" title="" />
        <p className="text-sm font-medium text-forest">
          Secure checkout opens at the launch
        </p>
        <p className="max-w-[34ch] text-xs leading-relaxed text-forest/60">
          Card payment (Square / Stripe) plugs in here when it&rsquo;s ready. For
          Friday, your spot is reserved now and paid in person.
        </p>
      </section>

      <section className="flex flex-col gap-3 pt-1">
        <ReserveButton />
        <p className="text-center text-xs leading-relaxed text-forest/55">
          You won&rsquo;t be charged today. We&rsquo;ll see you Friday, June 19.
        </p>
      </section>

      <BrandFooter />
    </main>
  );
}
