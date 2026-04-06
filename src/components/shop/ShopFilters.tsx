"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export type ProductCategory = "all" | "seasonings" | "juices" | "bundles";
export type SortOption = "featured" | "price-low-high" | "price-high-low";

interface ShopFiltersProps {
  activeCategory: ProductCategory;
  activeSort: SortOption;
  onCategoryChange: (category: ProductCategory) => void;
  onSortChange: (sort: SortOption) => void;
  productCount: number;
}

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: "All", value: "all" },
  { label: "Seasonings", value: "seasonings" },
  { label: "Juices", value: "juices" },
  { label: "Bundles", value: "bundles" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low-high" },
  { label: "Price: High to Low", value: "price-high-low" },
];

export function ShopFilters({
  activeCategory,
  activeSort,
  onCategoryChange,
  onSortChange,
  productCount,
}: ShopFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 mb-8">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              "font-sans text-xs uppercase tracking-[0.06em] font-medium px-5 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] border",
              activeCategory === cat.value
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-border hover:border-black"
            )}
          >
            {cat.label}
          </button>
        ))}
        <span className="font-sans text-xs text-black/50 ml-2">
          {productCount} {productCount === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
        <label htmlFor="sort-select" className="sr-only">
          Sort products
        </label>
        <select
          id="sort-select"
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none bg-transparent font-sans text-xs uppercase tracking-[0.06em] font-medium pr-8 pl-3 py-2.5 border border-border cursor-pointer hover:border-black transition-colors duration-300 focus:outline-none focus:border-black"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
      </div>
    </div>
  );
}
