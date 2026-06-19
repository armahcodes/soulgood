"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SeedOfLifeProps {
  /** Pixel size of the square mark. Defaults to 92. */
  size?: number;
  className?: string;
  /**
   * When true (and motion is allowed), the seven inner circles bloom in with a
   * staggered scale + fade. Respects `prefers-reduced-motion`: when motion is
   * reduced the mark short-circuits to its resting, fully-visible state.
   */
  bloom?: boolean;
  /** Accessible label; set to "" to mark the SVG decorative. */
  title?: string;
}

const CENTER = 50;
const R = 16;

/** The 7 inner circle centers: the center point + 6 on a hex lattice. */
const INNER_CENTERS: Array<[number, number]> = [
  [CENTER, CENTER],
  ...[0, 60, 120, 180, 240, 300].map((deg): [number, number] => {
    const rad = (deg * Math.PI) / 180;
    return [CENTER + R * Math.cos(rad), CENTER + R * Math.sin(rad)];
  }),
];

/**
 * Soul Good "Seed of Life" mark — a central circle ringed by six circles on a
 * hex lattice, inside an enclosing boundary circle (radius 2R). Drawn in
 * `currentColor` so callers set color via text color. DISTINCT from `Logo`
 * (ring + leaf): this is the calm sacred-geometry mark used on the quiz Intro
 * and the results reveal.
 */
export function SeedOfLife({
  size = 92,
  className,
  bloom = false,
  title = "Soul Good",
}: SeedOfLifeProps) {
  const prefersReduced = useReducedMotion();
  const animate = bloom && !prefersReduced;
  const decorative = title === "";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
    >
      {!decorative && <title>{title}</title>}
      {/* Enclosing boundary circle (radius 2R). */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={2 * R}
        stroke="currentColor"
        strokeWidth={1.4}
        opacity={0.55}
      />
      {/* Seven inner circles — center + six on the hex lattice. */}
      {INNER_CENTERS.map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={R}
          stroke="currentColor"
          strokeWidth={1.4}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          initial={animate ? { scale: 0.4, opacity: 0 } : false}
          animate={animate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={
            animate
              ? { duration: 0.5, delay: i * 0.1, ease: "easeOut" }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  );
}
