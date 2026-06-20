"use client";

import { useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SwiperOptions, Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  breakpoints?: SwiperOptions["breakpoints"];
  showNavigation?: boolean;
  showPagination?: boolean;
  loop?: boolean;
  ariaLabel?: string;
}

function Carousel({
  children,
  className,
  slidesPerView = 1,
  spaceBetween = 24,
  breakpoints,
  showNavigation = true,
  showPagination = false,
  loop = false,
  ariaLabel = "Content carousel",
}: CarouselProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const handleBeforeInit = useCallback((swiper: SwiperType) => {
    if (
      swiper.params.navigation &&
      typeof swiper.params.navigation !== "boolean"
    ) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
    }
  }, []);

  return (
    <div className={cn("relative group", className)} aria-label={ariaLabel}>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        loop={loop}
        pagination={
          showPagination
            ? { clickable: true, dynamicBullets: true }
            : false
        }
        navigation={
          showNavigation
            ? { enabled: true }
            : false
        }
        onBeforeInit={showNavigation ? handleBeforeInit : undefined}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
        }}
      >
        {children.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>

      {showNavigation && (
        <>
          <button
            ref={prevRef}
            type="button"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 flex items-center justify-center",
              "bg-white/90 border border-border text-black",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
              "hover:bg-black hover:text-white hover:border-black",
              "disabled:opacity-30 disabled:pointer-events-none",
              "-translate-x-1/2"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            ref={nextRef}
            type="button"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 flex items-center justify-center",
              "bg-white/90 border border-border text-black",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
              "hover:bg-black hover:text-white hover:border-black",
              "disabled:opacity-30 disabled:pointer-events-none",
              "translate-x-1/2"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}

export { Carousel };
export type { CarouselProps };
