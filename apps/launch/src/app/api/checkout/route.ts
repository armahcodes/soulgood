import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

/** The founding-spot deposit amount, in cents. */
const DEPOSIT_AMOUNT = 5000;

/**
 * POST /api/checkout — start a Stripe Checkout Session for the $50 founding-spot
 * deposit and return its hosted URL.
 *
 * Graceful degradation: when STRIPE_SECRET_KEY is missing/blank we return
 * { url: null, disabled: true } with HTTP 200 instead of throwing, so the client
 * can route the (already-captured) lead straight to /welcome. The deposit step is
 * skipped but the spot is still reserved. This route NEVER 500s on absent keys.
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ url: null, disabled: true }, { status: 200 });
  }

  // Derive the origin so success/cancel URLs are absolute in any environment.
  const origin =
    request.headers.get("origin") ?? new URL(request.url).origin;

  // Initialize the client lazily — only when the key exists — so build/SSR with
  // blank keys never crashes.
  const stripe = new Stripe(secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: DEPOSIT_AMOUNT,
          product_data: {
            name: "Soul Good — Founding spot deposit",
          },
        },
      },
    ],
    success_url: `${origin}/welcome`,
    cancel_url: `${origin}/checkout`,
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
