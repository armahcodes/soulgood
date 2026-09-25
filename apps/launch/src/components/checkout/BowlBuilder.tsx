"use client";

import Image from "next/image";
import { QuantityStepper } from "@/components/ui/kit/quantity-stepper";
import { cn } from "@/lib/utils";
import {
  bowlsForPlan,
  bowlSelectionTotal,
  mealSetCount,
  type BowlSelection,
} from "@/lib/bowl-selection";
import {
  AVAILABLE_BOWLS,
  SOLD_OUT_BOWLS,
  type BowlId,
} from "@/lib/current-offer";

const DISPLAY_BOWLS = [...AVAILABLE_BOWLS, ...SOLD_OUT_BOWLS];

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
    const bowlAvailable = DISPLAY_BOWLS.find((bowl) => bowl.id === id)?.available;
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
    <fieldset id="step-bowls" className="grid scroll-mt-40 gap-4 rounded-lg border border-forest/12 bg-card p-4 sm:p-6">
      <legend className="sr-only">Step 2 · Choose your bowls</legend>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p aria-hidden="true" className="flex items-center gap-2.5 text-xs font-medium tracking-[0.12em] text-forest/70 uppercase">
            <span className="flex size-6 items-center justify-center rounded-full bg-forest text-[0.65rem] text-oat">2</span>
            Choose your bowls
          </p>
          <p className="mt-2 text-sm leading-relaxed text-forest/68">
            We start you with five different recipes per set. Swap in any bowl
            from this week’s lineup, or choose more of your favorites.
          </p>
        </div>
        <span
          aria-live="polite"
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1 text-sm font-bold tabular-nums transition-colors",
            complete ? "bg-sage/15 text-forest" : "bg-clay/10 text-clay",
          )}
        >
          {total} of {target}
        </span>
      </div>

      <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-forest/8">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-(--ease-soft)", complete ? "bg-sage" : "bg-clay")}
          style={{ width: `${Math.min(total / target, 1) * 100}%` }}
        />
      </div>

      <div className="grid gap-2.5">
        {DISPLAY_BOWLS.map((bowl) => {
          const quantity = selection[bowl.id];
          return (
            <article
              key={bowl.id}
              data-availability={bowl.available ? "available" : "sold-out"}
              className={cn(
                "relative overflow-hidden rounded-lg border bg-oat/70 transition-[border-color,box-shadow] duration-300",
                quantity > 0 ? "border-sage/60 shadow-[0_0_0_1px_var(--color-sage)]" : "border-forest/12",
                !bowl.available && "opacity-65",
              )}
            >
              <div className="grid grid-cols-[84px_1fr] items-stretch sm:grid-cols-[100px_1fr]">
                <div className={cn("relative min-h-[112px]", bowl.tone)}>
                  <Image
                    src={bowl.imagePath}
                    alt={`${bowl.name} in a 32 ounce Soul Good jar`}
                    fill
                    sizes="100px"
                    className="object-cover"
                    unoptimized
                  />
                  {!bowl.available ? (
                    <span className="absolute inset-x-2 top-2 rounded-sm bg-forest px-2 py-1 text-center text-[0.6rem] font-medium tracking-[0.12em] text-oat uppercase">
                      Sold out
                    </span>
                  ) : quantity > 0 ? (
                    <span aria-hidden="true" className="absolute top-2 left-2 flex size-6 items-center justify-center rounded-full bg-forest text-[0.7rem] font-bold text-oat">
                      {quantity}
                    </span>
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-3 p-3.5 sm:p-4">
                  <div>
                    <h3 className="font-serif text-xl leading-tight text-forest">
                      {bowl.name}
                    </h3>
                    {!bowl.available ? (
                      <p className="mt-1 text-xs font-medium tracking-[0.08em] text-clay uppercase">
                        Currently unavailable
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs leading-relaxed text-forest/65">
                      {bowl.dietary.join(" · ")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <details className="group min-w-[6rem] flex-1">
                      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-xs font-bold text-forest underline decoration-forest/25 underline-offset-4">
                        Learn more
                        <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="mt-1 border-t border-forest/10 pt-3 text-xs leading-relaxed text-forest/70">
                        <p>{bowl.ingredients}</p>
                        <p className="mt-2">
                          <strong className="text-forest">Serve:</strong> {bowl.serving}
                        </p>
                        {bowl.allergen ? (
                          <p className="mt-2 font-bold text-clay">{bowl.allergen}</p>
                        ) : (
                          <p className="mt-2 text-forest/60">
                            No named major allergen on the current label. Cross-contact
                            can still occur.
                          </p>
                        )}
                      </div>
                    </details>

                    <QuantityStepper
                      size="sm"
                      value={quantity}
                      groupLabel={`${bowl.name} quantity`}
                      valueLabel={`${quantity} ${bowl.name} selected`}
                      decrementLabel={`Remove one ${bowl.name}`}
                      incrementLabel={`Add one ${bowl.name}`}
                      decrementDisabled={disabled || !bowl.available || quantity === 0}
                      incrementDisabled={
                        disabled ||
                        !bowl.available ||
                        total >= target ||
                        quantity >= maxPerRecipe
                      }
                      onDecrement={() => changeQuantity(bowl.id, -1)}
                      onIncrement={() => changeQuantity(bowl.id, 1)}
                    />
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
          {" "}to continue.
        </p>
      ) : (
        <p role="status" className="text-sm font-semibold text-sage">
          Your selection is complete: {target} bowls.
        </p>
      )}
    </fieldset>
  );
}
