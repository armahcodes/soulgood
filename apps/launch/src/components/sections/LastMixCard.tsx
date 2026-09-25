"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ReorderButton } from "@/components/checkout/ReorderButton";
import { CURRENT_BOWLS } from "@/lib/current-offer";
import { LAST_MIX_KEY, parseLastMix, type LastMix } from "@/lib/last-mix";

/**
 * Returning customers see their last confirmed mix with a one-tap reorder —
 * the "route to past orders from the homepage" that food-ordering research
 * finds most sites miss. Stored on this device only; nothing renders otherwise.
 */
export function LastMixCard() {
  const [mix, setMix] = useState<LastMix | null>(null);

  useEffect(() => {
    let value: string | null = null;
    try {
      value = window.localStorage.getItem(LAST_MIX_KEY);
    } catch {
      return;
    }
    const parsed = parseLastMix(value);
    if (parsed) queueMicrotask(() => setMix(parsed));
  }, []);

  if (!mix) return null;
  const bowls = CURRENT_BOWLS.filter((bowl) => mix.bowlSelection[bowl.id] > 0);
  const total = bowls.reduce((sum, bowl) => sum + mix.bowlSelection[bowl.id], 0);

  return (
    <section
      aria-label="Your last mix"
      className="mb-10 flex flex-col gap-4 rounded-lg border border-forest/12 bg-card p-5 motion-safe:animate-[rise_0.5s_var(--ease-soft)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex items-center gap-4">
        <div aria-hidden="true" className="flex -space-x-3">
          {bowls.slice(0, 4).map((bowl) => (
            <span key={bowl.id} className="relative size-12 overflow-hidden rounded-full border-2 border-card bg-sand">
              <Image src={bowl.imagePath} alt="" fill unoptimized sizes="48px" className="scale-150 object-cover object-[50%_60%]" />
            </span>
          ))}
        </div>
        <div>
          <p className="text-[0.65rem] font-medium tracking-[0.16em] text-clay-ink uppercase">Welcome back</p>
          <p className="mt-1 font-serif text-xl leading-tight text-forest">Your last mix · {total} bowls</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-forest/72">
            {bowls.map((bowl) => `${bowl.name.replace("™", "")} ×${mix.bowlSelection[bowl.id]}`).join(" · ")}
          </p>
        </div>
      </div>
      <ReorderButton
        bowlSelection={mix.bowlSelection}
        fulfillmentMethod={mix.fulfillmentMethod}
        mealsPerDay={mix.mealsPerDay}
        peopleCount={mix.peopleCount}
        className="w-full shrink-0 gap-2 sm:w-auto"
      >
        <RotateCcw className="size-4" aria-hidden />
        Order it again
      </ReorderButton>
    </section>
  );
}
