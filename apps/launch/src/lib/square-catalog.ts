import type { BowlSelection } from "./bowl-selection";
import {
  describeExtraOptions,
  findExtra,
  TIER_PRICE_CENTS,
  type ExtraLine,
  type ExtraTier,
} from "./menu-extras";
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

/** One Square catalog item ("Soul Good Salads & Light Bites") with a variation per price tier. */
const ADD_ON_VARIATION_ENV: Record<ExtraTier, string> = {
  "signature-salad": "SQUARE_ADDON_SIGNATURE_SALAD_VARIATION_ID",
  "build-your-own": "SQUARE_ADDON_BUILD_YOUR_OWN_SALAD_VARIATION_ID",
  "veggie-cup": "SQUARE_ADDON_VEGGIE_CUP_VARIATION_ID",
  snack: "SQUARE_ADDON_SNACK_VARIATION_ID",
  "tasting-trio": "SQUARE_ADDON_TASTING_TRIO_VARIATION_ID",
};

export type SquareCatalogConfig = {
  bowlVariationIds: Record<BowlId, string>;
  deliveryVariationId: string;
  weeklyPlanVariationId: string;
  /** Present only when every salad/snack tier is configured in Square. */
  addOnVariationIds?: Record<ExtraTier, string>;
};

export function getAddOnVariationIds(): Record<ExtraTier, string> | undefined {
  const entries = (Object.keys(ADD_ON_VARIATION_ENV) as ExtraTier[]).map(
    (tier) => [tier, process.env[ADD_ON_VARIATION_ENV[tier]]?.trim()] as const,
  );
  return entries.every(([, id]) => id)
    ? (Object.fromEntries(entries) as Record<ExtraTier, string>)
    : undefined;
}

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

  const addOnVariationIds = getAddOnVariationIds();
  return {
    bowlVariationIds: bowlVariationIds as Record<BowlId, string>,
    deliveryVariationId,
    weeklyPlanVariationId,
    ...(addOnVariationIds ? { addOnVariationIds } : {}),
  };
}

/** Salads and snacks as tier-priced catalog line items; the note carries the dish and choices. */
export function squareExtraLineItems(
  lines: readonly ExtraLine[],
  config: SquareCatalogConfig,
): SquareOrderLineItem[] {
  if (!lines.length) return [];
  if (!config.addOnVariationIds) throw new Error("Salads and snacks are not configured in Square");
  const ids = config.addOnVariationIds;
  return lines.map((line) => {
    const extra = findExtra(line.id);
    if (!extra) throw new Error("Unknown menu item");
    const options = describeExtraOptions(line);
    return {
      quantity: String(line.quantity),
      catalog_object_id: ids[extra.tier],
      base_price_money: { amount: TIER_PRICE_CENTS[extra.tier], currency: "USD" as const },
      note: options ? `${extra.name} · ${options}` : extra.name,
    };
  });
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
