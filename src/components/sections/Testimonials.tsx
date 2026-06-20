"use client";

import { Rating } from "@/components/ui/Rating";
import { Carousel } from "@/components/ui/Carousel";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section className="section-padding max-container bg-cream">
      {/* Section header */}
      <div className="mb-10 text-center">
        <p className="label-text text-primary mb-3 text-xs tracking-widest">
          WHAT PEOPLE ARE SAYING
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem]">
          Client Reviews
        </h2>
      </div>

      {/* Testimonials carousel */}
      <Carousel
        slidesPerView={1}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        showNavigation={true}
        showPagination={false}
        ariaLabel="Customer testimonials carousel"
      >
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-8 md:p-10 border border-border flex flex-col h-full"
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

            {/* Customer name */}
            <div className="border-t border-border pt-4">
              <p className="font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/80">
                {testimonial.name}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
