/**
 * Current customer-facing Soul Bowls™ offer.
 *
 * Source: Soul Good - Jar Production.xlsx, "Jar Menu" and "Instructions" tabs.
 * The workbook's $55 pilot price is intentionally not used here; the current
 * customer price remains the canonical $88 five-bowl value in brand.ts.
 */

export type BowlServing = "Cold or warm" | "Warm";

export interface CurrentBowl {
  id: BowlId;
  name: string;
  serving: BowlServing;
  ingredients: string;
  dietary: string[];
  allergen?: string;
  imagePath: string;
  tone: string;
}

export const BOWL_IDS = [
  "glow-bowl",
  "golden-harvest-bowl",
  "jerk-wellness-bowl",
  "performance-power-bowl",
  "herb-chicken-nourish-bowl",
] as const;

export type BowlId = (typeof BOWL_IDS)[number];

export const CURRENT_BOWLS: CurrentBowl[] = [
  {
    id: "glow-bowl",
    name: "Glow Bowl™",
    serving: "Cold or warm",
    ingredients:
      "Greens, quinoa, cucumber, avocado, herbs, and lemon dressing.",
    dietary: ["Made fresh", "Plant-forward"],
    imagePath: "/api/product-image/glow-bowl",
    tone: "bg-gold/42",
  },
  {
    id: "golden-harvest-bowl",
    name: "Golden Harvest Bowl™",
    serving: "Cold or warm",
    ingredients:
      "Roasted sweet potato, carrots, quinoa, chickpeas, greens, and tahini herb dressing.",
    dietary: ["Plant-forward", "Protein-rich"],
    allergen: "Contains sesame",
    imagePath: "/api/product-image/golden-harvest-bowl",
    tone: "bg-sage/16",
  },
  {
    id: "jerk-wellness-bowl",
    name: "Jerk Wellness Bowl™",
    serving: "Cold or warm",
    ingredients:
      "Jerk chicken, brown rice, roasted vegetables, greens, herbs, and jerk sauce.",
    dietary: ["Rooted in nature", "Clean ingredients"],
    allergen: "Marinade may contain soy or wheat",
    imagePath: "/api/product-image/jerk-wellness-bowl",
    tone: "bg-clay/16",
  },
  {
    id: "performance-power-bowl",
    name: "Performance Power Bowl™",
    serving: "Cold or warm",
    ingredients:
      "Grilled chicken, brown rice, sweet potato, broccoli, herbs, and house dressing.",
    dietary: ["Higher protein", "Performance fuel"],
    imagePath: "/api/product-image/performance-power-bowl",
    tone: "bg-sand/62",
  },
  {
    id: "herb-chicken-nourish-bowl",
    name: "Herb Chicken Nourish Bowl™",
    serving: "Cold or warm",
    ingredients:
      "Herb chicken, quinoa, greens, roasted vegetables, herbs, and light dressing.",
    dietary: ["Clean, balanced flavors", "Mindful nourishment"],
    imagePath: "/api/product-image/herb-chicken-nourish-bowl",
    tone: "bg-gold/26",
  },
];

export const CURRENT_OFFER = {
  jarSizeOunces: 32,
  bowlsPerWeek: CURRENT_BOWLS.length,
  format: "32 oz wide-mouth glass jars",
  storage: "Keep refrigerated and follow the prep and eat-by dates on each jar.",
  coldServing: "Plate and enjoy straight from the refrigerator.",
  warmServing: "Remove the lid, transfer to a microwave-safe bowl, and warm before serving.",
} as const;
