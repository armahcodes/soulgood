import Link from "next/link";
import { ArrowDown, CalendarCheck, ChefHat, MapPin, ReceiptText } from "lucide-react";
import { CulinaryQuoteBuilder } from "@/components/culinary/CulinaryQuoteBuilder";
import { GatheringOptions } from "@/components/gatherings/GatheringOptions";
import { GatheringsFaq } from "@/components/gatherings/GatheringsFaq";
import { GatheringsGallery } from "@/components/gatherings/GatheringsGallery";
import { GatheringsMenu } from "@/components/gatherings/GatheringsMenu";
import { Reveal } from "@/components/ui/kit/reveal";
import { Timeline } from "@/components/ui/kit/timeline";
import { FocusTask } from "@/components/ui/FocusTask";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { formatCents } from "@/lib/brand";
import { CULINARY_PRICING, todayInLosAngeles, type CulinaryExperience } from "@/lib/culinary-booking";

export const dynamic = "force-dynamic";
export const metadata = {
  alternates: { canonical: "/quote" },
  title: "Gatherings & culinary bookings — Soul Bowls™",
  description:
    "Plan a Los Angeles County gathering. Bowl delivery starts at 10 bowls. Plated service is $55 per guest, with a $555 food minimum plus $500 culinary support, tax, and delivery. 50% deposit; balance due on the event date before arrival.",
};

const eyebrow = "text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase";

const STEPS = [
  { title: "Build your estimate", body: "Choose delivery or a plated dinner, shape the food, and see an itemized total with tax in minutes." },
  { title: "We confirm the details", body: "Our team reviews your date, guests, and dietary notes, and confirms availability with you." },
  { title: "Sign & reserve", body: `We send your contract and Square invoice. A ${CULINARY_PRICING.depositPercentage}% deposit reserves the date.` },
  { title: "Gather", body: "The balance is due on the day, before we arrive. Then we bring the nourishment." },
];

const PROMISES = [
  { icon: MapPin, text: "Across Los Angeles County" },
  { icon: ReceiptText, text: "Itemized estimate, tax included" },
  { icon: CalendarCheck, text: "No payment to request" },
  { icon: ChefHat, text: `Plated from ${formatCents(CULINARY_PRICING.platedPersonCents)}/guest` },
];

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ experience?: string }> }) {
  const requested = (await searchParams).experience;
  const initialExperience: CulinaryExperience = requested === "plated" ? "plated" : "delivery";

  return (
    <div className="culinary-page min-h-screen bg-oat text-forest">
      <SiteHeader current="/quote" className="print-hidden" />
      <main>
        {/* Hero — headline with an expanding gallery of gatherings */}
        <section className="print-hidden mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 pt-8 pb-12 sm:px-8 sm:pt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-12 lg:pb-16">
          <div className="text-center motion-safe:animate-[rise_0.8s_var(--ease-soft)] lg:text-left">
            <p className={eyebrow}>Gatherings · Los Angeles County</p>
            <h1 className="mt-4 text-[clamp(3rem,11vw,5.5rem)] leading-[1.02] font-normal tracking-[0.01em] text-forest">
              Let’s plan your gathering.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-forest/72 sm:text-lg lg:mx-0">
              Your menu, your people, one thoughtful step at a time. From shared Soul Bowls™ at the
              office to a candlelit plated dinner, we bring the nourishment.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="#quote"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-forest px-7 text-sm font-medium tracking-[0.12em] text-oat uppercase transition-colors hover:bg-forest/90"
              >
                Start your estimate
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
              </Link>
              <Link
                href="#gatherings-menu"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-forest/20 px-7 text-sm font-medium tracking-[0.12em] text-forest uppercase transition-colors hover:border-forest"
              >
                See the full menu
              </Link>
            </div>
            <p className="mt-5 text-sm text-forest/72">No payment required to request a booking.</p>
          </div>
          <GatheringsGallery />
        </section>

        <div className="print-hidden border-y border-forest/10 bg-sand/35">
          <ul className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-3 px-5 py-5 text-sm font-semibold text-forest/80 sm:px-8 lg:grid-cols-4 lg:px-12">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-clay-ink" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Two ways to gather */}
        <section id="options" aria-labelledby="options-heading" className="print-hidden scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
              <p className={eyebrow}>Two ways to gather</p>
              <h2 id="options-heading" className="mt-4 text-4xl leading-none font-normal tracking-[0.01em] text-forest sm:text-6xl">
                Drop-off or dinner service.
              </h2>
              <p className="mt-5 text-base leading-7 text-forest/72">
                Transparent pricing either way. Tax and delivery are calculated for your address in the estimate.
              </p>
            </Reveal>
            <GatheringOptions />
          </div>
        </section>

        {/* The full gatherings menu */}
        <section id="gatherings-menu" aria-labelledby="gatherings-menu-heading" className="print-hidden scroll-mt-24 border-t border-forest/10 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mx-auto mb-10 max-w-2xl text-center">
              <p className={eyebrow}>The full menu</p>
              <h2 id="gatherings-menu-heading" className="mt-4 text-4xl leading-none font-normal tracking-[0.01em] text-forest sm:text-6xl">
                Everything we bring to the table.
              </h2>
              <p className="mt-5 text-base leading-7 text-forest/72">
                Mix Soul Bowls™ with made-to-order salads, veggie cups, and snacks, all priced in your estimate.
              </p>
            </Reveal>
            <GatheringsMenu />
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="print-hidden border-t border-forest/10 bg-card/60 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-10 max-w-2xl sm:mb-12">
              <p className={eyebrow}>How it works</p>
              <h2 id="how-heading" className="mt-4 text-4xl leading-none font-normal tracking-[0.01em] text-forest sm:text-5xl">
                From estimate to table.
              </h2>
            </Reveal>
            <Timeline steps={STEPS} />
          </div>
        </section>

        {/* The quote builder */}
        <section id="quote" aria-labelledby="quote-section-heading" className="scroll-mt-24 py-14 sm:py-20">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
            <div className="print-hidden mx-auto mb-8 max-w-2xl text-center">
              <p className={eyebrow}>Your estimate</p>
              <h2 id="quote-section-heading" className="mt-3 text-3xl leading-tight font-normal tracking-[0.01em] text-forest sm:text-5xl">
                Build it in five calm steps.
              </h2>
              <p className="mt-3 text-sm leading-6 text-forest/72">
                Your selections stay on this page while you work. Nothing is charged, and your date isn’t reserved until you sign.
              </p>
            </div>
            <div className="rounded-lg border border-forest/10 bg-card/70 px-4 py-6 shadow-[0_40px_80px_-60px_rgb(44_58_52/0.55)] sm:px-8 sm:py-10">
              <CulinaryQuoteBuilder key={initialExperience} today={todayInLosAngeles()} initialExperience={initialExperience} />
              <FocusTask targetId="quote" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="print-hidden border-t border-forest/10 py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12">
            <Reveal>
              <p className={eyebrow}>Questions</p>
              <h2 id="faq-heading" className="mt-4 text-4xl leading-none font-normal tracking-[0.01em] text-forest sm:text-5xl">
                Good to know before you gather.
              </h2>
              <Link href="#quote" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-forest underline underline-offset-4 hover:text-clay-ink">
                Back to your estimate
              </Link>
            </Reveal>
            <GatheringsFaq />
          </div>
        </section>
      </main>
      <div className="print-hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
