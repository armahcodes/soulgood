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
