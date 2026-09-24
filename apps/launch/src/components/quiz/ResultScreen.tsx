"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SeedOfLife } from "@/components/ui/SeedOfLife";
import { PRICING, type FulfillmentMethod } from "@/lib/brand";
import { CURRENT_BOWLS } from "@/lib/current-offer";
import { MIX_RATIONALE, recommendMix } from "@/lib/pathway-mix";
import type { PathwayState } from "@/lib/pathway-state";
import { PATHWAY_DEFINITIONS } from "@/lib/pathways";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Pathway reveal: the matched pathway (name, descriptor, and description
 * verbatim from the Pathway Finder) and a five-bowl mix from today's menu that
 * prefills checkout.
 */
export function ResultScreen({
  state,
  fulfillment,
  onRetake,
}: {
  state: PathwayState;
  fulfillment: FulfillmentMethod;
  onRetake: () => void;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const pathway = PATHWAY_DEFINITIONS[state.pathway];
  const mix = recommendMix(state.pathway, state);
  const picks = CURRENT_BOWLS.filter((bowl) => mix.selection[bowl.id] > 0);

  const startWithMix = () => {
    window.sessionStorage.setItem("soulbowls:bowlSelection", JSON.stringify(mix.selection));
    window.sessionStorage.setItem("soulbowls:peopleCount", "1");
    window.sessionStorage.setItem("soulbowls:mealsPerDay", "1");
    router.push(`/checkout?fulfillment=${fulfillment}`);
  };

  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE } };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-5 text-center">
        <motion.div {...rise(0)}>
          <SeedOfLife size={96} className="text-sage" bloom title="" />
        </motion.div>
        <motion.p {...rise(0.1)} className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">
          Your Soul Good pathway
        </motion.p>
        <motion.h1 {...rise(0.18)} className="text-[clamp(3.6rem,14vw,6rem)] leading-[0.85] font-normal tracking-[-0.055em] text-forest">
          {pathway.name}
        </motion.h1>
        <motion.p {...rise(0.26)} className="text-sm font-bold tracking-[0.12em] text-sage uppercase">
          {pathway.descriptor}
        </motion.p>
        <motion.p {...rise(0.32)} className="max-w-[38ch] text-lg leading-relaxed text-forest/75">
          {pathway.description}
        </motion.p>
      </div>

      <motion.section {...rise(0.4)} aria-labelledby="mix-heading" className="overflow-hidden rounded-lg border border-forest/12 bg-card shadow-[0_30px_60px_-45px_rgb(44_58_52/0.5)]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-dashed border-forest/15 p-5 sm:p-7">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.18em] text-forest/60 uppercase">Your starting mix</p>
            <h2 id="mix-heading" className="mt-2 text-3xl leading-none tracking-[-0.03em] text-forest">Five bowls for {PRICING.oneTime}</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-forest/70">{MIX_RATIONALE[state.pathway]}</p>
        </div>
        <ul className="grid gap-px bg-forest/8 sm:grid-cols-2">
          {picks.map((bowl) => (
            <li key={bowl.id} className="flex items-center gap-4 bg-card p-4 sm:p-5">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-sand">
                <Image src={bowl.imagePath} alt={`${bowl.name} in a 32 ounce Soul Good jar`} fill unoptimized sizes="80px" className="object-cover" />
                <span className="absolute right-1 bottom-1 flex size-6 items-center justify-center rounded-full bg-forest text-xs font-bold text-oat">
                  {mix.selection[bowl.id]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-serif text-xl leading-tight text-forest">{bowl.name}</p>
                <p className="mt-1 text-xs leading-5 text-forest/65">{bowl.dietary.join(" · ")}</p>
                {bowl.allergen ? <p className="mt-1 text-xs font-semibold text-clay">{bowl.allergen}</p> : null}
              </div>
            </li>
          ))}
        </ul>
        <div className="grid gap-3 p-5 text-sm leading-6 text-forest/72 sm:p-7">
          {mix.fallback ? (
            <p className="rounded-md border border-clay/30 bg-clay/8 px-4 py-3 text-forest">
              Your answers rule out most of this week’s bowls, so we’ve started you with one of each.
              Please review the mix at checkout and adjust it to suit you.
            </p>
          ) : null}
          {mix.excluded.length ? (
            <p>
              <strong className="text-forest">Left out for you:</strong>{" "}
              {mix.excluded.map((bowl) => `${bowl.name} (${bowl.reason})`).join(", ")}.
            </p>
          ) : null}
          <p className="text-xs text-forest/60">
            You can change any bowl at checkout. Our kitchen handles other major allergens and we can’t
            guarantee against cross-contact; customers with severe or life-threatening allergies should not order.
          </p>
        </div>
      </motion.section>

      <motion.div {...rise(0.5)} className="flex flex-col items-center gap-3">
        <Button type="button" size="lg" className="w-full sm:w-auto sm:min-w-[18rem]" onClick={startWithMix}>
          Start with this mix
        </Button>
        <div className="flex flex-wrap items-center justify-center gap-x-6 text-sm font-semibold">
          <Link href="/#bowls" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">
            Browse all bowls
          </Link>
          <button type="button" onClick={onRetake} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">
            Retake the quiz
          </button>
        </div>
      </motion.div>
    </div>
  );
}
