"use client";

import { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  ShopFilters,
  type ProductCategory,
  type SortOption,
} from "@/components/shop/ShopFilters";

// TODO: Backend Integration - Replace with API call to fetch products
// TODO: Backend Integration - Add server-side filtering/sorting with URL search params

export function ShopContent() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [activeSort, setActiveSort] = useState<SortOption>("featured");

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...PRODUCTS];

    // Filter by category
    if (activeCategory !== "all") {
      products = products.filter((p) => p.category === activeCategory);
    }

    // Sort
    switch (activeSort) {
      case "price-low-high":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        products.sort((a, b) => b.price - a.price);
        break;
      case "featured":
      default:
        // Featured order: best-sellers first, then by rating
        products.sort((a, b) => {
          if (a.badge === "best-seller" && b.badge !== "best-seller") return -1;
          if (b.badge === "best-seller" && a.badge !== "best-seller") return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return products;
  }, [activeCategory, activeSort]);

  return (
    <main className="flex-1">
      {/* Page Header + Filters + Product Grid */}
      <section className="section-padding max-container">
        <div className="mb-8">
          <p className="label-text text-primary mb-3 text-xs tracking-widest">
            SOUL GOOD
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem]">
            Shop All
          </h1>
        </div>

        <ShopFilters
          activeCategory={activeCategory}
          activeSort={activeSort}
          onCategoryChange={setActiveCategory}
          onSortChange={setActiveSort}
          productCount={filteredAndSortedProducts.length}
        />

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-body text-lg text-black/60 mb-4">
              No products found in this category.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="font-sans text-sm uppercase tracking-[0.06em] font-medium text-primary hover:text-primary-dark underline underline-offset-4 decoration-1 transition-colors duration-300"
            >
              View All Products
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
