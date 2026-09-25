"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/kit/reveal";
import { ExtraSheet } from "@/components/menu/ExtraSheet";
import { useExtrasCart } from "@/components/menu/use-extras-cart";
import { formatCents } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import {
  EXTRA_CATEGORIES,
  extraPriceCents,
  MENU_EXTRAS,
  SALAD_BASES,
  SALAD_TOPPINGS,
  type MenuExtra,
} from "@/lib/menu-extras";

function ExtraCard({ extra, onOpen }: { extra: MenuExtra; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        haptic();
        onOpen();
      }}
      aria-haspopup="dialog"
      aria-label={`${extra.name}, ${formatCents(extraPriceCents(extra.id))}. ${extra.options === "none" ? "Add to order" : "Choose options"}`}
      className="group/card flex w-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay"
    >
      <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-sand/40">
        <Image
          src={extra.imagePath}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, 46vw"
          className="object-cover transition-transform duration-700 ease-(--ease-soft) group-hover/card:scale-[1.04]"
        />
        <span className="absolute top-2.5 left-2.5 rounded-md bg-oat/92 px-2 py-1 text-xs font-bold text-forest tabular-nums backdrop-blur-sm sm:top-3 sm:left-3">
          {formatCents(extraPriceCents(extra.id))}
        </span>
        <span
          aria-hidden="true"
          className="absolute right-2.5 bottom-2.5 flex size-10 items-center justify-center rounded-full bg-oat/92 text-forest shadow-sm backdrop-blur transition-transform duration-300 group-hover/card:rotate-90 sm:right-3 sm:bottom-3 sm:size-11"
        >
          <Plus className="size-5" />
        </span>
      </span>
      <span className="block pt-3 sm:pt-4">
        <span className="block font-serif text-xl leading-[1.05] tracking-[-0.02em] text-forest sm:text-2xl">{extra.name}</span>
        <span className="mt-1.5 line-clamp-2 block text-[0.8rem] leading-5 text-forest/68 sm:text-sm sm:leading-6">{extra.description}</span>
      </span>
    </button>
  );
}

function BuildYourOwnCard({ extra, onOpen }: { extra: MenuExtra; onOpen: () => void }) {
  return (
    <div className="col-span-2 grid overflow-hidden rounded-lg border border-forest/12 bg-card sm:grid-cols-[1fr_1.1fr] lg:col-span-2">
      <div className="relative aspect-[4/3] sm:aspect-auto">
        <Image src={extra.imagePath} alt="Build-your-own salad ingredients in separate glass bowls" fill sizes="(min-width: 1024px) 24vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
        <div>
          <p className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.18em] text-clay uppercase">
            <Sparkles className="size-3.5" aria-hidden /> Make it yours · {formatCents(extraPriceCents(extra.id))}
          </p>
          <h3 className="mt-2 text-3xl leading-none tracking-[-0.03em] text-forest">{extra.name}</h3>
          <p className="mt-3 text-sm leading-6 text-forest/72">{extra.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
            {[...SALAD_BASES, ...SALAD_TOPPINGS].slice(0, 7).map((item) => (
              <span key={item.id} className="rounded-full border border-forest/12 bg-oat px-2.5 py-1 text-[0.7rem] font-semibold text-forest/70">
                {item.name}
              </span>
            ))}
            <span className="rounded-full px-1 py-1 text-[0.7rem] font-semibold text-forest/50">+ more</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            haptic();
            onOpen();
          }}
          aria-haspopup="dialog"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-forest px-6 text-sm font-bold tracking-[0.12em] text-oat uppercase transition-colors hover:bg-forest/90"
        >
          Build your salad
        </button>
      </div>
    </div>
  );
}

/** Salads, veggie cups, and snacks with an item sheet and the salad builder. */
export function ExtrasMenu() {
  const [open, setOpen] = useState<MenuExtra | null>(null);
  const { add } = useExtrasCart();

  return (
    <>
      {EXTRA_CATEGORIES.map((category) => {
        const items = MENU_EXTRAS.filter((item) => item.category === category.id);
        return (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-heading`} className="scroll-mt-36 border-t border-forest/10 py-14 sm:py-20">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
              <Reveal className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">{category.eyebrow}</p>
                  <h2 id={`${category.id}-heading`} className="mt-3 text-4xl leading-none font-normal tracking-[-0.045em] text-forest sm:text-5xl">
                    {category.title}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-forest/70">{category.blurb}</p>
              </Reveal>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
                {items.map((extra) =>
                  extra.options === "build-your-own" ? (
                    <BuildYourOwnCard key={extra.id} extra={extra} onOpen={() => setOpen(extra)} />
                  ) : (
                    <ExtraCard key={extra.id} extra={extra} onOpen={() => setOpen(extra)} />
                  ),
                )}
              </div>
            </div>
          </section>
        );
      })}
      <ExtraSheet extra={open} onClose={() => setOpen(null)} onAdd={add} />
    </>
  );
}
