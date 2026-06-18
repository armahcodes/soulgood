import { describe, expect, it } from "vitest";
import {
  buildPathwayState,
  toggleSelection,
} from "../pathway-state";
import type { QuizAnswers } from "../quiz";

describe("toggleSelection", () => {
  it("adds a value that is not selected", () => {
    expect(toggleSelection(["a"], "b")).toEqual(["a", "b"]);
  });

  it("removes a value that is already selected", () => {
    expect(toggleSelection(["a", "b"], "a")).toEqual(["b"]);
  });

  it("blocks adding past the max (cap at 3)", () => {
    const current = ["Flavor", "Energy", "Protein"];
    expect(toggleSelection(current, "Variety", 3)).toEqual(current);
  });

  it("still allows deselecting when at the cap", () => {
    const current = ["Flavor", "Energy", "Protein"];
    expect(toggleSelection(current, "Energy", 3)).toEqual([
      "Flavor",
      "Protein",
    ]);
  });

  it("allows adding when under the cap", () => {
    expect(toggleSelection(["Flavor"], "Energy", 3)).toEqual([
      "Flavor",
      "Energy",
    ]);
  });
});

describe("buildPathwayState", () => {
  const answers: QuizAnswers = {
    season:
      "I'm reconnecting with my health and creating healthier habits.",
    energy: "Heavy, sluggish, or drained",
    goal: "Improving digestion and feeling lighter",
    mostTrue: "I want to feel refreshed and renewed.",
    dietary: ["Plant-Based"],
    allergens: ["Dairy"],
    foods: ["Fruit"],
    priorities: ["Flavor", "Energy"],
    reflectBody: "  rest  ",
    reflectSoul: "",
  };

  it("computes the matched pathway from scored answers", () => {
    expect(buildPathwayState(answers).pathway).toBe("detox");
  });

  it("carries the full nutrition profile forward", () => {
    const state = buildPathwayState(answers);
    expect(state.dietary).toEqual(["Plant-Based"]);
    expect(state.allergens).toEqual(["Dairy"]);
    expect(state.foods).toEqual(["Fruit"]);
    expect(state.priorities).toEqual(["Flavor", "Energy"]);
  });

  it("trims reflections and omits empty ones", () => {
    const state = buildPathwayState(answers);
    expect(state.reflectBody).toBe("rest");
    expect(state.reflectSoul).toBeUndefined();
  });

  it("defaults profile arrays to empty when unanswered", () => {
    const state = buildPathwayState({});
    expect(state.dietary).toEqual([]);
    expect(state.allergens).toEqual([]);
    expect(state.foods).toEqual([]);
    expect(state.priorities).toEqual([]);
  });

  it("toggling a dietary-only answer does not change the pathway", () => {
    const withDietary = buildPathwayState({
      ...answers,
      dietary: ["High Protein", "Vegetarian"],
    });
    expect(withDietary.pathway).toBe("detox");
  });
});
