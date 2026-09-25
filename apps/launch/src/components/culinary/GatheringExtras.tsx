"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ExtraSheet } from "@/components/menu/ExtraSheet";
import { QuantityStepper } from "@/components/ui/kit/quantity-stepper";
import { formatCents } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import {
  addExtraLine,
  describeExtraOptions,
  EXTRA_CATEGORIES,
  extraLineTotalCents,
  extraPriceCents,
  extrasTotalCents,
  findExtra,
  MAX_EXTRA_QUANTITY,
  MENU_EXTRAS,
  type ExtraLine,
  type MenuExtra,
} from "@/lib/menu-extras";
import { cn } from "@/lib/utils";

/**
 * Optional salads, veggie cups, and snacks for a bowl-delivery gathering, at
 * menu prices. Choices open the same item sheet as the menu (with the salad
 * builder), and the list stays with this estimate — not the retail cart.
 */
export function GatheringExtras({ lines, onChange }: { lines: ExtraLine[]; onChange: (lines: ExtraLine[]) => void }) {
  const [open, setOpen] = useState<MenuExtra | null>(null);
  const [category, setCategory] = useState(EXTRA_CATEGORIES[0].id);
  const items = MENU_EXTRAS.filter((item) => item.category === category);

  const setQuantity = (index: number, quantity: number) =>
    onChange(
      lines
        .map((line, i) => (i === index ? { ...line, quantity: Math.min(MAX_EXTRA_QUANTITY, quantity) } : line))
        .filter((line) => line.quantity > 0),
    );

  return (
    <section aria-labelledby="gathering-extras-title" className="mt-8 border-t border-forest/15 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-clay uppercase">Optional · menu prices</p>
          <h3 id="gathering-extras-title" className="mt-1 font-serif text-2xl text-forest sm:text-3xl">Add salads &amp; snacks</h3>
          <p className="mt-1 text-sm leading-6 text-forest/70">
            Made-to-order salads, veggie cups, and shareable bites, delivered with your bowls.
          </p>
        </div>
        {lines.length ? (
          <span className="rounded-md bg-forest/6 px-2.5 py-1 text-sm font-bold text-forest tabular-nums">{formatCents(extrasTotalCents(lines))}</span>
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
                      aria-label={`Take ${extra.name} off the estimate`}
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

      <div role="tablist" aria-label="Salads and snacks categories" className="scrollbar-none mt-5 flex gap-1.5 overflow-x-auto">
        {EXTRA_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={category === item.id}
            onClick={() => setCategory(item.id)}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors",
              category === item.id ? "bg-forest text-oat" : "border border-forest/15 bg-card text-forest/75 hover:border-forest/40",
            )}
          >
            {item.id === "snacks" ? "Snacks & bites" : item.title}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
        {items.map((extra) => (
          <button
            key={extra.id}
            type="button"
            onClick={() => {
              haptic();
              setOpen(extra);
            }}
            aria-haspopup="dialog"
            aria-label={`Add ${extra.name}, ${formatCents(extraPriceCents(extra.id))} each`}
            className="group/add flex items-center gap-3 rounded-lg border border-forest/12 bg-white/60 p-2 text-left transition-colors hover:border-forest/35"
          >
            <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-sand/40">
              <Image src={extra.imagePath} alt="" fill sizes="56px" className="object-cover transition-transform duration-500 group-hover/add:scale-105" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 block text-sm leading-tight font-semibold text-forest">{extra.name}</span>
              <span className="mt-0.5 block text-xs text-forest/60 tabular-nums">{formatCents(extraPriceCents(extra.id))}</span>
            </span>
            <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-forest/6 text-forest transition-colors group-hover/add:bg-forest group-hover/add:text-oat">
              <Plus className="size-4" />
            </span>
          </button>
        ))}
      </div>

      <ExtraSheet extra={open} onClose={() => setOpen(null)} onAdd={(line) => onChange(addExtraLine(lines, line))} addLabel="Add to estimate" />
    </section>
  );
}
