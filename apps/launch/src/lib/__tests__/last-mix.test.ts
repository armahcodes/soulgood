import { describe, expect, it } from "vitest";
import { bowlSelectionSchema, DEFAULT_BOWL_SELECTION } from "@/lib/bowl-selection";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";
import { parseLastMix } from "@/lib/last-mix";
import { mixFeaturing } from "@/lib/pathway-mix";
import { withSoldOut } from "./sold-out";

describe("mixFeaturing", () => {
  it("doubles the featured bowl and stays a valid five-bowl mix", () => {
    for (const bowl of AVAILABLE_BOWLS) {
      const mix = mixFeaturing(bowl.id);
      expect(mix[bowl.id]).toBe(2);
      expect(bowlSelectionSchema.safeParse(mix).success).toBe(true);
    }
  });

  it("falls back to the standard mix for a sold-out bowl", async () => {
    await withSoldOut("glow-bowl", () =>
      expect(mixFeaturing("glow-bowl")).toEqual(DEFAULT_BOWL_SELECTION),
    );
  });
});

describe("parseLastMix", () => {
  const valid = {
    version: 1,
    bowlSelection: DEFAULT_BOWL_SELECTION,
    peopleCount: 1,
    mealsPerDay: 1,
    fulfillmentMethod: "delivery",
    savedAt: "2026-09-24T12:00:00Z",
  };

  it("accepts a saved mix and rejects tampered or invalid data", () => {
    expect(parseLastMix(JSON.stringify(valid))).toEqual(valid);
    expect(parseLastMix(JSON.stringify({ ...valid, peopleCount: 2 }))).toBeNull();
    expect(parseLastMix(JSON.stringify({ ...valid, fulfillmentMethod: "drone" }))).toBeNull();
    expect(parseLastMix("not json")).toBeNull();
    expect(parseLastMix(null)).toBeNull();
  });
});
