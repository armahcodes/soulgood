"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/ui/Carousel";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { PRODUCTS, MEAL_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProductCarouselItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  badge?: string;
  href: string;
}

function buildCarouselItems(): ProductCarouselItem[] {
  const planItems: ProductCarouselItem[] = MEAL_PLANS.map((plan) => ({
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    image: plan.image,
    price: plan.pricing.fiveDaySubscription,
    rating: 5,
    badge: "meal-plan",
    href: `/meal-plans/${plan.slug}`,
  }));

  const productItems: ProductCarouselItem[] = PRODUCTS.filter(
    (p) => p.inStock
  ).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
    price: product.price,
    rating: product.rating,
    badge: product.badge,
    href: `/shop/${product.slug}`,
  }));

  return [...planItems, ...productItems];
}

function getBadgeLabel(badge: string): string {
  switch (badge) {
    case "best-seller":
      return "Best Seller";
    case "bundle-save":
      return "Bundle & Save";
    case "meal-plan":
      return "Meal Plan";
    default:
      return badge;
  }
}

export function ProductCarousel() {
  const items = buildCarouselItems();

  return (
    <section className="section-padding max-container">
      <div className="mb-10 text-center">
        <p className="label-text text-primary mb-3 text-xs tracking-widest">
          CHEF KYLA&apos;S KITCHEN
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem]">
          Your Wellness Essentials
        </h2>
      </div>

      <Carousel
        slidesPerView={1.3}
        spaceBetween={16}
        breakpoints={{
          480: { slidesPerView: 2.2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        showNavigation={true}
        showPagination={false}
        ariaLabel="Products and meal plans carousel"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-light">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-700",
                  "ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105"
                )}
                sizes="(max-width: 480px) 75vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 25vw"
                data-placeholder="true"
              />
              {item.badge && (
                <div className="absolute top-3 left-3">
                  <Badge>{getBadgeLabel(item.badge)}</Badge>
                </div>
              )}
            </div>
            <div className="pt-4 pb-2">
              <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-medium mb-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-3">
                <span className="font-sans text-sm text-black/80">
                  ${item.price}
                </span>
                <Rating value={item.rating} size="sm" />
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
