import { getMongoDatabase } from "./db/mongodb";

let pending: Promise<void> | undefined;
export function ensureOperationalIndexes(): Promise<void> {
  return (pending ??= (async () => {
    const { db } = getMongoDatabase();
    await Promise.all([
      db
        .collection("checkout_attempts")
        .createIndex({ state: 1, nextAttemptAt: 1, leaseUntil: 1 }),
      db
        .collection("checkout_attempts")
        .createIndex({ "input.contact.email": 1, createdAt: -1 }),
      ...["customerId", "paymentId", "subscriptionId", "order.id"].map(
        (field) =>
          db
            .collection("checkout_attempts")
            .createIndex({ [field]: 1 }, { sparse: true }),
      ),
      db
        .collection("square_events")
        .createIndex({ state: 1, nextAttemptAt: 1, leaseUntil: 1 }),
      db
        .collection("email_outbox")
        .createIndex({ state: 1, nextAttemptAt: 1, leaseUntil: 1 }),
      db
        .collection("subscription_cancellations")
        .createIndex({ state: 1, leaseUntil: 1 }),
      db
        .collection("request_limits")
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]);
  })().catch((error) => {
    pending = undefined;
    throw error;
  }));
}
