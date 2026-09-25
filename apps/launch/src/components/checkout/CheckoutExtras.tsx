"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ExtraSheet } from "@/components/menu/ExtraSheet";
import { useExtrasCart } from "@/components/menu/use-extras-cart";
import { QuantityStepper } from "@/components/ui/kit/quantity-stepper";
import { formatCents } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import {
  describeExtraOptions,
  extraLineTotalCents,
  extraPriceCents,
  extrasTotalCents,
  findExtra,
  MAX_EXTRA_QUANTITY,
  MENU_EXTRAS,
  type MenuExtra,
} from "@/lib/menu-extras";
import { cn } from "@/lib/utils";

const SUGGESTED = ["build-your-own-salad", "rainbow-crunch", "smoky-sweet-potato-salad", "jerk-cauliflower-bites", "crunch-cup", "veggie-tasting-trio"];

/**
 * Optional salads and snacks inside checkout: review what was added from the
 * menu, adjust quantities, or add more without leaving the page.
 */
export function CheckoutExtras({ disabled, weekly, className }: { disabled?: boolean; weekly: boolean; className?: string }) {
  const { lines, add, setQuantity } = useExtrasCart();
  const [open, setOpen] = useState<MenuExtra | null>(null);
  const suggestions = SUGGESTED.map((id) => MENU_EXTRAS.find((item) => item.id === id)).filter(Boolean) as MenuExtra[];

  return (
    <fieldset id="step-extras" className={cn("min-w-0 scroll-mt-40", className)} disabled={disabled}>
      <legend className="sr-only">Optional · Salads and snacks</legend>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p aria-hidden="true" className="flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] text-forest/70 uppercase">
            <span className="flex size-6 items-center justify-center rounded-full border border-forest/25 text-[0.65rem] text-forest">+</span>
            Add salads &amp; snacks
            <span className="rounded-full bg-forest/6 px-2 py-0.5 text-[0.6rem] tracking-[0.1em] text-forest/60">Optional</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-forest/68">
            Made-to-order salads, veggie cups, and snacks, prepared with your bowls.
            {weekly && lines.length ? " On a weekly plan they repeat with every delivery." : ""}
          </p>
        </div>
        {lines.length ? (
          <span className="shrink-0 rounded-md bg-forest/6 px-2.5 py-1 text-sm font-bold text-forest tabular-nums">{formatCents(extrasTotalCents(lines))}</span>
        ) : null}
      </div>

      {lines.length ? (
        <ul className="mt-4 divide-y divide-forest/10 rounded-lg border border-forest/12 bg-white/60 px-4">
          {lines.map((line, index) => {
            const extra = findExtra(line.id);
            if (!extra) return null;
            const options = describeExtraOptions(line);
            return (
              <li key={`${line.id}-${index}`} className="flex gap-3 py-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-sand">
                  <Image src={extra.imagePath} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-semibold text-forest">{extra.name}</span>
                    <span className="shrink-0 text-xs font-semibold text-forest/70 tabular-nums">{formatCents(extraLineTotalCents(line))}</span>
                  </p>
                  {options ? <p className="text-xs leading-5 text-forest/60">{options}</p> : null}
                  <div className="mt-2 flex items-center gap-1">
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
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-forest/55 transition-colors hover:bg-clay/10 hover:text-clay"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="scrollbar-none mt-4 flex snap-x gap-3 overflow-x-auto pb-1">
        {suggestions.map((extra) => (
          <button
            key={extra.id}
            type="button"
            onClick={() => {
              haptic();
              setOpen(extra);
            }}
            aria-haspopup="dialog"
            aria-label={`Add ${extra.name}, ${formatCents(extraPriceCents(extra.id))}`}
            className="group/add flex w-32 shrink-0 snap-start flex-col text-left"
          >
            <span className="relative block aspect-square w-full overflow-hidden rounded-md bg-sand/40">
              <Image src={extra.imagePath} alt="" fill sizes="128px" className="object-cover transition-transform duration-500 group-hover/add:scale-105" />
              <span aria-hidden="true" className="absolute right-1.5 bottom-1.5 flex size-8 items-center justify-center rounded-full bg-oat/92 text-forest shadow-sm">
                <Plus className="size-4" />
              </span>
            </span>
            <span className="mt-1.5 line-clamp-1 text-xs font-semibold text-forest">{extra.name}</span>
            <span className="text-xs text-forest/60 tabular-nums">{formatCents(extraPriceCents(extra.id))}</span>
          </button>
        ))}
        <Link href="/menu#salads" className="flex w-32 shrink-0 snap-start flex-col items-center justify-center rounded-md border border-dashed border-forest/20 text-center text-xs font-semibold text-forest underline-offset-4 hover:underline">
          See the full menu
        </Link>
      </div>

      <ExtraSheet extra={open} onClose={() => setOpen(null)} onAdd={add} />
    </fieldset>
  );
}
