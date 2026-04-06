"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ImageGallery } from "./ImageGallery";
import { BuyingPanel } from "./BuyingPanel";
import { TrustBadges } from "./TrustBadges";
import { RelatedProducts } from "./RelatedProducts";
import type { Product } from "@/lib/types";

interface PDPContentProps {
  product: Product;
  relatedProducts: Product[];
}

export function PDPContent({ product, relatedProducts }: PDPContentProps) {
  return (
    <div>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-container px-6 lg:px-8 py-4 border-b border-border"
      >
        <ol className="flex items-center gap-1.5 font-sans text-xs text-black/50">
          <li>
            <Link
              href="/"
              className="hover:text-black transition-colors duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3" />
          </li>
          <li>
            <Link
              href="/shop"
              className="hover:text-black transition-colors duration-300"
            >
              Shop
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3 h-3" />
          </li>
          <li className="text-black font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Main PDP Layout: Two Columns */}
      <div className="max-container px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Image Gallery */}
          <ImageGallery
            images={product.images}
            productName={product.name}
          />

          {/* Right: Buying Panel */}
          <BuyingPanel product={product} />
        </div>

        {/* Trust Badges */}
        <TrustBadges className="mt-12" />
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
