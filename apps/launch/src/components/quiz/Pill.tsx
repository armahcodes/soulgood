"use client";

import { cn } from "@/lib/utils";

interface PillProps {
  label: string;
  selected: boolean;
  /** Disabled when a multi-select cap is reached and this pill is unselected. */
  disabled?: boolean;
  onToggle: () => void;
}

/**
 * A compact rounded toggle chip for multi-select quiz steps. Selected state =
 * sage fill with oat text. Renders the label VERBATIM. As a toggle it exposes
 * `aria-pressed`.
 */
export function Pill({ label, selected, disabled = false, onToggle }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onToggle();
      }}
      className={cn(
        "min-h-[44px] rounded-full border px-[17px] py-[11px] text-[14.5px] leading-[1.1] transition-colors",
        selected
          ? "border-sage bg-sage font-medium text-oat"
          : "border-forest/15 bg-white/70 text-forest/75 hover:border-sage/60",
        disabled && !selected && "cursor-not-allowed opacity-40 hover:border-forest/15",
      )}
    >
      {label}
    </button>
  );
}
