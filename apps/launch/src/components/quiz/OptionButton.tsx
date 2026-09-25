"use client";

import { Check } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

/**
 * A large, thumb-friendly single-select option (radio card). Label is rendered
 * verbatim from the Pathway Finder source.
 */
export function OptionButton({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => {
        haptic();
        onSelect();
      }}
      className={cn(
        "group flex min-h-16 w-full items-center gap-4 rounded-lg border px-5 py-4 text-left text-base leading-snug transition-[border-color,background-color,box-shadow,transform] duration-200 active:scale-[0.99]",
        selected
          ? "border-forest bg-forest text-oat shadow-[0_18px_30px_-22px_rgb(44_58_52/0.8)]"
          : "border-forest/15 bg-card text-forest hover:border-forest/40 hover:bg-oat",
      )}
    >
      <span className="flex-1">{label}</span>
      <span
        aria-hidden
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected ? "border-oat bg-oat text-forest" : "border-forest/25 text-transparent group-hover:border-forest/50",
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}
