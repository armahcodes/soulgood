"use client";

import Image from "next/image";
import {
  bowlsForPlan,
  bowlSelectionTotal,
  mealSetCount,
  type BowlSelection,
} from "@/lib/bowl-selection";
import { CURRENT_BOWLS, type BowlId } from "@/lib/current-offer";

export function BowlBuilder({
  disabled,
  mealsPerDay,
  onChange,
  peopleCount,
  selection,
}: {
  disabled: boolean;
  mealsPerDay: number;
  onChange: (selection: BowlSelection) => void;
  peopleCount: number;
  selection: BowlSelection;
}) {
  const total = bowlSelectionTotal(selection);
  const target = bowlsForPlan(peopleCount, mealsPerDay);
  const maxPerRecipe = mealSetCount(peopleCount, mealsPerDay) * 2;
  const complete = total === target;

  function changeQuantity(id: BowlId, amount: -1 | 1): void {
    const nextQuantity = selection[id] + amount;
    const bowlAvailable = CURRENT_BOWLS.find((bowl) => bowl.id === id)?.available;
    if (
      disabled ||
      !bowlAvailable ||
      nextQuantity < 0 ||
      nextQuantity > maxPerRecipe ||
      (amount > 0 && total >= target)
    ) {
      return;
    }
    onChange({ ...selection, [id]: nextQuantity });
  }

  return (
    <fieldset className="grid gap-4">
      <legend className="w-full">
        <span className="flex items-end justify-between gap-4">
          <span>
            <span className="block text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">
              Build your {target}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-forest/62">
              We started with one of each available bowl for every five-meal set.
              Adjust the mix to fit your order.
            </span>
          </span>
          <span
            aria-live="polite"
            className={`shrink-0 text-sm font-bold ${complete ? "text-sage" : "text-clay"}`}
          >
            {total} of {target}
          </span>
        </span>
      </legend>

      <div
        aria-hidden="true"
        className="h-1.5 overflow-hidden rounded-full bg-forest/8"
      >
        <div
          className={`h-full rounded-full transition-all ${complete ? "bg-sage" : "bg-clay"}`}
          style={{ width: `${Math.min(total / target, 1) * 100}%` }}
        />
      </div>

      <div className="grid gap-3">
        {CURRENT_BOWLS.map((bowl) => {
          const quantity = selection[bowl.id];
          return (
            <article
              key={bowl.id}
              data-availability={bowl.available ? "available" : "sold-out"}
              className={`relative overflow-hidden border bg-white/65 transition-colors ${
                quantity > 0 ? "border-sage/45" : "border-forest/12"
              } ${bowl.available ? "" : "opacity-65"}`}
            >
              <div className="grid grid-cols-[88px_1fr] items-stretch sm:grid-cols-[104px_1fr]">
                <div className={`relative min-h-[118px] ${bowl.tone}`}>
                  <Image
                    src={bowl.imagePath}
                    alt={`${bowl.name} in a 32 ounce Soul Good jar`}
                    fill
                    sizes="104px"
                    className="object-cover"
                    unoptimized
                  />
                  {!bowl.available ? (
                    <span className="absolute inset-x-2 top-2 bg-forest px-2 py-1 text-center text-[0.62rem] font-bold tracking-[0.12em] text-oat uppercase">
                      Sold out
                    </span>
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-3 p-4">
                  <div>
                    <h3 className="font-serif text-lg leading-tight font-semibold text-forest">
                      {bowl.name}
                    </h3>
                    {!bowl.available ? (
                      <p className="mt-1 text-xs font-bold tracking-[0.08em] text-clay uppercase">
                        Currently unavailable
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs leading-relaxed text-forest/55">
                      {bowl.dietary.join(" · ")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <details className="group min-w-0">
                      <summary className="cursor-pointer list-none text-xs font-bold text-forest underline decoration-forest/25 underline-offset-4">
                        Learn more
                      </summary>
                      <div className="col-span-2 mt-3 border-t border-forest/10 pt-3 text-xs leading-relaxed text-forest/65">
                        <p>{bowl.ingredients}</p>
                        <p className="mt-2">
                          <strong className="text-forest">Serve:</strong> {bowl.serving}
                        </p>
                        {bowl.allergen ? (
                          <p className="mt-2 font-bold text-clay">{bowl.allergen}</p>
                        ) : (
                          <p className="mt-2 text-forest/48">
                            No named major allergen on the current label. Cross-contact
                            can still occur.
                          </p>
                        )}
                      </div>
                    </details>

                    <div
                      aria-label={`${bowl.name} quantity`}
                      className="flex shrink-0 items-center border border-forest/18 bg-oat"
                    >
                      <button
                        type="button"
                        aria-label={`Remove one ${bowl.name}`}
                        className="flex h-10 w-10 items-center justify-center text-xl text-forest transition-colors hover:bg-sage/12 disabled:cursor-not-allowed disabled:text-forest/25"
                        disabled={disabled || !bowl.available || quantity === 0}
                        onClick={() => changeQuantity(bowl.id, -1)}
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <output
                        aria-label={`${quantity} ${bowl.name} selected`}
                        className="flex h-10 min-w-9 items-center justify-center border-x border-forest/12 text-sm font-bold text-forest"
                      >
                        {quantity}
                      </output>
                      <button
                        type="button"
                        aria-label={`Add one ${bowl.name}`}
                        className="flex h-10 w-10 items-center justify-center text-xl text-forest transition-colors hover:bg-sage/12 disabled:cursor-not-allowed disabled:text-forest/25"
                        disabled={
                          disabled ||
                          !bowl.available ||
                          total >= target ||
                          quantity >= maxPerRecipe
                        }
                        onClick={() => changeQuantity(bowl.id, 1)}
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!complete ? (
        <p role="status" className="text-sm font-semibold text-clay">
          Select {target - total} more {target - total === 1 ? "bowl" : "bowls"}
          to continue.
        </p>
      ) : (
        <p role="status" className="text-sm font-semibold text-sage">
          Your {target}-bowl order is ready.
        </p>
      )}
    </fieldset>
  );
}
