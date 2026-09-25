import {
  BOWLS_PER_ORDER,
  DEFAULT_BOWL_SELECTION,
  type BowlSelection,
} from "./bowl-selection";
import { BOWL_IDS, CURRENT_BOWLS, type BowlId } from "./current-offer";
import type { Pathway } from "./lead-schema";

/**
 * Turns a matched pathway (plus the guest's allergen and lifestyle answers)
 * into a valid five-bowl starting mix from the CURRENT Soul Bowls™ offer.
 *
 * Only facts printed on today's labels are used: a bowl is left out when its
 * label names an allergen the guest reported, or when it contains chicken and
 * the guest follows a plant-based, vegetarian, or pescatarian lifestyle. Sold-out
 * bowls are never recommended. If too few bowls remain to fill five slots, the
 * standard one-of-each mix is returned with `fallback: true` so the guest is
 * asked to review it at checkout rather than being sent an invalid selection.
 */

/** Pathway preference order across the current recipes (most → least aligned). */
const PREFERENCES: Record<Pathway, BowlId[]> = {
  mindful: ["glow-bowl", "golden-harvest-bowl", "anti-inflammatory-bowl", "herb-chicken-nourish-bowl", "jerk-wellness-bowl", "performance-power-bowl"],
  performance: ["performance-power-bowl", "jerk-wellness-bowl", "herb-chicken-nourish-bowl", "golden-harvest-bowl", "glow-bowl", "anti-inflammatory-bowl"],
  detox: ["glow-bowl", "anti-inflammatory-bowl", "golden-harvest-bowl", "herb-chicken-nourish-bowl", "jerk-wellness-bowl", "performance-power-bowl"],
  alignment: ["glow-bowl", "golden-harvest-bowl", "jerk-wellness-bowl", "anti-inflammatory-bowl", "herb-chicken-nourish-bowl", "performance-power-bowl"],
};

/** Five slots spread across the top recipes. Alignment keeps the variety of one of each. */
const ALLOCATION: Record<Pathway, number[]> = {
  mindful: [2, 2, 1],
  performance: [2, 2, 1],
  detox: [2, 2, 1],
  alignment: [1, 1, 1, 1, 1],
};

const MAX_PER_RECIPE = 2;

/** Quiz allergen answer → bowls whose current label names it. */
const ALLERGEN_BOWLS: Record<string, BowlId[]> = {
  Sesame: ["golden-harvest-bowl"],
  Soy: ["jerk-wellness-bowl"],
  Gluten: ["jerk-wellness-bowl"],
};

const CHICKEN_BOWLS: BowlId[] = ["jerk-wellness-bowl", "performance-power-bowl", "herb-chicken-nourish-bowl"];
const NO_CHICKEN_LIFESTYLES = ["Plant-Based", "Vegetarian", "Pescatarian"];

// Describes what's in the bowls — ingredients, not health effects.
export const MIX_RATIONALE: Record<Pathway, string> = {
  mindful: "Plant-forward bowls with leafy greens, quinoa, and roasted vegetables for an easy week.",
  performance: "Leans on our chicken bowls, with brown rice, sweet potato, and broccoli.",
  detox: "Vegetable-forward bowls built on leafy greens, herbs, and turmeric.",
  alignment: "A little of everything, so you can find the flavors that fit your week.",
};

export interface ExcludedBowl {
  id: BowlId;
  name: string;
  reason: string;
}

export interface PathwayMix {
  selection: BowlSelection;
  excluded: ExcludedBowl[];
  /** True when exclusions left too few bowls, so the standard mix was used. */
  fallback: boolean;
}

export function recommendMix(
  pathway: Pathway,
  profile: { allergens?: string[]; dietary?: string[] } = {},
): PathwayMix {
  const allergens = profile.allergens ?? [];
  const dietary = profile.dietary ?? [];
  const reasons = new Map<BowlId, string[]>();

  for (const allergen of allergens) {
    for (const id of ALLERGEN_BOWLS[allergen] ?? []) {
      reasons.set(id, [...(reasons.get(id) ?? []), `label lists ${allergen.toLowerCase()}`]);
    }
  }
  const lifestyle = dietary.find((value) => NO_CHICKEN_LIFESTYLES.includes(value));
  if (lifestyle) {
    for (const id of CHICKEN_BOWLS) {
      reasons.set(id, [...(reasons.get(id) ?? []), `contains chicken (${lifestyle.toLowerCase()})`]);
    }
  }

  const available = new Set(CURRENT_BOWLS.filter((bowl) => bowl.available).map((bowl) => bowl.id));
  const candidates = PREFERENCES[pathway].filter((id) => available.has(id) && !reasons.has(id));

  const excluded = CURRENT_BOWLS.filter((bowl) => bowl.available && reasons.has(bowl.id)).map((bowl) => ({
    id: bowl.id,
    name: bowl.name,
    reason: reasons.get(bowl.id)!.join("; "),
  }));

  const selection = Object.fromEntries(BOWL_IDS.map((id) => [id, 0])) as BowlSelection;
  let remaining = BOWLS_PER_ORDER;
  ALLOCATION[pathway].forEach((count, index) => {
    const id = candidates[index];
    if (!id || remaining === 0) return;
    const take = Math.min(count, remaining);
    selection[id] += take;
    remaining -= take;
  });
  // Too few distinct candidates for the pattern: top up in preference order.
  for (const id of candidates) {
    while (remaining > 0 && selection[id] < MAX_PER_RECIPE) {
      selection[id] += 1;
      remaining -= 1;
    }
  }

  if (remaining > 0) {
    return { selection: { ...DEFAULT_BOWL_SELECTION }, excluded, fallback: true };
  }
  return { selection, excluded, fallback: false };
}

/**
 * The standard starting mix with the featured bowl doubled; recipes later in
 * the list give up their slots. Always a valid five-bowl selection.
 */
export function mixFeaturing(featured: BowlId): BowlSelection {
  const selection = { ...DEFAULT_BOWL_SELECTION };
  if (!CURRENT_BOWLS.find((item) => item.id === featured)?.available) return selection;
  while (selection[featured] < MAX_PER_RECIPE) {
    const giver = [...CURRENT_BOWLS].reverse().find((item) => item.id !== featured && selection[item.id] > 0);
    if (!giver) break;
    selection[giver.id] -= 1;
    selection[featured] += 1;
  }
  return selection;
}
