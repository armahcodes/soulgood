import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { Accordion } from "@/components/ui/kit/accordion";
import { CarouselRail } from "@/components/ui/kit/carousel-rail";
import { Marquee } from "@/components/ui/kit/marquee";
import { NumberTicker } from "@/components/ui/kit/number-ticker";
import {
  ProductCard,
  ProductCardBadge,
  ProductCardContent,
  ProductCardImage,
  ProductCardSubtitle,
  ProductCardTitle,
} from "@/components/ui/kit/product-card";
import { Reveal } from "@/components/ui/kit/reveal";
import { Timeline } from "@/components/ui/kit/timeline";
import { PlanPicker } from "@/components/sections/PlanPicker";
import { AVAILABLE_BOWLS, CURRENT_BOWLS, CURRENT_OFFER, SOLD_OUT_BOWLS } from "@/lib/current-offer";
import { EAT_NOW } from "@/lib/ordering";
import { BUSINESS, FOUNDER, NOURISHMENT, PLAN, PRICING, TAGLINE } from "@/lib/brand";

const RITUAL_STEPS = [
  { title: "Make it yours", body: "Choose the bowls you love. Order once or return to a weekly rhythm." },
  { title: "Made with intention", body: "Thoughtfully prepared by Chef Kyla with whole ingredients and care." },
  { title: "A Sunday connection", body: "Choose free pickup for a one-time order, or let our team deliver in LA County for $8.88." },
  { title: "Make a moment of it", body: "Set the table, enjoy your bowl, and make a little space for yourself." },
  { title: "Find your rhythm", body: "Choose a one-time order or a subscription that renews every seven days until canceled." },
] as const;

const PROMISES = [
  "Thoughtfully prepared by Chef Kyla",
  "32 oz glass jars",
  "Whole ingredients, comforting flavors",
  "Sunday pickup or LA County delivery",
  "Delivered by the Soul Good team",
  "Order once or weekly",
] as const;

const FAQS = [
  {
    id: "order",
    title: "What comes in an order?",
    content: `Choose any ${PLAN.bowlsPerWeek} chef-made 32 oz jarred bowls from the available lineup, prepared together for ${PLAN.deliveryDay} pickup or delivery. One of each available bowl is preselected for convenience.`,
  },
  {
    id: "storage",
    title: "How do I store and serve the bowls?",
    content: `${CURRENT_OFFER.storage} Plate and enjoy cold, or remove the lid, transfer the food to a microwave-safe bowl, and warm before serving.`,
  },
  {
    id: "delivery",
    title: "Where do you deliver?",
    content: `Delivery is $8.88 per order to verified addresses throughout ${BUSINESS.serviceArea}. We confirm eligibility before activating delivery.`,
  },
  {
    id: "pickup",
    title: "Can I pick up my bowls?",
    content: "Yes. Sunday pickup is free for one-time orders. We confirm the pickup location and window before fulfillment. Weekly plans are delivered by our team.",
  },
  {
    id: "billing",
    title: "How does billing work?",
    content: `A one-time order is ${PRICING.oneTime} and does not renew. The weekly plan is ${PRICING.weekly} every seven days until canceled. Applicable sales tax and any refundable reusable-container deposit are disclosed before payment.`,
  },
  {
    id: "cancel",
    title: "Can I cancel?",
    content: (
      <>
        Yes. <Link href="/cancel" className="text-clay underline underline-offset-4">Cancel future renewals online</Link> at any time. An order already charged and committed to production remains final.
      </>
    ),
  },
  {
    id: "refunds",
    title: "Do you offer refunds?",
    content: "Perishable orders are nonrefundable. If an item arrives missing, incorrect, damaged, or spoiled, report it within 24 hours for a verified exchange, replacement, or account credit.",
  },
  {
    id: "allergies",
    title: "Can you accommodate severe allergies?",
    content: "The current line includes sesame, soy, and wheat-related risks, and our kitchen handles other major allergens. We cannot guarantee against cross-contact. Customers with severe or life-threatening allergies should not order.",
  },
];

const DISPLAY_BOWLS = [...AVAILABLE_BOWLS, ...SOLD_OUT_BOWLS];
const [HERO_BOWL, SECOND_BOWL, THIRD_BOWL] = CURRENT_BOWLS;

const eyebrow = "text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="overflow-x-clip bg-oat">
        {/* Hero — editorial split, adapted from 21st.dev felipemenezes098/hero-08 */}
        <section className="relative">
          <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 pt-8 pb-14 sm:px-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:pt-10 lg:pb-20">
            <div className="relative z-10 text-center motion-safe:animate-[rise_0.8s_var(--ease-soft)] lg:text-left">
              <p className={eyebrow}>{TAGLINE}</p>
              <h1 className="mt-5 text-[clamp(3.6rem,17vw,5rem)] leading-[0.82] font-normal tracking-[-0.055em] text-forest lg:text-[clamp(5rem,8.4vw,8.4rem)] lg:leading-[0.78]">
                <span className="inline-flex items-start whitespace-nowrap">
                  Soul Bowls<sup className="relative -top-1 ml-0.5 text-[0.16em] tracking-normal">™</sup>
                </span>
              </h1>
              <p className="mt-6 font-serif text-3xl leading-tight text-forest sm:text-4xl">{NOURISHMENT.headline}</p>
              <p className="mx-auto mt-6 max-w-md text-base leading-7 text-forest/72 sm:text-lg lg:mx-0">
                Thoughtfully prepared by {FOUNDER}, Soul Bowls™ bring whole ingredients and
                comforting flavors to your daily rhythm. A nourishing moment, made for you.
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-forest/72 lg:mx-0">
                Five 32 oz bowls for $88. Order once or choose weekly delivery.
                Free Sunday pickup for one-time orders, or $8.88 LA County delivery.
                Applicable tax is shown at checkout.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                <Button as="a" href="/checkout" size="lg" className="w-full sm:w-auto">
                  {NOURISHMENT.cta}
                </Button>
                <Button as="a" href={EAT_NOW.menuUrl} target="_self" variant="secondary" size="lg" className="w-full sm:w-auto">
                  Eat Now · Single orders
                </Button>
              </div>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-forest/68 lg:mx-0">
                A bowl for today? Explore Eat Now, with delivery by available courier partners or a Soul Good courier.{" "}
                <Link href={EAT_NOW.infoPath} className="font-semibold text-forest underline underline-offset-4 hover:text-clay">
                  How Eat Now works
                </Link>
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
              <div className="relative aspect-[5/5.4] overflow-hidden rounded-lg bg-sand sm:aspect-[5/4.6] lg:aspect-[5/5.6]">
                <Image
                  src="/botanicals/clay-branch.png"
                  alt=""
                  width={320}
                  height={400}
                  aria-hidden="true"
                  loading="eager"
                  className="pointer-events-none absolute -top-8 -right-10 w-48 rotate-12 opacity-30 sm:w-64"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest/12 to-transparent" />
                <figure className="absolute bottom-[7%] left-1/2 w-[54%] -translate-x-1/2 motion-safe:animate-[rise_1s_var(--ease-soft)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_40px_60px_-30px_rgb(44_58_52/0.55)]">
                    <Image src={HERO_BOWL.imagePath} alt={`${HERO_BOWL.name} in a 32 ounce Soul Good jar`} fill loading="eager" fetchPriority="high" unoptimized sizes="(min-width: 1024px) 28vw, 54vw" className="object-cover" />
                  </div>
                </figure>
                <figure aria-hidden="true" className="absolute bottom-[15%] left-[4%] w-[30%] -rotate-6 motion-safe:animate-[rise_1.2s_var(--ease-soft)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_30px_40px_-24px_rgb(44_58_52/0.5)]">
                    <Image src={SECOND_BOWL.imagePath} alt="" fill loading="eager" unoptimized sizes="(min-width: 1024px) 16vw, 30vw" className="object-cover" />
                  </div>
                </figure>
                <figure aria-hidden="true" className="absolute right-[4%] bottom-[19%] w-[30%] rotate-6 motion-safe:animate-[rise_1.35s_var(--ease-soft)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_30px_40px_-24px_rgb(44_58_52/0.5)]">
                    <Image src={THIRD_BOWL.imagePath} alt="" fill loading="eager" unoptimized sizes="(min-width: 1024px) 16vw, 30vw" className="object-cover" />
                  </div>
                </figure>

                <div className="absolute top-5 left-5 rounded-lg bg-oat/92 px-4 py-3 shadow-sm backdrop-blur sm:top-7 sm:left-7">
                  <p className="font-serif text-3xl leading-none tracking-[-0.03em] text-forest">$88</p>
                  <p className="mt-1 text-[0.62rem] font-bold tracking-[0.16em] text-forest/65 uppercase">Five 32 oz bowls</p>
                </div>
                <div className="absolute top-5 right-5 hidden rounded-lg bg-forest px-4 py-3 text-oat shadow-sm sm:top-7 sm:right-7 sm:block">
                  <p className="text-[0.62rem] font-bold tracking-[0.16em] text-gold uppercase">From our kitchen</p>
                  <p className="mt-1 font-serif text-lg leading-none">with care, by {FOUNDER}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-y border-forest/10 bg-sand/35 py-4 text-[0.7rem] font-bold tracking-[0.16em] text-forest/72 uppercase">
            <Marquee items={PROMISES} />
          </div>
        </section>

        {/* Bowls — 21st.dev product-card + product-carousel patterns */}
        <section id="bowls" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-10 flex flex-col items-center gap-5 text-center sm:mb-14 lg:flex-row lg:items-end lg:justify-between lg:text-left">
              <div>
                <p className={eyebrow}>Thoughtfully made, thoughtfully chosen</p>
                <h2 className="mt-4 text-4xl leading-none font-normal tracking-[-0.045em] text-forest sm:text-6xl">
                  Find your favorite flavors.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-forest/70">
                {AVAILABLE_BOWLS.length} recipes this week, each in a 32 oz glass jar. Mix and
                match any five, or scale up for the people at your table.
              </p>
            </Reveal>

            <CarouselRail label="This week’s Soul Bowls™" itemsClassName="lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14 lg:overflow-visible lg:px-0">
              {DISPLAY_BOWLS.map((bowl) => (
                <ProductCard key={bowl.id} className="w-[76%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
                  <ProductCardImage src={bowl.imagePath} alt={`${bowl.name} in a 32 ounce Soul Good jar`} muted={!bowl.available}>
                    {bowl.available ? (
                      <ProductCardBadge>{bowl.serving}</ProductCardBadge>
                    ) : (
                      <ProductCardBadge tone="dark">Sold out</ProductCardBadge>
                    )}
                  </ProductCardImage>
                  <ProductCardContent>
                    <ProductCardTitle>{bowl.name}</ProductCardTitle>
                    <ProductCardSubtitle>{bowl.ingredients}</ProductCardSubtitle>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {bowl.dietary.map((tag) => (
                        <span key={tag} className="rounded-md border border-forest/12 px-2 py-1 text-[0.65rem] font-bold tracking-[0.06em] text-forest/70 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {bowl.allergen ? <p className="mt-3 text-xs leading-relaxed font-semibold text-clay">{bowl.allergen}</p> : null}
                  </ProductCardContent>
                </ProductCard>
              ))}
            </CarouselRail>
          </div>
        </section>

        {/* Ritual — 21st.dev shadcnui-blocks/timeline-04 */}
        <section id="ritual" className="scroll-mt-24 border-t border-forest/10 bg-card/60 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-12 max-w-2xl sm:mb-16">
              <p className={eyebrow}>{NOURISHMENT.label}</p>
              <h2 className="mt-4 text-4xl leading-none font-normal tracking-[-0.045em] text-forest sm:text-6xl">
                From our kitchen, with care.
              </h2>
            </Reveal>
            <Timeline steps={RITUAL_STEPS} />
          </div>
        </section>

        {/* Plan & fulfillment — pricing card with segmented controls */}
        <section id="fulfillment" className="scroll-mt-24 py-16 sm:py-24">
          <div id="price" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 sm:px-8 lg:px-12">
            <Reveal>
              <PlanPicker />
            </Reveal>
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-forest/65">
              Ordering Eat Now instead? Courier partners, service times, and charges depend on availability.{" "}
              <Link href={EAT_NOW.infoPath} className="underline underline-offset-4 hover:text-clay">See how Eat Now delivery works.</Link>
            </p>
          </div>
        </section>

        {/* Community — 21st.dev danielpetho/basic-number-ticker */}
        <section className="relative overflow-hidden bg-sage text-oat">
          <Image
            src="/botanicals/clay-branch.png"
            alt=""
            width={320}
            height={400}
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-14 w-60 -rotate-12 opacity-20 mix-blend-multiply"
          />
          <Reveal className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 text-center sm:px-8 sm:py-20 md:grid-cols-[auto_1fr] md:gap-16 md:text-left lg:px-12">
            <div className="md:border-r md:border-oat/25 md:pr-16">
              <NumberTicker value={100} suffix="+" className="block font-serif text-8xl leading-none tracking-[-0.06em] sm:text-9xl" />
              <p className="mt-3 text-sm font-bold text-oat/85">community meals delivered</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-oat/80 uppercase">A community initiative by Soul Good</p>
              <h2 className="mt-3 text-5xl leading-tight tracking-[-0.04em]">Food for the Soul.</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-oat/88 md:mx-0">
                We provide the meals. Together, we bring them to your community. Partner with us to bring a meal drive where you are, or learn how to get involved in our October 15 drive.
              </p>
              <Button as="a" href="/food-for-the-soul" className="mt-7 w-full bg-oat text-forest hover:bg-sand sm:w-auto">
                Explore Food for the Soul
              </Button>
            </div>
          </Reveal>
        </section>

        {/* FAQ — 21st.dev ddoemonn/accordion */}
        <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <p className={eyebrow}>Common questions</p>
              <h2 className="mt-4 text-4xl leading-none font-normal tracking-[-0.045em] text-forest sm:text-5xl">
                Everything, clearly.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-forest/70">
                Read the{" "}
                <Link href="/customer-agreement" className="font-semibold text-clay underline underline-offset-4">Customer Agreement</Link>{" "}
                for complete purchase and delivery terms.
              </p>
            </Reveal>
            <Accordion items={FAQS} defaultOpen={["order"]} />
          </div>
        </section>

        {/* Gatherings */}
        <section className="border-t border-forest/10 bg-sand/35 px-5 py-16 sm:px-8 sm:py-20">
          <Reveal className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="text-center lg:text-left">
              <p className={eyebrow}>For your next gathering</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">Good food brings us together.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-forest/75 lg:mx-0">
                Bowl delivery starts at 10 bowls, priced individually. For a plated experience,
                pricing is $55 per guest with a $555 food minimum, plus a required $500 culinary-support fee
                for plating, service, and ingredient education. Tax and delivery are additional.
              </p>
              <p className="mt-3 text-sm text-forest/70">Los Angeles County only. Build an itemized estimate with no payment required.</p>
            </div>
            <Button as="a" href="/quote" size="lg" className="w-full lg:w-auto">Plan a gathering</Button>
          </Reveal>
        </section>

        {/* Closing CTA — 21st.dev shadcndesign/cta-section-1 pattern */}
        <section className="relative overflow-hidden bg-forest px-5 py-20 text-center text-oat sm:px-8 sm:py-28">
          <Image
            src="/botanicals/clay-branch.png"
            alt=""
            width={280}
            height={350}
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 bottom-[-8rem] w-56 -rotate-12 opacity-20 sm:w-72"
          />
          <Reveal className="relative z-10 mx-auto max-w-3xl">
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold uppercase">{TAGLINE}</p>
            <h2 className="mt-4 text-5xl leading-none font-normal tracking-[-0.045em] sm:text-7xl">Make room for nourishment.</h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-oat/72">
              A few thoughtful choices can become a daily ritual. Let us take care
              of the cooking, so you can make time to enjoy it.
            </p>
            <Button as="a" href="/checkout" size="lg" className="mt-8 w-full bg-oat text-forest hover:bg-sand sm:w-auto">
              {NOURISHMENT.cta}
            </Button>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
