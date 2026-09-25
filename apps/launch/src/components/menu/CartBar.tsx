"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/kit/bottom-sheet";
import { QuantityStepper } from "@/components/ui/kit/quantity-stepper";
import { useExtrasCart } from "@/components/menu/use-extras-cart";
import { formatCents } from "@/lib/brand";
import {
  describeExtraOptions,
  extraLineTotalCents,
  extrasCount,
  extrasTotalCents,
  findExtra,
  MAX_EXTRA_QUANTITY,
} from "@/lib/menu-extras";

/**
 * Floating summary of salads and snacks added from the menu, with a review
 * sheet. Sits above the phone tab bar; add-ons join a Soul Bowls™ order.
 */
export function CartBar() {
  const { lines, setQuantity } = useExtrasCart();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const count = extrasCount(lines);

  return (
    <>
      <AnimatePresence>
        {count > 0 ? (
          <motion.div
            initial={reduced ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-3 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.75rem)] z-30 mx-auto max-w-md lg:right-6 lg:bottom-6 lg:left-auto lg:mx-0 lg:w-96"
          >
            <div className="flex items-center gap-2 rounded-full border border-forest/15 bg-forest p-1.5 pl-2 text-oat shadow-[0_18px_40px_-16px_rgb(44_58_52/0.7)]">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="flex min-h-11 flex-1 items-center gap-3 rounded-full px-2 text-left"
              >
                <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-oat/12">
                  <ShoppingBag className="size-4" aria-hidden />
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-gold text-[0.65rem] font-bold text-forest tabular-nums">{count}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">Salads &amp; snacks</span>
                  <span className="block text-xs text-oat/70 tabular-nums">{formatCents(extrasTotalCents(lines))} · review</span>
                </span>
              </button>
              <Link href="/checkout" className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-oat px-4 text-xs font-medium tracking-[0.1em] text-forest uppercase transition-colors hover:bg-sand">
                Checkout
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <BottomSheet
        open={open && count > 0}
        onClose={() => setOpen(false)}
        labelledBy="cart-sheet-title"
        closeLabel="Close your salads and snacks"
        footer={
          <div className="grid gap-2">
            <Button as="a" href="/checkout" size="lg" className="w-full">
              Continue to checkout · {formatCents(extrasTotalCents(lines))}
            </Button>
            <p className="text-center text-xs text-forest/72">Salads and snacks join your Soul Bowls™ order at checkout.</p>
          </div>
        }
      >
        <div className="px-5 pt-10 pb-4 md:px-8 md:pt-8">
          <h2 id="cart-sheet-title" className="pr-12 text-3xl leading-none tracking-[0.01em] text-forest">Your salads &amp; snacks</h2>
          <ul className="mt-5 divide-y divide-forest/10">
            {lines.map((line, index) => {
              const extra = findExtra(line.id);
              if (!extra) return null;
              const options = describeExtraOptions(line);
              return (
                <li key={`${line.id}-${index}`} className="flex gap-3 py-4">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-sand">
                    <Image src={extra.imagePath} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-3">
                      <span className="font-serif text-lg leading-tight text-forest">{extra.name}</span>
                      <span className="shrink-0 text-sm font-semibold text-forest tabular-nums">{formatCents(extraLineTotalCents(line))}</span>
                    </p>
                    {options ? <p className="mt-0.5 text-xs leading-5 text-forest/72">{options}</p> : null}
                    <div className="mt-2 flex items-center gap-2">
                      <QuantityStepper
                        size="sm"
                        groupLabel={`${extra.name} quantity`}
                        decrementLabel={`One fewer ${extra.name}`}
                        incrementLabel={`One more ${extra.name}`}
                        valueLabel={`${line.quantity} ${extra.name}`}
                        value={line.quantity}
                        onDecrement={() => setQuantity(index, line.quantity - 1)}
                        onIncrement={() => setQuantity(index, line.quantity + 1)}
                        decrementDisabled={line.quantity <= 1}
                        incrementDisabled={line.quantity >= MAX_EXTRA_QUANTITY}
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(index, 0)}
                        aria-label={`Remove ${extra.name}`}
                        className="flex size-11 items-center justify-center rounded-full text-forest/72 transition-colors hover:bg-clay/10 hover:text-clay-ink"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </BottomSheet>
    </>
  );
}
