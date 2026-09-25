import { describe, expect, it } from "vitest";
import { bowlSelectionSchema } from "@/lib/bowl-selection";
import { PATHWAYS } from "@/lib/lead-schema";
import { recommendMix } from "@/lib/pathway-mix";
import { withSoldOut } from "./sold-out";

describe("recommendMix", () => {
  it("always returns a checkout-valid five-bowl selection for every pathway", () => {
    for (const pathway of PATHWAYS) {
      const { selection, fallback } = recommendMix(pathway);
      expect(bowlSelectionSchema.safeParse(selection).success).toBe(true);
      expect(fallback).toBe(false);
    }
  });

  it("never recommends a sold-out bowl", async () => {
    await withSoldOut("herb-chicken-nourish-bowl", () => {
      for (const pathway of PATHWAYS) {
        const { selection } = recommendMix(pathway);
        expect(selection["herb-chicken-nourish-bowl"]).toBe(0);
        expect(bowlSelectionSchema.safeParse(selection).success).toBe(true);
      }
    });
  });

  it("leans each focused pathway toward its recipes", () => {
    expect(recommendMix("performance").selection).toMatchObject({
      "performance-power-bowl": 2,
      "jerk-wellness-bowl": 2,
      "herb-chicken-nourish-bowl": 1,
    });
    expect(recommendMix("detox").selection).toMatchObject({
      "glow-bowl": 2,
      "anti-inflammatory-bowl": 2,
      "golden-harvest-bowl": 1,
    });
    expect(recommendMix("alignment").selection).toMatchObject({
      "glow-bowl": 1,
      "golden-harvest-bowl": 1,
      "jerk-wellness-bowl": 1,
      "anti-inflammatory-bowl": 1,
      "herb-chicken-nourish-bowl": 1,
    });
  });

  it("leaves out bowls whose labels name a reported allergen and explains why", () => {
    const mix = recommendMix("performance", { allergens: ["Sesame", "Soy"] });
    expect(mix.selection["golden-harvest-bowl"]).toBe(0);
    expect(mix.selection["jerk-wellness-bowl"]).toBe(0);
    expect(bowlSelectionSchema.safeParse(mix.selection).success).toBe(true);
    expect(mix.excluded.map((bowl) => bowl.id).sort()).toEqual(["golden-harvest-bowl", "jerk-wellness-bowl"]);
    expect(mix.excluded.find((bowl) => bowl.id === "golden-harvest-bowl")?.reason).toContain("sesame");
  });

  it("removes chicken bowls for plant-based, vegetarian, and pescatarian guests", () => {
    const mix = recommendMix("performance", { dietary: ["Vegetarian"] });
    expect(mix.selection["performance-power-bowl"]).toBe(0);
    expect(mix.selection["jerk-wellness-bowl"]).toBe(0);
    expect(bowlSelectionSchema.safeParse(mix.selection).success).toBe(true);
  });

  it("falls back to the standard mix when exclusions leave too few bowls", () => {
    const mix = recommendMix("mindful", { allergens: ["Sesame"], dietary: ["Plant-Based"] });
    expect(mix.fallback).toBe(true);
    expect(bowlSelectionSchema.safeParse(mix.selection).success).toBe(true);
  });
});
