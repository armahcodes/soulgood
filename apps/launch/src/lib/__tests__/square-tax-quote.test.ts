import { afterEach, describe, expect, it, vi } from "vitest";
import { getTaxQuote } from "../square";

function locationResponse(postalCode: string): Response {
  return new Response(
    JSON.stringify({
      location: {
        address: {
          address_line_1: "456 Elm Ave",
          locality: "Long Beach",
          administrative_district_level_1: "CA",
          postal_code: postalCode,
        },
      },
    }),
    { status: 200 },
  );
}

function cdtfaResponse(): Response {
  return new Response(
    JSON.stringify({
      taxRateInfo: [
        { rate: 0.105, jurisdiction: "LONG BEACH", county: "LOS ANGELES" },
      ],
    }),
    { status: 200 },
  );
}

describe("getTaxQuote for pickup", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sends CDTFA a 5-digit ZIP when Square stores ZIP+4", async () => {
    vi.stubEnv("SQUARE_ACCESS_TOKEN", "test-token");
    vi.stubEnv("SQUARE_LOCATION_ID", "L123");
    const zips: Array<string | null> = [];
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const target = String(url);
      if (target.includes("/v2/locations/")) {
        return locationResponse("90802-2426");
      }
      zips.push(new URL(target).searchParams.get("zip"));
      return cdtfaResponse();
    });

    const quote = await getTaxQuote("pickup", null, 1, fetcher as typeof fetch);

    expect(zips).toEqual(["90802"]);
    expect(quote.county).toBe("LOS ANGELES");
    expect(quote.totalCents).toBe(quote.subtotalCents + quote.taxCents);
  });

  it("rejects a pickup location without a usable ZIP", async () => {
    vi.stubEnv("SQUARE_ACCESS_TOKEN", "test-token");
    vi.stubEnv("SQUARE_LOCATION_ID", "L123");
    const fetcher = vi.fn(async () => locationResponse("unknown"));

    await expect(
      getTaxQuote("pickup", null, 1, fetcher as typeof fetch),
    ).rejects.toThrow(
      "The Square pickup location needs a complete California address",
    );
  });
});

describe("getTaxQuote for weekly delivery", () => {
  const address = (city: string, postalCode: string) => ({
    addressLine1: "200 Test Street",
    addressLine2: "",
    city,
    state: "CA" as const,
    postalCode,
  });
  const cdtfa = (county: string, rate = 0.0775) =>
    vi.fn(async () =>
      new Response(JSON.stringify({ taxRateInfo: [{ rate, jurisdiction: county, county }] }), { status: 200 }),
    );

  it("accepts Orange County addresses and charges $8.88 delivery on a single set", async () => {
    const quote = await getTaxQuote("delivery", address("Anaheim", "92805"), 1, cdtfa("ORANGE") as unknown as typeof fetch);
    expect(quote.county).toBe("ORANGE");
    expect(quote.subtotalCents).toBe(8800 + 888);
  });

  it("waives delivery on orders over $100", async () => {
    const quote = await getTaxQuote("delivery", address("Irvine", "92618"), 2, cdtfa("ORANGE") as unknown as typeof fetch);
    expect(quote.subtotalCents).toBe(17600);
  });

  it("adds salads and snacks to the subtotal and counts them toward free delivery", async () => {
    const small = await getTaxQuote("delivery", address("Santa Ana", "92701"), 1, cdtfa("ORANGE") as unknown as typeof fetch, 600);
    expect(small.subtotalCents).toBe(8800 + 600 + 888);
    const overHundred = await getTaxQuote("delivery", address("Costa Mesa", "92626"), 1, cdtfa("ORANGE") as unknown as typeof fetch, 1400);
    expect(overHundred.subtotalCents).toBe(8800 + 1400);
  });

  it("rejects delivery outside Los Angeles and Orange County", async () => {
    await expect(
      getTaxQuote("delivery", address("Riverside", "92501"), 1, cdtfa("RIVERSIDE") as unknown as typeof fetch),
    ).rejects.toThrow("Weekly delivery is available only in Los Angeles and Orange County");
  });
});
