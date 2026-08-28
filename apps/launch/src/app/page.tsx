import { BowlIllustration } from "@/components/ui/BowlIllustration";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import { SignupForm } from "@/components/join/SignupForm";
import { SampleBowlsSection } from "@/components/sections/SampleBowlsSection";
import { ServiceAndFaq } from "@/components/sections/ServiceAndFaq";
import { FOUNDER, PLAN, PRICING } from "@/lib/brand";

const PLAN_DETAILS = [
  {
    number: "01",
    title: `${PLAN.bowlsPerWeek} chef-made bowls`,
    body: "A fresh weekly rotation built with grains, greens, vegetables, and satisfying proteins.",
  },
  {
    number: "02",
    title: PLAN.deliveryNote,
    body: "Your week arrives together, ready to grab when you need a real meal without the prep.",
  },
  {
    number: "03",
    title: `${PRICING.weekly} per week`,
    body: "Base-plan price. The delivery charge and one-time refundable container deposit are shown before payment.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Wordmark href="/" className="text-forest" />
        <div className="flex items-center gap-3">
          <nav aria-label="Primary" className="mr-2 hidden items-center gap-5 text-sm font-bold text-forest/62 lg:flex">
            <a href="#menu" className="hover:text-clay">Bowls</a>
            <a href="#delivery" className="hover:text-clay">Delivery</a>
            <a href="#faq" className="hover:text-clay">FAQ</a>
          </nav>
          <Button as="a" href="#join" size="sm">
            Get the bowls
          </Button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pt-10 pb-20 sm:px-8 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:pt-20 lg:pb-28">
        <div className="flex flex-col items-start gap-7">
          <span className="rounded-full bg-gold/55 px-4 py-2 text-xs font-bold tracking-[0.16em] text-forest uppercase">
            Five bowls · $55/week · LA County
          </span>

          <div className="flex flex-col gap-5">
            <h1 className="max-w-[10ch] text-6xl leading-[0.9] font-semibold tracking-[-0.055em] text-forest sm:text-7xl lg:text-[6.3rem]">
              Your week, bowled.
            </h1>
            <p className="max-w-[34rem] text-lg leading-relaxed text-forest/72 sm:text-xl">
              Five fresh, chef-made Soul Bowls<sup className="text-[0.5em]">™</sup>{" "}
              delivered every Sunday. The plan is {PRICING.weekly} a week, plus
              the disclosed delivery charge and refundable container deposit.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button as="a" href="#join" size="lg" className="sm:min-w-52">
              Join Soul Bowls™
            </Button>
            <Button as="a" href="#plan" size="lg" variant="secondary">
              See the plan
            </Button>
          </div>

          <p className="text-sm text-forest/58">
            Soul-food roots. Seasonal ingredients. Made by {FOUNDER}.
          </p>
        </div>

        <BowlIllustration />
      </section>

      <section id="plan" className="bg-forest text-oat">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="mb-14 grid gap-5 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.18em] text-gold uppercase">
                The whole plan
              </p>
              <h2 className="max-w-[12ch] text-4xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-6xl">
                Five bowls. One delivery. No overthinking.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-oat/65 lg:justify-self-end lg:text-lg">
              Soul Bowls™ keeps the offer simple: a week of complete, satisfying
              bowls delivered at once. The menu changes. The plan does not.
            </p>
          </div>

          <div className="grid border-t border-oat/20 md:grid-cols-3">
            {PLAN_DETAILS.map((detail) => (
              <article
                key={detail.number}
                className="border-b border-oat/20 py-8 md:border-r md:border-b-0 md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="mb-10 text-xs font-bold tracking-[0.18em] text-gold">
                  {detail.number}
                </p>
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.02em]">
                  {detail.title}
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-oat/62">
                  {detail.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SampleBowlsSection />

      <ServiceAndFaq />

      <section id="join" className="bg-gold/25">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20 lg:px-12 lg:py-28">
          <div className="flex flex-col gap-6 lg:sticky lg:top-10">
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">
              Ready when you are
            </p>
            <h2 className="max-w-[10ch] text-5xl leading-[0.95] font-semibold tracking-[-0.045em] text-forest sm:text-6xl">
              Get next week&rsquo;s bowls.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-forest/68">
              Share your details to reserve your spot. We&rsquo;ll text you before
              your first Sunday delivery. No charge today.
            </p>

            <div className="flex items-end gap-3 border-t border-forest/15 pt-6">
              <span className="font-serif text-6xl leading-none font-semibold tracking-[-0.05em] text-forest">
                {PRICING.weekly}
              </span>
              <span className="pb-1 text-sm font-bold text-forest/58">per week</span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-forest/55">
              Base-plan price, plus the disclosed weekly delivery charge and a
              one-time refundable reusable-container deposit.
            </p>
          </div>

          <div className="rounded-[2rem] bg-oat p-6 shadow-[0_22px_80px_rgba(32,53,47,0.10)] sm:p-9">
            <div className="mb-7 flex items-center justify-between gap-4 border-b border-forest/10 pb-6">
              <div>
                <p className="font-serif text-2xl font-semibold text-forest">
                  Reserve your bowls
                </p>
                <p className="mt-1 text-sm text-forest/58">
                  {PLAN.bowlsPerWeek} bowls · {PLAN.deliveryDay} delivery
                </p>
              </div>
              <span className="rounded-full bg-sage/15 px-3 py-1.5 text-xs font-bold text-sage">
                {PRICING.weekly}/wk
              </span>
            </div>
            <SignupForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
