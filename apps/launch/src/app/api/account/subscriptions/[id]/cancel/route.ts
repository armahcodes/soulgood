import { after, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getOwnedSubscription } from "@/lib/checkout-record";
import {
  cancellationJobs,
  processCancellation,
  queueCancellation,
} from "@/lib/subscription-cancellation";
import { drainEmailOutbox } from "@/lib/email-outbox";
import { planHasEnded } from "@/lib/customer-experience";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Read the saved result without issuing another Square cancellation. */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      return NextResponse.json(
        { error: "Sign in to manage this plan." },
        { status: 401, headers },
      );
    const { id } = await context.params;
    if (!id || id.length > 255)
      return NextResponse.json(
        { error: "Invalid subscription." },
        { status: 400, headers },
      );
    const owner = await getOwnedSubscription(session.user.email, id);
    if (!owner)
      return NextResponse.json(
        { error: "Subscription not found." },
        { status: 404, headers },
      );
    if (owner.cancellationScheduledFor)
      return NextResponse.json(
        { state: "scheduled", effectiveDate: owner.cancellationScheduledFor },
        { headers },
      );
    if (planHasEnded(owner.subscriptionStatus))
      return NextResponse.json({ state: "ended" }, { headers });
    const job = await cancellationJobs().findOne({
      _id: id,
      customerEmail: owner.customerEmail,
    });
    return NextResponse.json(
      job?.effectiveDate
        ? { state: "scheduled", effectiveDate: job.effectiveDate }
        : { state: job?.state === "pending" ? "pending" : "active" },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { error: "We could not check your plan. Please try again." },
      { status: 503, headers },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      return NextResponse.json(
        { error: "Sign in to manage this plan." },
        { status: 401 },
      );
    const { id } = await context.params;
    if (!id || id.length > 255)
      return NextResponse.json(
        { error: "Invalid subscription." },
        { status: 400 },
      );
    const owner = await getOwnedSubscription(session.user.email, id);
    if (!owner)
      return NextResponse.json(
        { error: "Subscription not found." },
        { status: 404 },
      );
    if (owner.cancellationScheduledFor)
      return NextResponse.json({
        ok: true,
        state: "scheduled",
        effectiveDate: owner.cancellationScheduledFor,
      });
    if (planHasEnded(owner.subscriptionStatus))
      return NextResponse.json({ ok: true, state: "ended" });
    await queueCancellation(id, owner);
    // Acknowledge the durable request immediately. The existing recovery job also
    // retries it if this invocation ends before Square confirms cancellation.
    after(async () => {
      await processCancellation(id).catch(() => undefined);
      await drainEmailOutbox(1).catch(() => undefined);
    });
    return NextResponse.json(
      {
        pending: true,
        state: "pending",
        message:
          "Your request is saved. We’re waiting for Square to confirm the cancellation.",
      },
      { status: 202, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Cancellation verification is temporarily unavailable. Please check your account again or contact customer care.",
      },
      { status: 503 },
    );
  }
}
