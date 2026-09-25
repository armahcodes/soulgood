"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { formatCents } from "@/lib/brand";
import { CULINARY_PRICING } from "@/lib/culinary-booking";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";
import { MENU_COLLECTION_LIST } from "@/lib/menu";
import { extraPriceCents, MENU_EXTRAS, type ExtraCategory } from "@/lib/menu-extras";
import { cn } from "@/lib/utils";

type TabId = "bowls" | ExtraCategory | "collections";

const TABS: { id: TabId; label: string; note: string }[] = [
  { id: "bowls", label: "Soul Bowls™", note: `${formatCents(CULINARY_PRICING.bowlUnitCents)} per 32 oz bowl · from ${CULINARY_PRICING.deliveryMinimumBowls} bowls for delivery` },
  { id: "salads", label: "Salads", note: "Made to order with your choice of Soul Good dressing · add to any bowl delivery" },
  { id: "veggie-cups", label: "Veggie cups", note: "Colorful, portioned bites · add to any bowl delivery" },
  { id: "snacks", label: "Snacks & bites", note: "Bold, shareable, roasted and raw · add to any bowl delivery" },
  { id: "collections", label: "Pathway collections", note: "Wraps, breakfast, and juices by pathway · available by request" },
];

/**
 * Everything we make for gatherings, in one tabbed menu (brand adaptation of
 * 21st.dev ruixen.ui/pill-morph-tabs with a sliding active pill).
 */
export function GatheringsMenu() {
  const [tab, setTab] = useState<TabId>("bowls");
  const reduced = useReducedMotion();
  const active = TABS.find((item) => item.id === tab)!;

  return (
    <div>
      <div role="tablist" aria-label="Gatherings menu" className="scrollbar-none -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:justify-center sm:px-0">
        <div className="inline-flex shrink-0 gap-1 rounded-full border border-forest/12 bg-card p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`gm-tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls="gm-panel"
              onClick={() => setTab(item.id)}
              className={cn(
                "relative inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
                tab === item.id ? "text-oat" : "text-forest/70 hover:text-forest",
              )}
            >
              {tab === item.id ? (
                <motion.span layoutId="gm-pill" className="absolute inset-0 rounded-full bg-forest" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} />
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-forest/65">{active.note}</p>

      <div id="gm-panel" role="tabpanel" aria-labelledby={`gm-tab-${tab}`} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "collections" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {MENU_COLLECTION_LIST.map((collection) => (
                  <div key={collection.id} className="rounded-lg border border-forest/12 bg-oat p-5">
                    <p className="text-[0.65rem] font-bold tracking-[0.18em] text-sage uppercase">{collection.tagline}</p>
                    <h3 className="mt-2 font-serif text-3xl leading-none text-forest">{collection.name}</h3>
                    <dl className="mt-4 grid gap-3 border-t border-forest/10 pt-4">
                      {collection.categories.map((category) => (
                        <div key={category.id}>
                          <dt className="text-[0.65rem] font-bold tracking-[0.14em] text-forest/55 uppercase">{category.label}</dt>
                          <dd className="mt-1 text-sm leading-6 text-forest/80">
                            {category.items.map((item) => `${item.name}${item.note ? ` (${item.note})` : ""}`).join(" · ")}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
                {(tab === "bowls"
                  ? AVAILABLE_BOWLS.map((bowl) => ({ id: bowl.id, name: bowl.name, description: bowl.ingredients, image: bowl.imagePath, price: CULINARY_PRICING.bowlUnitCents, api: true }))
                  : MENU_EXTRAS.filter((item) => item.category === tab).map((item) => ({ id: item.id, name: item.name, description: item.description, image: item.imagePath, price: extraPriceCents(item.id), api: false }))
                ).map((item) => (
                  <li key={item.id}>
                    <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-sand/40">
                      <Image src={item.image} alt="" fill unoptimized={item.api} sizes="(min-width: 1024px) 22vw, 46vw" className="object-cover" />
                      <span className="absolute top-2.5 left-2.5 rounded-md bg-oat/92 px-2 py-1 text-xs font-bold text-forest tabular-nums backdrop-blur-sm">
                        {formatCents(item.price)}
                      </span>
                    </span>
                    <span className="mt-3 block font-serif text-xl leading-[1.05] tracking-[-0.02em] text-forest sm:text-2xl">{item.name}</span>
                    <span className="mt-1.5 line-clamp-3 block text-[0.8rem] leading-5 text-forest/68 sm:text-sm sm:leading-6">{item.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-5 text-forest/60">
        Salads, veggie cups, and snacks can be added to any bowl-delivery estimate. Interested in pathway wraps,
        breakfast, or juices? Add a note in the final step and our team will follow up. Our kitchen handles common
        allergens; every dietary request is confirmed before booking.
      </p>
    </div>
  );
}
