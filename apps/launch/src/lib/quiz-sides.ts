import type { BowlSelection } from "./bowl-selection";
import { BOWL_IDS } from "./current-offer";
import { BOWL_INGREDIENTS, extraIngredients, newVegetables } from "./food-groups";
import type { Pathway } from "./lead-schema";
import type { DressingId, ExtraLine } from "./menu-extras";

/**
 * Turns the quiz's "anything alongside your bowls?" answer into a few optional
 * salads and sides. Choices are explained with facts only — which vegetables a
 * dish adds to the week — never with health outcomes.
 *
 * Allergen care: dishes whose seasoning or sauce may contain soy or wheat (jerk)
 * are skipped when the guest reports soy or gluten, and tahini (sesame) is never
 * chosen as a default dressing.
 */

export const SIDE_ANSWERS = {
  salad: "A made-to-order salad",
  cups: "Veggie cups for between meals",
  warm: "Warm roasted bites",
  share: "Something to share",
  none: "Just my bowls",
} as const;

const SIGNATURE_SALADS: Record<Pathway, string[]> = {
  mindful: ["rainbow-crunch", "golden-garden", "beet-and-bright", "smoky-sweet-potato-salad"],
  detox: ["beet-and-bright", "rainbow-crunch", "golden-garden", "smoky-sweet-potato-salad"],
  performance: ["smoky-sweet-potato-salad", "golden-garden", "rainbow-crunch", "beet-and-bright"],
  alignment: ["golden-garden", "rainbow-crunch", "beet-and-bright", "smoky-sweet-potato-salad"],
};

const DEFAULT_DRESSING: Record<Pathway, DressingId> = {
  mindful: "lemon",
  detox: "lemon",
  performance: "house",
  alignment: "turmeric",
};

export type SideSuggestion = {
  line: ExtraLine;
  /** Vegetables this dish adds that aren't already in the bowl mix. */
  adds: string[];
  /** Which answer it responds to, for the explanation line. */
  reason: string;
};

export function recommendSides(input: {
  pathway: Pathway;
  mix: BowlSelection;
  sides?: string[];
  allergens?: string[];
  foods?: string[];
}): { suggestions: SideSuggestion[]; preselected: boolean } {
  const sides = input.sides ?? [];
  if (sides.includes(SIDE_ANSWERS.none)) return { suggestions: [], preselected: false };

  const avoidJerk = (input.allergens ?? []).some((value) => value === "Soy" || value === "Gluten");
  const dressing = DEFAULT_DRESSING[input.pathway];
  const mixIngredients = BOWL_IDS.filter((id) => input.mix[id] > 0).map((id) => BOWL_INGREDIENTS[id]);
  const suggest = (line: ExtraLine, reason: string): SideSuggestion => ({ line, reason, adds: newVegetables(mixIngredients, extraIngredients(line)) });

  // No answer: offer one salad, unticked, so the result still shows the salad bar.
  const wanted = sides.length ? sides : [SIDE_ANSWERS.salad];
  const suggestions: SideSuggestion[] = [];

  if (wanted.includes(SIDE_ANSWERS.salad)) {
    const ranked = SIGNATURE_SALADS[input.pathway]
      .map((id, order) => ({ id, order, adds: newVegetables(mixIngredients, extraIngredients({ id })).length }))
      .sort((a, b) => b.adds - a.adds || a.order - b.order);
    suggestions.push(suggest({ id: ranked[0].id, quantity: 1, dressing }, "A made-to-order salad"));
  }
  if (wanted.includes(SIDE_ANSWERS.cups)) {
    const raw = input.pathway === "mindful" || input.pathway === "detox" || (input.foods ?? []).includes("Fresh vegetables");
    suggestions.push(suggest({ id: raw ? "crunch-cup" : "golden-veggie-cup", quantity: 1 }, "Veggie cups for between meals"));
  }
  if (wanted.includes(SIDE_ANSWERS.warm)) {
    suggestions.push(
      suggest(
        avoidJerk ? { id: "smoky-sweet-potato-wedges", quantity: 1 } : { id: "jerk-cauliflower-bites", quantity: 1, dressing: "house" },
        "Warm roasted bites",
      ),
    );
  }
  if (wanted.includes(SIDE_ANSWERS.share)) {
    suggestions.push(
      suggest(
        {
          id: "veggie-tasting-trio",
          quantity: 1,
          trio: avoidJerk ? ["smoky-sweet-potatoes", "golden-curry-vegetables", "rainbow-crunch"] : ["jerk-cauliflower", "smoky-sweet-potatoes", "rainbow-crunch"],
        },
        "Something to share",
      ),
    );
  }
  return { suggestions, preselected: sides.length > 0 };
}
