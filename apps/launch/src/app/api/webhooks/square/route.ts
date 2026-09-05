import { after, NextResponse } from "next/server";
import {
  drainSquareJobs,
  enqueueSquareSync,
  squareEventSchema,
  verifySquareSignature,
} from "@/lib/square-jobs";
import { drainEmailOutbox } from "@/lib/email-outbox";
import { readLimitedBody } from "@/lib/server-http";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const url = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;
  if (!key || !url)
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  let raw: string;
  try {
    raw = await readLimitedBody(request);
  } catch {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }
  if (
    !verifySquareSignature(
      raw,
      request.headers.get("x-square-hmacsha256-signature"),
      key,
      url,
    )
  )
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const event = squareEventSchema.safeParse(parsed);
  if (!event.success)
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const kind = event.data.type.split(".")[0];
  if (!["payment", "invoice", "subscription", "refund", "order"].includes(kind))
    return NextResponse.json({ received: true });
  try {
    await enqueueSquareSync(
      event.data.event_id,
      kind,
      event.data.data.id,
      event.data.type,
    );
    after(async () => {
      await drainSquareJobs(2)
        .then(() => drainEmailOutbox(2))
        .catch(() => console.error("[square] Background worker deferred"));
    });
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Temporarily unable to accept event" },
      { status: 503 },
    );
  }
}
