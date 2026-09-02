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

const CATALOG_VARIATIONS = {
  "glow-bowl": "variation-glow",
  "golden-harvest-bowl": "variation-golden-harvest",
  "jerk-wellness-bowl": "variation-jerk-wellness",
  "performance-power-bowl": "variation-performance-power",
  "herb-chicken-nourish-bowl": "variation-herb-chicken",
  "anti-inflammatory-bowl": "variation-anti-inflammatory",
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
  process.env.SQUARE_GLOW_BOWL_VARIATION_ID = CATALOG_VARIATIONS["glow-bowl"];
  process.env.SQUARE_GOLDEN_HARVEST_BOWL_VARIATION_ID =
    CATALOG_VARIATIONS["golden-harvest-bowl"];
  process.env.SQUARE_JERK_WELLNESS_BOWL_VARIATION_ID =
    CATALOG_VARIATIONS["jerk-wellness-bowl"];
  process.env.SQUARE_PERFORMANCE_POWER_BOWL_VARIATION_ID =
    CATALOG_VARIATIONS["performance-power-bowl"];
  process.env.SQUARE_HERB_CHICKEN_BOWL_VARIATION_ID =
    CATALOG_VARIATIONS["herb-chicken-nourish-bowl"];
  process.env.SQUARE_ANTI_INFLAMMATORY_BOWL_VARIATION_ID =
    CATALOG_VARIATIONS["anti-inflammatory-bowl"];
  process.env.SQUARE_SOUL_BOWLS_DELIVERY_VARIATION_ID = "variation-delivery";
  process.env.SQUARE_WEEKLY_ITEMIZED_PLAN_VARIATION_ID = "itemized-plan-123";
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function mockSuccessfulDelivery(): void {
  squareFetch.mockImplementation(async (input, init) => {
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
    if (url.endsWith("/v2/orders")) {
      const request = JSON.parse(String(init?.body));
      const subtotalCents = request.order.line_items.reduce(
        (total: number, line: { base_price_money: { amount: number }; quantity: string }) =>
          total + line.base_price_money.amount * Number(line.quantity),
        0,
      );
      const taxCents = Math.round(
        subtotalCents * (Number(request.order.taxes[0].percentage) / 100),
      );
      return jsonResponse({
        order: {
          id: "order-123",
          version: 1,
          state: request.order.state,
          total_money: { amount: subtotalCents + taxCents, currency: "USD" },
        },
      });
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
    delete process.env.SQUARE_GLOW_BOWL_VARIATION_ID;
    delete process.env.SQUARE_GOLDEN_HARVEST_BOWL_VARIATION_ID;
    delete process.env.SQUARE_JERK_WELLNESS_BOWL_VARIATION_ID;
    delete process.env.SQUARE_PERFORMANCE_POWER_BOWL_VARIATION_ID;
    delete process.env.SQUARE_HERB_CHICKEN_BOWL_VARIATION_ID;
    delete process.env.SQUARE_ANTI_INFLAMMATORY_BOWL_VARIATION_ID;
    delete process.env.SQUARE_SOUL_BOWLS_DELIVERY_VARIATION_ID;
    delete process.env.SQUARE_WEEKLY_ITEMIZED_PLAN_VARIATION_ID;
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

  it("rejects digital wallets for automatic weekly renewals", async () => {
    const response = await POST(
      makeRequest({ paymentMethod: "apple-pay", verificationToken: "wallet-token" }),
    );

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
      plan_variation_id: "itemized-plan-123",
      customer_id: "customer-123",
      card_id: "card-123",
      phases: [{ ordinal: 0, order_template_id: "order-123" }],
      timezone: "America/Los_Angeles",
      source: {
        name: "Soul Bowls website | people:1,meals:1 | glow-bowl:1,golden-harvest-bowl:1,jerk-wellness-bowl:1,performance-power-bowl:1,herb-chicken-nourish-bowl:0,anti-inflammatory-bowl:1",
      },
    });
    const order = requests.find((request) => request.url.endsWith("/v2/orders"));
    expect(order?.body).toMatchObject({
      order: {
        customer_id: "customer-123",
        state: "DRAFT",
        metadata: {
          purchase_type: "weekly",
          fulfillment_method: "delivery",
          people_count: "1",
          meals_per_day: "1",
          jar_size_ounces: "32",
        },
        taxes: [{ percentage: "9.75", scope: "ORDER", type: "ADDITIVE" }],
        fulfillments: [
          {
            type: "DELIVERY",
            state: "PROPOSED",
            delivery_details: {
              recipient: {
                customer_id: "customer-123",
                display_name: "Avery Jones",
                email_address: "avery@example.com",
                phone_number: "+13105550134",
                address: expect.objectContaining({ postal_code: "90012" }),
              },
            },
          },
        ],
      },
    });
    expect(order?.body.order.line_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          catalog_object_id: CATALOG_VARIATIONS["glow-bowl"],
          quantity: "1",
          base_price_money: { amount: 1760, currency: "USD" },
        }),
        expect.objectContaining({
          catalog_object_id: "variation-delivery",
          quantity: "1",
          base_price_money: { amount: 888, currency: "USD" },
        }),
      ]),
    );
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
      phases: [{ ordinal: 0, order_template_id: "order-123" }],
      source: { name: expect.stringContaining("people:1,meals:2") },
    });
    const orderCall = squareFetch.mock.calls.find(([url]) =>
      String(url).endsWith("/v2/orders"),
    );
    const orderBody = JSON.parse(String(orderCall?.[1]?.body));
    expect(orderBody.order.line_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          catalog_object_id: CATALOG_VARIATIONS["glow-bowl"],
          quantity: "2",
        }),
      ]),
    );
  });

  it("supports three meals per day for every person in a six-person order", async () => {
    configureSquare();
    process.env.SQUARE_ENVIRONMENT = "production";
    mockSuccessfulDelivery();
    const selection = Object.fromEntries(
      Object.entries(BOWL_SELECTION).map(([id, quantity]) => [id, quantity * 18]),
    );

    const response = await POST(
      makeRequest({ peopleCount: 6, mealsPerDay: 3, bowlSelection: selection }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      peopleCount: 6,
      mealsPerDay: 3,
      tax: {
        subtotalCents: 159288,
        taxCents: 15531,
        totalCents: 174819,
      },
    });
    const orderCall = squareFetch.mock.calls.find(([url]) =>
      String(url).endsWith("/v2/orders"),
    );
    const orderBody = JSON.parse(String(orderCall?.[1]?.body));
    expect(orderBody.order.metadata).toMatchObject({
      people_count: "6",
      meals_per_day: "3",
    });
    expect(orderBody.order.line_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          catalog_object_id: CATALOG_VARIATIONS["glow-bowl"],
          quantity: "18",
        }),
      ]),
    );
  });

  it("rejects orders above the six-person online limit", async () => {
    const response = await POST(makeRequest({ peopleCount: 7, mealsPerDay: 1 }));

    expect(response.status).toBe(400);
    expect(squareFetch).not.toHaveBeenCalled();
  });

  it("completes a one-time order without storing the card or creating a subscription", async () => {
    configureSquare();
    process.env.SQUARE_ENVIRONMENT = "production";
    mockSuccessfulDelivery();

    const response = await POST(
      makeRequest({
        purchaseType: "one-time",
        paymentMethod: "apple-pay",
        verificationToken: "buyer-verification-token",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      purchaseType: "one-time",
      status: "COMPLETED",
      paymentId: "payment-123",
      orderId: "order-123",
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
      verification_token: "buyer-verification-token",
      amount_money: { amount: 10633, currency: "USD" },
      autocomplete: true,
      customer_id: "customer-123",
      location_id: "location-123",
      order_id: "order-123",
      reference_id: "lead-123",
      buyer_email_address: "avery@example.com",
      buyer_phone_number: "+13105550134",
      shipping_address: expect.objectContaining({ postal_code: "90012" }),
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
    squareFetch.mockImplementation(async (input, init) => {
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
      if (url.endsWith("/v2/orders")) {
        const request = JSON.parse(String(init?.body));
        return jsonResponse({
          order: {
            id: "order-123",
            version: 1,
            state: request.order.state,
            total_money: { amount: 10633, currency: "USD" },
          },
        });
      }
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
