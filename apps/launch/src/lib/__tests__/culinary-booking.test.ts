import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  balancedCulinarySelection,
  CULINARY_PRICING,
  culinaryInputSchema,
  culinaryLineItems,
  culinaryRequestSchema,
  culinaryPaymentSchedule,
  culinaryServingCount,
  PLATED_MENU_IDS,
  platedMenuName,
  todayInLosAngeles,
  type CulinaryInput,
} from "../culinary-booking";
import { bowlSelectionTotal } from "../bowl-selection";
import { CURRENT_BOWLS } from "../current-offer";
import { withSoldOut } from "./sold-out";

export function culinaryInput(
  count = 10,
  experience: "delivery" | "plated" = "delivery",
): CulinaryInput {
  return {
    experience,
    ...(experience === "plated" ? { guestCount: count } : {}),
    bowlSelection: balancedCulinarySelection(count),
    eventDate: "2026-10-10",
    eventTime: "13:00",
    occasion: "Team lunch",
    address: {
      addressLine1: "123 Test Street",
      addressLine2: "Suite 2",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90012",
    },
  };
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-08T18:00:00Z"));
});
afterEach(() => vi.useRealTimers());

describe("culinary minimums and mandatory fees", () => {
  it.each(PLATED_MENU_IDS)(
    "prices the %s group menu by headcount without assigning bowls",
    (platedMenu) => {
      const parsed = culinaryInputSchema.parse({
        ...culinaryInput(10, "plated"),
        platedMenu,
        bowlSelection: undefined,
      });
      expect(bowlSelectionTotal(parsed.bowlSelection)).toBe(0);
      expect(culinaryServingCount(parsed)).toBe(10);
      const items = culinaryLineItems("plated", parsed.bowlSelection, parsed);
      expect(items.filter((item) => item.kind === "plated")).toEqual([
        {
          id: `plated-${platedMenu}`,
          kind: "plated",
          label: `Plated menu — ${platedMenuName(platedMenu)}`,
          quantity: 10,
          unitCents: 5500,
          amountCents: 55000,
        },
      ]);
      expect(items.some((item) => item.kind === "bowl")).toBe(false);
      expect(items.reduce((sum, item) => sum + item.amountCents, 0)).toBe(
        106388,
      );
    },
  );
  it.each([1, 11, 57, 10000])(
    "sizes a group menu for %i guests and keeps support separate",
    (guestCount) => {
      const parsed = culinaryInputSchema.parse({
        ...culinaryInput(10, "plated"),
        platedMenu: "chicken",
        guestCount,
        bowlSelection: undefined,
      });
      const items = culinaryLineItems("plated", parsed.bowlSelection, parsed);
      expect(items[0].quantity).toBe(guestCount);
      expect(items.reduce((sum, item) => sum + item.amountCents, 0)).toBe(
        Math.max(guestCount * 5500, 55500) + 50000 + 888,
      );
    },
  );
  it.each([undefined, 0, -1, 1.5, 10001])(
    "rejects invalid group headcount %s",
    (guestCount) => {
      expect(
        culinaryInputSchema.safeParse({
          ...culinaryInput(10, "plated"),
          platedMenu: "chicken",
          guestCount,
          bowlSelection: undefined,
        }).success,
      ).toBe(false);
    },
  );
  it("rejects ambiguous group menus, unsupported styles, and delivery/style combinations", () => {
    expect(
      culinaryInputSchema.safeParse({
        ...culinaryInput(10, "plated"),
        platedMenu: "chicken",
      }).success,
    ).toBe(false);
    expect(
      culinaryInputSchema.safeParse({
        ...culinaryInput(10, "plated"),
        platedMenu: "unknown",
        bowlSelection: undefined,
      }).success,
    ).toBe(false);
    expect(
      culinaryInputSchema.safeParse({
        ...culinaryInput(),
        platedMenu: "chicken",
      }).success,
    ).toBe(false);
    expect(
      culinaryInputSchema.safeParse({
        ...culinaryInput(),
        bowlSelection: undefined,
      }).success,
    ).toBe(false);
  });
  it.each([
    [9, false],
    [10, true],
    [11, true],
  ])("validates delivery with %i bowls", (count, valid) => {
    expect(culinaryInputSchema.safeParse(culinaryInput(count)).success).toBe(
      valid,
    );
  });
  it("charges $55 per guest with a $555 food minimum, plus $500 support", () => {
    const items = culinaryLineItems("plated", balancedCulinarySelection(10));
    expect(
      items
        .filter((item) => item.kind === "bowl")
        .reduce((sum, item) => sum + item.amountCents, 0),
    ).toBe(55000);
    expect(items.find((item) => item.kind === "minimum")?.amountCents).toBe(
      500,
    );
    expect(items.find((item) => item.kind === "support")?.amountCents).toBe(
      50000,
    );
    expect(items.reduce((sum, item) => sum + item.amountCents, 0)).toBe(106388);
    expect(bowlSelectionTotal(balancedCulinarySelection(10))).toBe(10);
  });
  it("does not apply the delivery minimum to plated food and rejects an empty plated menu", () => {
    expect(
      culinaryInputSchema.safeParse(culinaryInput(1, "plated")).success,
    ).toBe(true);
    expect(
      culinaryInputSchema.safeParse(culinaryInput(0, "plated")).success,
    ).toBe(false);
  });
  it("retains per-guest charges above $555 and always adds support on top", () => {
    const items = culinaryLineItems("plated", balancedCulinarySelection(57));
    expect(items.some((item) => item.kind === "minimum")).toBe(false);
    expect(items.find((item) => item.kind === "support")?.amountCents).toBe(
      50000,
    );
    expect(items.reduce((sum, item) => sum + item.amountCents, 0)).toBe(364388);
  });
  it.each([undefined, 0, 9, 11, 1.5, 10001])(
    "rejects missing, invalid, or mismatched headcount %s",
    (guestCount) => {
      expect(
        culinaryInputSchema.safeParse({
          ...culinaryInput(10, "plated"),
          guestCount,
        }).success,
      ).toBe(false);
    },
  );
  it.each([0, 1, 116761, 116762])(
    "splits %i cents without losing a cent",
    (total) => {
      const schedule = culinaryPaymentSchedule(total, "2026-10-10");
      expect(schedule.depositCents).toBe(Math.round(total / 2));
      expect(schedule.depositCents + schedule.balanceCents).toBe(total);
      expect(schedule.balanceDueDate).toBe("2026-10-10");
      expect(schedule.balanceTiming).toBe("Before our team arrives");
    },
  );
  it.each([-1, 1.5, NaN, Infinity])(
    "rejects invalid payment total %s",
    (total) => {
      expect(() => culinaryPaymentSchedule(total, "2026-10-10")).toThrow();
    },
  );
  it("never charges culinary support or a food adjustment for delivery", () => {
    const items = culinaryLineItems("delivery", balancedCulinarySelection(10));
    expect(
      items.every((item) => item.kind === "bowl" || item.kind === "delivery"),
    ).toBe(true);
    expect(items.reduce((sum, item) => sum + item.amountCents, 0)).toBe(18488);
    expect(CULINARY_PRICING.bowlUnitCents).toBe(1760);
  });
  it("only preselects available bowls and distributes arbitrary totals exactly", () => {
    for (const count of [0, 1, 10, 11, 57, 10000]) {
      const selection = balancedCulinarySelection(count);
      for (const bowl of CURRENT_BOWLS.filter((item) => !item.available))
        expect(selection[bowl.id]).toBe(0);
      expect(bowlSelectionTotal(selection)).toBe(count);
    }
    expect(bowlSelectionTotal(balancedCulinarySelection(NaN))).toBe(0);
  });
  it.each([-1, 1.5, 10001, NaN])("rejects invalid quantity %s", (quantity) => {
    const input = culinaryInput();
    input.bowlSelection["glow-bowl"] = quantity;
    expect(culinaryInputSchema.safeParse(input).success).toBe(false);
  });
  it("rejects sold-out recipes, omitted recipes, client prices, and optional staffing", async () => {
    const input = culinaryInput();
    await withSoldOut("herb-chicken-nourish-bowl", () =>
      expect(
        culinaryInputSchema.safeParse({
          ...input,
          bowlSelection: {
            ...input.bowlSelection,
            "herb-chicken-nourish-bowl": 1,
          },
        }).success,
      ).toBe(false),
    );
    expect(
      culinaryInputSchema.safeParse({
        ...input,
        bowlSelection: { "glow-bowl": 10 },
      }).success,
    ).toBe(false);
    expect(
      culinaryInputSchema.safeParse({ ...input, totalCents: 1 }).success,
    ).toBe(false);
    expect(
      culinaryInputSchema.safeParse({ ...input, support: false }).success,
    ).toBe(false);
  });
  it.each(["2026-02-30", "2026-09-07", "not-a-date"])(
    "rejects unavailable date %s",
    (eventDate) => {
      expect(
        culinaryInputSchema.safeParse({ ...culinaryInput(), eventDate })
          .success,
      ).toBe(false);
    },
  );
  it("uses Los Angeles time for today's boundary", () => {
    expect(todayInLosAngeles(new Date("2026-09-08T01:00:00Z"))).toBe(
      "2026-09-07",
    );
  });
  it("requires consent, validates contact, and normalizes safe retry data", () => {
    const input = {
      quoteId: "fa0066bc-1ba4-4ed2-97a0-154076135c23",
      contact: {
        name: " Test Guest ",
        email: " TEST@EXAMPLE.COM ",
        phone: "(213) 555-0100",
      },
      acceptedEstimate: true,
    };
    expect(culinaryRequestSchema.parse(input)).toMatchObject({
      contact: {
        name: "Test Guest",
        email: "test@example.com",
        phone: "2135550100",
      },
    });
    expect(
      culinaryRequestSchema.safeParse({ ...input, acceptedEstimate: false })
        .success,
    ).toBe(false);
    expect(
      culinaryRequestSchema.safeParse({
        ...input,
        contact: { ...input.contact, phone: "123" },
      }).success,
    ).toBe(false);
  });
});
