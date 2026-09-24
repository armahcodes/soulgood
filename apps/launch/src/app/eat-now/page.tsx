import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { BRAND_NAME, CONTACT, NOURISHMENT } from "@/lib/brand";
import { CURRENT_BOWLS } from "@/lib/current-offer";
import { EAT_NOW } from "@/lib/ordering";

const title = `Eat Now — Single-order ${BRAND_NAME}`;
const description =
  `Order individual Soul Bowls™ from the Soul Good menu. ${EAT_NOW.deliveryDetails} Check available service times before ordering.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.soulgood.kitchen/eat-now" },
  openGraph: { title, description, url: "https://www.soulgood.kitchen/eat-now" },
  twitter: { title, description },
};

export default function EatNowPage() {
  return (
    <>
      <SiteHeader cta={{ href: EAT_NOW.menuUrl, label: "Eat Now menu", short: "Order" }} />
      <main className="min-h-screen bg-oat">

        <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0 text-center lg:text-left">
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">Eat Now · Single orders</p>
            <h1 className="mx-auto mt-5 max-w-[12ch] font-serif text-6xl leading-[0.95] tracking-[-0.045em] text-forest sm:text-7xl lg:mx-0">
              A little good, whenever it fits.
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-forest/75 lg:mx-0">
              A bowl for you, a few to share. Thoughtfully prepared Soul Bowls™,
              chosen one at a time. Find the flavors that feel right today.
            </p>
            <p className="mt-5 text-sm font-semibold text-forest">{EAT_NOW.fulfillment} · Los Angeles County</p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-forest/75 lg:mx-0">
              {EAT_NOW.deliveryDetails}
            </p>
            <Button as="a" href={EAT_NOW.menuUrl} target="_self" size="lg" className="mt-7 w-full sm:w-auto">
              Open the Eat Now menu
            </Button>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-forest/65 lg:mx-0">
              Browse and order at checkout.soulgood.kitchen.
              Secure payment through Square; care from the Soul Good team.
            </p>
            <a href="#order-help" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-forest underline underline-offset-4">
              Already placed an Eat Now order?
            </a>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg bg-sand/35 shadow-[0_40px_70px_-45px_rgb(44_58_52/0.6)]">
            <Image
              src={CURRENT_BOWLS[0].imagePath}
              alt="Glow Bowl™ in a 32 ounce Soul Good jar"
              fill
              loading="eager"
              fetchPriority="high"
              unoptimized
              sizes="(min-width: 1024px) 448px, (min-width: 640px) 448px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section aria-labelledby="eat-now-details" className="border-y border-forest/12 bg-sand/25">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
            <h2 id="eat-now-details" className="text-center font-serif text-3xl text-forest sm:text-4xl">One order. Your own rhythm.</h2>
            <ol className="mt-8 grid gap-4 text-center md:grid-cols-3 md:text-left [&>li]:rounded-lg [&>li]:border [&>li]:border-forest/12 [&>li]:bg-card [&>li]:p-6">
              <li>
                <h3 className="text-2xl text-forest">01. Choose from the menu</h3>
                <p className="mt-3 text-sm leading-6 text-forest/75">The live menu has the latest items and prices. For a single order, select “One time” if purchase options are shown.</p>
              </li>
              <li>
                <h3 className="text-2xl text-forest">02. Check your service time</h3>
                <p className="mt-3 text-sm leading-6 text-forest/75">{EAT_NOW.availability}</p>
              </li>
              <li>
                <h3 className="text-2xl text-forest">03. Keep your confirmation</h3>
                <p className="mt-3 text-sm leading-6 text-forest/75">Square confirms the order after checkout. Our team prepares your food; an available courier partner or Soul Good courier brings it to you. Keep your order reference and contact Soul Good if you need help.</p>
              </li>
            </ol>
            <p className="mt-8 text-center text-sm leading-6 text-forest/70">Made with care, on our kitchen’s schedule. Check available pickup and delivery times in the menu before ordering.</p>
          </div>
        </section>

        <section id="order-help" aria-labelledby="eat-now-help" className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h2 id="eat-now-help" className="font-serif text-3xl text-forest sm:text-4xl">Already ordered?</h2>
            <p className="mt-4 text-sm leading-7 text-forest/75">Your Square confirmation is the place to check your Eat Now order and payment details. Eat Now purchases do not appear in your Soul Good account’s weekly nourishment history.</p>
            <p className="mt-3 text-sm leading-7 text-forest/75">For an update, a missing confirmation, or help with delivery, contact our team with the order reference from your confirmation. Do not send card details.</p>
            <a href={`mailto:${CONTACT.email}?subject=Eat%20Now%20order%20help`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-forest underline underline-offset-4">Contact Soul Good</a>
          </div>
          <div className="border border-forest/15 bg-white/35 p-6 text-center sm:p-8 md:text-left rounded-lg">
            <h2 className="font-serif text-3xl text-forest sm:text-4xl">A ritual to come home to.</h2>
            <p className="mt-4 text-sm leading-7 text-forest/75">Make space for nourishment throughout your week. Five 32 oz Soul Bowls™ start at $88, once or weekly. {NOURISHMENT.deliveryDisclosure}</p>
            <p className="mt-3 text-sm leading-7 text-forest/75">For meal prep, Sunday pickup is free for one-time orders; LA County delivery is $8.88. Applicable tax is additional. Eat Now has its own delivery availability and charges, shown at checkout.</p>
            <Button as="a" href="/checkout" variant="secondary" className="mt-5 w-full sm:w-auto">{NOURISHMENT.cta}</Button>
          </div>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-forest underline underline-offset-4 md:col-span-2">Back to Soul Good</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
