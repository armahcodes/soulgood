import {
  bowlSelectionSchemaForPlan,
  type BowlSelection,
} from "./bowl-selection";
import type { FulfillmentMethod, PurchaseType } from "./brand";

export const LAST_ORDER_STORAGE_KEY = "soulbowls:lastOrder";
export const ACTIVE_CHECKOUT_STORAGE_KEY = "soulbowls:activeCheckout";

export type LastOrderConfirmation = {
  version: 1;
  purchaseType: PurchaseType;
  status: string;
  squareObjectId: string;
  squareOrderId?: string;
  receiptUrl?: string;
  acceptedAt: string;
  fulfillmentMethod: FulfillmentMethod;
  peopleCount: number;
  mealsPerDay: number;
  bowlSelection: BowlSelection;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paymentPending?: boolean;
};

export function parseLastOrderConfirmation(
  value: string | null,
): LastOrderConfirmation | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<LastOrderConfirmation>;
    const purchaseTypeIsValid =
      parsed.purchaseType === "one-time" || parsed.purchaseType === "weekly";
    const fulfillmentIsValid =
      parsed.fulfillmentMethod === "pickup" ||
      parsed.fulfillmentMethod === "delivery";
    const countsAreValid =
      Number.isInteger(parsed.peopleCount) &&
      Number.isInteger(parsed.mealsPerDay) &&
      typeof parsed.peopleCount === "number" &&
      typeof parsed.mealsPerDay === "number";
    const amountsAreValid = [
      parsed.subtotalCents,
      parsed.taxCents,
      parsed.totalCents,
    ].every((amount) => typeof amount === "number" && amount >= 0);

    if (
      parsed.version !== 1 ||
      !purchaseTypeIsValid ||
      !fulfillmentIsValid ||
      !countsAreValid ||
      !amountsAreValid ||
      !parsed.squareObjectId ||
      !parsed.status ||
      !parsed.acceptedAt ||
      !parsed.bowlSelection ||
      !bowlSelectionSchemaForPlan(
        parsed.peopleCount as number,
        parsed.mealsPerDay as number,
      ).safeParse(parsed.bowlSelection).success
    ) {
      return null;
    }

    return parsed as LastOrderConfirmation;
  } catch {
    return null;
  }
}
