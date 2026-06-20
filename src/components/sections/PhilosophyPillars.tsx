"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/ui/Carousel";
import { PHILOSOPHY_PILLARS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PhilosophyPillars() {
  return (
    <section className="section-padding max-container">
      {/* Section header */}
      <div className="mb-10 text-center">
        <p className="label-text text-primary mb-3 text-xs tracking-widest">
          THE SOUL GOOD PHILOSOPHY
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem]">
          Our Pillars of Nourishment
        </h2>
      </div>

      {/* Pillars carousel */}
      <Carousel
        slidesPerView={1.2}
        spaceBetween={16}
        breakpoints={{
          480: { slidesPerView: 2.2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
        }}
        showNavigation={true}
        showPagination={false}
        ariaLabel="Philosophy pillars carousel"
      >
        {PHILOSOPHY_PILLARS.map((pillar) => (
          <div key={pillar.id} className="group">
            {/* Pillar image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-light mb-4">
              <Image
                src={pillar.image}
                alt={pillar.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-700",
                  "ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                )}
                sizes="(max-width: 480px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
                data-placeholder="true"
              />
            </div>

            {/* Pillar content */}
            <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-medium mb-2">
              {pillar.name}
            </h3>
            <p className="font-body text-sm text-black/60 leading-relaxed mb-3 line-clamp-3">
              {pillar.description}
            </p>
            <Link
              href="/about#philosophy"
              className="inline-flex items-center font-sans text-xs uppercase tracking-[0.06em] font-medium text-primary hover:text-primary-dark transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
            >
              READ MORE
              <svg
                className="ml-1.5 w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
