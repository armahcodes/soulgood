"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const MENU_SECTIONS = [
  { id: "bowls", label: "Soul Bowls™" },
  { id: "salads", label: "Salads" },
  { id: "veggie-cups", label: "Veggie cups" },
  { id: "snacks", label: "Snacks" },
  { id: "collections", label: "Collections" },
] as const;

/** Sticky section tabs that follow your place on the menu (scroll-spy). */
export function MenuJumpNav() {
  const [active, setActive] = useState<string>(MENU_SECTIONS[0].id);

  useEffect(() => {
    const sections = MENU_SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.getElementById(`jump-${active}`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Menu sections" className="sticky top-[calc(4.5rem+env(safe-area-inset-top))] z-30 sm:top-[calc(5rem+env(safe-area-inset-top))] border-y border-forest/10 bg-oat/90 backdrop-blur-xl supports-[backdrop-filter]:bg-oat/80">
      <ul className="scrollbar-none mx-auto flex w-full max-w-7xl gap-1.5 overflow-x-auto px-5 py-2.5 sm:px-8 lg:px-12">
        {MENU_SECTIONS.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              id={`jump-${section.id}`}
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              className={cn(
                "inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
                active === section.id ? "bg-forest text-oat" : "text-forest/72 hover:bg-forest/5 hover:text-forest",
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
