"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Brand adaptation of 21st.dev ddoemonn/segmented-control: a sliding forest
 * thumb with masked label crossfade and full radiogroup keyboard support.
 */

const SPRING = { type: "spring", stiffness: 480, damping: 36, mass: 0.5 } as const;
const SEGMENT =
  "flex min-h-11 items-center justify-center px-4 text-center text-[0.72rem] font-medium tracking-[0.1em] uppercase whitespace-nowrap";

export type SegmentedOption<T extends string = string> = { value: T; label: string };

export function SegmentedControl<T extends string>({
  options,
  label,
  value,
  onValueChange,
  className,
}: {
  options: readonly SegmentedOption<T>[];
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}) {
  const count = Math.max(1, options.length);
  const template = `repeat(${count}, minmax(0, 1fr))`;
  const index = Math.max(0, options.findIndex((option) => option.value === value));

  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const pos = useMotionValue(index);
  const thumbX = useTransform(pos, (v) => `${v * 100}%`);
  const maskX = useTransform(pos, (v) => `${v * -100}%`);

  useEffect(() => {
    if (reduced) {
      pos.set(index);
      return;
    }
    const controls = animate(pos, index, SPRING);
    return () => controls.stop();
  }, [index, reduced, pos]);

  const go = useCallback(
    (i: number) => {
      const next = options[(i + count) % count];
      buttons.current[(i + count) % count]?.focus();
      onValueChange(next.value);
    },
    [count, onValueChange, options],
  );

  const onKeyDown = (event: React.KeyboardEvent, i: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (delta) {
      event.preventDefault();
      go(i + delta);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      go(event.key === "Home" ? 0 : count - 1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("relative inline-block rounded-lg border border-forest/15 bg-oat p-1 select-none", className)}
    >
      <div className="relative grid" style={{ gridTemplateColumns: template, touchAction: "manipulation" }}>
        {options.map((option) => (
          <span key={option.value} aria-hidden className={cn(SEGMENT, "pointer-events-none text-forest/65")}>
            {option.label}
          </span>
        ))}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-md bg-forest shadow-[0_1px_2px_rgb(44_58_52/0.25)]"
          style={{ width: `${100 / count}%`, x: thumbX }}
        >
          <motion.div className="absolute inset-0" style={{ x: maskX }}>
            <div className="absolute inset-y-0 left-0 grid" style={{ width: `${count * 100}%`, gridTemplateColumns: template }}>
              {options.map((option) => (
                <span key={option.value} className={cn(SEGMENT, "text-oat")}>
                  {option.label}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: template }}>
          {options.map((option, i) => (
            <button
              key={option.value}
              ref={(node) => {
                buttons.current[i] = node;
              }}
              type="button"
              role="radio"
              aria-checked={i === index}
              tabIndex={i === index ? 0 : -1}
              onClick={() => onValueChange(option.value)}
              onKeyDown={(event) => onKeyDown(event, i)}
              className="cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-oat"
            >
              <span className="sr-only">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
