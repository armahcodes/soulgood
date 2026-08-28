import { describe, it, expect } from "vitest";
import { leadSchema } from "../lead-schema";

const validLead = {
  email: "guest@example.com",
  phone: "+1 (310) 555-0134",
  name: "Jane Guest",
  deliveryZip: "90012",
  deliveryCountyConfirmed: true,
  pathway: "detox",
  intent: "buyer",
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
    expect(leadSchema.safeParse({ ...validLead, email: "" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(leadSchema.safeParse({ ...validLead, email: "notanemail" }).success).toBe(false);
  });

  it("rejects an empty phone", () => {
    expect(leadSchema.safeParse({ ...validLead, phone: "" }).success).toBe(false);
  });

  it("rejects a garbage phone with no digits", () => {
    expect(leadSchema.safeParse({ ...validLead, phone: "abcdef" }).success).toBe(false);
  });

  it("rejects a missing name", () => {
    const { name: _omit, ...withoutName } = validLead;
    void _omit;
    expect(leadSchema.safeParse(withoutName).success).toBe(false);
  });

  it("rejects an empty name", () => {
    expect(leadSchema.safeParse({ ...validLead, name: "   " }).success).toBe(false);
  });

  it("accepts a lenient phone typed on a phone keyboard", () => {
    expect(leadSchema.safeParse({ ...validLead, phone: "310-555-0134" }).success).toBe(true);
  });

  it("allows a null pathway", () => {
    const result = leadSchema.safeParse({ ...validLead, pathway: null });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.pathway).toBeNull();
  });

  it("rejects a pathway outside the canonical values", () => {
    expect(leadSchema.safeParse({ ...validLead, pathway: "wellness" }).success).toBe(false);
  });

  it("rejects an invalid delivery ZIP", () => {
    expect(leadSchema.safeParse({ ...validLead, deliveryZip: "902" }).success).toBe(false);
  });

  it("requires Los Angeles County delivery confirmation", () => {
    expect(
      leadSchema.safeParse({ ...validLead, deliveryCountyConfirmed: false }).success,
    ).toBe(false);
  });

  it("defaults profile fields to empty arrays", () => {
    const result = leadSchema.safeParse({
      name: "Jane Guest",
      email: "a@b.com",
      phone: "3105550134",
      deliveryZip: "90012",
      deliveryCountyConfirmed: true,
      intent: "list",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dietary).toEqual([]);
      expect(result.data.allergens).toEqual([]);
      expect(result.data.foods).toEqual([]);
      expect(result.data.priorities).toEqual([]);
      expect(result.data.pathway).toBeNull();
    }
  });
});
