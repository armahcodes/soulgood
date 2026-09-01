import { describe, expect, it } from "vitest";
import {
  bowlSelectionSchema,
  bowlSelectionSchemaForPlan,
  bowlSelectionTotal,
  bowlsForPlan,
  DEFAULT_BOWL_SELECTION,
  mealSetCount,
  parseStoredBowlSelection,
  selectionForPlan,
  selectionSourceName,
} from "../bowl-selection";

describe("bowl selection", () => {
  it("accepts the five-bowl default and counts it", () => {
    expect(bowlSelectionSchema.safeParse(DEFAULT_BOWL_SELECTION).success).toBe(true);
    expect(bowlSelectionTotal(DEFAULT_BOWL_SELECTION)).toBe(5);
  });

  it("scales a five-day plan by people and daily meals", () => {
    const selection = selectionForPlan(2, 2);

    expect(mealSetCount(2, 2)).toBe(4);
    expect(bowlsForPlan(2, 2)).toBe(20);
    expect(bowlSelectionTotal(selection)).toBe(20);
    expect(bowlSelectionSchemaForPlan(2, 2).safeParse(selection).success).toBe(
      true,
    );
    expect(bowlSelectionSchema.safeParse(selection).success).toBe(false);
  });

  it("allows customers to choose multiples of a recipe", () => {
    const mix = {
      ...DEFAULT_BOWL_SELECTION,
      "glow-bowl": 2,
      "golden-harvest-bowl": 2,
      "jerk-wellness-bowl": 1,
      "performance-power-bowl": 0,
      "herb-chicken-nourish-bowl": 0,
      "anti-inflammatory-bowl": 0,
    };
    expect(bowlSelectionSchema.safeParse(mix).success).toBe(true);
  });

  it("limits each available recipe to a double", () => {
    const triple = {
      ...DEFAULT_BOWL_SELECTION,
      "glow-bowl": 3,
      "golden-harvest-bowl": 0,
      "anti-inflammatory-bowl": 1,
    };
    expect(bowlSelectionSchema.safeParse(triple).success).toBe(false);
  });

  it("rejects a sold-out Herb Chicken selection", () => {
    const soldOutMix = {
      ...DEFAULT_BOWL_SELECTION,
      "anti-inflammatory-bowl": 0,
      "herb-chicken-nourish-bowl": 1,
    };
    const result = bowlSelectionSchema.safeParse(soldOutMix);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Herb Chicken Nourish Bowl is sold out",
    );
  });

  it("rejects totals other than five and unknown recipes", () => {
    expect(
      bowlSelectionSchema.safeParse({ ...DEFAULT_BOWL_SELECTION, "glow-bowl": 2 })
        .success,
    ).toBe(false);
    expect(
      bowlSelectionSchema.safeParse({ ...DEFAULT_BOWL_SELECTION, "mystery-bowl": 0 })
        .success,
    ).toBe(false);
  });

  it("round-trips stored selections and creates an exact Square source label", () => {
    expect(parseStoredBowlSelection(JSON.stringify(DEFAULT_BOWL_SELECTION))).toEqual(
      DEFAULT_BOWL_SELECTION,
    );
    expect(selectionSourceName(DEFAULT_BOWL_SELECTION)).toBe(
      "Soul Bowls website | people:1,meals:1 | glow-bowl:1,golden-harvest-bowl:1,jerk-wellness-bowl:1,performance-power-bowl:1,herb-chicken-nourish-bowl:0,anti-inflammatory-bowl:1",
    );
  });

  it("preserves an incomplete browser draft without making it checkout-valid", () => {
    const draft = { ...DEFAULT_BOWL_SELECTION, "glow-bowl": 0 };
    expect(parseStoredBowlSelection(JSON.stringify(draft))).toEqual(draft);
    expect(bowlSelectionSchema.safeParse(draft).success).toBe(false);
  });

  it("resets a stored selection containing a sold-out bowl", () => {
    const soldOutDraft = {
      ...DEFAULT_BOWL_SELECTION,
      "anti-inflammatory-bowl": 0,
      "herb-chicken-nourish-bowl": 1,
    };
    expect(parseStoredBowlSelection(JSON.stringify(soldOutDraft))).toEqual(
      DEFAULT_BOWL_SELECTION,
    );
  });
});
