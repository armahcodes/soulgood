"use client";

import { useEffect } from "react";

/**
 * While the element with `targetId` is on screen, marks the page as being in a
 * focused task (e.g. building a quote) so the phone tab bar steps aside and the
 * task's own actions own the bottom of the screen.
 */
export function FocusTask({ targetId }: { targetId: string }) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) document.body.dataset.focusTask = "true";
        else delete document.body.dataset.focusTask;
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      delete document.body.dataset.focusTask;
    };
  }, [targetId]);
  return null;
}
