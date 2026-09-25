import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  addExtraLine,
  describeExtraOptions,
  extraLineSchema,
  extrasFingerprint,
  extrasTotalCents,
  MENU_EXTRAS,
  parseStoredExtras,
} from "@/lib/menu-extras";

describe("menu extras", () => {
  it("has a product image on disk for every item", () => {
    for (const item of MENU_EXTRAS)
      expect(existsSync(path.join(process.cwd(), "public", item.imagePath))).toBe(true);
  });

  it("prices by tier", () => {
    expect(
      extrasTotalCents([
        { id: "rainbow-crunch", quantity: 2, dressing: "lemon" },
        { id: "build-your-own-salad", quantity: 1, base: "red-cabbage", toppings: ["sliced-beets", "sliced-radishes", "shredded-carrots"], mint: true, dressing: "house" },
        { id: "crunch-cup", quantity: 3 },
        { id: "roasted-cabbage-wedges", quantity: 1 },
        { id: "veggie-tasting-trio", quantity: 1, trio: ["jerk-cauliflower", "rainbow-crunch", "smoky-sweet-potatoes"] },
      ]),
    ).toBe(2 * 1400 + 1500 + 3 * 600 + 800 + 1600);
  });

  it("requires the right choices for each item", () => {
    expect(extraLineSchema.safeParse({ id: "rainbow-crunch", quantity: 1 }).success).toBe(false);
    expect(extraLineSchema.safeParse({ id: "crunch-cup", quantity: 1, dressing: "lemon" }).success).toBe(false);
    expect(extraLineSchema.safeParse({ id: "garden-crunch-and-dip", quantity: 1, dressing: "tahini-herb" }).success).toBe(true);
    expect(
      extraLineSchema.safeParse({ id: "build-your-own-salad", quantity: 1, base: "green-cabbage", toppings: ["sliced-beets", "sliced-beets", "shredded-carrots"], dressing: "lemon" }).success,
    ).toBe(false);
    expect(
      extraLineSchema.safeParse({ id: "build-your-own-salad", quantity: 1, base: "green-cabbage", toppings: ["sliced-beets", "shredded-carrots"], dressing: "lemon" }).success,
    ).toBe(false);
    expect(extraLineSchema.safeParse({ id: "veggie-tasting-trio", quantity: 1, trio: ["jerk-cauliflower", "rainbow-crunch"] }).success).toBe(false);
    expect(extraLineSchema.safeParse({ id: "golden-garden", quantity: 13, dressing: "lemon" }).success).toBe(false);
    expect(extraLineSchema.safeParse({ id: "mystery", quantity: 1 }).success).toBe(false);
  });

  it("describes choices and stacks identical configurations", () => {
    const salad = { id: "build-your-own-salad", quantity: 1, base: "red-cabbage" as const, toppings: ["sliced-beets" as const, "sliced-radishes" as const, "shredded-carrots" as const], mint: true, dressing: "lemon" as const };
    expect(describeExtraOptions(salad)).toBe("Red cabbage · Sliced beets, Sliced radishes, Shredded carrots · Fresh mint · Lemon dressing");
    const cart = addExtraLine(addExtraLine([], salad), { ...salad, toppings: ["shredded-carrots", "sliced-beets", "sliced-radishes"] });
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
    expect(extrasFingerprint(cart)).toBe(extrasFingerprint([...cart].reverse()));
  });

  it("drops tampered or invalid stored carts", () => {
    expect(parseStoredExtras(JSON.stringify([{ id: "crunch-cup", quantity: 2 }]))).toHaveLength(1);
    expect(parseStoredExtras(JSON.stringify([{ id: "crunch-cup", quantity: 2, priceCents: 1 }]))).toEqual([]);
    expect(parseStoredExtras("nope")).toEqual([]);
  });
});
