import { describe, expect, it } from "vitest";
import { squareExtraLineItems, type SquareCatalogConfig } from "@/lib/square-catalog";

const base: SquareCatalogConfig = {
  bowlVariationIds: {
    "glow-bowl": "G", "golden-harvest-bowl": "GH", "jerk-wellness-bowl": "J",
    "performance-power-bowl": "P", "herb-chicken-nourish-bowl": "H", "anti-inflammatory-bowl": "A",
  },
  deliveryVariationId: "D",
  weeklyPlanVariationId: "W",
};

describe("squareExtraLineItems", () => {
  it("returns nothing for an order without add-ons, even when add-ons are not configured", () => {
    expect(squareExtraLineItems([], base)).toEqual([]);
  });

  it("refuses add-ons when the Square variations are not configured", () => {
    expect(() => squareExtraLineItems([{ id: "crunch-cup", quantity: 1 }], base)).toThrow(/not configured/);
  });

  it("prices each line from its tier and records the dish and choices in the note", () => {
    const lines = squareExtraLineItems(
      [
        { id: "build-your-own-salad", quantity: 2, base: "green-cabbage", toppings: ["sliced-beets", "roasted-cauliflower", "shredded-carrots"], mint: false, dressing: "tahini-herb" },
        { id: "crunch-cup", quantity: 1 },
      ],
      {
        ...base,
        addOnVariationIds: { "signature-salad": "S", "build-your-own": "B", "veggie-cup": "V", snack: "N", "tasting-trio": "T" },
      },
    );
    expect(lines).toEqual([
      {
        quantity: "2",
        catalog_object_id: "B",
        base_price_money: { amount: 1500, currency: "USD" },
        note: "Build Your Own Salad · Green cabbage · Sliced beets, Roasted cauliflower, Shredded carrots · Tahini herb dressing",
      },
      { quantity: "1", catalog_object_id: "V", base_price_money: { amount: 600, currency: "USD" }, note: "Crunch Cup" },
    ]);
  });
});
