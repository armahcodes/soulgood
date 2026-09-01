import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../route";

const squareFetch = vi.fn<typeof fetch>();

const ADDRESS = {
  addressLine1: "123 Main Street",
  addressLine2: "",
  city: "Los Angeles",
  state: "CA",
  postalCode: "90012",
};

const BOWL_SELECTION = {
  "glow-bowl": 1,
  "golden-harvest-bowl": 1,
  "jerk-wellness-bowl": 1,
  "performance-power-bowl": 1,
  "herb-chicken-nourish-bowl": 0,
  "anti-inflammatory-bowl": 1,
};

function makeRequest(overrides: Record<string, unknown> = {}): Request {
  return new Request("https://soulgood.test/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      acceptedTerms: true,
      billingAddress: ADDRESS,
      bowlSelection: BOWL_SELECTION,
      contact: {
        givenName: "Avery",
        familyName: "Jones",
        email: "avery@example.com",
        phone: "(310) 555-0134",
      },
      deliveryAddress: ADDRESS,
      fulfillmentMethod: "delivery",
      idempotencyKey: "f6ac292b-72dc-4b7c-9b3b-d38ee1848c40",
      leadId: "lead-123",
      purchaseType: "weekly",
      sourceId: "cnon:card-token",
      ...overrides,
    }),
  });
}

function configureSquare(): void {
  process.env.SQUARE_ACCESS_TOKEN = "square-token-placeholder";
  process.env.SQUARE_LOCATION_ID = "location-123";
  process.env.SQUARE_PICKUP_PLAN_VARIATION_ID = "pickup-plan-123";
  process.env.SQUARE_DELIVERY_PLAN_VARIATION_ID = "delivery-plan-123";
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function mockSuccessfulDelivery(): void {
  squareFetch.mockImplementation(async (input) => {
    const url = String(input);
    if (url.startsWith("https://services.maps.cdtfa.ca.gov/")) {
      return jsonResponse({
        taxRateInfo: [
          { rate: 0.0975, jurisdiction: "LOS ANGELES", county: "LOS ANGELES" },
        ],
      });
    }
    if (url.endsWith("/v2/customers/search")) return jsonResponse({ customers: [] });
    if (url.endsWith("/v2/customers")) {
      return jsonResponse({ customer: { id: "customer-123", version: 0 } });
    }
    if (url.endsWith("/v2/cards")) return jsonResponse({ card: { id: "card-123" } });
    if (url.endsWith("/v2/payments")) {
      return jsonResponse({
        payment: {
          id: "payment-123",
          status: "COMPLETED",
          receipt_url: "https://square.test/receipt/payment-123",
        },
      });
    }
    if (url.endsWith("/v2/subscriptions")) {
      return jsonResponse({ subscription: { id: "subscription-123", status: "ACTIVE" } });
    }
    return jsonResponse({ errors: [{ code: "NOT_FOUND" }] }, 404);
  });
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    delete process.env.SQUARE_ACCESS_TOKEN;
    delete process.env.SQUARE_LOCATION_ID;
    delete process.env.SQUARE_PICKUP_PLAN_VARIATION_ID;
    delete process.env.SQUARE_DELIVERY_PLAN_VARIATION_ID;
    delete process.env.SQUARE_ENVIRONMENT;
    delete process.env.MONGODB_URI;
    squareFetch.mockReset();
    vi.stubGlobal("fetch", squareFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects checkout without affirmative recurring-card consent", async () => {
    const response = await POST(makeRequest({ acceptedTerms: false }));

    expect(response.status).toBe(400);
    expect(squareFetch).not.toHaveBeenCalled();
  });

  it("rejects a mix that does not contain exactly five bowls", async () => {
    const response = await POST(
      makeRequest({
        bowlSelection: { ...BOWL_SELECTION, "glow-bowl": 0 },
      }),
    );

    expect(response.status).toBe(400);
    expect(squareFetch).not.toHaveBeenCalled();
  });

  it("rejects a sold-out Herb Chicken selection", async () => {
    const response = await POST(
      makeRequest({
        bowlSelection: {
          ...BOWL_SELECTION,
          "anti-inflammatory-bowl": 0,
          "herb-chicken-nourish-bowl": 1,
        },
      }),
    );

    expect(response.status).toBe(400);
    expect(squareFetch).not.toHaveBeenCalled();
  });

  it("pauses checkout when Square is not configured", async () => {
    const response = await POST(makeRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      disabled: true,
      reason: "square-unconfigured",
    });
    expect(squareFetch).not.toHaveBeenCalled();
  });

  it("stores the card and creates a taxed weekly delivery subscription", async () => {
    configureSquare();
    process.env.SQUARE_ENVIRONMENT = "production";
    mockSuccessfulDelivery();

    const response = await POST(makeRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "ACTIVE",
      subscriptionId: "subscription-123",
      fulfillmentMethod: "delivery",
      bowlSelection: BOWL_SELECTION,
      purchaseType: "weekly",
      legalVersion: "2026-08-31",
      tax: {
        subtotalCents: 9688,
        taxCents: 945,
        totalCents: 10633,
        percentage: "9.75",
      },
    });

    const requests = squareFetch.mock.calls.map(([url, init]) => ({
      url: String(url),
      method: init?.method,
      body: init?.body ? JSON.parse(String(init.body)) : null,
    }));
    const customer = requests.find((request) => request.url.endsWith("/v2/customers"));
    expect(customer?.body).toMatchObject({
      email_address: "avery@example.com",
      phone_number: "+13105550134",
      reference_id: "lead-123",
    });
    const card = requests.find((request) => request.url.endsWith("/v2/cards"));
    expect(card?.body).toMatchObject({
      source_id: "cnon:card-token",
      card: { customer_id: "customer-123" },
    });
    const subscription = requests.find((request) =>
      request.url.endsWith("/v2/subscriptions"),
    );
    expect(subscription?.body).toMatchObject({
      location_id: "location-123",
      plan_variation_id: "delivery-plan-123",
      customer_id: "customer-123",
      card_id: "card-123",
      tax_percentage: "9.75",
      price_override_money: { amount: 9688, currency: "USD" },
      timezone: "America/Los_Angeles",
      source: {
        name: "Soul Bowls website | people:1,meals:1 | glow-bowl:1,golden-harvest-bowl:1,jerk-wellness-bowl:1,performance-power-bowl:1,herb-chicken-nourish-bowl:0,anti-inflammatory-bowl:1",
      },
    });
  });

  it("prices a two-meal daily plan for one person as two five-bowl sets", async () => {
    configureSquare();
    process.env.SQUARE_ENVIRONMENT = "production";
    mockSuccessfulDelivery();
    const doubledSelection = Object.fromEntries(
      Object.entries(BOWL_SELECTION).map(([id, quantity]) => [id, quantity * 2]),
    );

    const response = await POST(
      makeRequest({
        peopleCount: 1,
        mealsPerDay: 2,
        bowlSelection: doubledSelection,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      peopleCount: 1,
      mealsPerDay: 2,
      tax: {
        subtotalCents: 18488,
        taxCents: 1803,
        totalCents: 20291,
      },
    });
    const subscriptionCall = squareFetch.mock.calls.find(([url]) =>
      String(url).endsWith("/v2/subscriptions"),
    );
    const subscriptionBody = JSON.parse(String(subscriptionCall?.[1]?.body));
    expect(subscriptionBody).toMatchObject({
      price_override_money: { amount: 18488, currency: "USD" },
      source: { name: expect.stringContaining("people:1,meals:2") },
    });
  });

  it("rejects order sizes above the six-set online limit", async () => {
    const response = await POST(
      makeRequest({ peopleCount: 3, mealsPerDay: 3 }),
    );

    expect(response.status).toBe(400);
    expect(squareFetch).not.toHaveBeenCalled();
  });

  it("completes a one-time order without storing the card or creating a subscription", async () => {
    process.env.SQUARE_ACCESS_TOKEN = "square-token-placeholder";
    process.env.SQUARE_LOCATION_ID = "location-123";
    process.env.SQUARE_ENVIRONMENT = "production";
    mockSuccessfulDelivery();

    const response = await POST(makeRequest({ purchaseType: "one-time" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      purchaseType: "one-time",
      status: "COMPLETED",
      paymentId: "payment-123",
      receiptUrl: "https://square.test/receipt/payment-123",
      bowlSelection: BOWL_SELECTION,
      tax: { totalCents: 10633 },
    });

    const requests = squareFetch.mock.calls.map(([url, init]) => ({
      url: String(url),
      body: init?.body ? JSON.parse(String(init.body)) : null,
    }));
    expect(requests.some((request) => request.url.endsWith("/v2/cards"))).toBe(false);
    expect(
      requests.some((request) => request.url.endsWith("/v2/subscriptions")),
    ).toBe(false);
    const payment = requests.find((request) => request.url.endsWith("/v2/payments"));
    expect(payment?.body).toMatchObject({
      source_id: "cnon:card-token",
      amount_money: { amount: 10633, currency: "USD" },
      autocomplete: true,
      customer_id: "customer-123",
      location_id: "location-123",
      reference_id: "lead-123",
      note: "Soul Bowls website | people:1,meals:1 | glow-bowl:1,golden-harvest-bowl:1,jerk-wellness-bowl:1,performance-power-bowl:1,herb-chicken-nourish-bowl:0,anti-inflammatory-bowl:1",
    });
  });

  it("rejects an address outside Los Angeles County before touching Square customer data", async () => {
    configureSquare();
    squareFetch.mockResolvedValueOnce(
      jsonResponse({
        taxRateInfo: [
          { rate: 0.0775, jurisdiction: "ANAHEIM", county: "ORANGE" },
        ],
      }),
    );

    const response = await POST(makeRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      error: "Square could not start the weekly plan. No subscription was created.",
    });
    expect(squareFetch).toHaveBeenCalledOnce();
  });

  it("disables a newly saved card if subscription creation fails", async () => {
    configureSquare();
    mockSuccessfulDelivery();
    squareFetch.mockImplementation(async (input) => {
      const url = String(input);
      if (url.startsWith("https://services.maps.cdtfa.ca.gov/")) {
        return jsonResponse({
          taxRateInfo: [
            { rate: 0.0975, jurisdiction: "LOS ANGELES", county: "LOS ANGELES" },
          ],
        });
      }
      if (url.endsWith("/v2/customers/search")) return jsonResponse({ customers: [] });
      if (url.endsWith("/v2/customers")) return jsonResponse({ customer: { id: "customer-123" } });
      if (url.endsWith("/v2/cards")) return jsonResponse({ card: { id: "card-123" } });
      if (url.endsWith("/v2/subscriptions")) {
        return jsonResponse({ errors: [{ code: "CARD_DECLINED" }] }, 400);
      }
      if (url.endsWith("/v2/cards/card-123/disable")) return jsonResponse({});
      return jsonResponse({}, 404);
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: "The card was declined. Try another card or contact your bank.",
    });
    expect(squareFetch).toHaveBeenCalledWith(
      "https://connect.squareupsandbox.com/v2/cards/card-123/disable",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
