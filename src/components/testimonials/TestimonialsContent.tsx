"use client";

import { useState, useMemo } from "react";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ============================================
   Category Filter Config
   ============================================ */
const FILTER_CATEGORIES = [
  { key: "all", label: "All Reviews" },
  { key: "meal-prep", label: "Meal Prep" },
  { key: "events", label: "Events" },
  { key: "catering", label: "Catering" },
] as const;

type FilterKey = (typeof FILTER_CATEGORIES)[number]["key"];

/* ============================================
   Section 1: Hero
   ============================================ */
function TestimonialsHero() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          WHAT PEOPLE ARE SAYING
        </p>
        <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Client Testimonials
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
          From weekly meal plans to intimate dinners and private catering —
          hear from the people who trust Soul Good to nourish them.
        </p>
      </div>
    </section>
  );
}

/* ============================================
   Section 2: Filterable Testimonials Grid
   ============================================ */
function TestimonialsGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "all") return TESTIMONIALS;
    return TESTIMONIALS.filter((t) => t.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="bg-white">
      <div className="max-container section-padding">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={cn(
                "font-sans text-xs uppercase tracking-[0.06em] font-medium px-6 py-3 border transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
                activeFilter === cat.key
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-border hover:border-black"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="font-sans text-xs uppercase tracking-[0.06em] text-black/50 text-center mb-8">
          {filteredTestimonials.length}{" "}
          {filteredTestimonials.length === 1 ? "Review" : "Reviews"}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-cream border border-border p-8 md:p-10 flex flex-col"
            >
              {/* Star rating */}
              <div className="mb-5">
                <Rating value={testimonial.rating} size="sm" />
              </div>

              {/* Quote text */}
              <blockquote className="flex-1 mb-6">
                <p className="font-body text-base italic text-black/70 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </blockquote>

              {/* Footer: name + category badge */}
              <div className="border-t border-border pt-4 flex items-center justify-between gap-4">
                <p className="font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/80">
                  {testimonial.name}
                </p>
                <span className="font-sans text-[10px] uppercase tracking-[0.06em] font-medium px-3 py-1 bg-primary/10 text-primary">
                  {testimonial.category === "meal-prep"
                    ? "Meal Prep"
                    : testimonial.category === "events"
                      ? "Events"
                      : "Catering"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTestimonials.length === 0 && (
          <div className="text-center py-16">
            <p className="font-body text-lg text-black/50">
              No reviews found for this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================
   Section 3: CTA
   ============================================ */
function TestimonialsCTA() {
  return (
    <section className="bg-cream-dark">
      <div className="max-container section-padding text-center">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[3rem] leading-[1.12] mb-6 max-w-3xl mx-auto">
          Ready to Experience Soul Good?
        </h2>
        <p className="font-body text-lg text-black/60 leading-relaxed max-w-2xl mx-auto mb-10">
          Join hundreds of satisfied clients who trust Chef Kyla to nourish
          their bodies and feed their souls.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as="a" href="/meal-plans">
            Explore Meal Plans
          </Button>
          <Button as="a" href="/catering" variant="secondary">
            Inquire About Catering
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Main Content Export
   ============================================ */
export function TestimonialsContent() {
  return (
    <>
      <TestimonialsHero />
      <TestimonialsGrid />
      <TestimonialsCTA />
    </>
  );
}
