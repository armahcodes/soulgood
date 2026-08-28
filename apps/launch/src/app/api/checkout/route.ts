import { NextResponse } from "next/server";
import Stripe from "stripe";
import { BRAND_NAME, LEGAL_VERSION, PRICING } from "@/lib/brand";

export const runtime = "nodejs";

type CheckoutRequest = {
  acceptedTerms?: unknown;
  deliveryZip?: unknown;
  leadId?: unknown;
};

function configuredFeeCents(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const cents = Number(value);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

function parseCheckoutRequest(value: unknown):
  | { acceptedTerms: true; deliveryZip: string; leadId: string }
  | null {
  if (!value || typeof value !== "object") return null;
  const body = value as CheckoutRequest;

  if (
    body.acceptedTerms !== true ||
    typeof body.deliveryZip !== "string" ||
    !/^\d{5}$/.test(body.deliveryZip) ||
    typeof body.leadId !== "string" ||
    body.leadId.trim().length === 0 ||
    body.leadId.length > 200
  ) {
    return null;
  }

  return {
    acceptedTerms: true,
    deliveryZip: body.deliveryZip,
    leadId: body.leadId.trim(),
  };
}

/** Start the disclosed weekly subscription after explicit customer consent. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const checkout = parseCheckoutRequest(body);

  if (!checkout) {
    return NextResponse.json(
      {
        error:
          "Checkout requires an eligible delivery ZIP, a saved reservation, and acceptance of the recurring purchase terms.",
      },
      { status: 400 },
    );
  }

  const deliveryFeeCents = configuredFeeCents(
    process.env.NEXT_PUBLIC_SOUL_BOWLS_DELIVERY_FEE_CENTS,
  );
  const depositCents = configuredFeeCents(
    process.env.NEXT_PUBLIC_SOUL_BOWLS_CONTAINER_DEPOSIT_CENTS,
  );

  if (deliveryFeeCents === null || depositCents === null) {
    return NextResponse.json(
      { url: null, disabled: true, reason: "fees-unconfigured" },
      { status: 200 },
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { url: null, disabled: true, reason: "stripe-unconfigured" },
      { status: 200 },
    );
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const acceptedAt = new Date().toISOString();
  const consentMetadata = {
    consent: "affirmative",
    legal_version: LEGAL_VERSION,
    accepted_at: acceptedAt,
    delivery_zip: checkout.deliveryZip,
    lead_id: checkout.leadId,
  };

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: checkout.leadId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: PRICING.weeklyCents,
          recurring: { interval: "week" },
          product_data: { name: `${BRAND_NAME} — Weekly plan` },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: deliveryFeeCents,
          recurring: { interval: "week" },
          product_data: { name: `${BRAND_NAME} — Weekly delivery` },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: depositCents,
          product_data: {
            name: `${BRAND_NAME} — Refundable container deposit`,
          },
        },
      },
    ],
    metadata: consentMetadata,
    subscription_data: { metadata: consentMetadata },
    success_url: `${origin}/welcome`,
    cancel_url: `${origin}/checkout`,
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
