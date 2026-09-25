"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/kit/bottom-sheet";
import { QuantityStepper } from "@/components/ui/kit/quantity-stepper";
import { formatCents } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import {
  DRESSINGS,
  extraLineSchema,
  extraPriceCents,
  MAX_EXTRA_QUANTITY,
  SALAD_BASES,
  SALAD_TOPPINGS,
  TOPPINGS_PER_SALAD,
  TRIO_OPTIONS,
  TRIO_SIZE,
  type ExtraLine,
  type MenuExtra,
} from "@/lib/menu-extras";
import { cn } from "@/lib/utils";
import { FoodGroupList } from "@/components/ui/FoodGroupList";
import { extraIngredients, menuItemIngredients } from "@/lib/food-groups";

type Option = { id: string; name: string; allergen?: string };

/** Single choice as tappable cards (brand adaptation of 21st.dev radio-group-in-card). */
function ChoiceGroup({ legend, options, value, onChange, hint }: { legend: string; options: readonly Option[]; value?: string; onChange: (id: string) => void; hint?: string }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 flex w-full items-baseline justify-between gap-3 text-[0.68rem] font-medium tracking-[0.16em] text-forest/72 uppercase">
        {legend}
        {hint ? <span className="text-[0.68rem] font-semibold tracking-normal text-forest/72 normal-case">{hint}</span> : null}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-clay",
                selected ? "border-forest bg-forest text-oat" : "border-forest/15 bg-card text-forest hover:border-forest/40",
              )}
            >
              <input type="radio" className="sr-only" checked={selected} onChange={() => { haptic(); onChange(option.id); }} />
              <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", selected ? "border-oat bg-oat text-forest" : "border-forest/30")}>
                {selected ? <Check className="size-3" aria-hidden /> : null}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{option.name}</span>
                {option.allergen ? <span className={cn("block text-xs", selected ? "text-oat/75" : "text-clay-ink")}>{option.allergen}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Pick exactly N (brand adaptation of 21st.dev card-style-checkbox). */
function MultiPick({ legend, options, value, limit, onChange }: { legend: string; options: readonly Option[]; value: string[]; limit: number; onChange: (ids: string[]) => void }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 flex w-full items-baseline justify-between gap-3 text-[0.68rem] font-medium tracking-[0.16em] text-forest/72 uppercase">
        {legend}
        <span aria-live="polite" className={cn("rounded-full px-2 py-0.5 text-[0.68rem] tracking-normal normal-case", value.length === limit ? "bg-sage/20 text-forest" : "bg-forest/6 text-forest/72")}>
          {value.length} of {limit} chosen
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option.id);
          const full = !selected && value.length >= limit;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              aria-disabled={full || undefined}
              onClick={() => {
                if (full) return;
                haptic();
                onChange(selected ? value.filter((id) => id !== option.id) : [...value, option.id]);
              }}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                selected ? "border-forest bg-forest text-oat" : full ? "cursor-not-allowed border-forest/10 bg-card text-forest/72" : "border-forest/15 bg-card text-forest hover:border-forest/40",
              )}
            >
              {selected ? <Check className="size-3.5" aria-hidden /> : null}
              {option.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const DRESSING_LEGEND = { dressing: "Dressing", sauce: "Sauce", dip: "Dip", "build-your-own": "Dressing" } as const;

/**
 * Details and choices for a salad, veggie cup, or snack. The Build Your Own
 * Salad walks through base → three toppings → mint → dressing with a live
 * summary; every configuration is validated with the same schema checkout uses.
 */
type SheetProps = {
  onClose: () => void;
  onAdd: (line: ExtraLine) => void;
  orderable?: boolean;
  /** Wording for the primary action, e.g. "Add to estimate" for gatherings. */
  addLabel?: string;
};

export function ExtraSheet({ extra, ...props }: SheetProps & { extra: MenuExtra | null }) {
  if (!extra) return <BottomSheet open={false} onClose={props.onClose} labelledBy="extra-sheet-title" closeLabel="Close item details">{null}</BottomSheet>;
  return <OpenExtraSheet key={extra.id} extra={extra} {...props} />;
}

function OpenExtraSheet({ extra, onClose, onAdd, orderable = true, addLabel = "Add to order" }: SheetProps & { extra: MenuExtra }) {
  const [draft, setDraft] = useState<Partial<ExtraLine>>({ quantity: 1 });
  const set = (patch: Partial<ExtraLine>) => setDraft((current) => ({ ...current, ...patch }));
  const reduced = useReducedMotion();
  const [added, setAdded] = useState(false);
  const line = { ...draft, id: extra.id, quantity: draft.quantity ?? 1 } as ExtraLine;
  const parsed = extraLineSchema.safeParse(stripEmpty(line, extra));
  const price = extraPriceCents(extra.id);
  const byo = extra.options === "build-your-own";

  const footer = !orderable ? (
    <p className="py-1 text-center text-sm leading-6 text-forest/75">
      Online ordering for salads and snacks is coming soon. Ask us about them with your next order.
    </p>
  ) : (
    <div className="flex items-center gap-3">
      <QuantityStepper
        groupLabel={`${extra.name} quantity`}
        decrementLabel={`One fewer ${extra.name}`}
        incrementLabel={`One more ${extra.name}`}
        valueLabel={`${line.quantity} ${extra.name}`}
        value={line.quantity}
        onDecrement={() => set({ quantity: Math.max(1, line.quantity - 1) })}
        onIncrement={() => set({ quantity: Math.min(MAX_EXTRA_QUANTITY, line.quantity + 1) })}
        decrementDisabled={line.quantity <= 1}
        incrementDisabled={line.quantity >= MAX_EXTRA_QUANTITY}
      />
      <Button
        type="button"
        size="lg"
        className="flex-1"
        disabled={!parsed.success || added}
        onClick={() => {
          if (!parsed.success) return;
          haptic([8, 40, 8]);
          onAdd(parsed.data);
          setAdded(true);
          window.setTimeout(onClose, reduced ? 0 : 650);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={added ? "added" : "add"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2">
            {added ? (<><Check className="size-4" aria-hidden /> Added</>) : parsed.success ? `${addLabel} · ${formatCents(price * line.quantity)}` : "Make your choices"}
          </motion.span>
        </AnimatePresence>
      </Button>
    </div>
  );

  return (
    <BottomSheet open onClose={onClose} labelledBy="extra-sheet-title" closeLabel="Close item details" footer={footer}>
      <div className="grid md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-full">
          <Image src={extra.imagePath} alt={`${extra.name} from the Soul Good kitchen`} fill sizes="(min-width: 768px) 300px, 100vw" className="object-cover" />
        </div>
        <div className="grid gap-6 px-5 pt-6 pb-6 md:px-8 md:pt-8">
          <div>
            <p className="text-[0.65rem] font-medium tracking-[0.18em] text-clay-ink uppercase">{formatCents(price)} · {extra.tags.join(" · ")}</p>
            <h2 id="extra-sheet-title" className="mt-2 pr-12 text-4xl leading-none tracking-[0.01em] text-forest">{extra.name}</h2>
            <p className="mt-3 text-sm leading-6 text-forest/75">{extra.description}</p>
          </div>

          {byo ? (
            <>
              <div aria-hidden="true" className="flex gap-1.5">
                {[Boolean(draft.base), (draft.toppings?.length ?? 0) === TOPPINGS_PER_SALAD, true, Boolean(draft.dressing)].map((done, index) => (
                  <span key={index} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", done ? "bg-sage" : "bg-forest/10")} />
                ))}
              </div>
              <ChoiceGroup legend="1 · Choose a base" options={SALAD_BASES} value={draft.base} onChange={(id) => set({ base: id as ExtraLine["base"] })} />
              <MultiPick legend="2 · Choose three toppings" options={SALAD_TOPPINGS} value={draft.toppings ?? []} limit={TOPPINGS_PER_SALAD} onChange={(ids) => set({ toppings: ids as ExtraLine["toppings"] })} />
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-[0.68rem] font-medium tracking-[0.16em] text-forest/72 uppercase">3 · Finish (optional)</legend>
                <button
                  type="button"
                  aria-pressed={Boolean(draft.mint)}
                  onClick={() => { haptic(); set({ mint: !draft.mint }); }}
                  className={cn("inline-flex min-h-11 w-fit items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors", draft.mint ? "border-sage bg-sage-ink text-oat" : "border-forest/15 bg-card text-forest hover:border-forest/40")}
                >
                  <Leaf className="size-4" aria-hidden /> Fresh mint
                </button>
              </fieldset>
            </>
          ) : null}

          {extra.options === "trio" ? (
            <MultiPick legend="Choose three" options={TRIO_OPTIONS} value={draft.trio ?? []} limit={TRIO_SIZE} onChange={(ids) => set({ trio: ids as ExtraLine["trio"] })} />
          ) : null}

          {extra.options !== "none" && extra.options !== "trio" ? (
            <ChoiceGroup
              legend={`${byo ? "4 · " : ""}${DRESSING_LEGEND[extra.options]}`}
              hint={extra.options === "dressing" && !byo ? "Served on the side" : undefined}
              options={DRESSINGS}
              value={draft.dressing}
              onChange={(id) => set({ dressing: id as ExtraLine["dressing"] })}
            />
          ) : null}

          {byo ? (
            <p aria-live="polite" className="rounded-lg border border-dashed border-forest/20 bg-card/70 px-4 py-3 text-sm leading-6 text-forest/80">
              <span className="font-semibold text-forest">Your salad: </span>
              {[
                SALAD_BASES.find((item) => item.id === draft.base)?.name ?? "choose a base",
                ...(draft.toppings ?? []).map((id) => SALAD_TOPPINGS.find((item) => item.id === id)?.name.toLowerCase()),
                draft.mint ? "fresh mint" : null,
                DRESSINGS.find((item) => item.id === draft.dressing)?.name.toLowerCase() ?? null,
              ].filter(Boolean).join(" · ")}
            </p>
          ) : null}

          <div>
            <p className="mb-2 text-[0.68rem] font-medium tracking-[0.16em] text-forest/72 uppercase">By food group</p>
            <FoodGroupList
              items={
                byo || extra.options === "trio"
                  ? extraIngredients(line).length
                    ? extraIngredients(line)
                    : menuItemIngredients(extra.id)
                  : extraIngredients(line)
              }
            />
          </div>

          <p className="text-xs leading-5 text-forest/72">
            Dressings and sauces follow their labels; our kitchen handles other major allergens and cross-contact can occur.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

/** Drop option fields that don't apply so the schema sees a clean line. */
function stripEmpty(line: ExtraLine, extra: MenuExtra): ExtraLine {
  const clean: ExtraLine = { id: line.id, quantity: line.quantity };
  if (extra.options !== "none" && extra.options !== "trio" && line.dressing) clean.dressing = line.dressing;
  if (extra.options === "build-your-own") {
    if (line.base) clean.base = line.base;
    clean.toppings = line.toppings ?? [];
    if (line.mint) clean.mint = true;
  }
  if (extra.options === "trio") clean.trio = line.trio ?? [];
  return clean;
}
