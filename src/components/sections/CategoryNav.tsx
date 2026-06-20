"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/ui/Carousel";
import { CATEGORY_NAV } from "@/lib/constants";

export function CategoryNav() {
  return (
    <section className="section-padding max-container">
      <Carousel
        slidesPerView={1.2}
        spaceBetween={16}
        breakpoints={{
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        showNavigation={false}
        showPagination={false}
        ariaLabel="Browse categories"
      >
        {CATEGORY_NAV.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-light">
              <Image
                src={category.image}
                alt={category.label}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 33vw"
                data-placeholder="true"
              />
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black/20 transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:bg-black/30" />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="label-text text-white text-sm tracking-widest">
                  {category.label}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
