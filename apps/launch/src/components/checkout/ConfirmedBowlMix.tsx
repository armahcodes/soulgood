"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_BOWL_SELECTION,
  parseStoredBowlSelection,
  type BowlSelection,
} from "@/lib/bowl-selection";
import { CURRENT_BOWLS } from "@/lib/current-offer";

export function ConfirmedBowlMix() {
  const [selection, setSelection] = useState<BowlSelection | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setSelection(
        parseStoredBowlSelection(
          window.sessionStorage.getItem("soulbowls:confirmedBowlSelection"),
        ) ?? DEFAULT_BOWL_SELECTION,
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!selection) return null;

  const selected = CURRENT_BOWLS.filter((bowl) => selection[bowl.id] > 0);
  return (
    <section className="mt-10 w-full border border-sage/30 bg-white/50 p-6 text-left sm:p-8">
      <p className="text-xs font-bold tracking-[0.16em] text-clay uppercase">
        Your confirmed five
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {selected.map((bowl) => (
          <li
            key={bowl.id}
            className="flex items-center justify-between gap-4 border-b border-forest/10 pb-3 text-sm text-forest/72"
          >
            <span>{bowl.name}</span>
            <strong className="text-forest">× {selection[bowl.id]}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
