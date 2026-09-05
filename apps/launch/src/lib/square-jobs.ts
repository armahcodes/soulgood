import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { getMongoDatabase } from "./db/mongodb";

export const squareEventSchema = z.object({
  event_id: z.string().min(1).max(200),
  type: z.string().max(120),
  data: z.object({ id: z.string().min(1).max(200) }),
});

export function verifySquareSignature(
  body: string,
  supplied: string | null,
  key: string,
  url: string,
): boolean {
  if (!supplied || !key || !url) return false;
  const expected = createHmac("sha256", key)
    .update(url + body)
    .digest("base64");
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

type SquareJob = {
  _id: string;
  kind: string;
  objectId: string;
  eventType?: string;
  state: "pending" | "done";
  nextAttemptAt: Date;
  leaseUntil: Date;
  attempts: number;
};
export function squareJobs() {
  return getMongoDatabase().db.collection<SquareJob>("square_events");
}

export async function enqueueSquareSync(
  eventId: string,
  kind: string,
  objectId: string,
  eventType?: string,
): Promise<void> {
  await squareJobs().updateOne(
    { _id: eventId },
    {
      $setOnInsert: {
        _id: eventId,
        kind,
        objectId,
        eventType,
        state: "pending",
        nextAttemptAt: new Date(),
        leaseUntil: new Date(0),
        attempts: 0,
      },
    },
    { upsert: true },
  );
}

export async function drainSquareJobs(limit = 5): Promise<number> {
  const { reconcileSquareObject } = await import("./square-reconciliation");
  let completed = 0;
  for (let index = 0; index < limit; index++) {
    const job = await squareJobs().findOneAndUpdate(
      {
        state: "pending",
        nextAttemptAt: { $lte: new Date() },
        leaseUntil: { $lte: new Date() },
      },
      {
        $set: { leaseUntil: new Date(Date.now() + 120_000) },
        $inc: { attempts: 1 },
      },
      { returnDocument: "after", sort: { nextAttemptAt: 1 } },
    );
    if (!job) break;
    try {
      await reconcileSquareObject(job.kind, job.objectId, job.eventType);
      await squareJobs().updateOne(
        { _id: job._id },
        { $set: { state: "done" } },
      );
      completed++;
    } catch {
      await squareJobs().updateOne(
        { _id: job._id },
        {
          $set: {
            leaseUntil: new Date(0),
            nextAttemptAt: new Date(
              Date.now() +
                Math.min(3600_000, 10_000 * 2 ** Math.min(job.attempts, 9)),
            ),
          },
        },
      );
      console.error("[square] Reconciliation queued for retry", {
        eventId: job._id,
      });
    }
  }
  return completed;
}
