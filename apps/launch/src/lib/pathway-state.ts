import type { Pathway } from "./lead-schema";
import { matchPathway, type QuizAnswers } from "./quiz";

/** sessionStorage key the quiz writes and `/join` reads. */
export const PATHWAY_STATE_KEY = "sg_pathway_state";

/**
 * The handoff payload persisted to sessionStorage after the quiz completes.
 * Holds the matched pathway plus the full nutrition profile so `/join` can
 * merge it into the captured lead. Reflection prompts are optional free-text.
 */
export interface PathwayState {
  pathway: Pathway;
  dietary: string[];
  allergens: string[];
  foods: string[];
  priorities: string[];
  reflectBody?: string;
  reflectSoul?: string;
}

/**
 * Build the persisted state from the guest's answers: compute the matched
 * pathway and gather the nutrition profile. Profile fields never affect the
 * match (see `matchPathway`), they are carried forward for the lead.
 */
export function buildPathwayState(answers: QuizAnswers): PathwayState {
  const reflectBody = answers.reflectBody?.trim();
  const reflectSoul = answers.reflectSoul?.trim();
  return {
    pathway: matchPathway(answers),
    dietary: answers.dietary ?? [],
    allergens: answers.allergens ?? [],
    foods: answers.foods ?? [],
    priorities: answers.priorities ?? [],
    ...(reflectBody ? { reflectBody } : {}),
    ...(reflectSoul ? { reflectSoul } : {}),
  };
}

/** Persist the pathway state to sessionStorage (no-op on the server). */
export function savePathwayState(state: PathwayState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PATHWAY_STATE_KEY, JSON.stringify(state));
}

/** Read the pathway state from sessionStorage; null when absent or malformed. */
export function loadPathwayState(): PathwayState | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(PATHWAY_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PathwayState;
  } catch {
    return null;
  }
}

/**
 * Toggle a value within a multi-select answer, enforcing an optional max.
 *
 * - Already selected → removed.
 * - Not selected and under the cap (or no cap) → added.
 * - Not selected but at the cap → returned UNCHANGED (selection blocked).
 */
export function toggleSelection(
  current: string[],
  value: string,
  max?: number,
): string[] {
  if (current.includes(value)) {
    return current.filter((v) => v !== value);
  }
  if (typeof max === "number" && current.length >= max) {
    return current;
  }
  return [...current, value];
}
