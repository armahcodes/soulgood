import { after, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getOwnedSubscription } from "@/lib/checkout-record";
import {
  processCancellation,
  queueCancellation,
} from "@/lib/subscription-cancellation";
import { drainEmailOutbox } from "@/lib/email-outbox";

export const runtime = "nodejs";
export const maxDuration = 60;

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
        effectiveDate: owner.cancellationScheduledFor,
      });
    await queueCancellation(id, owner);
    const result = await processCancellation(id);
    after(async () => {
      await drainEmailOutbox(1).catch(() => undefined);
    });
    if (result.effectiveDate) return NextResponse.json({ ok: true, ...result });
    return NextResponse.json(
      {
        pending: true,
        error:
          "Your cancellation request was saved and is being verified. Check again shortly; do not assume renewals have stopped until Square confirms.",
      },
      { status: 202 },
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
