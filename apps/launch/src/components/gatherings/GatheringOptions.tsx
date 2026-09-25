import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/kit/reveal";
import { formatCents } from "@/lib/brand";
import { CULINARY_PRICING } from "@/lib/culinary-booking";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    id: "delivery",
    eyebrow: "Drop-off",
    name: "Bowl delivery",
    price: formatCents(CULINARY_PRICING.bowlUnitCents),
    unit: "per bowl",
    blurb: `A minimum of ${CULINARY_PRICING.deliveryMinimumBowls} bowls, delivered ready for your gathering. No on-site service.`,
    image: "/gatherings/team-lunch.webp",
    points: [
      `From ${CULINARY_PRICING.deliveryMinimumBowls} bowls, mixed any way you like`,
      "Add made-to-order salads, veggie cups, and snacks",
      "Chef-made 32 oz Soul Bowls™ in glass jars",
      "Perfect for team lunches, retreats, and open houses",
      "Delivery and California sales tax shown in your estimate",
    ],
    cta: "Start a delivery estimate",
    featured: false,
  },
  {
    id: "plated",
    eyebrow: "Full service",
    name: "Plated dinner",
    price: formatCents(CULINARY_PRICING.platedPersonCents),
    unit: "per guest",
    blurb: `${formatCents(CULINARY_PRICING.platedFoodMinimumCents)} food minimum, plus ${formatCents(CULINARY_PRICING.platedSupportCents)} culinary support for plating, service, and ingredient education.`,
    image: "/gatherings/plated-dinner.webp",
    points: [
      "One food style for the whole group: chef’s selection, plant-forward, or chicken",
      "Our team plates and serves at your venue",
      "Ingredient education woven into the meal",
      "50% deposit reserves your date after we confirm",
    ],
    cta: "Start a plated estimate",
    featured: true,
  },
] as const;

/**
 * Two ways to gather, side by side — brand adaptation of 21st.dev
 * ln-dev7/two-plan-pricing-cards, with photography and a clear recommended option.
 */
export function GatheringOptions() {
  return (
    <Reveal stagger className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {OPTIONS.map((option) => (
        <div
          key={option.id}
          className={cn(
            "relative flex flex-col overflow-hidden rounded-lg border bg-card",
            option.featured ? "border-forest shadow-[0_30px_60px_-40px_rgb(44_58_52/0.6)]" : "border-forest/12",
          )}
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image src={option.image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            {option.featured ? (
              <span className="absolute top-4 left-4 rounded-full bg-forest px-3 py-1 text-[0.62rem] font-medium tracking-[0.16em] text-oat uppercase">
                Chef-led service
              </span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <p className="text-[0.65rem] font-medium tracking-[0.18em] text-clay-ink uppercase">{option.eyebrow}</p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-serif text-3xl leading-none tracking-[0.01em] text-forest sm:text-4xl">{option.name}</h3>
              <p className="text-forest">
                <span className="font-serif text-3xl tracking-[0.01em]">{option.price}</span>{" "}
                <span className="text-sm text-forest/72">{option.unit}</span>
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-forest/72">{option.blurb}</p>
            <ul className="mt-5 grid gap-2.5 border-t border-forest/10 pt-5">
              {option.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-6 text-forest/80">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-ink">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={`/quote?experience=${option.id}#quote`}
              className={cn(
                "group mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium tracking-[0.12em] uppercase transition-colors",
                option.featured ? "bg-forest text-oat hover:bg-forest/90" : "border border-forest/20 text-forest hover:border-forest hover:bg-forest hover:text-oat",
              )}
            >
              {option.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      ))}
    </Reveal>
  );
}
