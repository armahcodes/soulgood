"use client";

import { useEffect, useState } from "react";

/**
 * "up" while the visitor scrolls toward the top (or rests near it), "down"
 * while they read further. Small movements under `threshold` px are ignored.
 */
export function useScrollDirection(threshold = 8): "up" | "down" {
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 40;
        if (y < 80 || nearBottom) setDirection("up");
        else if (Math.abs(y - last) >= threshold) setDirection(y > last ? "down" : "up");
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return direction;
}
