import type { BowlId } from "./current-offer";
import type { ExtraLine } from "./menu-extras";

/**
 * What's in each dish, grouped the way USDA MyPlate and the Dietary Guidelines
 * for Americans group foods. This describes ingredients only — never nutrient
 * amounts, health effects, or suitability for any condition — so it can be shown
 * without making nutrition or health claims.
 *
 * Sources: MyPlate food groups and vegetable subgroups (myplate.gov) and the
 * Dietary Guidelines for Americans, 2020–2025 (dietaryguidelines.gov).
 * Classifications follow the ingredient lists on our labels and menu.
 */

export type FoodGroup = "vegetables" | "grains" | "protein";
export type VegetableSubgroup = "dark-green" | "red-orange" | "beans-peas-lentils" | "starchy" | "other";

export type Ingredient = {
  name: string;
  group: FoodGroup;
  /** Vegetables only. Beans, peas, and lentils also count as protein foods. */
  subgroup?: VegetableSubgroup;
  /** Grains only: true when the grain is whole (quinoa, brown rice). */
  whole?: boolean;
  /** Protein foods only. */
  source?: "plant" | "poultry";
};

export const VEGETABLE_SUBGROUPS: { id: VegetableSubgroup; label: string; examples: string }[] = [
  { id: "dark-green", label: "Dark green", examples: "leafy greens, broccoli" },
  { id: "red-orange", label: "Red & orange", examples: "sweet potato, carrots, squash" },
  { id: "beans-peas-lentils", label: "Beans, peas & lentils", examples: "chickpeas" },
  { id: "starchy", label: "Starchy", examples: "potatoes, corn, green peas" },
  { id: "other", label: "Other", examples: "cabbage, cauliflower, beets, radishes" },
];

export const FOOD_GROUP_SOURCES = [
  { label: "USDA MyPlate", href: "https://www.myplate.gov/eat-healthy/vegetables" },
  { label: "Dietary Guidelines for Americans", href: "https://www.dietaryguidelines.gov/" },
] as const;

const I = {
  greens: { name: "Leafy greens", group: "vegetables", subgroup: "dark-green" },
  broccoli: { name: "Broccoli", group: "vegetables", subgroup: "dark-green" },
  sweetPotato: { name: "Sweet potato", group: "vegetables", subgroup: "red-orange" },
  carrots: { name: "Carrots", group: "vegetables", subgroup: "red-orange" },
  butternut: { name: "Butternut squash", group: "vegetables", subgroup: "red-orange" },
  chickpeas: { name: "Chickpeas", group: "vegetables", subgroup: "beans-peas-lentils" },
  cucumber: { name: "Cucumber", group: "vegetables", subgroup: "other" },
  avocado: { name: "Avocado", group: "vegetables", subgroup: "other" },
  greenCabbage: { name: "Green cabbage", group: "vegetables", subgroup: "other" },
  redCabbage: { name: "Red cabbage", group: "vegetables", subgroup: "other" },
  radishes: { name: "Radishes", group: "vegetables", subgroup: "other" },
  beets: { name: "Beets", group: "vegetables", subgroup: "other" },
  cauliflower: { name: "Cauliflower", group: "vegetables", subgroup: "other" },
  roastedVegetables: { name: "Roasted vegetables", group: "vegetables" },
  quinoa: { name: "Quinoa", group: "grains", whole: true },
  brownRice: { name: "Brown rice", group: "grains", whole: true },
  turmericRice: { name: "Turmeric rice", group: "grains" },
  chicken: { name: "Chicken", group: "protein", source: "poultry" },
  chickpeaProtein: { name: "Chickpeas", group: "protein", source: "plant" },
} satisfies Record<string, Ingredient>;

/** Components per bowl, from the ingredient lists on current labels. */
export const BOWL_INGREDIENTS: Record<BowlId, Ingredient[]> = {
  "glow-bowl": [I.greens, I.cucumber, I.avocado, I.quinoa],
  "golden-harvest-bowl": [I.sweetPotato, I.carrots, I.chickpeas, I.greens, I.quinoa, I.chickpeaProtein],
  "jerk-wellness-bowl": [I.roastedVegetables, I.greens, I.brownRice, I.chicken],
  "performance-power-bowl": [I.sweetPotato, I.broccoli, I.brownRice, I.chicken],
  "herb-chicken-nourish-bowl": [I.greens, I.roastedVegetables, I.quinoa, I.chicken],
  "anti-inflammatory-bowl": [I.chickpeas, I.greens, I.roastedVegetables, I.turmericRice, I.chickpeaProtein],
};

const BASE: Record<string, Ingredient[]> = {
  "green-cabbage": [I.greenCabbage],
  "red-cabbage": [I.redCabbage],
  "cabbage-carrot-slaw": [I.greenCabbage, I.redCabbage, I.carrots],
};
const TOPPING: Record<string, Ingredient[]> = {
  "shredded-carrots": [I.carrots],
  "sliced-radishes": [I.radishes],
  "sliced-beets": [I.beets],
  "roasted-cauliflower": [I.cauliflower],
  "roasted-butternut-squash": [I.butternut],
  "smoky-sweet-potatoes": [I.sweetPotato],
};
const TRIO: Record<string, Ingredient[]> = {
  "jerk-cauliflower": [I.cauliflower],
  "smoky-sweet-potatoes": [I.sweetPotato],
  "golden-curry-vegetables": [I.cauliflower, I.butternut, I.carrots],
  "rainbow-crunch": [I.greenCabbage, I.redCabbage, I.carrots, I.radishes],
  "beet-and-carrot-salad": [I.beets, I.carrots, I.redCabbage],
};

/** Components per salad, cup, and snack, from the menu descriptions. */
const EXTRA_INGREDIENTS: Record<string, Ingredient[]> = {
  "rainbow-crunch": [I.greenCabbage, I.redCabbage, I.carrots, I.radishes],
  "golden-garden": [I.butternut, I.cauliflower, I.carrots, I.greenCabbage],
  "beet-and-bright": [I.beets, I.redCabbage, I.carrots, I.radishes],
  "smoky-sweet-potato-salad": [I.sweetPotato, I.cauliflower, I.greenCabbage, I.carrots],
  "crunch-cup": [I.carrots, I.radishes, I.cauliflower],
  "rainbow-slaw-cup": [I.greenCabbage, I.redCabbage, I.carrots],
  "beet-and-carrot-cup": [I.beets, I.carrots],
  "golden-veggie-cup": [I.butternut, I.cauliflower, I.carrots],
  "smoky-sweet-potato-bites": [I.sweetPotato],
  "jerk-cauliflower-bites": [I.cauliflower],
  "smoky-sweet-potato-wedges": [I.sweetPotato],
  "golden-curry-cup": [I.cauliflower, I.butternut, I.carrots],
  "roasted-cabbage-wedges": [I.greenCabbage],
  "rainbow-crunch-cup": [I.greenCabbage, I.redCabbage, I.carrots, I.radishes],
  "beet-and-carrot-salad-cup": [I.beets, I.carrots, I.redCabbage],
  "garden-crunch-and-dip": [I.carrots, I.radishes, I.cauliflower],
};

/** Ingredients in one salad/snack line, following the customer's choices. */
export function extraIngredients(line: Pick<ExtraLine, "id" | "base" | "toppings" | "trio">): Ingredient[] {
  if (line.id === "build-your-own-salad")
    return [...(line.base ? BASE[line.base] ?? [] : []), ...(line.toppings ?? []).flatMap((id) => TOPPING[id] ?? [])];
  if (line.id === "veggie-tasting-trio") return (line.trio ?? []).flatMap((id) => TRIO[id] ?? []);
  return EXTRA_INGREDIENTS[line.id] ?? [];
}

/** Ingredients for a menu item before any choices are made (for menu displays). */
export function menuItemIngredients(id: string): Ingredient[] {
  if (id === "build-your-own-salad") return [...BASE["cabbage-carrot-slaw"], ...Object.values(TOPPING).flat()];
  if (id === "veggie-tasting-trio") return Object.values(TRIO).flat();
  return EXTRA_INGREDIENTS[id] ?? [];
}

export type FoodGroupSummary = {
  vegetables: string[];
  subgroups: VegetableSubgroup[];
  wholeGrains: string[];
  otherGrains: string[];
  proteins: { name: string; source: "plant" | "poultry" }[];
};

const unique = (values: string[]) => [...new Set(values)];

/**
 * Summarize a set of dishes by food group: which vegetables and subgroups appear,
 * which grains (whole or not), and which protein foods. Unspecified "roasted
 * vegetables" count as vegetables but never claim a subgroup.
 */
export function summarizeFoodGroups(lists: Ingredient[][]): FoodGroupSummary {
  const all = lists.flat();
  const vegetables = all.filter((item) => item.group === "vegetables");
  const grains = all.filter((item) => item.group === "grains");
  const proteins = all.filter((item) => item.group === "protein");
  return {
    vegetables: unique(vegetables.map((item) => item.name)),
    subgroups: VEGETABLE_SUBGROUPS.map((sub) => sub.id).filter((id) => vegetables.some((item) => item.subgroup === id)),
    wholeGrains: unique(grains.filter((item) => item.whole).map((item) => item.name)),
    otherGrains: unique(grains.filter((item) => !item.whole).map((item) => item.name)),
    proteins: [...new Map(proteins.map((item) => [item.name, { name: item.name, source: item.source! }])).values()],
  };
}

/** Vegetables in `extra` that don't already appear in `base` (e.g. what a salad adds to the week). */
export function newVegetables(base: Ingredient[][], extra: Ingredient[]): string[] {
  const seen = new Set(base.flat().filter((item) => item.group === "vegetables").map((item) => item.name));
  return unique(extra.filter((item) => item.group === "vegetables" && !seen.has(item.name)).map((item) => item.name));
}

/** A short "what's inside" line for a dish, e.g. "Leafy greens · Quinoa · Chicken". */
export function groupChips(items: Ingredient[]): { label: string; group: FoodGroup }[] {
  return [...new Map(items.map((item) => [item.name, { label: item.name, group: item.group }])).values()];
}
