"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

const DELIVERY_FEE = 11.95;

export function CartContent() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const orderTotal = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  function handleCheckout() {
    // TODO: Backend Integration - Submit cart data to checkout API
    console.log("Checkout:", {
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity,
      })),
      subtotal,
      delivery: DELIVERY_FEE,
      total: orderTotal,
    });
  }

  return (
    <div className="max-container section-padding">
      {/* Page Header */}
      <h1 className="font-heading text-4xl md:text-5xl mb-10">Your Cart</h1>

      {items.length === 0 ? (
        /* ──────── Empty State ──────── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-black/15 mb-6" />
          <p className="font-body text-lg text-black/60 mb-8">
            Your cart is empty
          </p>
          <Button as="a" href="/shop" variant="primary">
            Continue Shopping
          </Button>
        </div>
      ) : (
        /* ──────── Cart with Items ──────── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column — Line Items */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Column header (desktop) */}
            <div className="hidden md:grid md:grid-cols-[1fr_120px_120px_120px_40px] gap-4 pb-4 border-b border-border font-sans text-[11px] uppercase tracking-[0.06em] text-black/50 font-medium">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Unit Price</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            <ul>
              {items.map((item) => {
                const lineTotal = item.product.price * item.quantity;

                return (
                  <li
                    key={item.product.id}
                    className="py-6 border-b border-border"
                  >
                    {/* Desktop row */}
                    <div className="hidden md:grid md:grid-cols-[1fr_120px_120px_120px_40px] gap-4 items-center">
                      {/* Product Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 bg-gray-light flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            data-placeholder="true"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-sans text-xs uppercase tracking-[0.06em] font-semibold truncate">
                            {item.product.name}
                          </h3>
                          <p className="font-body text-xs text-black/50 mt-1">
                            {item.product.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="p-2 hover:bg-cream transition-colors duration-300"
                            aria-label={`Decrease quantity of ${item.product.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-sans text-xs font-medium min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="p-2 hover:bg-cream transition-colors duration-300"
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <span className="font-sans text-sm text-right">
                        ${item.product.price.toFixed(2)}
                      </span>

                      {/* Line Total */}
                      <span className="font-sans text-sm font-semibold text-right">
                        ${lineTotal.toFixed(2)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 hover:bg-cream transition-colors duration-300 justify-self-center"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <X className="w-4 h-4 text-black/40 hover:text-black" />
                      </button>
                    </div>

                    {/* Mobile row */}
                    <div className="flex gap-4 md:hidden">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-gray-light flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          data-placeholder="true"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-sans text-xs uppercase tracking-[0.06em] font-semibold truncate">
                              {item.product.name}
                            </h3>
                            <p className="font-body text-xs text-black/50 mt-0.5">
                              {item.product.subtitle}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 hover:bg-cream transition-colors duration-300 flex-shrink-0"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <X className="w-4 h-4 text-black/40" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
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

                          {/* Price */}
                          <span className="font-sans text-sm font-semibold">
                            ${lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Column — Order Summary (sticky) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="bg-cream-dark p-6 md:p-8">
                <h2 className="font-sans text-sm uppercase tracking-[0.06em] font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-black/70">
                      Subtotal
                    </span>
                    <span className="font-sans text-sm">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-black/70">
                      Estimated Delivery
                    </span>
                    <span className="font-sans text-sm">
                      ${DELIVERY_FEE.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mb-6">
                  <span className="font-sans text-sm uppercase tracking-[0.06em] font-semibold">
                    Order Total
                  </span>
                  <span className="font-sans text-lg font-semibold">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>

                <Button className="w-full" onClick={handleCheckout}>
                  Checkout
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href="/shop"
                    className="font-sans text-xs uppercase tracking-[0.06em] text-black/50 hover:text-black transition-colors duration-300 underline underline-offset-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
