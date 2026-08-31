import { describe, expect, it } from "vitest";
import {
  bowlSelectionSchema,
  bowlSelectionTotal,
  DEFAULT_BOWL_SELECTION,
  parseStoredBowlSelection,
  selectionSourceName,
} from "../bowl-selection";

describe("bowl selection", () => {
  it("accepts the five-bowl default and counts it", () => {
    expect(bowlSelectionSchema.safeParse(DEFAULT_BOWL_SELECTION).success).toBe(true);
    expect(bowlSelectionTotal(DEFAULT_BOWL_SELECTION)).toBe(5);
  });

  it("allows customers to choose multiples of a recipe", () => {
    const mix = {
      ...DEFAULT_BOWL_SELECTION,
      "glow-bowl": 3,
      "golden-harvest-bowl": 2,
      "jerk-wellness-bowl": 0,
      "performance-power-bowl": 0,
      "herb-chicken-nourish-bowl": 0,
    };
    expect(bowlSelectionSchema.safeParse(mix).success).toBe(true);
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
      "Soul Bowls website | glow-bowl:1,golden-harvest-bowl:1,jerk-wellness-bowl:1,performance-power-bowl:1,herb-chicken-nourish-bowl:1",
    );
  });

  it("preserves an incomplete browser draft without making it checkout-valid", () => {
    const draft = { ...DEFAULT_BOWL_SELECTION, "glow-bowl": 0 };
    expect(parseStoredBowlSelection(JSON.stringify(draft))).toEqual(draft);
    expect(bowlSelectionSchema.safeParse(draft).success).toBe(false);
  });
});
