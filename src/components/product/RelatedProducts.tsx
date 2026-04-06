"use client";

import { Carousel } from "@/components/ui/Carousel";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface RelatedProductsProps {
  products: Product[];
  className?: string;
}

export function RelatedProducts({ products, className }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn("section-padding", className)}>
      <div className="max-container">
        <div className="text-center mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.14em] text-primary mb-3">
            YOU MAY ALSO LIKE
          </p>
          <h2 className="font-heading text-3xl lg:text-4xl">
            Related Products
          </h2>
        </div>

        <Carousel
          slidesPerView={1}
          spaceBetween={24}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          ariaLabel="Related products"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
