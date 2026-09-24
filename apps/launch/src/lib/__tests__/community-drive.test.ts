import { describe, expect, it } from "vitest";
import {
  communityInterestSchema,
  COMMUNITY_INTERESTS,
} from "../community-drive";

const valid = {
  name: "Community Neighbor",
  email: "neighbor@example.com",
  interest: "host",
  community: "Long Beach",
  consent: true,
};
describe("community inquiry validation", () => {
  it("normalizes contact details and ignores fields that could impersonate campaign facts", () => {
    const result = communityInterestSchema.parse({
      ...valid,
      email: " Neighbor@Example.com ",
      campaign: "other",
      paid: true,
    });
    expect(result.email).toBe("neighbor@example.com");
    expect(result).not.toHaveProperty("campaign");
    expect(result).not.toHaveProperty("paid");
  });
  it.each(COMMUNITY_INTERESTS)("accepts $value inquiries", ({ value }) => {
    expect(
      communityInterestSchema.safeParse({ ...valid, interest: value }).success,
    ).toBe(true);
  });
  it("requires a community only for host inquiries", () => {
    expect(
      communityInterestSchema.safeParse({ ...valid, community: " " }).success,
    ).toBe(false);
    expect(
      communityInterestSchema.safeParse({
        ...valid,
        interest: "volunteer",
        community: "",
      }).success,
    ).toBe(true);
  });
  it.each([
    { consent: false },
    { consent: "true" },
    { name: " " },
    { email: "invalid" },
    { interest: "donate" },
    { message: "x".repeat(1501) },
    { website: "spam.example" },
  ])("rejects invalid or unconsented input %j", (changes) => {
    expect(
      communityInterestSchema.safeParse({ ...valid, ...changes }).success,
    ).toBe(false);
  });
});
