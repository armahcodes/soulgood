"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { FOOD_GROUP_SOURCES, VEGETABLE_SUBGROUPS, type FoodGroupSummary } from "@/lib/food-groups";
import { cn } from "@/lib/utils";

function Chips({ items, tone = "forest" }: { items: string[]; tone?: "forest" | "sage" | "clay" }) {
  if (!items.length) return <p className="text-sm text-forest/72">None in this mix</p>;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium",
            tone === "sage" ? "border-sage/30 bg-sage/10 text-forest" : tone === "clay" ? "border-clay/25 bg-clay/8 text-forest" : "border-forest/12 bg-oat text-forest/80",
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * "Your week, by food group" — what's in the mix (and any chosen sides), grouped
 * the way USDA MyPlate groups foods. It lists ingredients only: no amounts,
 * nutrient values, or health effects. The vegetable-subgroup meter is a brand
 * adaptation of 21st.dev shadcnspace/segmented-progress-pill-stepper.
 */
export function FoodGroupPanel({ summary, added }: { summary: FoodGroupSummary; added: string[] }) {
  const reduced = useReducedMotion();
  const covered = new Set(summary.subgroups);

  return (
    <section aria-labelledby="food-groups-heading" className="rounded-lg border border-forest/12 bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-medium tracking-[0.18em] text-forest/72 uppercase">What’s in your week</p>
          <h2 id="food-groups-heading" className="mt-2 text-3xl leading-none text-forest">By food group</h2>
        </div>
        <p aria-live="polite" className="text-sm text-forest/72">
          <strong className="font-semibold text-forest">{summary.vegetables.length}</strong> different vegetables
          {added.length ? <span className="text-sage-ink"> · {added.length} from your sides</span> : null}
        </p>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium tracking-[0.14em] text-forest/72 uppercase">Vegetable subgroups</p>
        <ol className="mt-3 grid grid-cols-5 gap-1.5" aria-label={`${covered.size} of 5 vegetable subgroups in your mix`}>
          {VEGETABLE_SUBGROUPS.map((sub) => {
            const on = covered.has(sub.id);
            return (
              <li key={sub.id} className="min-w-0">
                <span className="block h-1.5 overflow-hidden rounded-full bg-forest/10">
                  <motion.span
                    className="block h-full rounded-full bg-sage"
                    initial={false}
                    animate={{ width: on ? "100%" : "0%" }}
                    transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className={cn("mt-2 flex items-start gap-1 text-[0.7rem] leading-tight", on ? "text-forest" : "text-forest/72")}>
                  {on ? <Check className="mt-px size-3 shrink-0 text-sage-ink" aria-hidden /> : null}
                  <span>
                    {sub.label}
                    <span className="sr-only">{on ? " — in your mix" : " — not in this mix"}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-xs leading-5 text-forest/72">
          The Dietary Guidelines for Americans suggest choosing vegetables from all five subgroups over the week.
        </p>
      </div>

      <dl className="mt-6 grid gap-5 border-t border-forest/10 pt-5 sm:grid-cols-3">
        <div className="grid content-start gap-2">
          <dt className="text-xs font-medium tracking-[0.14em] text-forest/72 uppercase">Vegetables</dt>
          <dd><Chips items={summary.vegetables} tone="sage" /></dd>
        </div>
        <div className="grid content-start gap-2">
          <dt className="text-xs font-medium tracking-[0.14em] text-forest/72 uppercase">Grains</dt>
          <dd className="grid gap-2">
            <Chips items={summary.wholeGrains.map((name) => `${name} · whole grain`)} />
            {summary.otherGrains.length ? <Chips items={summary.otherGrains} /> : null}
          </dd>
        </div>
        <div className="grid content-start gap-2">
          <dt className="text-xs font-medium tracking-[0.14em] text-forest/72 uppercase">Protein foods</dt>
          <dd><Chips items={summary.proteins.map((item) => `${item.name} · ${item.source === "plant" ? "plant" : "poultry"}`)} tone="clay" /></dd>
        </div>
      </dl>

      <p className="mt-6 border-t border-dashed border-forest/15 pt-4 text-xs leading-5 text-forest/72">
        This groups the ingredients in your mix; it doesn’t measure amounts or nutrients, and it isn’t medical or
        nutrition advice. For specific dietary needs, talk with a registered dietitian or your healthcare provider.
        Food groups follow{" "}
        {FOOD_GROUP_SOURCES.map((source, index) => (
          <span key={source.href}>
            {index ? " and " : ""}
            <a href={source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-clay-ink">
              {source.label}
            </a>
          </span>
        ))}
        .
      </p>
    </section>
  );
}
