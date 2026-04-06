"use client";

import { useState, useCallback } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { Accordion } from "@/components/ui/Accordion";
import type { AccordionItemData } from "@/components/ui/Accordion";
import type { Product } from "@/lib/types";

interface BuyingPanelProps {
  product: Product;
  className?: string;
}

export function BuyingPanel({ product, className }: BuyingPanelProps) {
  const [isSubscription, setIsSubscription] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  const currentPrice = isSubscription
    ? product.subscriptionPrice
    : product.price;

  const handleAddToCart = useCallback(() => {
    addItem(product, quantity);
    openCart();
    // TODO: Backend Integration - Replace with real cart API
    console.log("Added to cart:", {
      product: product.name,
      quantity,
      isSubscription,
      price: currentPrice,
    });
  }, [addItem, openCart, product, quantity, isSubscription, currentPrice]);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const accordionItems: AccordionItemData[] = [
    {
      id: "benefits",
      title: "Benefits",
      content: product.benefits.join(". ") + ".",
    },
    {
      id: "how-to-use",
      title: "How to Use",
      content: product.howToUse,
    },
    {
      id: "ingredients",
      title: "Ingredients",
      content: product.ingredients,
    },
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Product Name */}
      <h1 className="font-sans text-lg uppercase tracking-[0.06em] font-semibold mb-2">
        {product.name}
      </h1>

      {/* Subtitle */}
      <p className="font-body text-base text-black/60 mb-4">
        {product.subtitle}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-6">
        <Rating value={product.rating} size="sm" />
        <a
          href="#reviews"
          className="font-sans text-xs text-black/50 hover:text-black transition-colors duration-300 underline underline-offset-2"
        >
          {product.reviewCount} reviews
        </a>
      </div>

      {/* Subscription / One-Time Toggle */}
      <div className="mb-6">
        <div className="flex flex-col gap-3">
          {/* Subscription Option */}
          <button
            type="button"
            onClick={() => setIsSubscription(true)}
            className={cn(
              "flex items-center justify-between w-full p-4 border transition-all duration-300",
              isSubscription
                ? "border-black bg-cream"
                : "border-border hover:border-black/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-4 h-4 border-2 flex items-center justify-center transition-colors duration-300",
                  isSubscription ? "border-black" : "border-border"
                )}
              >
                {isSubscription && (
                  <div className="w-2 h-2 bg-black" />
                )}
              </div>
              <div className="text-left">
                <span className="font-sans text-sm font-medium block">
                  Subscribe & Save 15%
                </span>
                <span className="font-body text-xs text-black/50">
                  Auto-delivers on your schedule
                </span>
              </div>
            </div>
            <span className="font-sans text-sm font-semibold">
              ${product.subscriptionPrice.toFixed(2)}
            </span>
          </button>

          {/* One-Time Option */}
          <button
            type="button"
            onClick={() => setIsSubscription(false)}
            className={cn(
              "flex items-center justify-between w-full p-4 border transition-all duration-300",
              !isSubscription
                ? "border-black bg-cream"
                : "border-border hover:border-black/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-4 h-4 border-2 flex items-center justify-center transition-colors duration-300",
                  !isSubscription ? "border-black" : "border-border"
                )}
              >
                {!isSubscription && (
                  <div className="w-2 h-2 bg-black" />
                )}
              </div>
              <span className="font-sans text-sm font-medium">
                One-Time Purchase
              </span>
            </div>
            <span className="font-sans text-sm font-semibold">
              ${product.price.toFixed(2)}
            </span>
          </button>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-sans text-xs uppercase tracking-[0.06em] font-medium">
          Quantity
        </span>
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1}
            className="p-3 hover:bg-cream transition-colors duration-300 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-5 font-sans text-sm font-medium min-w-[48px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="p-3 hover:bg-cream transition-colors duration-300"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        className="w-full mb-8"
        disabled={!product.inStock}
      >
        {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
      </Button>

      {/* Accordion Sections */}
      <Accordion items={accordionItems} />
    </div>
  );
}
