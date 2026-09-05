import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const mocks = vi.hoisted(() => ({ enqueue: vi.fn() }));
vi.mock("@/lib/square-jobs", async (original) => ({
  ...(await original<typeof import("@/lib/square-jobs")>()),
  enqueueSquareSync: mocks.enqueue,
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: vi.fn(),
}));

const url = "https://soulgood.test/api/webhooks/square";
const key = "test-webhook-key";
function request(raw: string, signature?: string) {
  return new Request(url, {
    method: "POST",
    body: raw,
    headers: {
      "x-square-hmacsha256-signature":
        signature ??
        createHmac("sha256", key)
          .update(url + raw)
          .digest("base64"),
    },
  });
}

beforeEach(() => {
  process.env.SQUARE_WEBHOOK_SIGNATURE_KEY = key;
  process.env.SQUARE_WEBHOOK_NOTIFICATION_URL = url;
  mocks.enqueue.mockReset().mockResolvedValue(undefined);
});

describe("Square webhook boundary", () => {
  it("rejects tampering without accepting a job", async () => {
    expect((await POST(request("{}", "invalid"))).status).toBe(403);
    expect(mocks.enqueue).not.toHaveBeenCalled();
  });
  it("retains event identity and type for deduplication and failure notifications", async () => {
    const raw = JSON.stringify({
      event_id: "event-test",
      type: "invoice.scheduled_charge_failed",
      data: { id: "invoice-test" },
    });
    expect((await POST(request(raw))).status).toBe(200);
    expect((await POST(request(raw))).status).toBe(200);
    expect(mocks.enqueue).toHaveBeenNthCalledWith(
      1,
      "event-test",
      "invoice",
      "invoice-test",
      "invoice.scheduled_charge_failed",
    );
    expect(mocks.enqueue.mock.calls[0]).toEqual(mocks.enqueue.mock.calls[1]);
  });
  it("returns a retryable error when durable acceptance fails", async () => {
    mocks.enqueue.mockRejectedValueOnce(new Error("database down"));
    const raw = JSON.stringify({
      event_id: "event-test",
      type: "payment.updated",
      data: { id: "payment-test" },
    });
    expect((await POST(request(raw))).status).toBe(503);
  });
  it("rejects invalid signed JSON without crashing", async () => {
    expect((await POST(request("not json"))).status).toBe(400);
  });
});
