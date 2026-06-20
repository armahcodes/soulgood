/**
 * Soul Good — the real menu.
 *
 * Single source of truth for the Soul Good food menu, transcribed VERBATIM from
 * the official menu collateral (`Soul Good_Menu collection.pdf`). The menu is
 * organized into four pathway COLLECTIONS — Mindful, Performance, Detox, and
 * Alignment — each offering the same four CATEGORIES: Wraps, Bowls, Breakfast &
 * Essentials, and Juices & Hydration.
 *
 * Item names keep their ™ exactly as printed. Some items carry a parenthetical
 * `note` in the source (e.g. "(extra protein option)") which is preserved here
 * as a separate field so it can be styled distinctly from the dish name.
 *
 * This package is consumed by BOTH Next apps in the monorepo (the launch
 * microsite and the full website) so the menu only ever lives in one place.
 *
 * NOTE: the collection ids intentionally match the launch app's `Pathway` enum
 * (`mindful` | `performance` | `detox` | `alignment`) so a matched quiz pathway
 * maps directly to its menu collection. The source PDF prints "PERFOMANCE" (a
 * typo); the canonical id is `performance` and the display name is "Performance".
 */

export type MenuCollectionId =
  | "mindful"
  | "performance"
  | "detox"
  | "alignment";

export type MenuCategoryId = "wraps" | "bowls" | "breakfast" | "juices";

export interface MenuItem {
  /** Dish name exactly as printed, ™ intact. */
  name: string;
  /** Optional parenthetical qualifier from the source (without the parens). */
  note?: string;
}

export interface MenuCategory {
  id: MenuCategoryId;
  /** Display label, e.g. "Breakfast & Essentials". */
  label: string;
  items: MenuItem[];
}

export interface MenuCollection {
  id: MenuCollectionId;
  /** Display name, e.g. "Performance". */
  name: string;
  /** Short headline phrase from the collection page (verbatim). */
  tagline: string;
  /** Supporting description for the collection (verbatim). */
  description: string;
  categories: MenuCategory[];
}

/** Canonical category order, matching the printed menu. */
export const MENU_CATEGORY_ORDER: MenuCategoryId[] = [
  "wraps",
  "bowls",
  "breakfast",
  "juices",
];

/** Display labels for each category. */
export const MENU_CATEGORY_LABELS: Record<MenuCategoryId, string> = {
  wraps: "Wraps",
  bowls: "Bowls",
  breakfast: "Breakfast & Essentials",
  juices: "Juices & Hydration",
};

/** Canonical collection order, matching the printed menu. */
export const MENU_COLLECTION_ORDER: MenuCollectionId[] = [
  "mindful",
  "performance",
  "detox",
  "alignment",
];

/** The cover/brand line that opens the menu collateral (verbatim). */
export const MENU_BRAND = {
  headline: "Nourish. Heal. Elevate.",
  subhead: "Guided nourishment for every season of life.",
} as const;

export const MENU_COLLECTIONS: Record<MenuCollectionId, MenuCollection> = {
  mindful: {
    id: "mindful",
    name: "Mindful",
    tagline: "Balanced. Intentional.",
    description: "Clean nourishment without overthinking.",
    categories: [
      {
        id: "wraps",
        label: MENU_CATEGORY_LABELS.wraps,
        items: [
          { name: "California Soul Wrap\u2122" },
          { name: "Soulgood Glow Wrap\u2122" },
          { name: "Sunday Greens Wrap\u2122" },
        ],
      },
      {
        id: "bowls",
        label: MENU_CATEGORY_LABELS.bowls,
        items: [
          { name: "Glow Bowl\u2122" },
          { name: "Ancient Grain Wellness Bowl\u2122" },
          { name: "Herb Chicken Nourish Bowl\u2122" },
        ],
      },
      {
        id: "breakfast",
        label: MENU_CATEGORY_LABELS.breakfast,
        items: [
          { name: "California Breakfast Tacos\u2122" },
          { name: "Chia Glow Overnight Oats\u2122" },
          { name: "Protein Egg Packs\u2122" },
        ],
      },
      {
        id: "juices",
        label: MENU_CATEGORY_LABELS.juices,
        items: [
          { name: "Watermelon Mint Cooler\u2122" },
          { name: "Lavender Lemonade\u2122" },
          { name: "Green Goddess Glow\u2122 Smoothie" },
        ],
      },
    ],
  },
  performance: {
    id: "performance",
    name: "Performance",
    tagline: "Higher protein fuel",
    description: "For demanding, active lifestyles.",
    categories: [
      {
        id: "wraps",
        label: MENU_CATEGORY_LABELS.wraps,
        items: [
          {
            name: "Performance Soul Wrap\u2122",
            note: "higher protein version of Glow Wrap",
          },
          { name: "California Soul Wrap\u2122", note: "extra protein option" },
          { name: "Turkey Fuel Wrap\u2122" },
        ],
      },
      {
        id: "bowls",
        label: MENU_CATEGORY_LABELS.bowls,
        items: [
          { name: "Performance Power Bowl\u2122" },
          {
            name: "Glow Bowl\u2122",
            note: "performance build \u2014 added protein / macro forward",
          },
          { name: "Salmon Recovery Bowl\u2122" },
        ],
      },
      {
        id: "breakfast",
        label: MENU_CATEGORY_LABELS.breakfast,
        items: [
          { name: "Soulgood Chicken & Waffles\u2122" },
          { name: "California Breakfast Tacos\u2122" },
          { name: "Protein Egg Packs\u2122" },
        ],
      },
      {
        id: "juices",
        label: MENU_CATEGORY_LABELS.juices,
        items: [
          { name: "Golden Energy Smoothie\u2122" },
          { name: "Green Goddess Glow\u2122 Smoothie", note: "protein boost option" },
          { name: "Beet Energy Juice\u2122" },
        ],
      },
    ],
  },
  detox: {
    id: "detox",
    name: "Detox",
    tagline: "Reset & restore",
    description: "Reset, hydration, lighter nourishment & digestive support.",
    categories: [
      {
        id: "wraps",
        label: MENU_CATEGORY_LABELS.wraps,
        items: [
          { name: "Detox Greens Wrap\u2122" },
          { name: "Soulgood Glow Wrap\u2122", note: "lighter detox build" },
          { name: "Ginger Citrus Chicken Wrap\u2122" },
        ],
      },
      {
        id: "bowls",
        label: MENU_CATEGORY_LABELS.bowls,
        items: [
          { name: "Detox Greens Bowl\u2122" },
          { name: "Glow Bowl\u2122", note: "detox modification" },
          { name: "Anti-Inflammatory Bowl\u2122" },
        ],
      },
      {
        id: "breakfast",
        label: MENU_CATEGORY_LABELS.breakfast,
        items: [
          { name: "Chia Glow Overnight Oats\u2122" },
          { name: "Fresh Fruit Wellness Cups\u2122" },
          { name: "Detox Breakfast Bowl\u2122" },
        ],
      },
      {
        id: "juices",
        label: MENU_CATEGORY_LABELS.juices,
        items: [
          { name: "Green Detox Juice\u2122" },
          { name: "Ginger Lemon Cleanse\u2122" },
          { name: "Watermelon Mint Cooler\u2122" },
          { name: "Green Goddess Glow\u2122 Smoothie", note: "clean detox version" },
        ],
      },
    ],
  },
  alignment: {
    id: "alignment",
    name: "Alignment",
    tagline: "Personalized nourishment",
    description: "Aligned with lifestyle, beliefs & body goals.",
    categories: [
      {
        id: "wraps",
        label: MENU_CATEGORY_LABELS.wraps,
        items: [
          { name: "Plant-Based Wellness Wrap\u2122" },
          { name: "California Soul Wrap\u2122", note: "customizable" },
          { name: "Halal Herb Chicken Wrap\u2122" },
        ],
      },
      {
        id: "bowls",
        label: MENU_CATEGORY_LABELS.bowls,
        items: [
          { name: "Custom Lifestyle Bowl\u2122" },
          { name: "Glow Bowl\u2122", note: "customized build" },
          { name: "Vegan Nourish Bowl\u2122" },
        ],
      },
      {
        id: "breakfast",
        label: MENU_CATEGORY_LABELS.breakfast,
        items: [
          { name: "Chia Glow Overnight Oats\u2122" },
          { name: "Protein Egg Packs\u2122" },
          { name: "Plant-Forward Breakfast Bowl\u2122" },
        ],
      },
      {
        id: "juices",
        label: MENU_CATEGORY_LABELS.juices,
        items: [
          { name: "Adaptogen Wellness Blend\u2122" },
          {
            name: "Green Goddess Glow\u2122 Smoothie",
            note: "functional customization",
          },
          { name: "Lavender Lemonade\u2122" },
          { name: "Personalized Functional Smoothie\u2122" },
        ],
      },
    ],
  },
};

/** The four collections in canonical order. */
export const MENU_COLLECTION_LIST: MenuCollection[] = MENU_COLLECTION_ORDER.map(
  (id) => MENU_COLLECTIONS[id],
);

/** Flat list of every dish name in a collection (across all categories). */
export function getCollectionDishNames(id: MenuCollectionId): string[] {
  return MENU_COLLECTIONS[id].categories.flatMap((c) =>
    c.items.map((item) => item.name),
  );
}

/**
 * A short, de-duplicated "taste of your plan" preview for a collection — one
 * standout dish from each category, in category order.
 */
export function getCollectionPreview(id: MenuCollectionId): string[] {
  const seen = new Set<string>();
  const preview: string[] = [];
  for (const category of MENU_COLLECTIONS[id].categories) {
    const first = category.items[0];
    if (first && !seen.has(first.name)) {
      seen.add(first.name);
      preview.push(first.name);
    }
  }
  return preview;
}
