import { describe, expect, it } from "vitest";
import {
  HOST_COMMITMENTS,
  mealDriveApplicationSchema,
  NEED_INDICATORS,
  NON_DISCRIMINATION_STATEMENT,
  ORGANIZATION_TYPES,
  reviewChecklist,
  SITE_FEATURES,
  TIME_WINDOWS,
} from "@/lib/meal-drive";

const today = "2026-09-25";
export const validApplication = {
  organizationName: "Harbor Tenants Association",
  organizationType: "tenant",
  organizationWebsite: "",
  contactName: "Jordan Lee",
  contactRole: "Organizer",
  email: "jordan@example.org",
  phone: "(562) 555-0100",
  communityArea: "West Long Beach",
  households: 150,
  needs: ["food-insecurity", "cost-of-living"],
  needDetails: "",
  siteName: "Community room",
  addressLine1: "100 Main St",
  city: "Long Beach",
  postalCode: "90813",
  county: "Los Angeles",
  setting: "outdoor",
  features: ["step-free", "handwashing"],
  sitePermission: "confirmed",
  preferredDate: "2026-11-07",
  alternateDate: "",
  timeWindow: "midday",
  volunteers: 8,
  commitments: Object.fromEntries(HOST_COMMITMENTS.map((item) => [item.key, true])),
  notes: "",
  consent: true,
  website: "",
};

// Words that would indicate we're asking about, or sorting by, protected characteristics.
const PROTECTED = /\b(race|racial|ethnic|ethnicity|religio|faith of|nationality|national origin|immigra|citizen|gender|sex\b|sexual|orientation|age\b|ages|senior|elder|child|kids|disab|marital|veteran|pregnan|income level|demograph)/i;

describe("meal drive host application", () => {
  const schema = mealDriveApplicationSchema(today);

  it("accepts a complete, open application", () => {
    expect(schema.safeParse(validApplication).success).toBe(true);
  });

  it("never asks about protected characteristics of applicants or meal recipients", () => {
    const fieldNames = Object.keys(schema.shape);
    const asked = [
      ...fieldNames,
      ...[NEED_INDICATORS, SITE_FEATURES, TIME_WINDOWS].flatMap((list) => list.map((item) => item.label)),
    ].join(" | ");
    expect(asked).not.toMatch(PROTECTED);
    expect(fieldNames.length).toBeGreaterThan(15);
    // Organization types describe the kind of group, and every type is treated the same.
    expect(ORGANIZATION_TYPES.length).toBeGreaterThan(5);
  });

  it("requires every open-access commitment, including first come, first served", () => {
    expect(HOST_COMMITMENTS.map((item) => item.label).join(" ")).toMatch(/first come, first served/);
    expect(HOST_COMMITMENTS.map((item) => item.label).join(" ")).toMatch(/No one will be asked for ID, proof of income, immigration status/);
    for (const item of HOST_COMMITMENTS) {
      const commitments = { ...validApplication.commitments, [item.key]: false };
      expect(schema.safeParse({ ...validApplication, commitments }).success, item.key).toBe(false);
    }
  });

  it("states a broad non-discrimination commitment", () => {
    for (const word of ["race", "religion", "national origin", "immigration status", "gender identity", "sexual orientation", "age", "disability", "veteran"])
      expect(NON_DISCRIMINATION_STATEMENT).toContain(word);
  });

  it("requires community need and keeps LA/OC, lead time, and size rules", () => {
    expect(schema.safeParse({ ...validApplication, needs: [] }).success).toBe(false);
    expect(schema.safeParse({ ...validApplication, needs: ["other"], needDetails: "" }).success).toBe(false);
    expect(schema.safeParse({ ...validApplication, county: "San Diego" }).success).toBe(false);
    expect(schema.safeParse({ ...validApplication, preferredDate: "2026-10-01" }).success).toBe(false);
    expect(schema.safeParse({ ...validApplication, households: 10 }).success).toBe(false);
  });

  it("scores every organization type and description identically", () => {
    const parsed = schema.parse(validApplication);
    const baseline = reviewChecklist(parsed, today);
    for (const type of ORGANIZATION_TYPES) {
      const variant = schema.parse({ ...validApplication, organizationType: type.value, organizationName: `${type.label} of the Valley`, communityArea: "Anywhere", needDetails: "Different words entirely" });
      expect(reviewChecklist(variant, today), type.value).toEqual(baseline);
    }
    expect(baseline.every((item) => item.met)).toBe(true);
  });

  it("flags open items for conversation instead of rejecting", () => {
    const parsed = schema.parse({ ...validApplication, sitePermission: "in-progress", volunteers: 2 });
    const checklist = reviewChecklist(parsed, today);
    expect(checklist.find((item) => item.id === "site")?.met).toBe(false);
    expect(checklist.find((item) => item.id === "logistics")?.note).toMatch(/Plan for about 4 volunteers/);
  });
});
