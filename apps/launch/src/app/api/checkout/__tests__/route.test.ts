import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../route";
import { checkoutInputSchema } from "@/lib/checkout-input";
import {
  configureCheckout,
  rawCheckout,
  address,
  selection,
  quote,
} from "@/lib/__tests__/checkout-fixtures";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  start: vi.fn(),
  process: vi.fn(),
}));
vi.mock("@/lib/checkout-attempt", async (original) => ({
  ...(await original<typeof import("@/lib/checkout-attempt")>()),
  mongoAttemptStore: { get: mocks.get },
  startCheckoutAttempt: mocks.start,
  processCheckoutAttempt: mocks.process,
}));
vi.mock("@/lib/request-limit", () => ({
  allowCheckoutRequest: vi.fn(async () => true),
}));
vi.mock("@/lib/email-outbox", () => ({
  drainEmailOutbox: vi.fn(async () => 0),
  enqueueOrderEmail: vi.fn(async () => {}),
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: vi.fn(),
}));

function request(overrides: Record<string, unknown> = {}) {
  return new Request("https://soulgood.test/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rawCheckout(overrides)),
  });
}

beforeEach(() => {
  configureCheckout();
  mocks.get.mockReset().mockResolvedValue(null);
  mocks.start.mockReset().mockResolvedValue({});
  mocks.process
    .mockReset()
    .mockResolvedValue({
      state: "complete",
      result: { ok: true, status: "COMPLETED" },
    });
});
afterEach(() => vi.useRealTimers());

describe("checkout request boundary", () => {
  it.each([
    { acceptedTerms: false },
    { purchaseType: "weekly", paymentMethod: "apple-pay" },
    {
      purchaseType: "weekly",
      fulfillmentMethod: "pickup",
      deliveryAddress: null,
    },
    { bowlSelection: { ...selection, "glow-bowl": 0 } },
    {
      bowlSelection: {
        ...selection,
        "anti-inflammatory-bowl": 0,
        "herb-chicken-nourish-bowl": 1,
      },
    },
    { peopleCount: 7 },
    { mealsPerDay: 4 },
    {
      contact: {
        givenName: "A",
        familyName: "B",
        email: "a@example.com",
        phone: "123",
      },
    },
  ])(
    "rejects invalid order %# before persistence or Square",
    async (overrides) => {
      expect((await POST(request(overrides))).status).toBe(400);
      expect(mocks.start).not.toHaveBeenCalled();
      expect(mocks.process).not.toHaveBeenCalled();
    },
  );

  it("accepts a different out-of-state billing address and cardholder", async () => {
    const response = await POST(
      request({
        billingAddress: { ...address, state: "NY", postalCode: "10001-1234" },
        billingName: { givenName: "Bill", familyName: "Payer" },
      }),
    );
    expect(response.status).toBe(200);
    expect(mocks.start).toHaveBeenCalledWith(
      expect.objectContaining({
        billingAddress: expect.objectContaining({ state: "NY" }),
        billingName: { givenName: "Bill", familyName: "Payer" },
      }),
      quote,
    );
  });

  it.each([
    [1, 2],
    [1, 3],
    [2, 3],
    [6, 3],
  ])("validates %i people with %i meals/day", (peopleCount, mealsPerDay) => {
    const count = peopleCount * mealsPerDay;
    const input = rawCheckout({
      peopleCount,
      mealsPerDay,
      bowlSelection: Object.fromEntries(
        Object.entries(selection).map(([key, quantity]) => [
          key,
          quantity * count,
        ]),
      ),
    });
    expect(checkoutInputSchema.safeParse(input).success).toBe(true);
  });

  it("requires a fresh quote instead of silently recalculating", async () => {
    const req = request();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + 16 * 60 * 1000);
    const response = await POST(req);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ requote: true });
    expect(mocks.process).not.toHaveBeenCalled();
  });

  it("requires the approved total to match the signed quote", async () => {
    expect(
      (await POST(request({ expectedTotalCents: quote.totalCents + 1 })))
        .status,
    ).toBe(409);
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("rejects a quote for a changed address", async () => {
    expect(
      (
        await POST(
          request({ deliveryAddress: { ...address, city: "Pasadena" } }),
        )
      ).status,
    ).toBe(409);
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("does not start financial operations when durable storage fails", async () => {
    mocks.get.mockRejectedValue(new Error("DB down"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ pending: true });
    expect(mocks.process).not.toHaveBeenCalled();
  });

  it("recovers an already accepted quote after its expiry", async () => {
    mocks.get.mockResolvedValue({ quote });
    const req = request();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + 16 * 60 * 1000);
    expect((await POST(req)).status).toBe(200);
  });

  it("rejects a cross-origin browser submission", async () => {
    const req = request();
    req.headers.set("origin", "https://example.invalid");
    expect((await POST(req)).status).toBe(403);
  });
});
