"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Entry = { id: string; label: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Builds an "On this page" list from the section headings inside
 * `#legal-content`, and highlights the section currently being read.
 * Legal copy is untouched; headings only gain ids for linking.
 */
export function LegalToc() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLHeadingElement>("#legal-content h2"));
    const found = headings.map((heading) => {
      if (!heading.id) heading.id = slugify(heading.textContent ?? "");
      heading.classList.add("scroll-mt-28");
      return { id: heading.id, label: heading.textContent ?? "" };
    });
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.filter((entry) => entry.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    queueMicrotask(() => {
      setEntries(found);
      setActive(found[0]?.id ?? "");
    });
    return () => observer.disconnect();
  }, []);

  if (!entries.length) return null;

  return (
    <nav aria-label="On this page" className="rounded-lg border border-forest/12 bg-card/70 p-5">
      <p className="text-[0.65rem] font-medium tracking-[0.18em] text-forest/60 uppercase">On this page</p>
      <ol className="mt-3 grid gap-0.5">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={active === entry.id ? "location" : undefined}
              className={cn(
                "block rounded-md border-l-2 px-3 py-1.5 text-[0.82rem] leading-5 transition-colors",
                active === entry.id
                  ? "border-clay bg-clay/6 font-semibold text-forest"
                  : "border-transparent text-forest/68 hover:text-forest",
              )}
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
