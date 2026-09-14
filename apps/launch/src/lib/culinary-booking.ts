import { z } from "zod";
import { deliveryAddressSchema } from "./address";
import { type BowlSelection, bowlSelectionTotal } from "./bowl-selection";
import { FULFILLMENT, PRICING } from "./brand";
import {
  AVAILABLE_BOWLS,
  BOWL_IDS,
  CURRENT_BOWLS,
  CURRENT_OFFER,
} from "./current-offer";

export const CULINARY_PRICING = {
  bowlUnitCents: PRICING.oneTimeCents / CURRENT_OFFER.bowlsPerWeek,
  deliveryMinimumBowls: 10,
  platedPersonCents: 5_500,
  platedFoodMinimumCents: 55_500,
  platedSupportCents: 50_000,
  depositPercentage: 50,
  deliveryCents: FULFILLMENT.delivery.amountCents,
} as const;
export const MAX_CULINARY_BOWLS = 10_000;
export const CULINARY_QUOTE_TTL_MS = 30 * 60 * 1000;
export type CulinaryExperience = "delivery" | "plated";
export const PLATED_MENU_IDS = [
  "chefs-selection",
  "plant-forward",
  "chicken",
] as const;
export type PlatedMenuId = (typeof PLATED_MENU_IDS)[number];
export const PLATED_MENUS: {
  id: PlatedMenuId;
  name: string;
  description: string;
}[] = [
  {
    id: "chefs-selection",
    name: "Chef’s selection",
    description: "A thoughtful mix of chicken and plant-forward dishes.",
  },
  {
    id: "plant-forward",
    name: "Plant-forward",
    description:
      "Vegetables, grains, and legumes with bright herbs and dressings.",
  },
  {
    id: "chicken",
    name: "Chicken",
    description: "Chicken with grains, vegetables, and flavorful dressings.",
  },
];
export function platedMenuName(id: PlatedMenuId): string {
  return PLATED_MENUS.find((menu) => menu.id === id)!.name;
}

export function todayInLosAngeles(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose an event date")
  .refine((value) => {
    const date = new Date(`${value}T12:00:00Z`);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value &&
      value >= todayInLosAngeles()
    );
  }, "Choose today or a future event date");

export const culinaryInputSchema = z
  .strictObject({
    experience: z.enum(["delivery", "plated"]),
    guestCount: z.number().int().min(1).max(MAX_CULINARY_BOWLS).optional(),
    platedMenu: z.enum(PLATED_MENU_IDS).optional(),
    bowlSelection: z
      .record(z.enum(BOWL_IDS), z.number().int().min(0).max(MAX_CULINARY_BOWLS))
      .default(() => balancedCulinarySelection(0)),
    eventDate: dateSchema,
    eventTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose an event time"),
    occasion: z.string().trim().max(120).default(""),
    address: deliveryAddressSchema,
  })
  .superRefine((input, context) => {
    const recipeCount = bowlSelectionTotal(input.bowlSelection);
    const count = culinaryServingCount(input);
    if (input.platedMenu && input.experience !== "plated")
      context.addIssue({
        code: "custom",
        path: ["platedMenu"],
        message: "Menu styles are only available for plated experiences",
      });
    if (input.platedMenu && recipeCount > 0)
      context.addIssue({
        code: "custom",
        path: ["bowlSelection"],
        message:
          "Choose a food style for the group, not individual bowl quantities",
      });
    if (
      input.experience === "plated" &&
      (!input.guestCount || count !== input.guestCount)
    )
      context.addIssue({
        code: "custom",
        path: ["guestCount"],
        message:
          "Choose one plated serving for each guest. Your menu total must match your guest count.",
      });
    const minimum =
      input.experience === "delivery"
        ? CULINARY_PRICING.deliveryMinimumBowls
        : 1;
    if (count < minimum)
      context.addIssue({
        code: "custom",
        path: ["bowlSelection"],
        message:
          input.experience === "delivery"
            ? "Delivery-only bookings require at least 10 bowls"
            : "Enter at least one guest for your plated experience",
      });
    if (count > MAX_CULINARY_BOWLS)
      context.addIssue({
        code: "custom",
        path: ["bowlSelection"],
        message: "Please contact us directly for an event of this size",
      });
    for (const bowl of CURRENT_BOWLS) {
      if (!bowl.available && input.bowlSelection[bowl.id] > 0)
        context.addIssue({
          code: "custom",
          path: ["bowlSelection", bowl.id],
          message: `${bowl.name} is currently sold out`,
        });
    }
  });
export type CulinaryInput = z.infer<typeof culinaryInputSchema>;

export function culinaryServingCount(input: {
  experience: CulinaryExperience;
  guestCount?: number;
  platedMenu?: PlatedMenuId;
  bowlSelection: BowlSelection;
}): number {
  return input.experience === "plated" && input.platedMenu
    ? (input.guestCount ?? 0)
    : bowlSelectionTotal(input.bowlSelection);
}

export const culinaryRequestSchema = z.strictObject({
  quoteId: z.string().uuid(),
  contact: z.strictObject({
    name: z.string().trim().min(2, "Enter your name").max(120),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email")
      .max(254),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/[\s()+.-]/g, ""))
      .refine(
        (value) => /^(1)?[2-9]\d{9}$/.test(value),
        "Enter a valid US phone number",
      ),
  }),
  company: z.string().trim().max(120).default(""),
  notes: z.string().trim().max(2000).default(""),
  acceptedEstimate: z.literal(true, {
    error:
      "Confirm that this is a booking request, not a confirmed reservation",
  }),
});
export type CulinaryRequest = z.infer<typeof culinaryRequestSchema>;

export type CulinaryLineItem = {
  id: string;
  kind: "bowl" | "plated" | "minimum" | "support" | "delivery";
  label: string;
  quantity: number;
  unitCents: number;
  amountCents: number;
};

export function culinaryLineItems(
  experience: CulinaryExperience,
  selection: BowlSelection,
  options: { platedMenu?: PlatedMenuId; guestCount?: number } = {},
): CulinaryLineItem[] {
  const unitCents =
    experience === "plated"
      ? CULINARY_PRICING.platedPersonCents
      : CULINARY_PRICING.bowlUnitCents;
  const items: CulinaryLineItem[] =
    experience === "plated" && options.platedMenu
      ? [
          {
            id: `plated-${options.platedMenu}`,
            kind: "plated",
            label: `Plated menu — ${platedMenuName(options.platedMenu)}`,
            quantity: options.guestCount ?? 0,
            unitCents,
            amountCents: (options.guestCount ?? 0) * unitCents,
          },
        ]
      : CURRENT_BOWLS.filter((bowl) => selection[bowl.id] > 0).map((bowl) => ({
          id: bowl.id,
          kind: "bowl",
          label: bowl.name,
          quantity: selection[bowl.id],
          unitCents,
          amountCents: selection[bowl.id] * unitCents,
        }));
  if (experience === "plated") {
    const food = items.reduce((sum, item) => sum + item.amountCents, 0);
    const adjustment = Math.max(
      0,
      CULINARY_PRICING.platedFoodMinimumCents - food,
    );
    if (adjustment)
      items.push({
        id: "food-minimum",
        kind: "minimum",
        label: "Culinary food minimum adjustment",
        quantity: 1,
        unitCents: adjustment,
        amountCents: adjustment,
      });
    items.push({
      id: "culinary-support",
      kind: "support",
      label: "Required culinary support & ingredient education",
      quantity: 1,
      unitCents: CULINARY_PRICING.platedSupportCents,
      amountCents: CULINARY_PRICING.platedSupportCents,
    });
  }
  items.push({
    id: "event-delivery",
    kind: "delivery",
    label: "Los Angeles County delivery",
    quantity: 1,
    unitCents: CULINARY_PRICING.deliveryCents,
    amountCents: CULINARY_PRICING.deliveryCents,
  });
  return items;
}

export function balancedCulinarySelection(count: number): BowlSelection {
  const validCount = Number.isFinite(count)
    ? Math.max(0, Math.min(MAX_CULINARY_BOWLS, Math.floor(count)))
    : 0;
  return Object.fromEntries(
    BOWL_IDS.map((id) => {
      const index = AVAILABLE_BOWLS.findIndex((bowl) => bowl.id === id);
      return [
        id,
        index < 0
          ? 0
          : Math.floor(validCount / AVAILABLE_BOWLS.length) +
            (index < validCount % AVAILABLE_BOWLS.length ? 1 : 0),
      ];
    }),
  ) as BowlSelection;
}

export type CulinaryQuote = {
  id: string;
  reference: string;
  input: CulinaryInput;
  items: CulinaryLineItem[];
  bowlCount: number;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxPercentage: string;
  jurisdiction: string;
  currency: "USD";
  createdAt: string;
  expiresAt: string;
  /** Absent on historical quotes, which must never create new invoices. */
  pricingVersion?: 2;
  paymentSchedule?: CulinaryPaymentSchedule;
};

export type CulinaryPaymentSchedule = {
  depositPercentage: 50;
  depositCents: number;
  balanceCents: number;
  balanceDueDate: string;
  balanceTiming: "Before our team arrives";
};

export function culinaryPaymentSchedule(
  totalCents: number,
  eventDate: string,
): CulinaryPaymentSchedule {
  if (!Number.isSafeInteger(totalCents) || totalCents < 0)
    throw new Error("Invalid culinary total");
  const depositCents = Math.round(totalCents / 2);
  return {
    depositPercentage: 50,
    depositCents,
    balanceCents: totalCents - depositCents,
    balanceDueDate: eventDate,
    balanceTiming: "Before our team arrives",
  };
}
