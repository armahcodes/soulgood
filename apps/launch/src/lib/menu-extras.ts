import { z } from "zod";

/**
 * Salads, veggie bites, and snacks that can be added to a Soul Bowls™ order.
 *
 * Source: "Made-to-Order Salads & Veggie Bites" and "Snacks & Light Bites"
 * menus (customer-facing copy only; kitchen prep notes stay internal).
 * Prices are per item, before tax, and are enforced server-side from here.
 */

export type ExtraCategory = "salads" | "veggie-cups" | "snacks";

/** Square catalog price tier; each tier is one variation of the add-ons item. */
export type ExtraTier = "signature-salad" | "build-your-own" | "veggie-cup" | "snack" | "tasting-trio";

export const TIER_PRICE_CENTS: Record<ExtraTier, number> = {
  "signature-salad": 1400,
  "build-your-own": 1500,
  "veggie-cup": 600,
  snack: 800,
  "tasting-trio": 1600,
};

export const DRESSINGS = [
  { id: "lemon", name: "Lemon dressing" },
  { id: "tahini-herb", name: "Tahini herb dressing", allergen: "Contains sesame" },
  { id: "jerk", name: "Jerk sauce", allergen: "May contain soy or wheat" },
  { id: "house", name: "House dressing" },
  { id: "turmeric", name: "Turmeric dressing" },
] as const;
export type DressingId = (typeof DRESSINGS)[number]["id"];

export const SALAD_BASES = [
  { id: "green-cabbage", name: "Green cabbage" },
  { id: "red-cabbage", name: "Red cabbage" },
  { id: "cabbage-carrot-slaw", name: "Mixed cabbage and carrot slaw" },
] as const;
export type SaladBaseId = (typeof SALAD_BASES)[number]["id"];

export const SALAD_TOPPINGS = [
  { id: "shredded-carrots", name: "Shredded carrots" },
  { id: "sliced-radishes", name: "Sliced radishes" },
  { id: "sliced-beets", name: "Sliced beets" },
  { id: "roasted-cauliflower", name: "Roasted cauliflower" },
  { id: "roasted-butternut-squash", name: "Roasted butternut squash" },
  { id: "smoky-sweet-potatoes", name: "Smoky sweet potatoes" },
] as const;
export type SaladToppingId = (typeof SALAD_TOPPINGS)[number]["id"];
export const TOPPINGS_PER_SALAD = 3;

export const TRIO_OPTIONS = [
  { id: "jerk-cauliflower", name: "Jerk cauliflower" },
  { id: "smoky-sweet-potatoes", name: "Smoky sweet potatoes" },
  { id: "golden-curry-vegetables", name: "Golden curry vegetables" },
  { id: "rainbow-crunch", name: "Rainbow crunch" },
  { id: "beet-and-carrot-salad", name: "Beet-and-carrot salad" },
] as const;
export type TrioOptionId = (typeof TRIO_OPTIONS)[number]["id"];
export const TRIO_SIZE = 3;

/** Which choice an item asks for. */
export type ExtraOptions = "none" | "dressing" | "sauce" | "dip" | "build-your-own" | "trio";

export interface MenuExtra {
  id: string;
  name: string;
  category: ExtraCategory;
  tier: ExtraTier;
  description: string;
  options: ExtraOptions;
  imagePath: string;
  tags: string[];
}

export const MENU_EXTRAS = [
  // Made-to-order salads — served with your choice of available Soul Good dressing.
  { id: "rainbow-crunch", name: "Rainbow Crunch", category: "salads", tier: "signature-salad", options: "dressing", tags: ["Raw", "Crunchy"],
    description: "Shredded green and red cabbage, carrots, sliced radishes, and fresh mint." },
  { id: "golden-garden", name: "Golden Garden", category: "salads", tier: "signature-salad", options: "dressing", tags: ["Roasted"],
    description: "Roasted butternut squash, cauliflower, carrots, and shredded green cabbage." },
  { id: "beet-and-bright", name: "Beet & Bright", category: "salads", tier: "signature-salad", options: "dressing", tags: ["Raw", "Bright"],
    description: "Sliced beets, red cabbage, shredded carrots, radishes, and fresh mint." },
  { id: "smoky-sweet-potato-salad", name: "Smoky Sweet Potato", category: "salads", tier: "signature-salad", options: "dressing", tags: ["Roasted", "Smoky"],
    description: "Smoked-paprika sweet potatoes, roasted cauliflower, green cabbage, and shredded carrots." },
  { id: "build-your-own-salad", name: "Build Your Own Salad", category: "salads", tier: "build-your-own", options: "build-your-own", tags: ["Your way"],
    description: "Choose one base and three toppings, finish with fresh mint if you like, and pick your dressing." },

  // Veggie snacks & light bites (from the salad menu).
  { id: "crunch-cup", name: "Crunch Cup", category: "veggie-cups", tier: "veggie-cup", options: "none", tags: ["Raw"],
    description: "Carrot sticks, radish wedges, and small raw cauliflower florets." },
  { id: "rainbow-slaw-cup", name: "Rainbow Slaw Cup", category: "veggie-cups", tier: "veggie-cup", options: "none", tags: ["Raw"],
    description: "Shredded green cabbage, red cabbage, carrots, and mint." },
  { id: "beet-and-carrot-cup", name: "Beet & Carrot Cup", category: "veggie-cups", tier: "veggie-cup", options: "none", tags: ["Raw"],
    description: "Sliced beets, shredded carrots, and mint." },
  { id: "golden-veggie-cup", name: "Golden Veggie Cup", category: "veggie-cups", tier: "veggie-cup", options: "none", tags: ["Roasted"],
    description: "Roasted butternut squash, cauliflower, and carrots." },
  { id: "smoky-sweet-potato-bites", name: "Smoky Sweet Potato Bites", category: "veggie-cups", tier: "veggie-cup", options: "none", tags: ["Roasted", "Smoky"],
    description: "Roasted sweet potato cubes with smoked paprika." },

  // Snacks & light bites — colorful vegetables, bold seasoning.
  { id: "jerk-cauliflower-bites", name: "Jerk Cauliflower Bites", category: "snacks", tier: "snack", options: "sauce", tags: ["Roasted", "Bold"],
    description: "Roasted cauliflower with bold jerk seasoning and thyme. Served with your choice of available Soul Good sauce." },
  { id: "smoky-sweet-potato-wedges", name: "Smoky Sweet Potato Wedges", category: "snacks", tier: "snack", options: "none", tags: ["Roasted", "Smoky"],
    description: "Thick-cut sweet potato wedges roasted with smoked paprika, garlic, and black pepper." },
  { id: "golden-curry-cup", name: "Golden Curry Cup", category: "snacks", tier: "snack", options: "none", tags: ["Roasted", "Warm spice"],
    description: "Curry-seasoned cauliflower, butternut squash, and carrots, roasted until tender." },
  { id: "roasted-cabbage-wedges", name: "Roasted Cabbage Wedges", category: "snacks", tier: "snack", options: "none", tags: ["Roasted"],
    description: "Tender green cabbage with browned edges, garlic, thyme, and black pepper." },
  { id: "rainbow-crunch-cup", name: "Rainbow Crunch Cup", category: "snacks", tier: "snack", options: "dressing", tags: ["Raw", "Crunchy"],
    description: "Shredded green and red cabbage, carrots, sliced radishes, and fresh mint. Dressing served separately." },
  { id: "beet-and-carrot-salad-cup", name: "Beet & Carrot Salad Cup", category: "snacks", tier: "snack", options: "dressing", tags: ["Raw", "Bright"],
    description: "Sliced beets, carrot ribbons, red cabbage, and fresh mint. Dressing served separately." },
  { id: "garden-crunch-and-dip", name: "Garden Crunch & Dip", category: "snacks", tier: "snack", options: "dip", tags: ["Raw", "Share"],
    description: "Carrot sticks, radish wedges, and small cauliflower florets with your choice of available Soul Good dip." },
  { id: "veggie-tasting-trio", name: "Veggie Tasting Trio", category: "snacks", tier: "tasting-trio", options: "trio", tags: ["Share"],
    description: "Choose three: jerk cauliflower, smoky sweet potatoes, golden curry vegetables, rainbow crunch, or beet-and-carrot salad." },
].map((item) => ({ ...item, imagePath: `/menu/${item.id}.webp` })) as unknown as readonly MenuExtra[];

export const EXTRA_IDS = MENU_EXTRAS.map((item) => item.id) as [string, ...string[]];

export const EXTRA_CATEGORIES: { id: ExtraCategory; title: string; eyebrow: string; blurb: string }[] = [
  { id: "salads", eyebrow: "Made to order", title: "Salads", blurb: "Crisp cabbage, bright vegetables, and your choice of Soul Good dressing." },
  { id: "veggie-cups", eyebrow: "Veggie bites", title: "Veggie cups", blurb: "Colorful vegetables, portioned for between meals." },
  { id: "snacks", eyebrow: "Snacks & light bites", title: "Something good between meals", blurb: "Bold seasoning, roasted and raw. A snack, a light bite, or an addition to your bowl." },
];

export const MAX_EXTRA_QUANTITY = 12;
export const MAX_EXTRA_LINES = 30;

export function findExtra(id: string): MenuExtra | undefined {
  return MENU_EXTRAS.find((item) => item.id === id);
}

export function extraPriceCents(id: string): number {
  const extra = findExtra(id);
  return extra ? TIER_PRICE_CENTS[extra.tier] : 0;
}

const DRESSING_IDS = DRESSINGS.map((item) => item.id) as [DressingId, ...DressingId[]];
const BASE_IDS = SALAD_BASES.map((item) => item.id) as [SaladBaseId, ...SaladBaseId[]];
const TOPPING_IDS = SALAD_TOPPINGS.map((item) => item.id) as [SaladToppingId, ...SaladToppingId[]];
const TRIO_IDS = TRIO_OPTIONS.map((item) => item.id) as [TrioOptionId, ...TrioOptionId[]];

/** One configured add-on in the cart. Options are validated against the item. */
export const extraLineSchema = z
  .strictObject({
    id: z.enum(EXTRA_IDS),
    quantity: z.number().int().min(1).max(MAX_EXTRA_QUANTITY),
    dressing: z.enum(DRESSING_IDS).optional(),
    base: z.enum(BASE_IDS).optional(),
    toppings: z.array(z.enum(TOPPING_IDS)).optional(),
    mint: z.boolean().optional(),
    trio: z.array(z.enum(TRIO_IDS)).optional(),
  })
  .superRefine((line, context) => {
    const extra = findExtra(line.id)!;
    const needsDressing = ["dressing", "sauce", "dip", "build-your-own"].includes(extra.options);
    const issue = (message: string, path: string) => context.addIssue({ code: "custom", path: [path], message });
    if (needsDressing && !line.dressing) issue(`Choose a ${extra.options === "sauce" ? "sauce" : extra.options === "dip" ? "dip" : "dressing"} for ${extra.name}`, "dressing");
    if (!needsDressing && line.dressing) issue(`${extra.name} does not take a dressing`, "dressing");
    if (extra.options === "build-your-own") {
      if (!line.base) issue("Choose a base for your salad", "base");
      const toppings = line.toppings ?? [];
      if (toppings.length !== TOPPINGS_PER_SALAD || new Set(toppings).size !== toppings.length)
        issue(`Choose ${TOPPINGS_PER_SALAD} different toppings`, "toppings");
    } else if (line.base || line.toppings || line.mint !== undefined) {
      issue(`${extra.name} is not customizable`, "base");
    }
    if (extra.options === "trio") {
      const trio = line.trio ?? [];
      if (trio.length !== TRIO_SIZE || new Set(trio).size !== trio.length) issue(`Choose ${TRIO_SIZE} different items for your trio`, "trio");
    } else if (line.trio) {
      issue(`${extra.name} is not a trio`, "trio");
    }
  });

export type ExtraLine = z.infer<typeof extraLineSchema>;

export const extraLinesSchema = z.array(extraLineSchema).max(MAX_EXTRA_LINES);

const nameOf = <T extends { id: string; name: string }>(list: readonly T[], id?: string) =>
  list.find((item) => item.id === id)?.name ?? "";

/** Human-readable choices, e.g. "Red cabbage · Beets, Radishes, Carrots · Mint · Lemon dressing". */
export function describeExtraOptions(line: ExtraLine): string {
  const parts: string[] = [];
  if (line.base) parts.push(nameOf(SALAD_BASES, line.base));
  if (line.toppings?.length) parts.push(line.toppings.map((id) => nameOf(SALAD_TOPPINGS, id)).join(", "));
  if (line.mint) parts.push("Fresh mint");
  if (line.trio?.length) parts.push(line.trio.map((id) => nameOf(TRIO_OPTIONS, id)).join(", "));
  if (line.dressing) parts.push(nameOf(DRESSINGS, line.dressing));
  return parts.join(" · ");
}

export function extraLineTotalCents(line: ExtraLine): number {
  return extraPriceCents(line.id) * line.quantity;
}

export function extrasTotalCents(lines: readonly ExtraLine[]): number {
  return lines.reduce((sum, line) => sum + extraLineTotalCents(line), 0);
}

export function extrasCount(lines: readonly ExtraLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Stable identity for a configuration, so the same choice stacks in the cart. */
export function extraLineKey(line: Omit<ExtraLine, "quantity">): string {
  return JSON.stringify([line.id, line.base ?? "", [...(line.toppings ?? [])].sort(), Boolean(line.mint), [...(line.trio ?? [])].sort(), line.dressing ?? ""]);
}

/** Canonical form for hashing into the signed tax quote. */
export function extrasFingerprint(lines: readonly ExtraLine[]): string {
  return JSON.stringify(
    [...lines].map((line) => [extraLineKey(line), line.quantity]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
  );
}

export const EXTRAS_STORAGE_KEY = "soulbowls:extras";

/** Adds a line to a cart, stacking identical configurations. */
export function addExtraLine(lines: readonly ExtraLine[], line: ExtraLine): ExtraLine[] {
  const key = extraLineKey(line);
  const existing = lines.find((item) => extraLineKey(item) === key);
  if (!existing) return [...lines, line].slice(0, MAX_EXTRA_LINES);
  return lines.map((item) =>
    item === existing ? { ...item, quantity: Math.min(MAX_EXTRA_QUANTITY, item.quantity + line.quantity) } : item,
  );
}

export function parseStoredExtras(value: string | null): ExtraLine[] {
  if (!value) return [];
  try {
    const parsed = extraLinesSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}
