import { Hero } from "@/components/sections/Hero";
import { CategoryNav } from "@/components/sections/CategoryNav";
import { ProductCarousel } from "@/components/sections/ProductCarousel";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* 1. Hero - 50/50 split with copy + lifestyle image */}
      <Hero />

      {/* 2. Category Navigation - horizontal scrollable cards */}
      <CategoryNav />

      {/* 3. Product/Plan Carousel - Swiper with prev/next arrows */}
      <ProductCarousel />
    </main>
  );
}
