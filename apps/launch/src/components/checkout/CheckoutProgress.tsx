"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutStep = { id: string; label: string; complete: boolean };

/**
 * Checkout progress — brand adaptation of 21st.dev originui/stepper.
 * Each step links to its section; the first incomplete step is current.
 */
export function CheckoutProgress({ steps }: { steps: readonly CheckoutStep[] }) {
  const currentIndex = Math.max(0, steps.findIndex((step) => !step.complete));
  const allComplete = steps.every((step) => step.complete);

  return (
    <nav
      aria-label="Checkout progress"
      className="sticky top-18 z-20 -mx-4 border-b border-forest/10 bg-oat/92 px-4 py-3 backdrop-blur-lg sm:top-20 sm:-mx-9 sm:px-9"
    >
      <ol className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const current = !allComplete && index === currentIndex;
          return (
            <li
              key={step.id}
              className={cn(
                "relative flex justify-center",
                index < steps.length - 1 &&
                  "after:absolute after:top-3.5 after:left-[calc(50%+1.25rem)] after:h-px after:w-[calc(100%-2.5rem)] after:transition-colors after:duration-500",
                step.complete ? "after:bg-sage" : "after:bg-forest/15",
              )}
            >
              <a
                href={`#${step.id}`}
                aria-current={current ? "step" : undefined}
                className="group flex min-h-11 flex-col items-center gap-1 rounded-md px-1"
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300",
                    step.complete
                      ? "border-sage bg-sage text-oat"
                      : current
                        ? "border-forest bg-forest text-oat"
                        : "border-forest/20 bg-oat text-forest/60",
                  )}
                >
                  {step.complete ? <Check className="size-3.5" aria-hidden /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-[0.62rem] font-bold tracking-[0.08em] uppercase sm:text-[0.68rem]",
                    current ? "text-forest" : "text-forest/60 group-hover:text-forest",
                  )}
                >
                  {step.label}
                  {step.complete ? <span className="sr-only"> (complete)</span> : null}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
