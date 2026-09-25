import { z } from "zod";

/**
 * Food for the Soul — host application for community meal drives.
 *
 * Fairness by design:
 * - We ask only about the organization, the site, logistics, and community-level
 *   need. We never ask about the race, ethnicity, religion, national origin,
 *   immigration status, sex, gender identity, sexual orientation, age,
 *   disability, or other protected characteristics of applicants or of the
 *   people who will receive meals, and we collect no data about recipients.
 * - Need is described with neutral, community-level indicators focused on
 *   households at risk of going without enough food.
 * - Every host commits to open, first-come, first-served distribution with no
 *   eligibility checks, and to the non-discrimination statement below.
 * - The review checklist is published and identical for every applicant; it
 *   never depends on organization type, and complete applications are reviewed
 *   in the order received.
 */

export const MEAL_DRIVE_PATH = "/food-for-the-soul/host";
export const MEAL_DRIVE_COUNTIES = ["Los Angeles", "Orange"] as const;
export const MEAL_DRIVE_LEAD_DAYS = 21;

export const ORGANIZATION_TYPES = [
  { value: "nonprofit", label: "Nonprofit or charity" },
  { value: "school", label: "School, college, or PTA" },
  { value: "faith", label: "Faith community" },
  { value: "community", label: "Community center or neighborhood group" },
  { value: "tenant", label: "Tenant or resident association" },
  { value: "mutual-aid", label: "Mutual-aid group" },
  { value: "health", label: "Clinic or health organization" },
  { value: "public", label: "Public agency or library" },
  { value: "other", label: "Other organization" },
] as const;

/** Community-level signals that households nearby are at risk of going without enough food. */
export const NEED_INDICATORS = [
  { value: "food-insecurity", label: "Households nearby regularly run short on food" },
  { value: "grocery-access", label: "Limited nearby access to fresh, affordable groceries" },
  { value: "emergency", label: "A recent emergency, such as a fire, flood, job losses, or displacement" },
  { value: "housing", label: "Neighbors facing housing instability or homelessness" },
  { value: "cost-of-living", label: "Households stretched by rising living costs" },
  { value: "other", label: "Another community need (describe below)" },
] as const;

export const TIME_WINDOWS = [
  { value: "morning", label: "Morning (8–11 am)" },
  { value: "midday", label: "Midday (11 am–2 pm)" },
  { value: "afternoon", label: "Afternoon (2–5 pm)" },
  { value: "evening", label: "Evening (5–8 pm)" },
] as const;

export const SITE_SETTINGS = [
  { value: "indoor", label: "Indoors" },
  { value: "outdoor", label: "Outdoors" },
  { value: "both", label: "Indoors and outdoors" },
] as const;

export const SITE_FEATURES = [
  { value: "step-free", label: "Step-free access for people using wheelchairs, walkers, or strollers" },
  { value: "handwashing", label: "Restrooms or a handwashing station for volunteers" },
  { value: "shade", label: "Shade or shelter from weather" },
  { value: "tables", label: "Tables we can serve from" },
  { value: "transit", label: "Near public transit or free parking" },
] as const;

export const NON_DISCRIMINATION_STATEMENT =
  "Food for the Soul meals are for anyone who comes. No one is turned away or treated differently because of race, color, religion or creed, national origin, ancestry, citizenship or immigration status, sex, gender, gender identity or expression, sexual orientation, age, disability, medical condition, genetic information, marital or family status, military or veteran status, income, housing status, or any other characteristic protected by law.";

export const HOST_COMMITMENTS = [
  { key: "firstComeFirstServed", label: "Meals will be offered to everyone who comes, first come, first served, while supplies last." },
  { key: "noEligibilityChecks", label: "No one will be asked for ID, proof of income, immigration status, residency, or membership to receive a meal." },
  { key: "noConditions", label: "Receiving a meal will never depend on joining, attending, or taking part in any program, service, sale, or religious activity." },
  { key: "noRecipientData", label: "We won’t collect names, photos, or other personal information from people receiving meals without their clear permission." },
  { key: "nonDiscrimination", label: "We agree to the Food for the Soul non-discrimination commitment." },
  { key: "foodSafety", label: "Our volunteers will follow Soul Good’s food-safety and handling guidance on drive day." },
] as const;
type CommitmentKey = (typeof HOST_COMMITMENTS)[number]["key"];

const enumOf = <T extends readonly { value: string }[]>(list: T) =>
  z.enum(list.map((item) => item.value) as [T[number]["value"], ...T[number]["value"][]]);

const text = (max: number) => z.string().trim().max(max);
const required = (label: string, max = 160) => z.string().trim().min(2, `Please enter ${label}.`).max(max);

function daysFromToday(date: string, today: string): number {
  return Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000);
}

export const organizationStepSchema = z.object({
  organizationName: required("your organization’s name"),
  organizationType: enumOf(ORGANIZATION_TYPES),
  organizationWebsite: text(200).default(""),
  contactName: required("your name", 100),
  contactRole: required("your role", 100),
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email.").max(254)),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()+.-]/g, ""))
    .refine((value) => /^(1)?[2-9]\d{9}$/.test(value), "Please enter a valid US phone number."),
});

export const communityStepSchema = z.object({
  communityArea: required("the neighborhood or area you’ll serve", 200),
  households: z.coerce
    .number({ error: "Please enter an estimate." })
    .int("Please enter a whole number.")
    .min(25, "Drives serve at least 25 households.")
    .max(2000, "For more than 2,000 households, please email us."),
  needs: z.array(enumOf(NEED_INDICATORS)).min(1, "Choose at least one community need."),
  needDetails: text(1500).default(""),
});

export const siteStepSchema = z.object({
  siteName: text(160).default(""),
  addressLine1: required("the site address", 200),
  city: required("the city", 100),
  postalCode: z.string().trim().regex(/^\d{5}$/, "Please enter a 5-digit ZIP code."),
  county: z.enum(MEAL_DRIVE_COUNTIES, { error: "Drives are available in Los Angeles and Orange County." }),
  setting: enumOf(SITE_SETTINGS),
  features: z.array(enumOf(SITE_FEATURES)).default([]),
  sitePermission: z.enum(["confirmed", "in-progress"], { error: "Tell us whether you have permission to use the site." }),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a preferred date."),
  alternateDate: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).default(""),
  timeWindow: enumOf(TIME_WINDOWS),
  volunteers: z.coerce.number({ error: "Please enter an estimate." }).int().min(2, "Drives need at least 2 volunteers.").max(500),
});

export const commitmentsSchema = z.object(
  Object.fromEntries(
    HOST_COMMITMENTS.map((item) => [item.key, z.literal(true, { error: "Every host commitment is required." })]),
  ) as Record<CommitmentKey, z.ZodLiteral<true>>,
);

export function mealDriveApplicationSchema(today: string) {
  return organizationStepSchema
    .extend(communityStepSchema.shape)
    .extend(siteStepSchema.shape)
    .extend({
      commitments: commitmentsSchema,
      notes: text(1500).default(""),
      consent: z.literal(true, { error: "Please agree to be contacted about your application." }),
      website: z.string().max(0).default(""),
    })
    .superRefine((input, context) => {
      if (daysFromToday(input.preferredDate, today) < MEAL_DRIVE_LEAD_DAYS)
        context.addIssue({ code: "custom", path: ["preferredDate"], message: `Please choose a date at least ${MEAL_DRIVE_LEAD_DAYS} days from today.` });
      if (input.alternateDate && daysFromToday(input.alternateDate, today) < MEAL_DRIVE_LEAD_DAYS)
        context.addIssue({ code: "custom", path: ["alternateDate"], message: `Please choose a date at least ${MEAL_DRIVE_LEAD_DAYS} days from today.` });
      if (input.needs.includes("other") && input.needDetails.length < 10)
        context.addIssue({ code: "custom", path: ["needDetails"], message: "Please describe the community need." });
    });
}
export type MealDriveApplication = z.infer<ReturnType<typeof mealDriveApplicationSchema>>;

/** The published review criteria — the same for every applicant. */
export const REVIEW_CRITERIA = [
  { id: "need", title: "Community need", body: "The drive serves households nearby who are at risk of going without enough food." },
  { id: "open", title: "Open to all", body: "Meals go to anyone who comes, first come, first served, with no eligibility checks or conditions." },
  { id: "site", title: "A safe, reachable site", body: "Permission to use the site, handwashing for volunteers, and a place people can reach." },
  { id: "logistics", title: "Workable logistics", body: `In Los Angeles or Orange County, at least ${MEAL_DRIVE_LEAD_DAYS} days out, with enough volunteers.` },
] as const;

export type ChecklistItem = { id: (typeof REVIEW_CRITERIA)[number]["id"]; met: boolean; note: string };

/**
 * A transparent readiness checklist for the team. It never rejects anyone
 * automatically: items not yet met become topics for the first conversation.
 * It deliberately ignores organization type, name, and free-text descriptions.
 */
export function reviewChecklist(
  input: Pick<MealDriveApplication, "needs" | "commitments" | "sitePermission" | "features" | "county" | "postalCode" | "preferredDate" | "households" | "volunteers">,
  today: string,
): ChecklistItem[] {
  const neededVolunteers = Math.max(4, Math.ceil(input.households / 50));
  return [
    { id: "need", met: input.needs.length > 0, note: `${input.needs.length} community need indicator${input.needs.length === 1 ? "" : "s"} shared.` },
    {
      id: "open",
      met: HOST_COMMITMENTS.every((item) => input.commitments[item.key] === true),
      note: "All host commitments accepted.",
    },
    {
      id: "site",
      met: input.sitePermission === "confirmed" && input.features.includes("handwashing"),
      note:
        input.sitePermission !== "confirmed"
          ? "Site permission is still in progress."
          : input.features.includes("handwashing")
            ? "Site permission confirmed; handwashing available."
            : "Plan handwashing for volunteers.",
    },
    {
      id: "logistics",
      met:
        MEAL_DRIVE_COUNTIES.includes(input.county) &&
        /^9[0-3]\d{3}$/.test(input.postalCode) &&
        daysFromToday(input.preferredDate, today) >= MEAL_DRIVE_LEAD_DAYS &&
        input.volunteers >= neededVolunteers,
      note: input.volunteers >= neededVolunteers ? `${input.volunteers} volunteers for about ${input.households} households.` : `Plan for about ${neededVolunteers} volunteers for ${input.households} households.`,
    },
  ];
}

export function labelFor<T extends readonly { value: string; label: string }[]>(list: T, value: string): string {
  return list.find((item) => item.value === value)?.label ?? value;
}
