import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeCollection } from "./fake-collection";

const mocks = vi.hoisted(() => ({ enqueue: vi.fn(), unsubscribe: vi.fn(), collection: null as ReturnType<typeof import("./fake-collection").fakeCollection> | null }));
vi.mock("@/lib/db/mongodb", () => ({ getMongoDatabase: () => ({ db: { collection: () => mocks.collection } }) }));
vi.mock("@/lib/email-outbox", () => ({ enqueueEmail: mocks.enqueue }));
vi.mock("@/lib/newsletter", () => ({ unsubscribe: mocks.unsubscribe }));

const { submitPrivacyRequest } = await import("@/lib/privacy-requests");
const { privacyRequestSchema } = await import("@/lib/privacy-shared");

const base = { requestType: "delete", name: "Avery Jones", email: "avery@example.com", relationship: "self", declaration: true } as const;

beforeEach(() => {
  vi.resetAllMocks();
  mocks.collection = fakeCollection();
});

describe("privacy requests", () => {
  it("validates declarations, agents, and corrections", () => {
    expect(privacyRequestSchema.safeParse({ ...base, declaration: false }).success).toBe(false);
    expect(privacyRequestSchema.safeParse({ ...base, relationship: "agent" }).success).toBe(false);
    expect(privacyRequestSchema.safeParse({ ...base, relationship: "agent", agentFor: "Sam Jones" }).success).toBe(true);
    expect(privacyRequestSchema.safeParse({ ...base, requestType: "correct" }).success).toBe(false);
  });

  it("records the request with a 45-day response date and emails the team and requester", async () => {
    const { reference } = await submitPrivacyRequest(privacyRequestSchema.parse(base), new Date("2026-09-25T18:00:00Z"));
    expect(reference).toMatch(/^PR-[0-9A-F]{6}$/);
    const record = [...mocks.collection!.docs.values()][0];
    expect(record).toMatchObject({ status: "received", respondBy: "2026-11-09" });
    expect(mocks.enqueue.mock.calls.map((call) => call[1])).toEqual(["privacyTeam", "privacyAck"]);
    expect(mocks.unsubscribe).not.toHaveBeenCalled();
  });

  it("applies a consumer's marketing opt-out immediately", async () => {
    await submitPrivacyRequest(privacyRequestSchema.parse({ ...base, requestType: "marketing" }));
    expect(mocks.unsubscribe).toHaveBeenCalledWith({ email: "avery@example.com" });
  });
});
