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

function makeRequest(overrides: Record<string, unknown> = {}): Request {
  return new Request("https://soulgood.test/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      acceptedTerms: true,
      billingAddress: ADDRESS,
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
      timezone: "America/Los_Angeles",
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
