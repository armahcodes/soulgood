import { getMongoDatabase } from "./db/mongodb";
import {
  sendOrderConfirmationEmail,
  sendSubscriptionCancelledEmail,
  sendFulfillmentReminderEmail,
  sendExchangeUpdateEmail,
  sendPaymentUpdateEmail,
} from "./email";
import {
  updateCheckoutConfirmationEmail,
  type CheckoutRecord,
} from "./checkout-record";

type MailPayloads = {
  order: Parameters<typeof sendOrderConfirmationEmail>[0];
  cancellation: Parameters<typeof sendSubscriptionCancelledEmail>[0];
  fulfillment: Parameters<typeof sendFulfillmentReminderEmail>[0];
  exchange: Parameters<typeof sendExchangeUpdateEmail>[0];
  paymentUpdate: Parameters<typeof sendPaymentUpdateEmail>[0];
};
type MailJob = {
  [K in keyof MailPayloads]: { kind: K; payload: MailPayloads[K] };
}[keyof MailPayloads] & {
  _id: string;
  state: "pending" | "sent" | "needs-review";
  nextAttemptAt: Date;
  leaseUntil: Date;
  createdAt: Date;
  firstAttemptAt?: Date;
  attempts: number;
  resendId?: string;
};

function outbox() {
  return getMongoDatabase().db.collection<MailJob>("email_outbox");
}

export async function enqueueEmail<K extends keyof MailPayloads>(
  id: string,
  kind: K,
  payload: MailPayloads[K],
): Promise<void> {
  await outbox().updateOne(
    { _id: id },
    {
      $setOnInsert: {
        _id: id,
        kind,
        payload,
        state: "pending",
        nextAttemptAt: new Date(),
        leaseUntil: new Date(0),
        createdAt: new Date(),
        attempts: 0,
      } as MailJob,
    },
    { upsert: true },
  );
}

export async function enqueueOrderEmail(record: CheckoutRecord): Promise<void> {
  const address = record.deliveryAddress;
  await enqueueEmail(`order:${record.squareObjectId}`, "order", {
    ...record,
    paymentPending: record.orderStatus === "PENDING_PAYMENT",
    deliveryAddress: address
      ? [
          address.addressLine1,
          address.addressLine2,
          `${address.city}, ${address.state} ${address.postalCode}`,
        ]
          .filter(Boolean)
          .join(", ")
      : undefined,
  });
}

export async function drainEmailOutbox(limit = 5): Promise<number> {
  if (!process.env.RESEND_API_KEY) return 0;
  let sent = 0;
  for (let index = 0; index < limit; index++) {
    const job = await outbox().findOneAndUpdate(
      {
        state: "pending",
        leaseUntil: { $lte: new Date() },
        nextAttemptAt: { $lte: new Date() },
      },
      {
        $set: { leaseUntil: new Date(Date.now() + 120_000) },
        $inc: { attempts: 1 },
      },
      { returnDocument: "after", sort: { nextAttemptAt: 1 } },
    );
    if (!job) break;
    if (
      job.firstAttemptAt &&
      Date.now() - job.firstAttemptAt.getTime() > 23 * 60 * 60 * 1000
    ) {
      // Resend's deduplication window is 24 hours. Escalate instead of risking a duplicate.
      await outbox().updateOne(
        { _id: job._id },
        { $set: { state: "needs-review" } },
      );
      continue;
    }
    try {
      if (!job.firstAttemptAt)
        await outbox().updateOne(
          { _id: job._id },
          { $set: { firstAttemptAt: new Date() } },
        );
      let resendId: string;
      switch (job.kind) {
        case "order":
          resendId = await sendOrderConfirmationEmail(job.payload);
          break;
        case "cancellation":
          resendId = await sendSubscriptionCancelledEmail(job.payload);
          break;
        case "fulfillment":
          resendId = await sendFulfillmentReminderEmail(job.payload);
          break;
        case "exchange":
          resendId = await sendExchangeUpdateEmail(job.payload);
          break;
        case "paymentUpdate":
          resendId = await sendPaymentUpdateEmail(job.payload);
          break;
      }
      await outbox().updateOne(
        { _id: job._id },
        { $set: { state: "sent", resendId } },
      );
      if (job.kind === "order")
        await updateCheckoutConfirmationEmail(job.payload.squareObjectId, {
          status: "sent",
          resendEmailId: resendId,
        }).catch(() => undefined);
      sent++;
    } catch {
      await outbox().updateOne(
        { _id: job._id },
        {
          $set: {
            leaseUntil: new Date(0),
            nextAttemptAt: new Date(
              Date.now() +
                Math.min(300_000, 10_000 * 2 ** Math.min(job.attempts, 5)),
            ),
          },
        },
      );
      console.error("[email] Delivery queued for retry", { jobId: job._id });
    }
  }
  return sent;
}
