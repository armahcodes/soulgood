import { describe, expect, it } from "vitest";
import {
  cancellationSnapshotSchema,
  formatCustomerDate,
  orderStatusLabel,
  planHasEnded,
} from "../customer-experience";
import { safeAccountRedirect } from "../safe-redirect";

describe("customer-facing plan and order states", () => {
  it("preserves a cancellation calendar date in Los Angeles", () => {
    expect(formatCustomerDate("2026-09-20")).toBe("September 20, 2026");
    expect(formatCustomerDate("2026-09-20T01:00:00Z")).toBe(
      "September 19, 2026",
    );
  });
  it.each(["invalid", "2026-02-31"])(
    "handles invalid date %s without inventing an end date",
    (date) => {
      expect(formatCustomerDate(date)).toBe("Date unavailable");
    },
  );
  it("does not equate an active or paused plan with cancellation", () => {
    for (const state of ["ACTIVE", "PENDING", "PAUSED", undefined])
      expect(planHasEnded(state)).toBe(false);
    for (const state of ["CANCELED", "CANCELLED", "DEACTIVATED"])
      expect(planHasEnded(state)).toBe(true);
  });
  it("requires an explicit state and a valid date before confirming cancellation", () => {
    expect(
      cancellationSnapshotSchema.safeParse({ state: "pending" }).success,
    ).toBe(true);
    expect(cancellationSnapshotSchema.safeParse({ ok: true }).success).toBe(
      false,
    );
    expect(
      cancellationSnapshotSchema.safeParse({ state: "scheduled" }).success,
    ).toBe(false);
    expect(
      cancellationSnapshotSchema.safeParse({
        state: "scheduled",
        effectiveDate: "2026-02-31",
      }).success,
    ).toBe(false);
  });
  it("distinguishes payment authorization from payment completion", () => {
    expect(orderStatusLabel("APPROVED")).toBe("Payment authorized");
    expect(orderStatusLabel("COMPLETED")).toBe("Paid");
    expect(orderStatusLabel("PENDING_PAYMENT")).toBe("Payment pending");
    expect(orderStatusLabel("PARTIALLY_REFUNDED")).toBe("Partially refunded");
  });
  it("preserves the cancellation destination through sign-in", () => {
    expect(safeAccountRedirect("/cancel")).toBe("/cancel");
  });
});
