import { after, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getOwnedSubscription,
  markSubscriptionCancellation,
} from "@/lib/checkout-record";
import { sendSubscriptionCancelledEmail } from "@/lib/email";
import { SquareApiError, squareRequest } from "@/lib/square";

export const runtime = "nodejs";

function requestIsSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function displayDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00-07:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/Los_Angeles",
  }).format(parsed);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!requestIsSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to manage this plan." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id || id.length > 255) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 400 });
  }

  const subscription = await getOwnedSubscription(session.user.email, id);
  if (!subscription) {
    return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
  }

  if (subscription.cancellationScheduledFor) {
    return NextResponse.json({
      ok: true,
      alreadyScheduled: true,
      effectiveDate: displayDate(subscription.cancellationScheduledFor),
    });
  }

  try {
    const response = await squareRequest<{
      subscription?: { canceled_date?: string; status?: string };
    }>(`/v2/subscriptions/${encodeURIComponent(id)}/cancel`, { method: "POST" });
    const effectiveDate = response.subscription?.canceled_date;
    if (!effectiveDate) throw new Error("Square did not return a cancellation date");

    await markSubscriptionCancellation(
      id,
      effectiveDate,
      response.subscription?.status || "CANCELED",
    );

    if (process.env.RESEND_API_KEY) {
      after(async () => {
        try {
          await sendSubscriptionCancelledEmail({
            customerEmail: subscription.customerEmail,
            customerName: subscription.customerName,
            effectiveDate: displayDate(effectiveDate),
            subscriptionId: id,
          });
        } catch (error) {
          console.error("[subscription] Cancellation succeeded but email failed", {
            subscriptionId: id,
            error: error instanceof Error ? error.message : "unknown",
          });
        }
      });
    }

    return NextResponse.json({
      ok: true,
      effectiveDate: displayDate(effectiveDate),
    });
  } catch (error) {
    console.error("[subscription] Square cancellation failed", {
      subscriptionId: id,
      status: error instanceof SquareApiError ? error.status : undefined,
      codes: error instanceof SquareApiError ? error.codes : undefined,
    });
    return NextResponse.json(
      { error: "We could not cancel the plan. No changes were made. Please try again." },
      { status: 502 },
    );
  }
}
