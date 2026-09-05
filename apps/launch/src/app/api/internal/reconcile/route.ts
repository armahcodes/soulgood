import { NextResponse } from "next/server";
import { hasBearer } from "@/lib/server-http";
import { ensureOperationalIndexes } from "@/lib/operational-indexes";
import {
  checkoutAttempts,
  processCheckoutAttempt,
} from "@/lib/checkout-attempt";
import {
  cancellationJobs,
  processCancellation,
} from "@/lib/subscription-cancellation";
import {
  drainSquareJobs,
  enqueueSquareSync,
  squareJobs,
} from "@/lib/square-jobs";
import { drainEmailOutbox } from "@/lib/email-outbox";
import { CheckoutRecordModel } from "@/lib/db/checkout-record-model";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getMongoDatabase } from "@/lib/db/mongodb";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!hasBearer(request, process.env.CRON_SECRET))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureOperationalIndexes();
    const attempts = await checkoutAttempts()
      .find({
        state: { $in: ["pending", "processing"] },
        nextAttemptAt: { $lte: new Date() },
        leaseUntil: { $lte: new Date() },
      })
      .limit(3)
      .toArray();
    const cancellations = await cancellationJobs()
      .find({ state: "pending", leaseUntil: { $lte: new Date() } })
      .limit(3)
      .toArray();
    await Promise.all([
      ...attempts.map((attempt) => processCheckoutAttempt(attempt._id)),
      ...cancellations.map((job) => processCancellation(job._id)),
    ]);
    await connectToDatabase();
    const records = await CheckoutRecordModel.find()
      .sort({ lastReconciledAt: 1 })
      .limit(5)
      .lean();
    for (const record of records) {
      await enqueueSquareSync(
        `sweep:${record.squareObjectId}:${Math.floor(Date.now() / 300_000)}`,
        record.squareObjectType,
        record.squareObjectId,
      );
      await CheckoutRecordModel.updateOne(
        { _id: record._id },
        { $set: { lastReconciledAt: new Date() } },
      );
    }
    const events = await drainSquareJobs(8);
    const emails = await drainEmailOutbox(5);
    const db = getMongoDatabase().db;
    const [checkoutAttention, emailAttention, staleEvents] = await Promise.all([
      checkoutAttempts().countDocuments({ state: "needs-review" }),
      db.collection("email_outbox").countDocuments({ state: "needs-review" }),
      squareJobs().countDocuments({ state: "pending", attempts: { $gte: 10 } }),
    ]);
    const needsAttention = checkoutAttention + emailAttention + staleEvents > 0;
    return NextResponse.json(
      {
        ok: !needsAttention,
        events,
        emails,
        checkoutAttention,
        emailAttention,
        staleEvents,
      },
      {
        status: needsAttention ? 503 : 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Reconciliation temporarily unavailable" },
      { status: 503 },
    );
  }
}
