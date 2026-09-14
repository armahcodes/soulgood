import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/account/subscriptions/[id]/cancel/route";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  owner: vi.fn(),
  find: vi.fn(),
  queue: vi.fn(),
  process: vi.fn(),
  drain: vi.fn(),
  after: vi.fn(),
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: mocks.after,
}));
vi.mock("@/lib/auth", () => ({
  getAuth: () => ({ api: { getSession: mocks.session } }),
}));
vi.mock("@/lib/checkout-record", () => ({ getOwnedSubscription: mocks.owner }));
vi.mock("@/lib/subscription-cancellation", () => ({
  cancellationJobs: () => ({ findOne: mocks.find }),
  queueCancellation: mocks.queue,
  processCancellation: mocks.process,
}));
vi.mock("@/lib/email-outbox", () => ({ drainEmailOutbox: mocks.drain }));

const context = { params: Promise.resolve({ id: "plan-test" }) };
const url = "https://soulgood.test/api/account/subscriptions/plan-test/cancel";
const request = (method = "GET", origin = "https://soulgood.test") =>
  new Request(url, { method, headers: { origin } });
beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ user: { email: "customer@example.com" } });
  mocks.owner.mockResolvedValue({
    customerEmail: "customer@example.com",
    customerName: "Test Guest",
    subscriptionStatus: "ACTIVE",
  });
  mocks.find.mockResolvedValue(null);
  mocks.queue.mockResolvedValue(undefined);
  mocks.process.mockResolvedValue({ effectiveDate: "2026-09-20" });
  mocks.drain.mockResolvedValue(undefined);
});

describe("private cancellation status", () => {
  it.each([GET, POST])(
    "requires sign-in before accessing a plan",
    async (handler) => {
      mocks.session.mockResolvedValue(null);
      expect(
        (await handler(request(handler === POST ? "POST" : "GET"), context))
          .status,
      ).toBe(401);
      expect(mocks.owner).not.toHaveBeenCalled();
    },
  );
  it.each([GET, POST])(
    "never discloses or changes another customer's plan",
    async (handler) => {
      mocks.owner.mockResolvedValue(null);
      expect(
        (await handler(request(handler === POST ? "POST" : "GET"), context))
          .status,
      ).toBe(404);
      expect(mocks.owner).toHaveBeenCalledWith(
        "customer@example.com",
        "plan-test",
      );
      expect(mocks.find).not.toHaveBeenCalled();
      expect(mocks.queue).not.toHaveBeenCalled();
    },
  );
  it("GET returns a pending job without initiating a cancellation", async () => {
    mocks.find.mockResolvedValue({ state: "pending" });
    const response = await GET(request(), context);
    expect(await response.json()).toEqual({ state: "pending" });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.find).toHaveBeenCalledWith({
      _id: "plan-test",
      customerEmail: "customer@example.com",
    });
    expect(mocks.queue).not.toHaveBeenCalled();
    expect(mocks.process).not.toHaveBeenCalled();
  });
  it("preserves provider confirmation even if record/email synchronization is pending", async () => {
    mocks.find.mockResolvedValue({
      state: "pending",
      effectiveDate: "2026-09-20",
    });
    expect(await (await GET(request(), context)).json()).toEqual({
      state: "scheduled",
      effectiveDate: "2026-09-20",
    });
  });
  it("fails closed on storage failure instead of claiming the plan is canceled", async () => {
    mocks.find.mockRejectedValue(new Error("offline"));
    expect((await GET(request(), context)).status).toBe(503);
  });
});

describe("cancellation submission", () => {
  it("rejects cross-origin writes", async () => {
    expect(
      (await POST(request("POST", "https://foreign.test"), context)).status,
    ).toBe(403);
    expect(mocks.queue).not.toHaveBeenCalled();
  });
  it("acknowledges durable storage without waiting for Square", async () => {
    const response = await POST(request("POST"), context);
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({
      pending: true,
      state: "pending",
    });
    expect(mocks.queue).toHaveBeenCalledOnce();
    expect(mocks.process).not.toHaveBeenCalled();
    expect(mocks.after).toHaveBeenCalledOnce();
    await mocks.after.mock.calls[0][0]();
    expect(mocks.process).toHaveBeenCalledWith("plan-test");
    expect(mocks.drain).toHaveBeenCalledWith(1);
  });
  it("does not claim a saved request if queue persistence fails", async () => {
    mocks.queue.mockRejectedValue(new Error("offline"));
    expect((await POST(request("POST"), context)).status).toBe(503);
    expect(mocks.after).not.toHaveBeenCalled();
  });
  it.each([GET, POST])(
    "returns an existing confirmed date without repeating cancellation",
    async (handler) => {
      mocks.owner.mockResolvedValue({ cancellationScheduledFor: "2026-09-20" });
      expect(
        await (
          await handler(request(handler === POST ? "POST" : "GET"), context)
        ).json(),
      ).toMatchObject({ state: "scheduled", effectiveDate: "2026-09-20" });
      expect(mocks.queue).not.toHaveBeenCalled();
      expect(mocks.process).not.toHaveBeenCalled();
    },
  );
  it.each([GET, POST])(
    "handles already ended plans without another request",
    async (handler) => {
      mocks.owner.mockResolvedValue({ subscriptionStatus: "CANCELED" });
      expect(
        await (
          await handler(request(handler === POST ? "POST" : "GET"), context)
        ).json(),
      ).toMatchObject({ state: "ended" });
      expect(mocks.queue).not.toHaveBeenCalled();
    },
  );
});
