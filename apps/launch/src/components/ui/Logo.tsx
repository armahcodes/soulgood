import { cn } from "@/lib/utils";

interface LogoProps {
  /** Pixel size of the square mark. Defaults to 40. */
  size?: number;
  className?: string;
  /** Accessible label; set to "" to mark the SVG decorative. */
  title?: string;
}

/**
 * Soul Bowls™ brand mark — a simple bowl and rising steam. `currentColor` lets
 * callers set the color through text color utilities.
 */
export function Logo({ size = 40, className, title = "Soul Bowls™" }: LogoProps) {
  const decorative = title === "";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
    >
      {!decorative && <title>{title}</title>}
      <path
        d="M10 29H54C52.5 43.5 43.5 53 32 53S11.5 43.5 10 29Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M8 29H56"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M22 22C18 18 19 13 23 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 22C29 17 30 11 35 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M43 22C40 18 41 14 45 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
