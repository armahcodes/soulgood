import { describe, expect, it } from "vitest";
import { extraLineSchema } from "@/lib/menu-extras";
import { BOWL_INGREDIENTS, extraIngredients, summarizeFoodGroups } from "@/lib/food-groups";
import { recommendMix } from "@/lib/pathway-mix";
import { recommendSides, SIDE_ANSWERS } from "@/lib/quiz-sides";
import { MENU_EXTRAS } from "@/lib/menu-extras";

describe("food groups", () => {
  it("classifies every bowl and menu item", () => {
    for (const list of Object.values(BOWL_INGREDIENTS)) expect(list.length).toBeGreaterThan(2);
    for (const extra of MENU_EXTRAS.filter((item) => item.options !== "build-your-own" && item.options !== "trio"))
      expect(extraIngredients({ id: extra.id }).length, extra.id).toBeGreaterThan(0);
  });

  it("summarizes vegetables, subgroups, whole grains, and proteins without inventing subgroups", () => {
    const summary = summarizeFoodGroups([BOWL_INGREDIENTS["performance-power-bowl"], BOWL_INGREDIENTS["jerk-wellness-bowl"]]);
    expect(summary.subgroups).toEqual(["dark-green", "red-orange"]);
    expect(summary.vegetables).toContain("Roasted vegetables");
    expect(summary.wholeGrains).toEqual(["Brown rice"]);
    expect(summary.proteins).toEqual([{ name: "Chicken", source: "poultry" }]);
    expect(summarizeFoodGroups([BOWL_INGREDIENTS["anti-inflammatory-bowl"]]).otherGrains).toEqual(["Turmeric rice"]);
  });

  it("follows the customer's build-your-own and trio choices", () => {
    expect(extraIngredients({ id: "build-your-own-salad", base: "red-cabbage", toppings: ["sliced-beets", "sliced-radishes", "shredded-carrots"] }).map((item) => item.name)).toEqual(["Red cabbage", "Beets", "Radishes", "Carrots"]);
  });
});

describe("recommendSides", () => {
  const mix = recommendMix("performance").selection;

  it("returns nothing for 'Just my bowls'", () => {
    expect(recommendSides({ pathway: "performance", mix, sides: [SIDE_ANSWERS.none] }).suggestions).toEqual([]);
  });

  it("offers one unticked salad when the question was skipped", () => {
    const result = recommendSides({ pathway: "mindful", mix: recommendMix("mindful").selection });
    expect(result.preselected).toBe(false);
    expect(result.suggestions).toHaveLength(1);
    expect(result.suggestions[0].line.id).toMatch(/rainbow-crunch|golden-garden|beet-and-bright|smoky-sweet-potato-salad/);
  });

  it("picks the salad that adds the most vegetables not already in the mix, and only valid lines", () => {
    const result = recommendSides({ pathway: "performance", mix, sides: Object.values(SIDE_ANSWERS).slice(0, 4) });
    expect(result.preselected).toBe(true);
    expect(result.suggestions.map((item) => item.line.id)).toEqual(["golden-garden", "golden-veggie-cup", "jerk-cauliflower-bites", "veggie-tasting-trio"]);
    expect(result.suggestions[0].adds).toEqual(expect.arrayContaining(["Butternut squash", "Cauliflower", "Green cabbage"]));
    for (const item of result.suggestions) expect(extraLineSchema.safeParse(item.line).success, item.line.id).toBe(true);
  });

  it("skips jerk seasoning for soy or gluten and never defaults to tahini", () => {
    const result = recommendSides({ pathway: "alignment", mix, sides: [SIDE_ANSWERS.salad, SIDE_ANSWERS.warm, SIDE_ANSWERS.share], allergens: ["Soy", "Sesame"] });
    const ids = JSON.stringify(result.suggestions.map((item) => item.line));
    expect(ids).not.toMatch(/jerk/);
    expect(ids).not.toMatch(/tahini/);
  });
});
