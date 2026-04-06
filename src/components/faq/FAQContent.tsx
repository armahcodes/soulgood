"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { FAQS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/lib/types";

/* ============================================
   FAQ Category Configuration
   ============================================ */

const FAQ_CATEGORIES = [
  { id: "general", label: "General" },
  { id: "meal-plans", label: "Meal Plans" },
  { id: "delivery", label: "Delivery" },
  { id: "subscription", label: "Subscription" },
  { id: "dietary", label: "Dietary" },
] as const;

type FAQCategoryId = (typeof FAQ_CATEGORIES)[number]["id"];

/* ============================================
   Hero Section
   ============================================ */

function FAQHero() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          HELP CENTER
        </p>
        <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Frequently Asked Questions
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
          Everything you need to know about Soul Good — from meal plans and
          delivery to dietary needs and subscriptions.
        </p>
      </div>
    </section>
  );
}

/* ============================================
   FAQ Content (sidebar + accordions)
   ============================================ */

export function FAQContent() {
  const [activeCategory, setActiveCategory] = useState<FAQCategoryId>("general");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* Group FAQs by category */
  const faqsByCategory = useMemo(() => {
    const grouped: Record<string, FAQ[]> = {};
    for (const cat of FAQ_CATEGORIES) {
      grouped[cat.id] = FAQS.filter((f) => f.category === cat.id);
    }
    return grouped;
  }, []);

  /* Handle category click — scrolls to section and sets active */
  const handleCategoryClick = useCallback((categoryId: FAQCategoryId) => {
    setActiveCategory(categoryId);
    const ref = sectionRefs.current[categoryId];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <FAQHero />

      <section className="max-container section-padding">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* ---- Sidebar (desktop) / Tabs (mobile) ---- */}
          <nav
            aria-label="FAQ categories"
            className="lg:w-64 shrink-0"
          >
            {/* Mobile: horizontal scrollable tabs */}
            <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 -mx-1 px-1 scrollbar-hide">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={cn(
                    "whitespace-nowrap px-5 py-2.5",
                    "font-sans text-xs uppercase tracking-[0.06em] font-medium",
                    "border transition-all duration-300",
                    activeCategory === cat.id
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-black/70 border-border hover:border-black hover:text-black"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Desktop: vertical sidebar list */}
            <div className="hidden lg:block sticky top-32">
              <h2 className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6">
                CATEGORIES
              </h2>
              <ul className="space-y-1">
                {FAQ_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className={cn(
                        "w-full text-left px-4 py-3",
                        "font-sans text-sm uppercase tracking-[0.06em] font-medium",
                        "border-l-2 transition-all duration-300",
                        activeCategory === cat.id
                          ? "border-primary text-primary bg-primary/5"
                          : "border-transparent text-black/60 hover:text-black hover:border-border"
                      )}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* ---- Accordion Q&A sections ---- */}
          <div className="flex-1 min-w-0">
            {FAQ_CATEGORIES.map((cat) => {
              const items = faqsByCategory[cat.id] || [];
              if (items.length === 0) return null;

              return (
                <section
                  key={cat.id}
                  ref={(el) => { sectionRefs.current[cat.id] = el; }}
                  className="mb-12 last:mb-0 scroll-mt-32"
                >
                  <h3 className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6 pb-3 border-b border-border">
                    {cat.label}
                  </h3>
                  <Accordion
                    items={items.map((faq) => ({
                      id: faq.id,
                      title: faq.question,
                      content: faq.answer,
                    }))}
                    allowMultiple
                  />
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
