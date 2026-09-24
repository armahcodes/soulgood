import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import { AVAILABLE_BOWLS, CURRENT_BOWLS, SOLD_OUT_BOWLS } from "@/lib/current-offer";
import { EAT_NOW } from "@/lib/ordering";
import { NOURISHMENT, TAGLINE } from "@/lib/brand";

const RITUAL_STEPS = [
  { number: "01", title: "Make it yours", body: "Choose the bowls you love. Order once or return to a weekly rhythm." },
  { number: "02", title: "Made with intention", body: "Thoughtfully prepared by Chef Kyla with whole ingredients and care." },
  { number: "03", title: "A Sunday connection", body: "Choose free pickup for a one-time order, or let our team deliver in LA County for $8.88." },
  { number: "04", title: "Make a moment of it", body: "Set the table, enjoy your bowl, and make a little space for yourself." },
  { number: "05", title: "Find your rhythm", body: "Choose a one-time order or a subscription that renews every seven days until canceled." },
] as const;

const DISPLAY_BOWLS = [...AVAILABLE_BOWLS, ...SOLD_OUT_BOWLS];

export default function Home() {
  return (
    <main className="overflow-hidden bg-oat">
      <header className="relative z-30 border-b border-forest/10 bg-oat/92">
        <div className="mx-auto flex min-h-20 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Wordmark href="/" />
          <nav
            aria-label="Primary"
            className="hidden items-center gap-5 text-[0.72rem] font-bold tracking-[0.08em] text-forest/72 uppercase xl:flex"
          >
            <a href={EAT_NOW.menuUrl} className="inline-flex min-h-11 items-center text-clay transition-colors hover:text-forest">Eat Now</a>
            <a href="#bowls" className="transition-colors hover:text-clay">Soul Bowls™</a>
            <a href="#ritual" className="transition-colors hover:text-clay">Our ritual</a>
            <a href="#fulfillment" className="transition-colors hover:text-clay">Delivery &amp; pickup</a>
            <Link href="/quote" className="transition-colors hover:text-clay">Culinary bookings</Link>
            <a href="/account" className="transition-colors hover:text-clay">My orders</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button as="a" href="/checkout" size="sm" className="px-4 sm:px-5">
              <span className="sm:hidden">Order bowls</span>
              <span className="hidden sm:inline">{NOURISHMENT.cta}</span>
            </Button>
          </div>
        </div>
        <nav aria-label="Quick links" className="flex flex-wrap items-center justify-center gap-x-5 border-t border-forest/10 px-4 text-center text-[0.65rem] font-bold tracking-[0.06em] uppercase xl:hidden">
          <a href={EAT_NOW.menuUrl} className="inline-flex min-h-11 items-center text-clay">Eat Now · Single orders</a>
          <Link href="/quote" className="inline-flex min-h-11 items-center">Culinary bookings</Link>
          <Link href="/account" className="inline-flex min-h-11 items-center">My orders</Link>
        </nav>
      </header>

      <Link href="/food-for-the-soul" className="flex min-h-12 flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-forest px-5 py-3 text-center text-sm text-oat transition-colors hover:bg-forest/90">
        <span className="font-bold">Food for the Soul</span>
        <span aria-hidden="true" className="text-gold">·</span>
        <span>Our October 15 community meal drive</span>
        <span className="underline underline-offset-4">Get involved →</span>
      </Link>

      <section className="relative lg:min-h-[700px]">
        <div className="grid lg:min-h-[700px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative order-2 min-h-[360px] overflow-hidden bg-sand sm:min-h-[460px] lg:order-1 lg:min-h-[700px]">
            <Image
              src={CURRENT_BOWLS[0].imagePath}
              alt="Glow Bowl™ in a 32 ounce Soul Good jar"
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[50%_48%] lg:object-[48%_48%]"
            />
          </div>

          <div className="relative order-1 flex items-center bg-oat px-5 py-10 text-center sm:px-12 sm:py-14 lg:order-2 lg:px-16 lg:py-24 lg:text-left">
            <Image
              src="/botanicals/clay-branch.png"
              alt=""
              width={320}
              height={400}
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 bottom-0 w-52 rotate-6 opacity-25 sm:w-64 lg:-right-12 lg:w-72"
            />
            <div className="relative z-10 mx-auto max-w-[34rem] lg:mx-0">
              <p className="mb-5 text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">
                {TAGLINE}
              </p>
              <h1 className="text-[clamp(3.65rem,18vw,5rem)] leading-[0.8] font-normal tracking-[-0.055em] text-forest lg:text-[clamp(4.6rem,8vw,8.3rem)] lg:leading-[0.76]">
                <span className="inline-flex items-start whitespace-nowrap">
                  Soul Bowls<sup className="relative -top-1 ml-0.5 text-[0.16em] tracking-normal">™</sup>
                </span>
              </h1>
              <p className="mt-7 font-serif text-3xl leading-tight text-forest sm:text-4xl">
                {NOURISHMENT.headline}
              </p>
              <div className="mx-auto mt-7 h-px w-12 bg-clay lg:mx-0" />
              <p className="mt-7 max-w-md text-base leading-7 text-forest/72 sm:text-lg">
                Thoughtfully prepared by Chef Kyla, Soul Bowls™ bring whole
                ingredients and comforting flavors to your daily rhythm.
                A nourishing moment, made for you.
              </p>
              <p className="mt-4 text-sm leading-6 text-forest/75">
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
              <p className="mt-4 text-sm leading-6 text-forest/68">
                A bowl for today? Explore Eat Now, with delivery by available courier partners or a Soul Good courier.{" "}
                <Link href={EAT_NOW.infoPath} className="underline underline-offset-4">How Eat Now works</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="bowls" className="relative border-t border-forest/10 bg-oat py-12 sm:py-16">
        <Image
          src="/botanicals/clay-branch.png"
          alt=""
          width={240}
          height={300}
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 top-28 hidden w-44 -rotate-12 opacity-[0.14] lg:block"
        />
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">
              Thoughtfully made, thoughtfully chosen
            </p>
            <h2 className="mt-4 text-4xl leading-none font-normal tracking-[-0.045em] text-forest sm:text-5xl">
              Find your favorite flavors.
            </h2>
          </div>

          <div className="divide-y divide-forest/12 border-y border-forest/12">
            {DISPLAY_BOWLS.map((bowl, index) => {
              const imageFirst = index % 2 === 0;
              const availableNumber = bowl.available
                ? AVAILABLE_BOWLS.findIndex((availableBowl) => availableBowl.id === bowl.id) + 1
                : null;
              return (
                <article
                  key={bowl.name}
                  className="grid items-center gap-7 py-4 lg:grid-cols-2 lg:gap-14"
                >
                  <div className={`relative min-h-[290px] overflow-hidden bg-sand/35 sm:min-h-[240px] lg:min-h-[205px] ${imageFirst ? "lg:order-1" : "lg:order-2"}`}>
                    <Image
                      src={bowl.imagePath}
                      alt={`${bowl.name} in a 32 ounce Soul Good jar`}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.025]"
                    />
                    {!bowl.available ? (
                      <span className="absolute left-4 top-4 bg-forest px-3 py-2 text-xs font-bold tracking-[0.14em] text-oat uppercase">
                        Sold out
                      </span>
                    ) : null}
                  </div>
                  <div className={`relative px-2 py-4 text-center sm:px-8 lg:px-12 lg:text-left ${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
                    <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">
                      {bowl.available ? `Available ${String(availableNumber).padStart(2, "0")}` : "Sold out"} · {bowl.serving}
                    </p>
                    <h3 className="mx-auto mt-3 max-w-[14ch] text-4xl leading-[0.94] font-normal tracking-[-0.035em] text-forest sm:text-5xl lg:mx-0">
                      {bowl.name}
                    </h3>
                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-forest/68 lg:mx-0">
                      {bowl.ingredients}
                    </p>
                    {bowl.allergen ? (
                      <p className="mt-2 text-xs leading-relaxed text-clay">{bowl.allergen}</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative border-b border-forest/10 bg-oat pb-12 sm:pb-14">
        <div className="mx-auto w-full max-w-6xl px-5 text-center sm:px-8 lg:px-12">
          <p className="font-serif text-3xl text-forest sm:text-4xl">
            A little variety. A daily ritual.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-5 sm:gap-6">
            {AVAILABLE_BOWLS.map((bowl) => (
              <figure key={bowl.name} className="min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-sand/25">
                  <Image
                    src={bowl.imagePath}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 18vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm leading-tight font-bold text-forest/72">
                  {bowl.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="ritual" className="bg-oat py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-8 text-center">
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">{NOURISHMENT.label}</p>
            <h2 className="mt-3 text-4xl leading-none font-normal tracking-[-0.04em] text-forest sm:text-5xl">
              From our kitchen, with care.
            </h2>
          </div>
          <ol className="grid border-t border-forest/15 sm:grid-cols-5">
            {RITUAL_STEPS.map((step) => (
              <li key={step.number} className="border-b border-forest/15 py-5 text-center sm:border-r sm:border-b-0 sm:px-5 sm:text-left sm:last:border-r-0">
                <p className="font-serif text-3xl text-clay">{step.number}</p>
                <h3 className="mt-4 text-lg font-normal text-forest">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-forest/62">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="fulfillment" className="mx-auto grid w-full max-w-[1440px] md:grid-cols-2">
        <article className="relative overflow-hidden bg-sage px-8 py-10 text-center text-oat sm:px-14 md:text-left lg:px-20">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-oat/72 uppercase">Free every Sunday</p>
          <h2 className="mt-4 text-5xl font-normal tracking-[-0.04em] sm:text-6xl">Pick up</h2>
          <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-oat/78 md:mx-0">
            Bring a little nourishment home. Free pickup is available for one-time orders; we confirm the Los Angeles pickup location and Sunday window with you.
          </p>
          <Button as="a" href="/checkout?fulfillment=pickup" variant="secondary" className="mt-8 w-full border-oat text-oat hover:bg-oat hover:text-forest sm:w-auto">
            Choose pickup
          </Button>
        </article>
        <article className="relative overflow-hidden bg-clay px-8 py-10 text-center text-oat sm:px-14 md:text-left lg:px-20">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-oat/72 uppercase">Weekly nourishment · $8.88 per order</p>
          <h2 className="mt-4 text-5xl font-normal tracking-[-0.04em] sm:text-6xl">Delivery</h2>
          <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-oat/78 md:mx-0">
            {NOURISHMENT.deliveryDisclosure} Weekly nourishment arrives on Sundays at verified LA County addresses.
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-oat/90 md:mx-0">
            Ordering Eat Now? Courier partners, service times, and charges depend on availability. <Link href={EAT_NOW.infoPath} className="underline underline-offset-4">See how Eat Now delivery works.</Link>
          </p>
          <Button as="a" href="/checkout?fulfillment=delivery" variant="secondary" className="mt-8 w-full border-oat text-oat hover:bg-oat hover:text-forest sm:w-auto">
            Choose delivery
          </Button>
        </article>
      </section>

      <section id="price" className="relative bg-oat px-5 py-10 text-center sm:px-8 sm:py-12">
        <Image
          src="/botanicals/clay-branch.png"
          alt=""
          width={280}
          height={350}
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 hidden w-56 -rotate-[58deg] opacity-[0.12] md:block"
        />
        <p className="font-serif text-3xl text-forest">{NOURISHMENT.label}, made personal.</p>
        <p className="mt-2 font-serif text-6xl leading-none tracking-[-0.05em] text-forest sm:text-7xl">Five bowls. $88.</p>
        <div className="mx-auto mt-4 h-px w-12 bg-clay" />
        <p className="mt-4 text-sm leading-6 text-forest/62">
          Five thoughtfully prepared 32 oz bowls. Begin with one of each available
          recipe, then make the selection your own. Order once or subscribe for
          weekly delivery. One-time orders include a free pickup option; delivery
          is $8.88. Applicable tax is shown before payment.
        </p>
      </section>

      <section className="relative overflow-hidden bg-forest px-5 py-12 text-center text-oat sm:px-8 sm:py-16">
        <Image
          src="/botanicals/clay-branch.png"
          alt=""
          width={280}
          height={350}
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 bottom-[-8rem] w-56 -rotate-12 opacity-20 sm:w-72"
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold uppercase">{TAGLINE}</p>
          <h2 className="mt-4 text-5xl leading-none font-normal tracking-[-0.045em] sm:text-6xl">
            Make room for nourishment.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-oat/68">
            A few thoughtful choices can become a daily ritual. Let us take care
            of the cooking, so you can make time to enjoy it.
          </p>
          <Button as="a" href="/checkout" size="lg" className="mt-6 w-full bg-sage hover:bg-oat hover:text-forest sm:w-auto">
            {NOURISHMENT.cta}
          </Button>
        </div>
      </section>

      <section className="border-t border-forest/15 bg-sand/30 px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-clay">For your next gathering</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">Good food brings us together.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-forest/75">
            Bowl delivery starts at 10 bowls, priced individually. For a plated experience,
            pricing is $55 per guest with a $555 food minimum, plus a required $500 culinary-support fee
            for plating, service, and ingredient education. Tax and delivery are additional.
          </p>
          <p className="mt-3 text-sm text-forest/70">Los Angeles County only. Build an itemized estimate with no payment required.</p>
          <Button as="a" href="/quote" className="mt-7 w-full sm:w-auto">Plan a gathering</Button>
        </div>
      </section>

      <section className="border-t border-forest/15 bg-oat px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-8 text-center md:grid-cols-[auto_1fr] md:gap-16 md:text-left">
          <div className="border-b border-forest/20 pb-8 md:border-r md:border-b-0 md:pr-16 md:pb-0">
            <p className="font-serif text-8xl leading-none tracking-[-0.06em] text-forest">100+</p>
            <p className="mt-3 text-sm font-bold text-forest/75">community meals delivered</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest/70">A community initiative by Soul Good</p>
            <h2 className="mt-3 text-5xl leading-tight tracking-[-0.04em]">Food for the Soul.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-forest/80">We provide the meals. Together, we bring them to your community. Partner with us to bring a meal drive where you are, or learn how to get involved in our October 15 drive.</p>
            <Button as="a" href="/food-for-the-soul" className="mt-6 w-full sm:w-auto">Explore Food for the Soul</Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
