import { z } from "zod";
import { billingAddressSchema, deliveryAddressSchema } from "./address";
import {
  bowlSelectionDraftSchema,
  bowlSelectionSchemaForPlan,
  MAX_MEALS_PER_DAY,
  MAX_MEAL_SETS_PER_ORDER,
  MAX_PEOPLE_PER_ORDER,
  mealSetCount,
} from "./bowl-selection";

export const checkoutInputSchema = z
  .object({
    acceptedTerms: z.literal(true),
    billingAddress: billingAddressSchema,
    billingName: z.object({
      givenName: z.string().trim().min(1).max(100),
      familyName: z.string().trim().min(1).max(100),
    }),
    bowlSelection: bowlSelectionDraftSchema,
    contact: z.object({
      givenName: z.string().trim().min(1).max(100),
      familyName: z.string().trim().min(1).max(100),
      email: z
        .string()
        .trim()
        .email()
        .max(254)
        .transform((email) => email.toLowerCase()),
      phone: z
        .string()
        .transform((phone) => phone.replace(/\D/g, ""))
        .refine(
          (phone) => /^1?\d{10}$/.test(phone),
          "Enter a valid US phone number",
        )
        .transform((phone) => `+${phone.length === 10 ? "1" : ""}${phone}`),
    }),
    deliveryAddress: deliveryAddressSchema.nullable(),
    fulfillmentMethod: z.enum(["pickup", "delivery"]),
    idempotencyKey: z.string().uuid(),
    leadId: z.string().trim().min(1).max(200),
    mealsPerDay: z.number().int().min(1).max(MAX_MEALS_PER_DAY).default(1),
    peopleCount: z.number().int().min(1).max(MAX_PEOPLE_PER_ORDER).default(1),
    paymentMethod: z.enum(["card", "apple-pay", "google-pay"]).default("card"),
    purchaseType: z.enum(["one-time", "weekly"]),
    sourceId: z.string().min(1).max(16384),
    verificationToken: z.string().min(1).max(16384).optional(),
    taxQuoteToken: z.string().min(1).max(4096),
    expectedTotalCents: z.number().int().positive(),
  })
  .superRefine((value, context) => {
    if (value.purchaseType === "weekly" && value.paymentMethod !== "card") {
      context.addIssue({
        code: "custom",
        path: ["paymentMethod"],
        message: "Weekly plans require a card",
      });
    }
    if (
      value.purchaseType === "weekly" &&
      value.fulfillmentMethod === "pickup"
    ) {
      context.addIssue({
        code: "custom",
        path: ["fulfillmentMethod"],
        message:
          "Weekly plans currently require delivery. Choose one-time for pickup.",
      });
    }
    if (
      (value.fulfillmentMethod === "delivery") !==
      Boolean(value.deliveryAddress)
    ) {
      context.addIssue({
        code: "custom",
        path: ["deliveryAddress"],
        message: "Provide an address for delivery only",
      });
    }
    if (
      mealSetCount(value.peopleCount, value.mealsPerDay) >
      MAX_MEAL_SETS_PER_ORDER
    ) {
      context.addIssue({
        code: "custom",
        path: ["peopleCount"],
        message: "Order exceeds the online limit",
      });
    }
    const selection = bowlSelectionSchemaForPlan(
      value.peopleCount,
      value.mealsPerDay,
    ).safeParse(value.bowlSelection);
    if (!selection.success)
      for (const issue of selection.error.issues) {
        context.addIssue({
          code: "custom",
          path: ["bowlSelection", ...issue.path],
          message: issue.message,
        });
      }
  });

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
