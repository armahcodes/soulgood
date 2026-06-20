import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING } from "@/lib/brand";

export const runtime = "nodejs";

/** The first-week order amount, in cents (intro price; $111/week thereafter). */
const FIRST_WEEK_AMOUNT = PRICING.firstWeekCents;

/**
 * POST /api/checkout — start a Stripe Checkout Session for the first-week order
 * ($88 intro; $111/week thereafter) and return its hosted URL.
 *
 * Graceful degradation: when STRIPE_SECRET_KEY is missing/blank we return
 * { url: null, disabled: true } with HTTP 200 instead of throwing, so the client
 * can route the (already-captured) lead straight to /welcome. The payment step is
 * skipped but the order is still recorded. This route NEVER 500s on absent keys.
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
          unit_amount: FIRST_WEEK_AMOUNT,
          product_data: {
            name: "Soul Good — Your first week (intro)",
          },
        },
      },
    ],
    success_url: `${origin}/welcome`,
    cancel_url: `${origin}/checkout`,
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
