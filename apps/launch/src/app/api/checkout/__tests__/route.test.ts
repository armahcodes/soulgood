import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createSession } = vi.hoisted(() => ({
  createSession: vi.fn(),
}));

vi.mock("stripe", () => ({
  default: class StripeMock {
    checkout = {
      sessions: {
        create: createSession,
      },
    };
  },
}));

import { POST } from "../route";

function makeRequest(
  body: Record<string, unknown> = {
    acceptedTerms: true,
    deliveryZip: "90012",
    leadId: "lead-123",
  },
): Request {
  return new Request("https://soulgood.test/api/checkout", {
    method: "POST",
    headers: {
      origin: "https://soulgood.test",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_SOUL_BOWLS_DELIVERY_FEE_CENTS;
    delete process.env.NEXT_PUBLIC_SOUL_BOWLS_CONTAINER_DEPOSIT_CENTS;
    createSession.mockReset();
  });

  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_SOUL_BOWLS_DELIVERY_FEE_CENTS;
    delete process.env.NEXT_PUBLIC_SOUL_BOWLS_CONTAINER_DEPOSIT_CENTS;
  });

  it("rejects checkout without affirmative consent", async () => {
    const response = await POST(
      makeRequest({
        acceptedTerms: false,
        deliveryZip: "90012",
        leadId: "lead-123",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("pauses checkout when the approved fees are not configured", async () => {
    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: null,
      disabled: true,
      reason: "fees-unconfigured",
    });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("disables checkout gracefully when Stripe is not configured", async () => {
    process.env.NEXT_PUBLIC_SOUL_BOWLS_DELIVERY_FEE_CENTS = "500";
    process.env.NEXT_PUBLIC_SOUL_BOWLS_CONTAINER_DEPOSIT_CENTS = "1500";

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: null,
      disabled: true,
      reason: "stripe-unconfigured",
    });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("creates a disclosed recurring subscription and records consent", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
    process.env.NEXT_PUBLIC_SOUL_BOWLS_DELIVERY_FEE_CENTS = "500";
    process.env.NEXT_PUBLIC_SOUL_BOWLS_CONTAINER_DEPOSIT_CENTS = "1500";
    createSession.mockResolvedValue({
      url: "https://checkout.stripe.test/session",
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://checkout.stripe.test/session",
    });
    expect(createSession).toHaveBeenCalledWith({
      mode: "subscription",
      client_reference_id: "lead-123",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 5500,
            recurring: { interval: "week" },
            product_data: { name: "Soul Bowls™ — Weekly plan" },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 500,
            recurring: { interval: "week" },
            product_data: { name: "Soul Bowls™ — Weekly delivery" },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 1500,
            product_data: {
              name: "Soul Bowls™ — Refundable container deposit",
            },
          },
        },
      ],
      metadata: {
        consent: "affirmative",
        legal_version: "2026-08-28",
        accepted_at: expect.any(String),
        delivery_zip: "90012",
        lead_id: "lead-123",
      },
      subscription_data: {
        metadata: {
          consent: "affirmative",
          legal_version: "2026-08-28",
          accepted_at: expect.any(String),
          delivery_zip: "90012",
          lead_id: "lead-123",
        },
      },
      success_url: "https://soulgood.test/welcome",
      cancel_url: "https://soulgood.test/checkout",
    });
  });
});
