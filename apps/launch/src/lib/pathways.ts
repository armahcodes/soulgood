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
}

export const PATHWAY_DEFINITIONS: Record<Pathway, PathwayDefinition> = {
  mindful: {
    id: "mindful",
    name: "Mindful",
    descriptor: "Grounded. Present. Nourishing.",
    description:
      "For intentional eating, everyday wellness, and nourishment without overthinking.",
  },
  performance: {
    id: "performance",
    name: "Performance",
    descriptor: "Strength. Focus. Momentum.",
    description:
      "For active lifestyles, busy schedules, recovery, and sustained energy.",
  },
  detox: {
    id: "detox",
    name: "Detox",
    descriptor: "Release. Restore. Renew.",
    description:
      "For those seeking hydration, digestive support, lighter nourishment, and a fresh start.",
  },
  alignment: {
    id: "alignment",
    name: "Alignment",
    descriptor: "Balance. Harmony. Personalization.",
    description:
      "For those seeking nourishment aligned with their goals, values, and lifestyle.",
  },
};

/** The four pathway definitions in canonical order (matches `PATHWAYS`). */
export const PATHWAY_LIST: PathwayDefinition[] = PATHWAYS.map(
  (id) => PATHWAY_DEFINITIONS[id],
);
