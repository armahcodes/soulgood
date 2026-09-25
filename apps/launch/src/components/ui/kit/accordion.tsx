"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Brand adaptation of 21st.dev ddoemonn/accordion: measured-height spring
 * disclosure, roving arrow-key focus, inert closed panels.
 */

const DISCLOSE = { type: "spring", stiffness: 420, damping: 42, mass: 0.7 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useAutoHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const next = el.getBoundingClientRect().height;
      setHeight((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };
    read();
    setReady(true);
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, height, ready };
}

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

export function Accordion({
  items,
  defaultOpen = [],
  headingLevel = 3,
  className,
}: {
  items: readonly AccordionItem[];
  defaultOpen?: readonly string[];
  headingLevel?: number;
  className?: string;
}) {
  const base = useId();
  const reduced = Boolean(useReducedMotion());
  const [open, setOpen] = useState<string>(defaultOpen[0] ?? "");
  const headers = useRef(new Map<string, HTMLButtonElement>());

  const move = useCallback(
    (id: string, to: "next" | "prev" | "first" | "last") => {
      const order = items.map((item) => item.id);
      const at = order.indexOf(id);
      const next =
        to === "first" ? 0 : to === "last" ? order.length - 1 : (at + (to === "next" ? 1 : -1) + order.length) % order.length;
      headers.current.get(order[next])?.focus();
    },
    [items],
  );

  return (
    <div className={cn("border-t border-forest/15", className)}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          open={open === item.id}
          reduced={reduced}
          headingLevel={headingLevel}
          headerId={`${base}-h-${item.id}`}
          panelId={`${base}-p-${item.id}`}
          bindHeader={(node) => {
            if (node) headers.current.set(item.id, node);
            else headers.current.delete(item.id);
          }}
          onToggle={() => setOpen((current) => (current === item.id ? "" : item.id))}
          onKeyDown={(event) => {
            const keys: Record<string, "next" | "prev" | "first" | "last"> = {
              ArrowDown: "next",
              ArrowUp: "prev",
              Home: "first",
              End: "last",
            };
            const to = keys[event.key];
            if (!to) return;
            event.preventDefault();
            move(item.id, to);
          }}
        />
      ))}
    </div>
  );
}

function AccordionRow({
  item,
  open,
  reduced,
  headingLevel,
  headerId,
  panelId,
  bindHeader,
  onToggle,
  onKeyDown,
}: {
  item: AccordionItem;
  open: boolean;
  reduced: boolean;
  headingLevel: number;
  headerId: string;
  panelId: string;
  bindHeader: (node: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}) {
  const { ref, height, ready } = useAutoHeight();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.inert = !open;
    return () => {
      el.inert = false;
    };
  }, [ref, open]);

  return (
    <div className="border-b border-forest/15">
      <div role="heading" aria-level={headingLevel}>
        <button
          ref={bindHeader}
          id={headerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="group flex min-h-16 w-full items-center justify-between gap-6 rounded-md py-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
        >
          <span className="font-serif text-xl leading-snug text-forest transition-colors group-hover:text-clay-ink sm:text-2xl">
            {item.title}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "relative flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
              open ? "border-forest bg-forest text-oat" : "border-forest/20 text-forest group-hover:border-clay group-hover:text-clay-ink",
            )}
          >
            <span className="absolute h-px w-3.5 bg-current" />
            <span
              className={cn(
                "absolute h-3.5 w-px bg-current transition-transform duration-300 ease-(--ease-soft)",
                open && "rotate-90 scale-y-0",
              )}
            />
          </span>
        </button>
      </div>
      <motion.div
        initial={false}
        animate={ready ? { height: open ? height : 0 } : {}}
        transition={reduced ? { duration: 0 } : DISCLOSE}
        style={{ overflow: "hidden", height: ready ? undefined : open ? "auto" : 0 }}
      >
        <div ref={ref} id={panelId} role="region" aria-labelledby={headerId}>
          <motion.div
            initial={false}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : -4 }}
            transition={reduced ? { duration: 0 } : { duration: open ? 0.3 : 0.15, ease: EASE }}
            className="max-w-2xl pr-14 pb-6 text-[0.95rem] leading-7 text-forest/72"
          >
            {item.content}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
