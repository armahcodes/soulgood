"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky mobile order summary. Visible only while the checkout form is on
 * screen and the full summary and payment step are not, so it never covers
 * the controls it points to.
 */
export function MobileOrderBar({
  hidden,
  selected,
  target,
  totalLabel,
  totalNote,
}: {
  hidden: boolean;
  selected: number;
  target: number;
  totalLabel: string;
  totalNote: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("step-size");
    const summary = document.getElementById("step-total");
    const pay = document.getElementById("step-pay");
    if (!form || !summary || !pay) return;

    const seen = new Map<Element, boolean>();
    const update = () => {
      const formStarted = form.getBoundingClientRect().top < window.innerHeight * 0.5;
      const pastPayment = pay.getBoundingClientRect().bottom < 0;
      setVisible(formStarted && !pastPayment && !seen.get(summary) && !seen.get(pay));
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) seen.set(entry.target, entry.isIntersecting);
      update();
    });
    [form, summary, pay].forEach((el) => observer.observe(el));
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  const show = visible && !hidden;
  const complete = selected === target;

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-forest/10 bg-oat/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-20px_rgb(44_58_52/0.45)] backdrop-blur-lg transition-transform duration-300 ease-(--ease-soft) lg:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className={cn("text-[0.65rem] font-medium tracking-[0.12em] uppercase", complete ? "text-sage-ink" : "text-clay-ink")}>
            {selected} of {target} bowls
          </p>
          <p className="font-serif text-2xl leading-tight text-forest">
            {totalLabel} <span className="font-sans text-xs text-forest/72">{totalNote}</span>
          </p>
        </div>
        <a
          href="#step-total"
          className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-forest px-5 text-xs font-medium tracking-[0.08em] text-oat uppercase"
        >
          Review total
        </a>
      </div>
    </div>
  );
}
