"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
  allowMultiple?: boolean;
}

function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}

interface AccordionItemProps {
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

function AccordionItem({ item, isOpen, onToggle, className }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, item.content]);

  return (
    <div className={cn("", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
      >
        <span className="font-sans text-sm uppercase tracking-[0.06em] font-medium pr-4">
          {item.title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        id={`accordion-content-${item.id}`}
        role="region"
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
        style={{
          maxHeight: isOpen ? contentHeight || "none" : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pb-5">
          <p className="font-body text-sm text-black/70 leading-relaxed">
            {item.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export { Accordion, AccordionItem };
export type { AccordionProps, AccordionItemData };
