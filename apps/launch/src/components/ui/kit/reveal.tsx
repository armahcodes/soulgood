"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealState = "static" | "armed" | "shown";

/**
 * Calm on-scroll entrance, adapted from the Reveal pattern in 21st.dev
 * felipemenezes098/hero-07. Server HTML is always fully visible (no-JS, crawlers,
 * reduced motion). Only content still below the fold after hydration is armed,
 * so nothing a visitor can already see ever blinks out.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  as: Component = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger direct children instead of fading the block as one. */
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "ol";
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    // Arming on the next frame keeps the hydration render identical to the server HTML.
    const frame = requestAnimationFrame(() => {
      setState("armed");
      observer.observe(el);
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      ref={ref as React.Ref<never>}
      data-reveal={state}
      className={cn(stagger ? "reveal-stagger" : "reveal", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
