import { PATHWAYS, type Pathway } from "./lead-schema";

/**
 * The four Soul Good pathways, transcribed VERBATIM from the Pathway Finder PDF
 * (`docs_new/Soul Good_Guide Questionnaire.pdf`, "Your Soul Good Pathway" page).
 *
 * NOTE: the PDF prints the title as "PERFOMANCE" (a typo). The canonical enum
 * value is `performance` (see `PATHWAYS` in lead-schema.ts); the display name and
 * descriptor below preserve the *intended* spelling.
 */
export interface PathwayDefinition {
  /** Canonical enum id used in the lead schema and matching. */
  id: Pathway;
  /** Display name, e.g. "Mindful". */
  name: string;
  /** The three-word descriptor, verbatim, e.g. "Grounded. Present. Nourishing." */
  descriptor: string;
  /** The "For ..." supporting sentence, verbatim. */
  description: string;
  /** A warm "note" line shown in a card on the results reveal (verbatim brand copy). */
  note: string;
  /** A short "taste of what's on your plan" preview — real menu items (™ intact). */
  dishes: string[];
}

export const PATHWAY_DEFINITIONS: Record<Pathway, PathwayDefinition> = {
  mindful: {
    id: "mindful",
    name: "Mindful",
    descriptor: "Grounded. Present. Nourishing.",
    description:
      "For intentional eating, everyday wellness, and nourishment without overthinking.",
    note: "Clean, balanced plates that ask nothing of you but to slow down and enjoy them.",
    dishes: [
      "Glow Bowl™",
      "Sunday Greens Wrap™",
      "Chia Glow Overnight Oats™",
      "Green Goddess Glow™ Smoothie",
    ],
  },
  performance: {
    id: "performance",
    name: "Performance",
    descriptor: "Strength. Focus. Momentum.",
    description:
      "For active lifestyles, busy schedules, recovery, and sustained energy.",
    note: "Higher-protein, macro-forward fuel built to keep up with everything you carry.",
    dishes: [
      "Performance Power Bowl™",
      "Turkey Fuel Wrap™",
      "Salmon Recovery Bowl™",
      "Golden Energy Smoothie™",
    ],
  },
  detox: {
    id: "detox",
    name: "Detox",
    descriptor: "Release. Restore. Renew.",
    description:
      "For those seeking hydration, digestive support, lighter nourishment, and a fresh start.",
    note: "Lighter, hydrating, anti-inflammatory plates that leave you feeling clear and renewed.",
    dishes: [
      "Detox Greens Bowl™",
      "Detox Greens Wrap™",
      "Green Detox Juice™",
      "Ginger Lemon Cleanse™",
    ],
  },
  alignment: {
    id: "alignment",
    name: "Alignment",
    descriptor: "Balance. Harmony. Personalization.",
    description:
      "For those seeking nourishment aligned with their goals, values, and lifestyle.",
    note: "Made-to-order plates tuned to your beliefs, your body, and the way you actually live.",
    dishes: [
      "Custom Lifestyle Bowl™",
      "Plant-Based Wellness Wrap™",
      "Halal Herb Chicken Wrap™",
      "Adaptogen Wellness Blend™",
    ],
  },
};

/** The four pathway definitions in canonical order (matches `PATHWAYS`). */
export const PATHWAY_LIST: PathwayDefinition[] = PATHWAYS.map(
  (id) => PATHWAY_DEFINITIONS[id],
);
