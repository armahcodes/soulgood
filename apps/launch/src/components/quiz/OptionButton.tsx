"use client";

import { cn } from "@/lib/utils";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  /** "radio" for single-select, "checkbox" for multi-select. */
  role: "radio" | "checkbox";
  /** Disabled when a multi-select cap is reached and this option is unselected. */
  disabled?: boolean;
  onSelect: () => void;
}

/**
 * A large, thumb-friendly quiz option. Renders the label VERBATIM. Left marker
 * is a ring (radio) or square (checkbox) that fills when selected.
 */
export function OptionButton({
  label,
  selected,
  role,
  disabled = false,
  onSelect,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left text-base leading-snug transition-colors duration-200",
        "min-h-[56px]",
        selected
          ? "border-sage bg-sage/15 text-forest"
          : "border-forest/15 bg-white/70 text-forest hover:border-sage/60",
        disabled && !selected && "cursor-not-allowed opacity-40 hover:border-forest/15",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors",
          role === "radio" ? "rounded-full" : "rounded-md",
          selected ? "border-sage bg-sage" : "border-forest/30 bg-transparent",
        )}
      >
        {selected && (
          <span
            className={cn(
              "block bg-oat",
              role === "radio" ? "h-2 w-2 rounded-full" : "h-2.5 w-2.5 rounded-[2px]",
            )}
          />
        )}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  );
}
