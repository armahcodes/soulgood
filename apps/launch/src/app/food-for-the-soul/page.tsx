import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Heart, HandHeart, Plus, Sprout } from "lucide-react";
import { Reveal } from "@/components/ui/kit/reveal";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { CommunityInterestForm } from "@/components/community/CommunityInterestForm";
import { ShareDrive } from "@/components/community/ShareDrive";
import { COMMUNITY_DRIVE } from "@/lib/community-drive";

const description =
  "100+ meals delivered, and more good to share. Food for the Soul by Soul Good brings nourishing meals to communities. Partner with us or get involved in our October 15, 2026 meal drive.";
export const metadata: Metadata = {
  title: "Food for the Soul · Community Meal Drive by Soul Good",
  description,
  alternates: { canonical: COMMUNITY_DRIVE.url },
  openGraph: {
    type: "website",
    title: "Food for the Soul · A little good goes a long way.",
    description,
    url: COMMUNITY_DRIVE.url,
    siteName: "Soul Good",
    images: [
      {
        url: "https://www.soulgood.kitchen/products/golden-harvest-bowl.webp",
        width: 480,
        height: 600,
        alt: "A Soul Good Golden Harvest Bowl",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Food for the Soul by Soul Good",
    description,
    images: ["https://www.soulgood.kitchen/products/golden-harvest-bowl.webp"],
  },
};

const primaryAction =
  "inline-flex min-h-13 items-center justify-center gap-3 rounded-md bg-forest px-5 py-4 text-center text-sm font-semibold text-oat transition-colors hover:bg-forest/90";
const eyebrow = "text-xs font-medium uppercase tracking-[0.2em]";

export default function FoodForTheSoulPage() {
  return (
    <div className="bg-oat text-forest">
      <a
        href="#main-content"
        className="sr-only z-50 bg-forest p-4 text-oat focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <SiteHeader
        current={COMMUNITY_DRIVE.path}
        cta={{ href: "#get-involved", label: "Get involved" }}
      />
      <nav
        aria-label="Community navigation"
        className="border-b border-forest/10 bg-card/60"
      >
        <div className="scrollbar-none mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-5 text-sm sm:px-8 lg:px-12">
          {[
            { href: "#our-impact", label: "Our impact" },
            { href: "#next-drive", label: "The next drive" },
            { href: "#how-it-works", label: "How it works" },
            { href: "#questions", label: "Questions" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-12 shrink-0 items-center gap-2 font-semibold text-forest/72 transition-colors hover:text-clay"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
      <main id="main-content">
        <section
          aria-labelledby="campaign-title"
          className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:py-20"
        >
          <div className="min-w-0 text-center lg:text-left">
            <p
              className={`${eyebrow} flex items-center justify-center gap-3 lg:justify-start`}
            >
              <span className="hidden h-px w-7 bg-clay sm:block" /> A community
              initiative by Soul Good
            </p>
            <h1
              id="campaign-title"
              className="mt-7 text-[clamp(4.25rem,15vw,7.6rem)] leading-[1.02] tracking-[0.01em]"
            >
              Food for <br />
              the <em className="font-normal text-clay">Soul.</em>
            </h1>
            <p className="mx-auto mt-8 max-w-lg font-serif text-3xl leading-tight sm:text-4xl lg:mx-0">
              A nourishing meal.
              <br />A reminder that we belong.
            </p>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-forest/80 lg:mx-0">
              Good food is a way of showing up for each other. We’re bringing
              the care of the Soul Good kitchen beyond our table—and into our
              communities.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-center lg:items-start">
              <a href="#get-involved" className={primaryAction}>
                Bring a drive to your community{" "}
                <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
              </a>
              <a
                href="#next-drive"
                className="inline-flex min-h-12 items-center justify-center gap-2 text-sm font-bold underline underline-offset-4"
              >
                Meet the October 15 meal drive{" "}
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[450px]">
            <div className="relative aspect-[4/4.4] overflow-hidden rounded-t-[48%] rounded-b-lg bg-sand shadow-[0_40px_70px_-45px_rgb(44_58_52/0.6)]">
              <Image
                src="/products/golden-harvest-bowl.webp"
                alt="A Golden Harvest Bowl from the Soul Good kitchen, layered with grains, vegetables, and greens"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 450px, (min-width: 640px) 440px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="relative -mt-14 mr-5 flex items-center gap-4 rounded-lg bg-forest px-5 py-6 text-oat shadow-[0_24px_40px_-24px_rgb(44_58_52/0.7)] sm:mr-10 sm:gap-5 sm:px-8">
              <span className="shrink-0 font-serif text-5xl leading-none tracking-[0.01em] text-gold sm:text-7xl">
                {COMMUNITY_DRIVE.impact}
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold">meals delivered</p>
                <p className="mt-1 text-sm text-oat/80">
                  And more good to share.
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-forest/70">
              From our kitchen, with care. Meal-drive menus may vary.
            </p>
          </div>
        </section>

        <div className="border-y border-forest/15 bg-sand/40 px-5 py-5">
          <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-xs font-medium uppercase tracking-[0.14em]">
            <span>Good food</span>
            <span aria-hidden="true" className="text-clay">
              ✳
            </span>
            <span>Real connection</span>
            <span aria-hidden="true" className="text-clay">
              ✳
            </span>
            <span>Care for our communities</span>
          </p>
        </div>

        <section
          id="our-impact"
          aria-labelledby="impact-heading"
          className="relative overflow-hidden bg-forest px-5 py-16 text-oat sm:px-8 sm:py-24"
        >
          <Image
            src="/botanicals/clay-branch.png"
            alt=""
            width={320}
            height={400}
            className="pointer-events-none absolute -right-24 bottom-0 w-72 rotate-12 opacity-20"
            aria-hidden="true"
          />
          <Reveal className="relative mx-auto grid max-w-6xl gap-10 text-center md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16 md:text-left">
            <div className="border-b border-oat/20 pb-10 md:border-r md:border-b-0 md:py-6 md:pr-12">
              <p className={`${eyebrow} text-gold`}>Our impact so far</p>
              <p className="mt-5 font-serif text-[7rem] leading-none tracking-[0.01em] sm:text-[9rem]">
                {COMMUNITY_DRIVE.impact}
              </p>
              <p className="mt-3 font-serif text-3xl text-gold">
                meals delivered.
              </p>
            </div>
            <div>
              <h2
                id="impact-heading"
                className="text-4xl leading-[1.05] tracking-[0.01em] sm:text-5xl"
              >
                More than a meal.
                <br />A moment of being cared for.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-oat/85">
                Food for the Soul is our way of putting nourishment into motion.
                With 100+ meals already delivered, we’re continuing to build
                something simple and meaningful: good food, shared with care.
              </p>
              <p className="mt-4 max-w-xl text-base leading-7 text-oat/85">
                Because everyone deserves a place at the table. And every
                community has a story worth showing up for.
              </p>
              <a
                href="#get-involved"
                className="mt-6 inline-flex min-h-12 items-center gap-3 text-sm font-bold text-gold underline underline-offset-4"
              >
                Be part of what comes next{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </section>

        <section
          id="next-drive"
          aria-labelledby="drive-heading"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
        >
          <Reveal className="grid overflow-hidden rounded-lg border border-forest/15 bg-card shadow-[0_30px_60px_-45px_rgb(44_58_52/0.5)] md:grid-cols-[0.75fr_1.25fr]">
            <div className="flex flex-col items-center justify-center bg-sand/60 px-8 py-10 text-center sm:py-14">
              <p className={eyebrow}>The next meal drive</p>
              <time dateTime={COMMUNITY_DRIVE.dateISO} className="mt-5 block">
                <span className="block font-serif text-4xl">October</span>
                <span className="block font-serif text-[8rem] leading-[1.02] tracking-[0.01em] sm:text-[10rem]">
                  15
                </span>
                <span className="mt-4 block text-sm tracking-[0.18em]">
                  THURSDAY · 2026
                </span>
              </time>
              <div className="mt-7 flex items-center gap-2 border-t border-forest/20 pt-5 text-sm">
                <Heart size={16} strokeWidth={1.5} aria-hidden="true" /> Meals
                provided by Soul Good
              </div>
            </div>
            <div className="flex flex-col justify-center px-6 py-9 text-center sm:p-12 md:text-left">
              <p className={`${eyebrow} text-forest/70`}>
                Our next chapter of good
              </p>
              <h2
                id="drive-heading"
                className="mt-4 text-4xl leading-tight tracking-[0.01em] sm:text-5xl"
              >
                Let’s make October 15
                <br className="hidden sm:block" /> a little more soulful.
              </h2>
              <p className="mt-5 text-base leading-7 text-forest/80">
                Our next Food for the Soul meal drive is coming. Want to lend a
                hand, connect us with your community, or learn more? This is
                your invitation.
              </p>
              <p className="mt-5 border-l-2 border-clay pl-4 text-left text-sm leading-6 text-forest/80">
                Time, location, and participation details will be shared once
                confirmed. Expressing interest does not reserve a meal or
                confirm a volunteer spot.
              </p>
              <a
                href="#get-involved"
                className={`${primaryAction} mt-7 self-stretch sm:self-center md:self-start`}
              >
                Get involved <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="partnership-heading"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-16 sm:px-8 sm:pb-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrow}>From our kitchen to your community</p>
            <h2
              id="partnership-heading"
              className="mt-4 text-4xl leading-tight tracking-[0.01em] sm:text-5xl"
            >
              We bring the meals.
              <br />
              Together, we bring the meaning.
            </h2>
          </div>
          <Reveal as="ol" stagger className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              {
                icon: Heart,
                title: "Start with a connection",
                body: "Tell us about your community, organization, or the people you hope to bring together.",
              },
              {
                icon: Sprout,
                title: "Plan something thoughtful",
                body: "We’ll explore the right fit together, from the setting and timing to the care your community needs.",
              },
              {
                icon: HandHeart,
                title: "Share the good",
                body: "Soul Good provides the meals. Together, we create a welcoming moment around nourishing food.",
              },
            ].map(({ icon: Icon, title, body }, index) => (
              <li
                key={title}
                className="rounded-lg border border-forest/12 bg-card p-6 text-center md:text-left"
              >
                <div className="flex items-center justify-center gap-3 text-clay md:justify-start">
                  <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-xs font-bold tracking-[0.15em]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-forest/80">{body}</p>
              </li>
            ))}
          </Reveal>
        </section>

        <CommunityInterestForm />

        <section
          id="questions"
          aria-labelledby="questions-heading"
          className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20"
        >
          <h2
            id="questions-heading"
            className="mb-8 text-center text-4xl tracking-[0.01em]"
          >
            A few things you might be wondering.
          </h2>
          {[
            [
              "What is Food for the Soul?",
              "Food for the Soul is Soul Good’s community meal-drive initiative. We provide meals and invite communities and organizations to connect with us to bring a drive to the people they serve.",
            ],
            [
              "Can we bring a meal drive to our community?",
              "That’s exactly the conversation we’d love to have. Choose “Bring a drive to my community” above and tell us where you are. Our team will discuss what’s possible; submitting the form doesn’t confirm a date or location.",
            ],
            [
              "Do I need to represent an organization?",
              "No. You can reach out as a community member, a potential volunteer, or someone who simply wants to learn more. Start wherever you are.",
            ],
            [
              "Where and when is the October 15 drive?",
              "The next drive is October 15, 2026. The time, location, and participation details are still to be confirmed. Choose “Learn about the next drive” to connect with our team about details.",
            ],
            [
              "Is this a meal order or a paid booking?",
              "No. This page is for community partnerships and participation in Food for the Soul. No payment is collected, and this form does not place a meal order, reserve a meal, or create a subscription.",
            ],
          ].map(([question, answer]) => (
            <details
              key={question}
              className="group border-b border-forest/15 first-of-type:border-t"
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl leading-snug transition-colors hover:text-clay sm:text-2xl [&::-webkit-details-marker]:hidden">
                {question}
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-forest/20 transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:border-forest group-open:bg-forest group-open:text-oat">
                  <Plus size={16} />
                </span>
              </summary>
              <p className="max-w-2xl pr-14 pb-6 text-base leading-7 text-forest/78">
                {answer}
              </p>
            </details>
          ))}
        </section>

        <section className="border-t border-forest/15 bg-sand/30 px-5 py-14 text-center sm:py-20">
          <p className={eyebrow}>Good grows when it’s shared</p>
          <h2 className="mt-4 text-4xl leading-tight tracking-[0.01em] sm:text-5xl">
            Know a community we should meet?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-forest/80">
            Pass this invitation along. One connection can be the beginning of
            something nourishing.
          </p>
          <ShareDrive />
          <Link
            href="/"
            className="mt-7 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
          >
            Discover more from Soul Good
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
