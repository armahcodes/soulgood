import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const mocks = vi.hoisted(() => ({ process: vi.fn(), allow: vi.fn() }));
vi.mock("@/lib/request-limit", () => ({
  allowCheckoutStatusRequest: mocks.allow,
}));
vi.mock("@/lib/checkout-attempt", async (original) => ({
  ...(await original<typeof import("@/lib/checkout-attempt")>()),
  processCheckoutAttempt: mocks.process,
}));
const id = "f6ac292b-72dc-4b7c-9b3b-d38ee1848c40";
function request(body = JSON.stringify({ attemptId: id }), origin?: string) {
  return new Request("https://soulgood.test/api/checkout/status", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      ...(origin ? { origin } : {}),
    },
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.allow.mockResolvedValue(true);
  mocks.process.mockResolvedValue({
    state: "complete",
    result: { ok: true, paymentId: "payment-one" },
  });
});
describe("checkout recovery boundary", () => {
  it("rejects cross-origin requests before accessing an attempt", async () => {
    const response = await POST(request(undefined, "https://other.invalid"));
    expect(response.status).toBe(403);
    expect(mocks.allow).not.toHaveBeenCalled();
    expect(mocks.process).not.toHaveBeenCalled();
  });
  it("caps streamed input before any database call", async () => {
    expect((await POST(request("x".repeat(4097)))).status).toBe(413);
    expect(mocks.allow).not.toHaveBeenCalled();
    expect(mocks.process).not.toHaveBeenCalled();
  });
  it.each(["not json", JSON.stringify({ attemptId: "not-a-uuid" })])(
    "rejects malformed input",
    async (body) => {
      expect((await POST(request(body))).status).toBe(400);
      expect(mocks.process).not.toHaveBeenCalled();
    },
  );
  it("rate-limits checks without permitting a second purchase", async () => {
    mocks.allow.mockResolvedValue(false);
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ pending: true });
    expect(mocks.process).not.toHaveBeenCalled();
  });
  it("resumes the same reference and never caches customer results", async () => {
    const response = await POST(request(undefined, "https://soulgood.test"));
    expect(mocks.process).toHaveBeenCalledWith(id);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
  it("keeps the purchase pending when the rate-limit database is unavailable", async () => {
    mocks.allow.mockRejectedValue(new Error("Database unavailable"));
    const response = await POST(request());
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ pending: true });
    expect(mocks.process).not.toHaveBeenCalled();
  });
});
