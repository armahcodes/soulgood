import type { BowlSelection } from "./bowl-selection";
import { PRICING } from "./brand";
import {
  BOWL_IDS,
  CURRENT_BOWLS,
  CURRENT_OFFER,
  type BowlId,
} from "./current-offer";

const BOWL_VARIATION_ENV: Record<BowlId, string> = {
  "glow-bowl": "SQUARE_GLOW_BOWL_VARIATION_ID",
  "golden-harvest-bowl": "SQUARE_GOLDEN_HARVEST_BOWL_VARIATION_ID",
  "jerk-wellness-bowl": "SQUARE_JERK_WELLNESS_BOWL_VARIATION_ID",
  "performance-power-bowl": "SQUARE_PERFORMANCE_POWER_BOWL_VARIATION_ID",
  "herb-chicken-nourish-bowl": "SQUARE_HERB_CHICKEN_BOWL_VARIATION_ID",
  "anti-inflammatory-bowl": "SQUARE_ANTI_INFLAMMATORY_BOWL_VARIATION_ID",
};

export const BOWL_UNIT_PRICE_CENTS =
  PRICING.oneTimeCents / CURRENT_OFFER.bowlsPerWeek;

if (!Number.isInteger(BOWL_UNIT_PRICE_CENTS)) {
  throw new Error("The five-bowl price must divide evenly into catalog units");
}

export type SquareCatalogConfig = {
  bowlVariationIds: Record<BowlId, string>;
  deliveryVariationId: string;
  weeklyPlanVariationId: string;
};

export type SquareOrderLineItem = {
  quantity: string;
  catalog_object_id: string;
  base_price_money: { amount: number; currency: "USD" };
  note: string;
};

export function getSquareCatalogConfig(): SquareCatalogConfig | null {
  const bowlVariationIds = Object.fromEntries(
    BOWL_IDS.map((id) => [id, process.env[BOWL_VARIATION_ENV[id]]?.trim()]),
  ) as Record<BowlId, string | undefined>;
  const deliveryVariationId =
    process.env.SQUARE_SOUL_BOWLS_DELIVERY_VARIATION_ID?.trim();
  const weeklyPlanVariationId =
    process.env.SQUARE_WEEKLY_ITEMIZED_PLAN_VARIATION_ID?.trim();

  if (
    BOWL_IDS.some((id) => !bowlVariationIds[id]) ||
    !deliveryVariationId ||
    !weeklyPlanVariationId
  ) {
    return null;
  }

  return {
    bowlVariationIds: bowlVariationIds as Record<BowlId, string>,
    deliveryVariationId,
    weeklyPlanVariationId,
  };
}

export function squareBowlLineItems(
  selection: BowlSelection,
  config: SquareCatalogConfig,
): SquareOrderLineItem[] {
  return CURRENT_BOWLS.flatMap((bowl) => {
    const quantity = selection[bowl.id];
    if (quantity <= 0) return [];
    return [
      {
        quantity: String(quantity),
        catalog_object_id: config.bowlVariationIds[bowl.id],
        base_price_money: {
          amount: BOWL_UNIT_PRICE_CENTS,
          currency: "USD" as const,
        },
        note: `${CURRENT_OFFER.jarSizeOunces} oz jar · ${bowl.serving}`,
      },
    ];
  });
}
