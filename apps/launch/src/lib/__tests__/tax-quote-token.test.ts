import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createTaxQuoteToken,
  verifyTaxQuoteToken,
} from "../tax-quote-token";

const ADDRESS = {
  addressLine1: "123 Main Street",
  addressLine2: "",
  city: "Los Angeles",
  state: "CA" as const,
  postalCode: "90012",
};

const QUOTE = {
  subtotalCents: 18488,
  taxCents: 1803,
  totalCents: 20291,
  percentage: "9.75",
  jurisdiction: "LOS ANGELES",
  county: "LOS ANGELES" as const,
};

describe("signed tax quote tokens", () => {
  beforeEach(() => {
    process.env.CHECKOUT_QUOTE_SECRET = "test-tax-quote-secret-with-enough-entropy";
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-31T20:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.CHECKOUT_QUOTE_SECRET;
  });

  it("round trips a verified quote for the exact address", () => {
    const token = createTaxQuoteToken(QUOTE, "delivery", ADDRESS, 1, 2);

    expect(token).toBeTruthy();
    expect(verifyTaxQuoteToken(token!, "delivery", ADDRESS, 1, 2)).toEqual(QUOTE);
  });

  it("rejects a changed address and a tampered token", () => {
    const token = createTaxQuoteToken(QUOTE, "delivery", ADDRESS, 1, 2)!;

    expect(
      verifyTaxQuoteToken(
        token,
        "delivery",
        { ...ADDRESS, postalCode: "90013" },
        1,
        2,
      ),
    ).toBeNull();
    expect(verifyTaxQuoteToken(`${token}x`, "delivery", ADDRESS, 1, 2)).toBeNull();
    expect(verifyTaxQuoteToken(token, "delivery", ADDRESS, 1, 3)).toBeNull();
  });

  it("rejects an expired quote", () => {
    const token = createTaxQuoteToken(QUOTE, "delivery", ADDRESS, 1, 2)!;
    vi.advanceTimersByTime(16 * 60 * 1000);

    expect(verifyTaxQuoteToken(token, "delivery", ADDRESS, 1, 2)).toBeNull();
  });
});
