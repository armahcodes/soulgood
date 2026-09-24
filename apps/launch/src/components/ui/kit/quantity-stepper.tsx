"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand adaptation of 21st.dev arihantcodes_1f7b8c4d/quantity-stepper: a
 * rounded − / value / + control whose number rolls in the direction of change.
 */
export function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  decrementDisabled,
  incrementDisabled,
  decrementLabel,
  incrementLabel,
  valueLabel,
  groupLabel,
  size = "md",
  className,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  decrementLabel: string;
  incrementLabel: string;
  valueLabel: string;
  groupLabel?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [previous, setPrevious] = useState(value);
  const [direction, setDirection] = useState<1 | -1>(1);
  if (previous !== value) {
    setDirection(value > previous ? 1 : -1);
    setPrevious(value);
  }

  const button = cn(
    "flex items-center justify-center rounded-full text-forest transition-colors hover:bg-forest hover:text-oat disabled:cursor-not-allowed disabled:bg-transparent disabled:text-forest/25",
    size === "sm" ? "size-10" : "size-11",
  );

  return (
    <div
      role={groupLabel ? "group" : undefined}
      aria-label={groupLabel}
      className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border border-forest/15 bg-oat p-1", className)}
    >
      <button type="button" aria-label={decrementLabel} className={button} disabled={decrementDisabled} onClick={onDecrement}>
        <Minus className="size-4" aria-hidden />
      </button>
      <output
        aria-label={valueLabel}
        aria-live="polite"
        className={cn("relative flex items-center justify-center overflow-hidden font-bold text-forest tabular-nums", size === "sm" ? "h-10 min-w-7 text-sm" : "h-11 min-w-9 text-base")}
      >
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.span
            key={value}
            custom={direction}
            initial={reduced ? false : { y: direction * 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: direction * -14, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </output>
      <button type="button" aria-label={incrementLabel} className={button} disabled={incrementDisabled} onClick={onIncrement}>
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
