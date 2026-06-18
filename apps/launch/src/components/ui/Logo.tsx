import { cn } from "@/lib/utils";

interface LogoProps {
  /** Pixel size of the square mark. Defaults to 40. */
  size?: number;
  className?: string;
  /** Accessible label; set to "" to mark the SVG decorative. */
  title?: string;
}

/**
 * Soul Good brand mark — an inline, single-color geometric approximation
 * (no logo file is provided). Sacred-geometry / botanical motif: a seed/leaf
 * form cradled within a ring. `currentColor` lets callers set the color via
 * text color (e.g. `text-forest`, `text-oat`). Built to stay legible at small
 * sizes.
 */
export function Logo({ size = 40, className, title = "Soul Good" }: LogoProps) {
  const decorative = title === "";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
    >
      {!decorative && <title>{title}</title>}
      {/* Enclosing ring */}
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" />
      {/* Leaf / seed: two mirrored arcs forming a vesica with a central stem */}
      <path
        d="M24 9C16 16 16 32 24 39C32 32 32 16 24 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M24 13V36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
