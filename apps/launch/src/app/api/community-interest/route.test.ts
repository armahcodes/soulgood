import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
const mocks = vi.hoisted(() => ({
  save: vi.fn(),
  allow: vi.fn(),
  after: vi.fn(),
  drain: vi.fn(),
}));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/community-interest", () => ({
  captureCommunityInterest: mocks.save,
}));
vi.mock("@/lib/request-limit", () => ({ allowCommunityRequest: mocks.allow }));
vi.mock("@/lib/email-outbox", () => ({ drainEmailOutbox: mocks.drain }));
const valid = {
  name: "Test Neighbor",
  email: "neighbor@example.com",
  interest: "host",
  community: "Long Beach",
  consent: true,
};
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("https://soulgood.test/api/community-interest", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.allow.mockResolvedValue(true);
  mocks.save.mockResolvedValue(undefined);
  mocks.drain.mockResolvedValue(1);
});
describe("community inquiry endpoint", () => {
  it("acknowledges only durable capture and defers email transport", async () => {
    const response = await POST(request());
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ received: true });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.save).toHaveBeenCalledOnce();
    expect(mocks.after).toHaveBeenCalledOnce();
    expect(mocks.drain).not.toHaveBeenCalled();
    await mocks.after.mock.calls[0][0]();
    expect(mocks.drain).toHaveBeenCalledWith(2);
  });
  it("rejects cross-origin submissions before touching the database", async () => {
    expect(
      (await POST(request(valid, { origin: "https://foreign.test" }))).status,
    ).toBe(403);
    expect(mocks.allow).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it.each([
    "broken json",
    "null",
    { ...valid, consent: false },
    { ...valid, website: "spam" },
    { ...valid, community: "" },
  ])("validates submissions before persistence: %j", async (body) => {
    expect((await POST(request(body))).status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("limits body size before storage", async () => {
    expect((await POST(request("x".repeat(8193)))).status).toBe(413);
    expect(mocks.allow).not.toHaveBeenCalled();
  });
  it("requires JSON", async () => {
    expect(
      (await POST(request(valid, { "Content-Type": "text/plain" }))).status,
    ).toBe(415);
  });
  it("rate-limits inquiries without saving or notifying", async () => {
    mocks.allow.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(429);
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.after).not.toHaveBeenCalled();
  });
  it("does not acknowledge storage failure or expose internal details", async () => {
    mocks.save.mockRejectedValue(new Error("private-connection-information"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain(
      "private-connection-information",
    );
    expect(mocks.after).not.toHaveBeenCalled();
  });
});
