import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { balancedCulinarySelection } from "@/lib/culinary-booking";
import { CulinaryQuoteError } from "@/lib/culinary-quotes";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  request: vi.fn(),
  allow: vi.fn(),
  queue: vi.fn(),
  drain: vi.fn(),
  after: vi.fn(),
  invoice: vi.fn(),
  notify: vi.fn(),
}));
vi.mock("@/lib/culinary-invoices", () => ({
  processCulinaryInvoice: mocks.invoice,
  notifyReadyCulinaryInvoices: mocks.notify,
}));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/request-limit", () => ({ allowCulinaryRequest: mocks.allow }));
vi.mock("@/lib/email-outbox", () => ({ drainEmailOutbox: mocks.drain }));
vi.mock("@/lib/culinary-quotes", () => ({
  createCulinaryQuote: mocks.create,
  requestCulinaryBooking: mocks.request,
  queueCulinaryEmails: mocks.queue,
  CulinaryQuoteError: class extends Error {
    constructor(
      message: string,
      public status: number,
      public expired = false,
    ) {
      super(message);
    }
  },
}));
const id = "fa0066bc-1ba4-4ed2-97a0-154076135c23";
const input = {
  experience: "delivery",
  bowlSelection: balancedCulinarySelection(10),
  eventDate: "2026-10-10",
  eventTime: "13:00",
  address: {
    addressLine1: "123 Test Street",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90012",
  },
};
const booking = {
  quoteId: id,
  contact: {
    name: "Test Guest",
    email: "test@example.com",
    phone: "2135550100",
  },
  acceptedEstimate: true,
};
function request(body: unknown = input, path = "", origin?: string) {
  return new Request(`https://soulgood.test/api/culinary-quotes${path}`, {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(origin ? { origin } : {}),
    },
  });
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-08T18:00:00Z"));
  vi.clearAllMocks();
  mocks.allow.mockResolvedValue(true);
  mocks.create.mockResolvedValue({ id });
  mocks.request.mockResolvedValue({ id, reference: "SG-TEST" });
  mocks.queue.mockResolvedValue(undefined);
  mocks.drain.mockResolvedValue(2);
  mocks.invoice.mockResolvedValue(undefined);
  mocks.notify.mockResolvedValue(undefined);
});
afterEach(() => vi.useRealTimers());
describe("culinary API boundary", () => {
  it.each(["", "/"])(
    "accepts the quote route with suffix '%s' and disables caching",
    async (path) => {
      const response = await POST(request(input, path));
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ quote: { id } });
      expect(response.headers.get("Cache-Control")).toBe("no-store");
    },
  );
  it("rejects foreign origins before persistence", async () => {
    expect(
      (await POST(request(input, "", "https://foreign.test"))).status,
    ).toBe(403);
    expect(mocks.allow).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it.each(["not json", "null", JSON.stringify({ ...input, totalCents: 1 })])(
    "rejects malformed or tampered quotes",
    async (body) => {
      expect((await POST(request(body))).status).toBe(400);
      expect(mocks.create).not.toHaveBeenCalled();
    },
  );
  it("caps request body before database work", async () => {
    expect((await POST(request("x".repeat(16 * 1024 + 1)))).status).toBe(413);
    expect(mocks.allow).not.toHaveBeenCalled();
  });
  it("rate limits quote generation and booking requests", async () => {
    mocks.allow.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(429);
    expect((await POST(request(booking, "/request"))).status).toBe(429);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.request).not.toHaveBeenCalled();
  });
  it("does not claim receipt before the durable request succeeds", async () => {
    mocks.request.mockRejectedValue(new Error("Private database details"));
    const response = await POST(request(booking, "/request"));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("Private database details");
    expect(mocks.after).not.toHaveBeenCalled();
  });
  it("requires consent before saving a booking", async () => {
    expect(
      (await POST(request({ ...booking, acceptedEstimate: false }, "/request")))
        .status,
    ).toBe(400);
    expect(mocks.request).not.toHaveBeenCalled();
  });
  it("returns expiry in a safe, actionable response", async () => {
    mocks.request.mockRejectedValue(
      new CulinaryQuoteError("Refresh your quote", 409, true),
    );
    const response = await POST(request(booking, "/request"));
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ expired: true });
  });
  it("acknowledges saved requests and defers both notification jobs", async () => {
    const response = await POST(request(booking, "/request"));
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({
      received: true,
      reference: "SG-TEST",
    });
    expect(mocks.after).toHaveBeenCalledOnce();
    await mocks.after.mock.calls[0][0]();
    expect(mocks.queue).toHaveBeenCalledOnce();
    expect(mocks.drain).toHaveBeenCalledWith(2);
    expect(mocks.invoice).toHaveBeenCalledWith(id);
    expect(mocks.notify).toHaveBeenCalledOnce();
  });
});
