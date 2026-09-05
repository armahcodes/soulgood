import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { drainEmailOutbox, enqueueEmail } from "../email-outbox";

const mocks = vi.hoisted(() => ({
  rows: new Map<string, Record<string, unknown>>(),
  send: vi.fn(),
}));
vi.mock("../db/mongodb", () => ({
  getMongoDatabase: () => ({
    db: {
      collection: () => ({
        updateOne: async (
          filter: { _id: string },
          update: {
            $setOnInsert?: Record<string, unknown>;
            $set?: Record<string, unknown>;
          },
        ) => {
          if (!mocks.rows.has(filter._id) && update.$setOnInsert)
            mocks.rows.set(filter._id, structuredClone(update.$setOnInsert));
          if (update.$set)
            Object.assign(mocks.rows.get(filter._id)!, update.$set);
        },
        findOneAndUpdate: async () => {
          const row = [...mocks.rows.values()].find(
            (value) =>
              value.state === "pending" &&
              (value.nextAttemptAt as Date).getTime() <= Date.now() &&
              (value.leaseUntil as Date).getTime() <= Date.now(),
          );
          if (!row) return null;
          row.leaseUntil = new Date(Date.now() + 120_000);
          row.attempts = Number(row.attempts) + 1;
          return structuredClone(row);
        },
      }),
    },
  }),
}));
vi.mock("../email", () => ({
  sendOrderConfirmationEmail: mocks.send,
  sendSubscriptionCancelledEmail: mocks.send,
  sendFulfillmentReminderEmail: mocks.send,
  sendExchangeUpdateEmail: mocks.send,
  sendPaymentUpdateEmail: mocks.send,
}));
vi.mock("../checkout-record", () => ({
  updateCheckoutConfirmationEmail: vi.fn(async () => {}),
}));

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-only";
  mocks.rows.clear();
  mocks.send.mockReset().mockResolvedValue("test-email-id");
  vi.useFakeTimers({ toFake: ["Date"] });
});
afterEach(() => vi.useRealTimers());

const payload = {
  customerEmail: "test@example.com",
  customerName: "Test",
  effectiveDate: "2026-09-11",
  subscriptionId: "test-subscription",
};
describe("durable email outbox", () => {
  it("deduplicates enqueue and retries an identical payload after a transport failure", async () => {
    await enqueueEmail("job-one", "cancellation", payload);
    await enqueueEmail("job-one", "cancellation", payload);
    expect(mocks.rows.size).toBe(1);
    mocks.send.mockRejectedValueOnce(new Error("transport failed"));
    expect(await drainEmailOutbox(1)).toBe(0);
    vi.setSystemTime(Date.now() + 300_000);
    expect(await drainEmailOutbox(1)).toBe(1);
    expect(mocks.send.mock.calls[0]).toEqual(mocks.send.mock.calls[1]);
    expect(await drainEmailOutbox(1)).toBe(0);
  });
  it("escalates uncertainty past Resend's deduplication window instead of sending again", async () => {
    await enqueueEmail("job-one", "cancellation", payload);
    mocks.send.mockRejectedValueOnce(new Error("response lost"));
    await drainEmailOutbox(1);
    vi.setSystemTime(Date.now() + 24 * 60 * 60 * 1000);
    expect(await drainEmailOutbox(1)).toBe(0);
    expect(mocks.rows.get("job-one")?.state).toBe("needs-review");
    expect(mocks.send).toHaveBeenCalledOnce();
  });
});
