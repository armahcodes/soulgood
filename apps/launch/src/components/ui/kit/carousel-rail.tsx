"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Adapted from 21st.dev ravikatiyar162/product-carousel: a scroll-snap rail
 * with previous/next controls that only appear while the rail can scroll.
 * Pass `gridFrom="lg"` to turn it into a static grid on large screens.
 */
export function CarouselRail({
  label,
  children,
  className,
  itemsClassName,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  itemsClassName?: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ scrollable: false, start: true, end: false });

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setEdges({
      scrollable: el.scrollWidth > el.clientWidth + 1,
      start: el.scrollLeft <= 1,
      end: Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) <= 1,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = rail.current;
    el?.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    if (el) observer.observe(el);
    return () => {
      el?.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const scroll = (direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className={cn("relative", className)} role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={rail}
        className={cn(
          "scrollbar-none -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8",
          itemsClassName,
        )}
      >
        {children}
      </div>
      {edges.scrollable ? (
        <div className="mt-6 flex items-center justify-end gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              disabled={direction === -1 ? edges.start : edges.end}
              aria-label={direction === -1 ? "Previous bowls" : "Next bowls"}
              className="flex size-11 items-center justify-center rounded-full border border-forest/20 text-forest transition-colors hover:border-forest hover:bg-forest hover:text-oat disabled:pointer-events-none disabled:opacity-35"
            >
              {direction === -1 ? <ArrowLeft className="size-4" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
