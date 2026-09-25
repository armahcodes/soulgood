"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { BowlSheet } from "@/components/sections/BowlSheet";
import { AVAILABLE_BOWLS, SOLD_OUT_BOWLS, type CurrentBowl } from "@/lib/current-offer";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const BOWLS = [...AVAILABLE_BOWLS, ...SOLD_OUT_BOWLS];

/** Label-based filters only — nothing here is a medical or allergen-free claim. */
const FILTERS = [
  { id: "plant", label: "Plant-forward", test: (bowl: CurrentBowl) => bowl.dietary.includes("Plant-forward") },
  { id: "chicken", label: "With chicken", test: (bowl: CurrentBowl) => /chicken/i.test(bowl.ingredients) },
  { id: "no-sesame", label: "No sesame listed", test: (bowl: CurrentBowl) => !/sesame/i.test(bowl.allergen ?? "") },
  { id: "no-soy-wheat", label: "No soy or wheat listed", test: (bowl: CurrentBowl) => !/soy|wheat/i.test(bowl.allergen ?? "") },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/**
 * The bowl collection: dietary filter chips (brand adaptation of 21st.dev
 * cnippet-dev/role-filter-chips), a native scroll-snap rail on phones whose
 * cards ease back in depth as they leave center (the idea behind
 * educalvolpz/scrollable-card-stack, without taking over page scrolling), and
 * whole-card tap targets that open the bowl sheet.
 */
export function BowlCollection() {
  const [active, setActive] = useState<Set<FilterId>>(new Set());
  const [open, setOpen] = useState<CurrentBowl | null>(null);
  const reduced = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => BOWLS.filter((bowl) => FILTERS.every((filter) => !active.has(filter.id) || filter.test(bowl))),
    [active],
  );

  const toggle = (id: FilterId) => {
    haptic();
    setActive((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    rail.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  // Depth effect on the phone rail: cards away from center shrink and soften.
  useEffect(() => {
    const el = rail.current;
    if (!el || reduced) return;
    const phone = window.matchMedia("(max-width: 1023px)");
    let frame = 0;
    const paint = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-rail-card]"));
      if (!phone.matches) {
        cards.forEach((card) => card.style.removeProperty("transform"));
        return;
      }
      const box = el.getBoundingClientRect();
      const center = box.left + box.width / 2;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const distance = Math.min(Math.abs(rect.left + rect.width / 2 - center) / box.width, 1);
        card.style.transform = `scale(${1 - distance * 0.07})`;
        card.style.opacity = String(1 - distance * 0.35);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    paint();
    el.addEventListener("scroll", onScroll, { passive: true });
    phone.addEventListener("change", paint);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      phone.removeEventListener("change", paint);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, visible]);

  return (
    <>
      <div className="mb-6 grid gap-3">
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.14em] text-forest/65 uppercase">
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Filter by label
          </p>
          <p className="text-xs text-forest/65" aria-live="polite">
            {visible.length} {visible.length === 1 ? "bowl" : "bowls"}
            {active.size ? (
              <button
                type="button"
                onClick={() => setActive(new Set())}
                className="ml-3 inline-flex min-h-11 items-center font-semibold text-forest underline underline-offset-4"
              >
                Clear
              </button>
            ) : null}
          </p>
        </div>
        <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:px-0">
          {FILTERS.map((filter) => {
            const pressed = active.has(filter.id);
            const count = BOWLS.filter(filter.test).length;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => toggle(filter.id)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border pr-2 pl-4 text-sm font-semibold transition-colors duration-200",
                  pressed ? "border-forest bg-forest text-oat" : "border-forest/15 bg-card text-forest/80 hover:border-forest/40",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[0.7rem] tabular-nums",
                    pressed ? "bg-oat/20 text-oat" : "bg-forest/8 text-forest/70",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={rail}
        role="region"
        aria-roledescription="carousel"
        aria-label="This week’s Soul Bowls™"
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory scroll-px-[12%] gap-4 overflow-x-auto px-[12%] pt-2 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14 lg:overflow-visible lg:px-0"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((bowl) => (
            <motion.article
              key={bowl.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-[76%] shrink-0 snap-center sm:w-[44%] sm:snap-start lg:w-auto"
            >
              <button
                type="button"
                data-rail-card
                onClick={() => {
                  haptic();
                  setOpen(bowl);
                }}
                aria-haspopup="dialog"
                aria-label={`${bowl.name}${bowl.available ? "" : ", sold out"}. View details`}
                className="group/card flex w-full origin-center flex-col text-left transition-[transform,opacity] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay"
              >
                <span className={cn("relative block aspect-[4/5] w-full overflow-hidden rounded-lg", bowl.tone)}>
                  <Image
                    src={bowl.imagePath}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 30vw, 72vw"
                    className={cn(
                      "object-cover transition-transform duration-700 ease-(--ease-soft) group-hover/card:scale-[1.035]",
                      !bowl.available && "grayscale-[0.35]",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-3 left-3 rounded-md px-2.5 py-1.5 text-[0.62rem] font-medium tracking-[0.14em] uppercase backdrop-blur-sm",
                      bowl.available ? "bg-oat/90 text-forest" : "bg-forest text-oat",
                    )}
                  >
                    {bowl.available ? bowl.serving : "Sold out"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-oat/92 text-forest shadow-sm backdrop-blur transition-transform duration-300 group-hover/card:rotate-90"
                  >
                    <Plus className="size-5" />
                  </span>
                </span>
                <span className="block pt-5">
                  <span className="block font-serif text-[1.7rem] leading-[1.02] tracking-[0.01em] text-forest">{bowl.name}</span>
                  <span className="mt-3 line-clamp-2 block text-sm leading-6 text-forest/68">{bowl.ingredients}</span>
                  <span className="mt-4 flex flex-wrap gap-1.5">
                    {bowl.dietary.map((tag) => (
                      <span key={tag} className="rounded-md border border-forest/12 px-2 py-1 text-[0.65rem] font-medium tracking-[0.06em] text-forest/70 uppercase">
                        {tag}
                      </span>
                    ))}
                  </span>
                  {bowl.allergen ? <span className="mt-3 block text-xs font-semibold text-clay">{bowl.allergen}</span> : null}
                </span>
              </button>
            </motion.article>
          ))}
        </AnimatePresence>
        {visible.length === 0 ? (
          <p className="w-full py-10 text-center text-sm text-forest/70 lg:col-span-3">
            No bowl matches all of those labels.{" "}
            <button type="button" onClick={() => setActive(new Set())} className="font-semibold text-forest underline underline-offset-4">
              Clear filters
            </button>
          </p>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-forest/60">
        Filters use current label information. Our kitchen handles other major allergens and cross-contact can occur.
      </p>

      <BowlSheet bowl={open} onClose={() => setOpen(null)} />
    </>
  );
}
