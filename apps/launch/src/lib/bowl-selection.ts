import { z } from "zod";
import { BOWL_IDS, type BowlId } from "./current-offer";

export const BOWLS_PER_ORDER = 5;
export const MAX_PEOPLE_PER_ORDER = 6;
export const MAX_MEALS_PER_DAY = 3;
export const MAX_MEAL_SETS_PER_ORDER =
  MAX_PEOPLE_PER_ORDER * MAX_MEALS_PER_DAY;
export const MAX_BOWLS_PER_ORDER =
  BOWLS_PER_ORDER * MAX_MEAL_SETS_PER_ORDER;

const quantitySchema = z
  .number()
  .int()
  .min(0)
  .max(MAX_MEAL_SETS_PER_ORDER * 2);

export const bowlSelectionDraftSchema = z.strictObject({
  "glow-bowl": quantitySchema,
  "golden-harvest-bowl": quantitySchema,
  "jerk-wellness-bowl": quantitySchema,
  "performance-power-bowl": quantitySchema,
  "herb-chicken-nourish-bowl": quantitySchema,
  "anti-inflammatory-bowl": quantitySchema,
});

export type BowlSelection = Record<BowlId, number>;

export function mealSetCount(peopleCount: number, mealsPerDay: number): number {
  return peopleCount * mealsPerDay;
}

export function bowlsForPlan(peopleCount: number, mealsPerDay: number): number {
  return BOWLS_PER_ORDER * mealSetCount(peopleCount, mealsPerDay);
}

export function bowlSelectionSchemaForPlan(
  peopleCount: number,
  mealsPerDay: number,
) {
  const target = bowlsForPlan(peopleCount, mealsPerDay);
  const maxPerRecipe = mealSetCount(peopleCount, mealsPerDay) * 2;
  return bowlSelectionDraftSchema.superRefine((selection, context) => {
    if (bowlSelectionTotal(selection) !== target) {
      context.addIssue({
        code: "custom",
        message: `Select exactly ${target} bowls`,
      });
    }
    if (selection["herb-chicken-nourish-bowl"] > 0) {
      context.addIssue({
        code: "custom",
        path: ["herb-chicken-nourish-bowl"],
        message: "Herb Chicken Nourish Bowl is sold out",
      });
    }
    for (const id of BOWL_IDS) {
      if (selection[id] > maxPerRecipe) {
        context.addIssue({
          code: "custom",
          path: [id],
          message: `Select no more than ${maxPerRecipe} of one bowl`,
        });
      }
    }
  });
}

export const bowlSelectionSchema = bowlSelectionSchemaForPlan(1, 1);

export const DEFAULT_BOWL_SELECTION: BowlSelection = {
  "glow-bowl": 1,
  "golden-harvest-bowl": 1,
  "jerk-wellness-bowl": 1,
  "performance-power-bowl": 1,
  "herb-chicken-nourish-bowl": 0,
  "anti-inflammatory-bowl": 1,
};

export function selectionForPlan(
  peopleCount: number,
  mealsPerDay: number,
): BowlSelection {
  const sets = mealSetCount(peopleCount, mealsPerDay);
  return Object.fromEntries(
    BOWL_IDS.map((id) => [id, DEFAULT_BOWL_SELECTION[id] * sets]),
  ) as BowlSelection;
}

export function bowlSelectionTotal(selection: BowlSelection): number {
  return BOWL_IDS.reduce((total, id) => total + selection[id], 0);
}

export function selectionSourceName(
  selection: BowlSelection,
  peopleCount = 1,
  mealsPerDay = 1,
): string {
  const mix = BOWL_IDS.map((id) => `${id}:${selection[id]}`).join(",");
  return `Soul Bowls website | people:${peopleCount},meals:${mealsPerDay} | ${mix}`;
}

export function parseStoredBowlSelection(value: string | null): BowlSelection | null {
  if (!value) return null;
  try {
    const parsed = bowlSelectionDraftSchema.safeParse(JSON.parse(value));
    if (!parsed.success) return null;
    return parsed.data["herb-chicken-nourish-bowl"] === 0
      ? parsed.data
      : DEFAULT_BOWL_SELECTION;
  } catch {
    return null;
  }
}
