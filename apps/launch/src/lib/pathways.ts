import { getCollectionPreview } from "@soulgood/menu";
import { PATHWAYS, type Pathway } from "./lead-schema";

/**
 * The four Soul Good pathways, transcribed VERBATIM from the Pathway Finder PDF
 * (`docs_new/Soul Good_Guide Questionnaire.pdf`, "Your Soul Good Pathway" page).
 *
 * NOTE: the PDF prints the title as "PERFOMANCE" (a typo). The canonical enum
 * value is `performance` (see `PATHWAYS` in lead-schema.ts); the display name and
 * descriptor below preserve the *intended* spelling.
 *
 * The pathway id is identical to its menu collection id, so each pathway maps
 * directly to a collection in `@soulgood/menu` (the single source of truth for
 * the actual menu items). The `dishes` preview below is DERIVED from that menu —
 * it is not hand-maintained — so the result reveal can never drift from the real
 * menu. Use `MENU_COLLECTIONS[pathway]` (from `@soulgood/menu`) to render the
 * full, category-grouped menu.
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
  /** A short "taste of your plan" preview — DERIVED from the real menu (™ intact). */
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
    dishes: getCollectionPreview("mindful"),
  },
  performance: {
    id: "performance",
    name: "Performance",
    descriptor: "Strength. Focus. Momentum.",
    description:
      "For active lifestyles, busy schedules, recovery, and sustained energy.",
    note: "Higher-protein, macro-forward fuel built to keep up with everything you carry.",
    dishes: getCollectionPreview("performance"),
  },
  detox: {
    id: "detox",
    name: "Detox",
    descriptor: "Release. Restore. Renew.",
    description:
      "For those seeking hydration, digestive support, lighter nourishment, and a fresh start.",
    note: "Lighter, hydrating, anti-inflammatory plates that leave you feeling clear and renewed.",
    dishes: getCollectionPreview("detox"),
  },
  alignment: {
    id: "alignment",
    name: "Alignment",
    descriptor: "Balance. Harmony. Personalization.",
    description:
      "For those seeking nourishment aligned with their goals, values, and lifestyle.",
    note: "Made-to-order plates tuned to your beliefs, your body, and the way you actually live.",
    dishes: getCollectionPreview("alignment"),
  },
};

/** The four pathway definitions in canonical order (matches `PATHWAYS`). */
export const PATHWAY_LIST: PathwayDefinition[] = PATHWAYS.map(
  (id) => PATHWAY_DEFINITIONS[id],
);
