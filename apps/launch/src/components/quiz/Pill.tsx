"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** A multi-select toggle chip. Label is rendered verbatim. */
export function Pill({
  label,
  selected,
  disabled = false,
  onToggle,
}: {
  label: string;
  selected: boolean;
  /** Disabled when a multi-select cap is reached and this pill is unselected. */
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onToggle();
      }}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border px-4 text-[0.92rem] transition-[border-color,background-color,color] duration-200",
        selected
          ? "border-forest bg-forest text-oat"
          : "border-forest/15 bg-card text-forest/80 hover:border-forest/40 hover:text-forest",
        disabled && !selected && "cursor-not-allowed opacity-40 hover:border-forest/15",
      )}
    >
      <span
        aria-hidden
        className={cn("grid transition-[grid-template-columns] duration-200", selected ? "grid-cols-[1fr]" : "grid-cols-[0fr]")}
      >
        <span className="overflow-hidden">
          <span className="flex pr-2">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        </span>
      </span>
      {label}
    </button>
  );
}
