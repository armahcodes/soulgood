import { getMongoDatabase } from "./db/mongodb";
import {
  markSubscriptionCancellation,
  type OwnedSubscription,
} from "./checkout-record";
import { enqueueEmail } from "./email-outbox";
import { squareRequest } from "./square";

type CancellationJob = {
  _id: string;
  customerEmail: string;
  customerName: string;
  state: "pending" | "done";
  leaseUntil: Date;
  effectiveDate?: string;
};
export function cancellationJobs() {
  return getMongoDatabase().db.collection<CancellationJob>(
    "subscription_cancellations",
  );
}

export async function queueCancellation(
  id: string,
  owner: OwnedSubscription,
): Promise<void> {
  await cancellationJobs().updateOne(
    { _id: id },
    {
      $setOnInsert: {
        _id: id,
        customerEmail: owner.customerEmail,
        customerName: owner.customerName,
        state: "pending",
        leaseUntil: new Date(0),
      },
    },
    { upsert: true },
  );
}

export async function processCancellation(
  id: string,
): Promise<{ effectiveDate?: string; syncPending?: boolean }> {
  const job = await cancellationJobs().findOneAndUpdate(
    { _id: id, state: "pending", leaseUntil: { $lte: new Date() } },
    { $set: { leaseUntil: new Date(Date.now() + 120_000) } },
    { returnDocument: "after" },
  );
  if (!job) {
    const existing = await cancellationJobs().findOne({ _id: id });
    return { effectiveDate: existing?.effectiveDate };
  }
  let effectiveDate: string | undefined;
  try {
    // Resolve an earlier lost response before issuing another cancellation request.
    let response = await squareRequest<{
      subscription?: { canceled_date?: string; status?: string };
    }>(`/v2/subscriptions/${encodeURIComponent(id)}`);
    if (!response.subscription?.canceled_date)
      response = await squareRequest(
        `/v2/subscriptions/${encodeURIComponent(id)}/cancel`,
        { method: "POST" },
      );
    effectiveDate = response.subscription?.canceled_date;
    if (!effectiveDate)
      throw new Error("Cancellation is awaiting confirmation");
    await markSubscriptionCancellation(
      id,
      effectiveDate,
      response.subscription?.status || "CANCELED",
    );
    await enqueueEmail(`cancellation:${id}`, "cancellation", {
      customerEmail: job.customerEmail,
      customerName: job.customerName,
      subscriptionId: id,
      effectiveDate,
    });
    await cancellationJobs().updateOne(
      { _id: id },
      { $set: { state: "done", effectiveDate } },
    );
    return { effectiveDate };
  } catch {
    await cancellationJobs()
      .updateOne(
        { _id: id },
        {
          $set: {
            leaseUntil: new Date(Date.now() + 30_000),
            ...(effectiveDate ? { effectiveDate } : {}),
          },
        },
      )
      .catch(() => undefined);
    // Preserve an affirmative Square result even if the database/email step fails.
    return { effectiveDate, syncPending: true };
  }
}
