"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AVAILABLE_BOWLS,
  SOLD_OUT_BOWLS,
  type BowlId,
  type CurrentBowl,
} from "@/lib/current-offer";
import { bowlSelectionTotal, type BowlSelection } from "@/lib/bowl-selection";
import {
  balancedCulinarySelection,
  CULINARY_PRICING,
  MAX_CULINARY_BOWLS,
} from "@/lib/culinary-booking";
import { recipeName } from "@/lib/culinary-menu";
import { formatCents } from "@/lib/brand";

const CONTROL =
  "flex h-11 w-11 shrink-0 items-center justify-center text-forest transition-colors hover:bg-sage/15 focus-visible:outline-2 focus-visible:outline-clay disabled:opacity-30";

function RecipeDialog({
  bowl,
  onClose,
}: {
  bowl: CurrentBowl;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      opener?.focus({ preventScroll: true });
    };
  }, []);
  function close() {
    ref.current?.close();
    onClose();
  }
  return (
    <dialog
      ref={ref}
      aria-labelledby="recipe-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          close();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto border border-forest/20 bg-oat p-5 text-forest shadow-xl backdrop:bg-forest/55 sm:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-clay">
            Soul Bowls™ · Meet your recipe
          </p>
          <h3 id="recipe-dialog-title" className="mt-2 font-serif text-3xl">
            {recipeName(bowl.name)}
          </h3>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close recipe details"
          className={CONTROL}
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-5 flex flex-wrap items-start gap-5">
        <div className="relative h-36 w-28 shrink-0 overflow-hidden bg-sand/30">
          <Image
            src={`/products/${bowl.id}.webp`}
            alt={bowl.name}
            fill
            sizes="112px"
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="min-w-[120px] flex-1 text-sm leading-6">
          <p className="font-semibold">Ingredients</p>
          <p>{bowl.ingredients}</p>
          {bowl.allergen && (
            <p className="mt-3 font-semibold">{bowl.allergen}.</p>
          )}
        </div>
      </div>
      <p className="mt-5 text-sm leading-6">
        A generous 32 oz jar, ready for your gathering.
      </p>
      <p className="mt-3 text-sm leading-6 text-forest/75">
        Tell us about allergies before booking. We cannot guarantee an
        allergen-free kitchen. Dietary requests are confirmed by our team.
      </p>
      <Button type="button" onClick={close} className="mt-6 w-full">
        Back to my menu
      </Button>
    </dialog>
  );
}

export function CulinaryMenu({
  selection,
  onQuantity,
  onChange,
  undo,
  onUndo,
}: {
  selection: BowlSelection;
  onQuantity: (id: BowlId, value: number) => void;
  onChange: (selection: BowlSelection, message: string) => void;
  undo?: { message: string } | null;
  onUndo: () => void;
}) {
  const [recipe, setRecipe] = useState<CurrentBowl | null>(null);
  const count = bowlSelectionTotal(selection);
  const complete =
    count >= CULINARY_PRICING.deliveryMinimumBowls &&
    count <= MAX_CULINARY_BOWLS;
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="menu-title" className="font-serif text-3xl">
          Choose your recipes.
        </h2>
        <span
          className="inline-flex items-center gap-2 text-sm font-semibold"
          role="status"
        >
          {complete && <Check size={17} aria-hidden="true" />}
          {count} bowls selected
        </span>
      </div>
      <p className="mb-4 text-sm leading-6 text-forest/75">
        {formatCents(CULINARY_PRICING.bowlUnitCents)} per 32 oz bowl · Minimum
        10. We’ve started you with a balanced menu.
      </p>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-y border-forest/15 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest/65">
          Soul Bowls™ · Current menu
        </p>
        <label className="flex items-center gap-2 text-sm">
          Balanced menu
          <select
            aria-label="Balanced menu size"
            value=""
            onChange={(event) =>
              onChange(
                balancedCulinarySelection(Number(event.target.value)),
                `Balanced menu set to ${event.target.value} bowls.`,
              )
            }
            className="min-h-11 border border-forest/20 bg-white/60 px-2 text-base"
          >
            <option value="" disabled>
              Choose size
            </option>
            {[10, 20, 30, 50].map((value) => (
              <option value={value} key={value}>
                {value} bowls
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="divide-y divide-forest/15 border-y border-forest/15 bg-white/30">
        {AVAILABLE_BOWLS.map((bowl) => (
          <article
            key={bowl.id}
            className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-3 gap-y-1 px-3 py-3 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:gap-x-4"
          >
            <div className="relative row-span-2 h-16 overflow-hidden bg-sand/30 sm:h-[72px]">
              <Image
                src={`/products/${bowl.id}.webp`}
                alt={bowl.name}
                fill
                sizes="56px"
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="min-w-0 self-center">
              <h3
                className="font-serif text-xl leading-tight"
                aria-label={bowl.name}
              >
                {recipeName(bowl.name)}
              </h3>
              {bowl.allergen && (
                <p className="mt-1 text-xs text-forest/75">{bowl.allergen}</p>
              )}
            </div>
            <div className="col-start-2 row-start-2">
              <button
                type="button"
                aria-label={`Ingredients & details for ${bowl.name}`}
                onClick={() => setRecipe(bowl)}
                className="min-h-11 text-xs font-semibold underline underline-offset-4"
              >
                Ingredients & details
              </button>
            </div>
            <div className="col-start-2 flex items-center justify-start sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:justify-end">
              <div className="flex border border-forest/20 bg-white/70">
                <button
                  type="button"
                  aria-label={`Remove one ${bowl.name}`}
                  disabled={selection[bowl.id] === 0}
                  onClick={() => onQuantity(bowl.id, selection[bowl.id] - 1)}
                  className={CONTROL}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <input
                  aria-label={`${bowl.name} quantity`}
                  type="number"
                  min={0}
                  max={MAX_CULINARY_BOWLS - count + selection[bowl.id]}
                  step={1}
                  inputMode="numeric"
                  value={selection[bowl.id]}
                  onChange={(event) =>
                    onQuantity(bowl.id, Number(event.target.value))
                  }
                  className="h-11 w-14 min-w-0 border-x border-forest/15 bg-transparent text-center text-base font-semibold focus-visible:outline-2 focus-visible:outline-clay [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  aria-label={`Add one ${bowl.name}`}
                  disabled={count >= MAX_CULINARY_BOWLS}
                  onClick={() => onQuantity(bowl.id, selection[bowl.id] + 1)}
                  className={CONTROL}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {SOLD_OUT_BOWLS.length > 0 && (
        <p className="mt-3 text-xs leading-6 text-forest/65">
          Currently sold out:{" "}
          {SOLD_OUT_BOWLS.map((bowl) => recipeName(bowl.name)).join(", ")}. Not
          included in your menu.
        </p>
      )}
      {undo && (
        <div className="mt-3 flex items-center justify-between gap-3 bg-sage/15 px-3 py-2 text-sm">
          <span role="status">{undo.message}</span>
          <button
            type="button"
            onClick={onUndo}
            className="min-h-11 shrink-0 font-semibold underline underline-offset-4"
          >
            Undo
          </button>
        </div>
      )}
      {!complete && (
        <p className="mt-3 text-sm font-semibold text-clay" role="status">
          Select at least 10 bowls for delivery.
        </p>
      )}
      {recipe && <RecipeDialog bowl={recipe} onClose={() => setRecipe(null)} />}
    </>
  );
}
