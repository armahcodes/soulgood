import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import { CURRENT_BOWLS } from "@/lib/current-offer";

const RITUAL_STEPS = [
  { number: "01", title: "Choose your week", body: "Reserve the five-bowl plan that fits your routine." },
  { number: "02", title: "We prep fresh", body: "Chef-made in Los Angeles with whole ingredients." },
  { number: "03", title: "Pick up or receive", body: "Free pickup or $8.88 delivery in LA County." },
  { number: "04", title: "Nourish your days", body: "Five 32 oz bowls, ready when your week gets full." },
  { number: "05", title: "Feel good. Repeat.", body: "A simple weekly ritual you can pause or cancel." },
] as const;

export default function Home() {
  return (
    <main className="overflow-hidden bg-oat">
      <header className="absolute inset-x-0 top-0 z-30 border-b border-forest/10 bg-oat/92">
        <div className="mx-auto flex min-h-20 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Wordmark href="/" />
          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 text-[0.72rem] font-bold tracking-[0.08em] text-forest/72 uppercase lg:flex"
          >
            <a href="#bowls" className="transition-colors hover:text-clay">Soul Bowls™</a>
            <a href="#ritual" className="transition-colors hover:text-clay">Our ritual</a>
            <a href="#fulfillment" className="transition-colors hover:text-clay">Delivery &amp; pickup</a>
            <a href="#price" className="transition-colors hover:text-clay">The plan</a>
          </nav>
          <Button as="a" href="/join" size="sm" className="hidden sm:inline-flex">
            Start my week
          </Button>
        </div>
      </header>

      <section className="relative pt-20 lg:min-h-[780px]">
        <div className="grid min-h-[700px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[470px] overflow-hidden bg-sand lg:min-h-[700px]">
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

          <div className="relative flex items-center bg-oat px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
            <Image
              src="/botanicals/clay-branch.png"
              alt=""
              width={320}
              height={400}
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 bottom-0 w-52 rotate-6 opacity-25 sm:w-64 lg:-right-12 lg:w-72"
            />
            <div className="relative z-10 max-w-[34rem]">
              <p className="mb-5 text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">
                Weekly nourishment · Los Angeles
              </p>
              <h1 className="text-[clamp(4.6rem,8vw,8.3rem)] leading-[0.76] font-normal tracking-[-0.055em] text-forest">
                Soul Bowls<sup className="ml-1 text-[0.18em] align-top tracking-normal">™</sup>
              </h1>
              <p className="mt-7 font-serif text-3xl leading-tight text-forest sm:text-4xl">
                Your week, nourished.
              </p>
              <div className="mt-7 h-px w-12 bg-clay" />
              <p className="mt-7 max-w-md text-base leading-7 text-forest/72 sm:text-lg">
                Five fresh 32 oz bowls for $88 weekly. Choose free pickup or
                $8.88 Los Angeles County delivery.
              </p>
              <Button as="a" href="/join" size="lg" className="mt-8 min-w-48">
                Start my week
              </Button>
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
              The five in your week
            </p>
            <h2 className="mt-4 text-4xl leading-none font-normal tracking-[-0.045em] text-forest sm:text-5xl">
              Five bowls, made with intention.
            </h2>
          </div>

          <div className="divide-y divide-forest/12 border-y border-forest/12">
            {CURRENT_BOWLS.map((bowl, index) => {
              const imageFirst = index % 2 === 0;
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
                  </div>
                  <div className={`relative px-2 py-4 sm:px-8 lg:px-12 ${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
                    <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">
                      Bowl {String(index + 1).padStart(2, "0")} · {bowl.serving}
                    </p>
                    <h3 className="mt-3 max-w-[14ch] text-4xl leading-[0.94] font-normal tracking-[-0.035em] text-forest sm:text-5xl">
                      {bowl.name}
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-forest/68">
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
            Five bowls. One nourishing week.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-5 sm:gap-6">
            {CURRENT_BOWLS.map((bowl) => (
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
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">Your weekly ritual</p>
            <h2 className="mt-3 text-4xl leading-none font-normal tracking-[-0.04em] text-forest sm:text-5xl">
              From our kitchen to your week.
            </h2>
          </div>
          <ol className="grid border-t border-forest/15 sm:grid-cols-5">
            {RITUAL_STEPS.map((step) => (
              <li key={step.number} className="border-b border-forest/15 py-5 sm:border-r sm:border-b-0 sm:px-5 sm:last:border-r-0">
                <p className="font-serif text-3xl text-clay">{step.number}</p>
                <h3 className="mt-4 text-lg font-normal text-forest">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-forest/62">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="fulfillment" className="mx-auto grid w-full max-w-[1440px] md:grid-cols-2">
        <article className="relative overflow-hidden bg-sage px-8 py-10 text-oat sm:px-14 lg:px-20">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-oat/72 uppercase">Free every Sunday</p>
          <h2 className="mt-4 text-5xl font-normal tracking-[-0.04em] sm:text-6xl">Pick up</h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-oat/78">
            Swing by our Los Angeles kitchen. We confirm your pickup location and window before fulfillment.
          </p>
          <Button as="a" href="/join?fulfillment=pickup" variant="secondary" className="mt-8 border-oat text-oat hover:bg-oat hover:text-forest">
            Choose pickup
          </Button>
        </article>
        <article className="relative overflow-hidden bg-clay px-8 py-10 text-oat sm:px-14 lg:px-20">
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-oat/72 uppercase">$8.88 per week</p>
          <h2 className="mt-4 text-5xl font-normal tracking-[-0.04em] sm:text-6xl">Delivery</h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-oat/78">
            Doorstep delivery to verified addresses throughout Los Angeles County, California.
          </p>
          <Button as="a" href="/join?fulfillment=delivery" variant="secondary" className="mt-8 border-oat text-oat hover:bg-oat hover:text-forest">
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
        <p className="font-serif text-3xl text-forest">Five 32 oz bowls.</p>
        <p className="mt-2 font-serif text-6xl leading-none tracking-[-0.05em] text-forest sm:text-7xl">$88 weekly.</p>
        <div className="mx-auto mt-4 h-px w-12 bg-clay" />
        <p className="mt-4 text-sm leading-6 text-forest/62">
          Choose free pickup or $8.88 LA County delivery. Applicable tax and any refundable jar deposit are shown before payment.
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
          <p className="text-[0.68rem] font-bold tracking-[0.22em] text-gold uppercase">Nourish · heal · thrive</p>
          <h2 className="mt-4 text-5xl leading-none font-normal tracking-[-0.045em] sm:text-6xl">
            Your week, nourished.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-oat/68">
            Five thoughtful bowls. One simple weekly rhythm. Made locally and ready for real life.
          </p>
          <Button as="a" href="/join" size="lg" className="mt-6 bg-sage hover:bg-oat hover:text-forest">
            Start my week
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
