"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function getBadgeLabel(badge: Product["badge"]): string {
  switch (badge) {
    case "best-seller":
      return "BEST SELLER";
    case "coming-soon":
      return "COMING SOON";
    case "bundle-save":
      return "BUNDLE & SAVE";
    default:
      return "";
  }
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSecondaryImage = product.images.length > 1;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn("group block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F7F7]">
        {/* Primary Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-opacity duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
            isHovered && hasSecondaryImage ? "opacity-0" : "opacity-100"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          data-placeholder="true"
        />

        {/* Secondary Image (shown on hover) */}
        {hasSecondaryImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} - alternate view`}
            fill
            className={cn(
              "object-cover transition-opacity duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-placeholder="true"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge>{getBadgeLabel(product.badge)}</Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-4 pb-2">
        <h3 className="font-sans text-sm uppercase tracking-[0.06em] font-medium mb-1">
          {product.name}
        </h3>
        <p className="font-body text-sm text-black/60 mb-2">
          {product.subtitle}
        </p>
        <div className="flex items-center gap-3">
          <Rating value={product.rating} size="sm" />
          <span className="font-sans text-xs text-black/50">
            ({product.reviewCount})
          </span>
        </div>
        <p className="font-sans text-sm font-medium mt-2">
          ${product.price}
        </p>
      </div>
    </Link>
  );
}
