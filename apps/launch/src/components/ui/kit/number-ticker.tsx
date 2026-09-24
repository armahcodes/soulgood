"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";

/**
 * Adapted from 21st.dev danielpetho/basic-number-ticker. Server-renders the
 * final value, then counts up once when scrolled into view.
 */
export function NumberTicker({
  value,
  suffix = "",
  className,
  duration = 1.8,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const count = useMotionValue(value);
  const text = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!inView || reduced) return;
    count.set(0);
    const controls = animate(count, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [count, duration, inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{`${value}${suffix}`}</span>
      <motion.span aria-hidden="true" className="tabular-nums">
        {text}
      </motion.span>
    </span>
  );
}
