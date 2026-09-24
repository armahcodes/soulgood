import { cn } from "@/lib/utils";

/**
 * Adapted from 21st.dev preetsuthar17/infinite-text-marquee as a CSS-only
 * loop (no client JS). Pauses on hover and stops under reduced motion.
 */
export function Marquee({
  items,
  className,
  separator = "✦",
}: {
  items: readonly string[];
  className?: string;
  separator?: string;
}) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 animate-[marquee_48s_linear_infinite] items-center gap-8 pr-8 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap">
          <span>{item}</span>
          <span aria-hidden="true" className="text-gold">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("group flex overflow-hidden", className)}>
      {row(false)}
      {row(true)}
    </div>
  );
}
