import { z } from "zod";

export const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "AS",
  "GU",
  "MP",
  "PR",
  "VI",
  "AA",
  "AE",
  "AP",
] as const;

export const billingAddressSchema = z.object({
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: z.string().trim().max(200).default(""),
  city: z.string().trim().min(2).max(100),
  state: z.enum(US_STATES),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}(?:-\d{4})?$/),
});

export const deliveryAddressSchema = billingAddressSchema.extend({
  state: z.literal("CA"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/),
});

export type BillingAddress = z.infer<typeof billingAddressSchema>;
export type DeliveryAddress = z.infer<typeof deliveryAddressSchema>;
