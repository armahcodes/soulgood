import { describe, expect, it } from "vitest";
import { assembleLead } from "../join-lead";
import { leadSchema } from "../lead-schema";
import type { PathwayState } from "../pathway-state";

const state: PathwayState = {
  pathway: "detox",
  dietary: ["Plant-Based"],
  allergens: ["Dairy"],
  foods: ["Fruit"],
  priorities: ["Flavor", "Energy"],
  reflectBody: "rest",
};

const form = { name: " Jane Guest ", email: " a@b.com ", phone: " (310) 555-0134 " };

describe("assembleLead", () => {
  it("assembles a buyer lead from sessionStorage state + form", () => {
    const lead = assembleLead(form, state, "buyer");
    expect(lead.name).toBe("Jane Guest");
    expect(lead.email).toBe("a@b.com");
    expect(lead.phone).toBe("(310) 555-0134");
    expect(lead.pathway).toBe("detox");
    expect(lead.intent).toBe("buyer");
    expect(lead.dietary).toEqual(["Plant-Based"]);
    expect(lead.allergens).toEqual(["Dairy"]);
    expect(lead.foods).toEqual(["Fruit"]);
    expect(lead.priorities).toEqual(["Flavor", "Energy"]);
    expect(lead.reflectBody).toBe("rest");
    // The assembled lead must satisfy the schema the API validates against.
    expect(leadSchema.safeParse(lead).success).toBe(true);
  });

  it("assembles a list lead with intent 'list'", () => {
    const lead = assembleLead(form, state, "list");
    expect(lead.intent).toBe("list");
    expect(lead.pathway).toBe("detox");
  });

  it("handles missing state (deep-link) with pathway null + empty profile", () => {
    const lead = assembleLead(form, null, "buyer");
    expect(lead.pathway).toBeNull();
    expect(lead.dietary).toEqual([]);
    expect(lead.allergens).toEqual([]);
    expect(lead.foods).toEqual([]);
    expect(lead.priorities).toEqual([]);
    expect(lead.reflectBody).toBeUndefined();
    // Still a valid, submittable lead — capture is never blocked.
    expect(leadSchema.safeParse(lead).success).toBe(true);
  });
});
