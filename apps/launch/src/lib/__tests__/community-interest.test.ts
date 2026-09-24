import { beforeEach, describe, expect, it, vi } from "vitest";
import { captureCommunityInterest } from "../community-interest";
import { communityInterestSchema, COMMUNITY_DRIVE } from "../community-drive";

const mocks = vi.hoisted(() => ({
  write: vi.fn(),
  enqueue: vi.fn(),
  records: new Map(),
}));
vi.mock("../db/mongodb", () => ({
  getMongoDatabase: () => ({
    db: { collection: () => ({ findOneAndUpdate: mocks.write }) },
  }),
}));
vi.mock("../email-outbox", () => ({ enqueueEmail: mocks.enqueue }));
const input = communityInterestSchema.parse({
  name: "Test Neighbor",
  email: "neighbor@example.com",
  interest: "host",
  community: "Long Beach",
  consent: true,
});
beforeEach(() => {
  vi.resetAllMocks();
  mocks.records.clear();
  mocks.enqueue.mockResolvedValue(undefined);
  mocks.write.mockImplementation(async (filter, update) => {
    if (!mocks.records.has(filter._id))
      mocks.records.set(filter._id, {
        _id: filter._id,
        ...update.$setOnInsert,
      });
    return mocks.records.get(filter._id);
  });
});
describe("durable community inquiries", () => {
  it("uses a server-set campaign, preserves consent, and safely reuses identical retries", async () => {
    await captureCommunityInterest(input);
    await captureCommunityInterest(input);
    expect(mocks.records.size).toBe(1);
    const record = [...mocks.records.values()][0];
    expect(record).toMatchObject({
      name: input.name,
      email: input.email,
      interest: input.interest,
      consent: true,
      campaign: COMMUNITY_DRIVE.campaign,
    });
    expect(record).not.toHaveProperty("website");
    expect(record.id).not.toContain("neighbor");
    expect(record.capturedAt).toBeTruthy();
    expect(mocks.enqueue.mock.calls[0]).toEqual(mocks.enqueue.mock.calls[1]);
    expect(mocks.enqueue).toHaveBeenCalledWith(
      `community:${record.id}`,
      "community",
      record,
    );
  });
  it("does not notify on a failed database write", async () => {
    mocks.write.mockRejectedValue(new Error("Database unavailable"));
    await expect(captureCommunityInterest(input)).rejects.toThrow();
    expect(mocks.enqueue).not.toHaveBeenCalled();
  });
  it("recovers notification-enqueue failures without duplicating the inquiry", async () => {
    mocks.enqueue.mockRejectedValueOnce(new Error("Outbox unavailable"));
    await expect(captureCommunityInterest(input)).rejects.toThrow();
    await captureCommunityInterest(input);
    expect(mocks.records.size).toBe(1);
    expect(mocks.enqueue.mock.calls[0]).toEqual(mocks.enqueue.mock.calls[1]);
  });
});
