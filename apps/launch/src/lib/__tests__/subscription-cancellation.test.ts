import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  processCancellation,
  queueCancellation,
} from "../subscription-cancellation";

const mocks = vi.hoisted(() => ({
  row: null as Record<string, unknown> | null,
  request: vi.fn(),
  mark: vi.fn(),
  enqueue: vi.fn(),
}));
vi.mock("../db/mongodb", () => ({
  getMongoDatabase: () => ({
    db: {
      collection: () => ({
        updateOne: async (
          _filter: unknown,
          update: {
            $setOnInsert?: Record<string, unknown>;
            $set?: Record<string, unknown>;
          },
        ) => {
          if (!mocks.row && update.$setOnInsert)
            mocks.row = structuredClone(update.$setOnInsert);
          if (mocks.row && update.$set) Object.assign(mocks.row, update.$set);
        },
        findOne: async () => mocks.row,
        findOneAndUpdate: async () => {
          if (mocks.row?.state !== "pending") return null;
          return structuredClone(mocks.row);
        },
      }),
    },
  }),
}));
vi.mock("../square", () => ({ squareRequest: mocks.request }));
vi.mock("../checkout-record", () => ({
  markSubscriptionCancellation: mocks.mark,
}));
vi.mock("../email-outbox", () => ({ enqueueEmail: mocks.enqueue }));

beforeEach(() => {
  mocks.row = null;
  mocks.request.mockReset();
  mocks.mark.mockReset().mockResolvedValue(undefined);
  mocks.enqueue.mockReset().mockResolvedValue(undefined);
});
afterEach(() => vi.restoreAllMocks());

describe("subscription cancellation recovery", () => {
  it("preserves Square's confirmed cancellation through a database failure", async () => {
    await queueCancellation("subscription-test", {
      customerEmail: "owner@example.com",
      customerName: "Owner",
    });
    mocks.request.mockResolvedValue({
      subscription: { canceled_date: "2026-09-11", status: "ACTIVE" },
    });
    mocks.mark.mockRejectedValueOnce(new Error("database failed"));
    expect(await processCancellation("subscription-test")).toEqual({
      effectiveDate: "2026-09-11",
      syncPending: true,
    });
    expect(mocks.row?.state).toBe("pending");
    expect(await processCancellation("subscription-test")).toEqual({
      effectiveDate: "2026-09-11",
    });
    expect(
      mocks.request.mock.calls.some(([path]) => path.endsWith("/cancel")),
    ).toBe(false);
    expect(mocks.row?.state).toBe("done");
    expect(mocks.enqueue).toHaveBeenCalledOnce();
  });

  it("checks upstream state after a lost cancellation response rather than repeating the write", async () => {
    await queueCancellation("subscription-test", {
      customerEmail: "owner@example.com",
      customerName: "Owner",
    });
    mocks.request
      .mockResolvedValueOnce({ subscription: { status: "ACTIVE" } })
      .mockRejectedValueOnce(new Error("lost response"));
    expect(await processCancellation("subscription-test")).toMatchObject({
      syncPending: true,
    });
    mocks.request.mockResolvedValue({
      subscription: { canceled_date: "2026-09-11", status: "ACTIVE" },
    });
    expect(await processCancellation("subscription-test")).toEqual({
      effectiveDate: "2026-09-11",
    });
    expect(
      mocks.request.mock.calls.filter(([path]) => path.endsWith("/cancel")),
    ).toHaveLength(1);
  });
});
