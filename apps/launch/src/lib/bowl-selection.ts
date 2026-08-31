import { z } from "zod";
import { BOWL_IDS, type BowlId } from "./current-offer";

export const BOWLS_PER_ORDER = 5;

const quantitySchema = z.number().int().min(0).max(BOWLS_PER_ORDER);

export const bowlSelectionDraftSchema = z.strictObject({
  "glow-bowl": quantitySchema,
  "golden-harvest-bowl": quantitySchema,
  "jerk-wellness-bowl": quantitySchema,
  "performance-power-bowl": quantitySchema,
  "herb-chicken-nourish-bowl": quantitySchema,
});

export const bowlSelectionSchema = bowlSelectionDraftSchema
  .superRefine((selection, context) => {
    if (bowlSelectionTotal(selection) !== BOWLS_PER_ORDER) {
      context.addIssue({
        code: "custom",
        message: `Select exactly ${BOWLS_PER_ORDER} bowls`,
      });
    }
  });

export type BowlSelection = Record<BowlId, number>;

export const DEFAULT_BOWL_SELECTION: BowlSelection = {
  "glow-bowl": 1,
  "golden-harvest-bowl": 1,
  "jerk-wellness-bowl": 1,
  "performance-power-bowl": 1,
  "herb-chicken-nourish-bowl": 1,
};

export function bowlSelectionTotal(selection: BowlSelection): number {
  return BOWL_IDS.reduce((total, id) => total + selection[id], 0);
}

export function selectionSourceName(selection: BowlSelection): string {
  const mix = BOWL_IDS.map((id) => `${id}:${selection[id]}`).join(",");
  return `Soul Bowls website | ${mix}`;
}

export function parseStoredBowlSelection(value: string | null): BowlSelection | null {
  if (!value) return null;
  try {
    const parsed = bowlSelectionDraftSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
