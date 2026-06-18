import { describe, it, expect } from "vitest";
import { leadSchema } from "../lead-schema";

const validLead = {
  email: "guest@example.com",
  phone: "+1 (310) 555-0134",
  name: "Jane Guest",
  pathway: "detox",
  intent: "buyer",
  plan: "subscription",
  dietary: ["vegan"],
  allergens: ["peanuts"],
  foods: ["leafy greens"],
  priorities: ["energy", "digestion"],
  reflectBody: "rest",
  reflectSoul: "calm",
};

describe("leadSchema", () => {
  it("accepts a full valid lead", () => {
    const result = leadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("guest@example.com");
      expect(result.data.pathway).toBe("detox");
      expect(result.data.intent).toBe("buyer");
    }
  });

  it("rejects an empty email", () => {
    const result = leadSchema.safeParse({ ...validLead, email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({ ...validLead, email: "notanemail" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty phone", () => {
    const result = leadSchema.safeParse({ ...validLead, phone: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a garbage phone with no digits", () => {
    const result = leadSchema.safeParse({ ...validLead, phone: "abcdef" });
    expect(result.success).toBe(false);
  });

  it("accepts a lenient phone typed on a phone keyboard", () => {
    const result = leadSchema.safeParse({ ...validLead, phone: "310-555-0134" });
    expect(result.success).toBe(true);
  });

  it("allows a null pathway (deep-link join with no quiz)", () => {
    const result = leadSchema.safeParse({ ...validLead, pathway: null });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.pathway).toBeNull();
  });

  it("rejects a pathway outside the four canonical values", () => {
    const result = leadSchema.safeParse({ ...validLead, pathway: "wellness" });
    expect(result.success).toBe(false);
  });

  it("defaults array profile fields to empty arrays", () => {
    const result = leadSchema.safeParse({
      email: "a@b.com",
      phone: "3105550134",
      intent: "list",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dietary).toEqual([]);
      expect(result.data.allergens).toEqual([]);
      expect(result.data.foods).toEqual([]);
      expect(result.data.priorities).toEqual([]);
      expect(result.data.pathway).toBeNull();
      expect(result.data.plan).toBeNull();
    }
  });
});
