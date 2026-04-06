import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CategoryNav } from "@/components/sections/CategoryNav";
import { ProductCarousel } from "@/components/sections/ProductCarousel";
import { BrandFeature } from "@/components/sections/BrandFeature";
import { EditorialCards } from "@/components/sections/EditorialCards";
import { PressLogos } from "@/components/sections/PressLogos";
import { PhilosophyPillars } from "@/components/sections/PhilosophyPillars";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";

export const metadata: Metadata = {
  title: "Soul Good | Made with Intention. Seasoned with Love.",
  description:
    "Premium wellness food by Chef Kyla — Southern soul food meets functional healing nutrition. Chef-crafted meal plans delivered to your door in Los Angeles.",
  openGraph: {
    title: "Soul Good | Made with Intention. Seasoned with Love.",
    description:
      "Premium wellness food by Chef Kyla — Southern soul food meets functional healing nutrition. Chef-crafted meal plans delivered to your door in Los Angeles.",
  },
};

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* 1. Hero - 50/50 split with copy + lifestyle image */}
      <Hero />

      {/* 2. Category Navigation - horizontal scrollable cards */}
      <CategoryNav />

      {/* 3. Product/Plan Carousel - Swiper with prev/next arrows */}
      <ProductCarousel />

      {/* 4. Brand Feature - split layout with image left, brand copy right */}
      <BrandFeature />

      {/* 5. Editorial/Blog Preview Cards - 4-up grid */}
      <EditorialCards />

      {/* 6. Press Logos - horizontal row with quotes */}
      <PressLogos />

      {/* 7. Philosophy Pillars - Swiper carousel of pillar cards */}
      <PhilosophyPillars />

      {/* 8. Testimonials - horizontal scrollable review cards */}
      <Testimonials />

      {/* 9. Newsletter Signup - email input with validation */}
      <Newsletter />
    </main>
  );
}
