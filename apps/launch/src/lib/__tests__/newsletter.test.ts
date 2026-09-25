import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeCollection } from "./fake-collection";

const mocks = vi.hoisted(() => ({ enqueue: vi.fn(), sync: vi.fn(), collection: null as ReturnType<typeof import("./fake-collection").fakeCollection> | null }));
vi.mock("@/lib/db/mongodb", () => ({ getMongoDatabase: () => ({ db: { collection: () => mocks.collection } }) }));
vi.mock("@/lib/email-outbox", () => ({ enqueueEmail: mocks.enqueue }));
vi.mock("resend", () => ({ Resend: vi.fn() }));

const { confirmSubscription, subscribe, subscriberId, unsubscribe, newsletterSignupSchema } = await import("@/lib/newsletter");

const tokenFrom = (url: string, param: string) => new URL(url).searchParams.get(param)!;

beforeEach(() => {
  vi.resetAllMocks();
  mocks.collection = fakeCollection();
  delete process.env.RESEND_API_KEY;
});

describe("newsletter double opt-in", () => {
  it("requires explicit consent and rejects the honeypot", () => {
    expect(newsletterSignupSchema.safeParse({ email: "a@b.co", consent: false }).success).toBe(false);
    expect(newsletterSignupSchema.safeParse({ email: "a@b.co", consent: true, website: "x" }).success).toBe(false);
    expect(newsletterSignupSchema.safeParse({ email: " A@B.co ", consent: true }).data?.email).toBe("a@b.co");
  });

  it("stores a pending subscriber with consent and only hashed tokens, then emails a confirmation link", async () => {
    await subscribe({ email: "neighbor@example.com", source: "footer", consent: true, website: "" });
    const doc = mocks.collection!.docs.get(subscriberId("neighbor@example.com"))!;
    expect(doc).toMatchObject({ status: "pending", email: "neighbor@example.com", source: "footer" });
    expect(doc.consentText).toMatch(/unsubscribe anytime/);
    const payload = mocks.enqueue.mock.calls[0][2];
    expect(mocks.enqueue.mock.calls[0][1]).toBe("newsletterConfirm");
    expect(JSON.stringify(doc)).not.toContain(tokenFrom(payload.confirmUrl, "token"));
  });

  it("confirms once, then welcome email; expired or reused links fail", async () => {
    await subscribe({ email: "neighbor@example.com", source: "quiz", consent: true, website: "" });
    const confirm = tokenFrom(mocks.enqueue.mock.calls[0][2].confirmUrl, "token");
    expect(await confirmSubscription(confirm)).toBe(true);
    expect(mocks.collection!.docs.get(subscriberId("neighbor@example.com"))!.status).toBe("subscribed");
    expect(mocks.enqueue.mock.calls[1][1]).toBe("newsletterWelcome");
    expect(await confirmSubscription(confirm)).toBe(false);

    await subscribe({ email: "late@example.com", source: "footer", consent: true, website: "" }, new Date("2020-01-01"));
    expect(await confirmSubscription(tokenFrom(mocks.enqueue.mock.calls[2][2].confirmUrl, "token"))).toBe(false);
  });

  it("does not re-email or reveal anything for an already confirmed address", async () => {
    await subscribe({ email: "neighbor@example.com", source: "footer", consent: true, website: "" });
    await confirmSubscription(tokenFrom(mocks.enqueue.mock.calls[0][2].confirmUrl, "token"));
    mocks.enqueue.mockClear();
    await subscribe({ email: "neighbor@example.com", source: "footer", consent: true, website: "" });
    expect(mocks.enqueue).not.toHaveBeenCalled();
  });

  it("unsubscribes by any link we sent, or by email", async () => {
    await subscribe({ email: "neighbor@example.com", source: "footer", consent: true, website: "" });
    const firstUnsubscribe = tokenFrom(mocks.enqueue.mock.calls[0][2].unsubscribeUrl, "unsubscribe");
    await confirmSubscription(tokenFrom(mocks.enqueue.mock.calls[0][2].confirmUrl, "token"));
    await unsubscribe({ token: firstUnsubscribe });
    expect(mocks.collection!.docs.get(subscriberId("neighbor@example.com"))!.status).toBe("unsubscribed");

    await subscribe({ email: "other@example.com", source: "footer", consent: true, website: "" });
    await unsubscribe({ email: "other@example.com" });
    expect(mocks.collection!.docs.get(subscriberId("other@example.com"))!.status).toBe("unsubscribed");
  });
});
