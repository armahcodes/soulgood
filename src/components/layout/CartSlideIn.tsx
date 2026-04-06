"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

interface CartSlideInProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSlideIn({ isOpen, onClose }: CartSlideInProps) {
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCart();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-sans text-sm uppercase tracking-[0.06em] font-semibold">
            Your Cart ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-cream transition-colors duration-300"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-black/20 mb-4" />
              <p className="font-body text-base text-black/60 mb-2">
                Your cart is empty
              </p>
              <p className="font-body text-sm text-black/40 mb-6">
                Add items to your cart to see them here.
              </p>
              <Button as="a" href="/shop" variant="secondary" size="sm" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 pb-6 border-b border-border last:border-0"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-24 bg-gray-light flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      data-placeholder="true"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans text-xs uppercase tracking-[0.06em] font-semibold mb-1 truncate">
                      {item.product.name}
                    </h3>
                    <p className="font-body text-xs text-black/50 mb-3">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="p-1.5 hover:bg-cream transition-colors duration-300"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-sans text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="p-1.5 hover:bg-cream transition-colors duration-300"
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="font-sans text-[10px] uppercase tracking-[0.06em] text-black/50 hover:text-black transition-colors duration-300 underline underline-offset-2"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs uppercase tracking-[0.06em] font-medium">
                Subtotal
              </span>
              <span className="font-sans text-sm font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <Button as="a" href="/cart" className="w-full mb-3" onClick={onClose}>View Cart</Button>
            <button
              onClick={() => {
                // TODO: Backend Integration - Navigate to checkout
                console.log("Checkout clicked", { items, subtotal });
              }}
              className="w-full font-sans text-[11px] uppercase tracking-[0.06em] text-black/50 hover:text-black transition-colors duration-300 text-center py-2 underline underline-offset-2"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
