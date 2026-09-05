import { after, NextResponse } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { timing } from "hono/timing";
import { checkoutInputSchema } from "@/lib/checkout-input";
import {
  AttemptConflictError,
  attemptResponse,
  mongoAttemptStore,
  processCheckoutAttempt,
  startCheckoutAttempt,
} from "@/lib/checkout-attempt";
import { verifyTaxQuoteToken } from "@/lib/tax-quote-token";
import { getSquareCatalogConfig } from "@/lib/square-catalog";
import { drainEmailOutbox } from "@/lib/email-outbox";
import { allowCheckoutRequest } from "@/lib/request-limit";
import { checkoutOperationsReady } from "@/lib/checkout-readiness";

export const runtime = "nodejs";
export const maxDuration = 60;

async function checkout(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );
  const parsed = checkoutInputSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ||
          "Complete the customer, billing, order, and consent fields.",
        retrySameAttempt: true,
      },
      { status: 400 },
    );
  if (
    !process.env.SQUARE_ACCESS_TOKEN ||
    !process.env.SQUARE_LOCATION_ID ||
    !getSquareCatalogConfig()
  ) {
    return NextResponse.json(
      {
        disabled: true,
        reason: "square-unconfigured",
        error: "Checkout is temporarily unavailable.",
        retrySameAttempt: true,
      },
      { status: 503 },
    );
  }
  const input = parsed.data;
  try {
    // Accepted attempts retain their original amount even after the quote expires.
    const existing = await mongoAttemptStore.get(input.idempotencyKey);
    if (!existing && !checkoutOperationsReady())
      return NextResponse.json(
        {
          error:
            "Checkout is temporarily unavailable while payment recovery is configured. Please try again later.",
          retrySameAttempt: true,
        },
        { status: 503 },
      );
    if (!existing && !(await allowCheckoutRequest(request)))
      return NextResponse.json(
        {
          error: "Too many checkout attempts. Please wait a few minutes.",
          retrySameAttempt: true,
        },
        { status: 429 },
      );
    const quote =
      existing?.quote ??
      verifyTaxQuoteToken(
        input.taxQuoteToken,
        input.fulfillmentMethod,
        input.deliveryAddress,
        input.peopleCount,
        input.mealsPerDay,
      );
    if (!quote || quote.totalCents !== input.expectedTotalCents) {
      return NextResponse.json(
        {
          error:
            "Your total expired or the order changed. Recalculate and accept the updated total before paying.",
          requote: true,
          retrySameAttempt: true,
        },
        { status: 409 },
      );
    }
    await startCheckoutAttempt(input, quote);
  } catch (error) {
    if (error instanceof AttemptConflictError)
      return NextResponse.json(
        {
          error:
            "This checkout is already being processed with its original details. Check its status before trying again.",
          pending: true,
          attemptId: input.idempotencyKey,
        },
        { status: 409 },
      );
    // Database timeouts can be ambiguous too. Keep the same recovery reference.
    return NextResponse.json(
      {
        error:
          "Checkout could not be reached. Check this attempt's status before retrying.",
        pending: true,
        attemptId: input.idempotencyKey,
      },
      { status: 503 },
    );
  }
  try {
    const result = attemptResponse(
      await processCheckoutAttempt(input.idempotencyKey),
    );
    after(async () => {
      await drainEmailOutbox(1).catch(() =>
        console.error("[email] Outbox worker deferred"),
      );
    });
    return NextResponse.json(result.body, {
      status: result.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        pending: true,
        attemptId: input.idempotencyKey,
        message:
          "We are verifying this purchase. Do not submit another payment.",
      },
      { status: 202 },
    );
  }
}

const app = new Hono().basePath("/api");
app.use("*", bodyLimit({ maxSize: 64 * 1024 }));
app.use("*", timing());
app.post("/checkout", (context) => checkout(context.req.raw));
export const POST = handle(app);
