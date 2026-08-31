import { z } from "zod";
import { BOWL_IDS, type BowlId } from "./current-offer";

export const BOWLS_PER_ORDER = 5;

const quantitySchema = z.number().int().min(0).max(2);

export const bowlSelectionDraftSchema = z.strictObject({
  "glow-bowl": quantitySchema,
  "golden-harvest-bowl": quantitySchema,
  "jerk-wellness-bowl": quantitySchema,
  "performance-power-bowl": quantitySchema,
  "herb-chicken-nourish-bowl": quantitySchema,
  "anti-inflammatory-bowl": quantitySchema,
});

export const bowlSelectionSchema = bowlSelectionDraftSchema
  .superRefine((selection, context) => {
    if (bowlSelectionTotal(selection) !== BOWLS_PER_ORDER) {
      context.addIssue({
        code: "custom",
        message: `Select exactly ${BOWLS_PER_ORDER} bowls`,
      });
    }
    if (selection["herb-chicken-nourish-bowl"] > 0) {
      context.addIssue({
        code: "custom",
        path: ["herb-chicken-nourish-bowl"],
        message: "Herb Chicken Nourish Bowl is sold out",
      });
    }
  });

export type BowlSelection = Record<BowlId, number>;

export const DEFAULT_BOWL_SELECTION: BowlSelection = {
  "glow-bowl": 1,
  "golden-harvest-bowl": 1,
  "jerk-wellness-bowl": 1,
  "performance-power-bowl": 1,
  "herb-chicken-nourish-bowl": 0,
  "anti-inflammatory-bowl": 1,
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
    if (!parsed.success) return null;
    return parsed.data["herb-chicken-nourish-bowl"] === 0
      ? parsed.data
      : DEFAULT_BOWL_SELECTION;
  } catch {
    return null;
  }
}
