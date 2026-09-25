import { bowlSelectionSchemaForPlan, type BowlSelection } from "./bowl-selection";
import type { FulfillmentMethod } from "./brand";

/**
 * The most recent confirmed mix, kept on this device (bowls and plan size only,
 * no contact or payment details) so returning customers can reorder in a tap.
 */
export const LAST_MIX_KEY = "soulbowls:lastMix";

export type LastMix = {
  version: 1;
  bowlSelection: BowlSelection;
  peopleCount: number;
  mealsPerDay: number;
  fulfillmentMethod: FulfillmentMethod;
  savedAt: string;
};

export function parseLastMix(value: string | null): LastMix | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<LastMix>;
    if (
      parsed.version !== 1 ||
      (parsed.fulfillmentMethod !== "pickup" && parsed.fulfillmentMethod !== "delivery") ||
      !Number.isInteger(parsed.peopleCount) ||
      !Number.isInteger(parsed.mealsPerDay) ||
      typeof parsed.savedAt !== "string" ||
      !bowlSelectionSchemaForPlan(parsed.peopleCount!, parsed.mealsPerDay!).safeParse(parsed.bowlSelection).success
    )
      return null;
    return parsed as LastMix;
  } catch {
    return null;
  }
}
