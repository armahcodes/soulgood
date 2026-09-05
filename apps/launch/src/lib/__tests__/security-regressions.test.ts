import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { safeAccountRedirect } from "../safe-redirect";
import { sealPaymentSource, openPaymentSource } from "../secure-payload";
import { verifySquareSignature } from "../square-jobs";
import { paymentStatus } from "../square-reconciliation";
import { hasBearer, readLimitedBody } from "../server-http";

describe("security regression checks", () => {
  it.each([
    "//example.invalid",
    "/\\example.invalid",
    "/%5Cexample.invalid",
    "/%2Fexample.invalid",
    "https://example.invalid",
    "/\t/example.invalid",
    "/%00/example.invalid",
    "/%zz",
  ])("rejects unsafe redirect %s", (value) =>
    expect(safeAccountRedirect(value)).toBe("/account"),
  );
  it("retains a safe same-origin return path", () =>
    expect(safeAccountRedirect("/checkout?fulfillment=delivery#billing")).toBe(
      "/checkout?fulfillment=delivery#billing",
    ));
  it("authenticates the exact Square URL and raw body", () => {
    const raw = '{"event_id":"test"}',
      url = "https://soulgood.test/api/webhooks/square",
      key = "test-signature-key";
    const signature = createHmac("sha256", key)
      .update(url + raw)
      .digest("base64");
    expect(verifySquareSignature(raw, signature, key, url)).toBe(true);
    expect(verifySquareSignature(raw + " ", signature, key, url)).toBe(false);
    expect(verifySquareSignature(raw, signature, key, url + "/")).toBe(false);
    expect(verifySquareSignature(raw, "short", key, url)).toBe(false);
  });
  it("binds encrypted payment sources to a single attempt", () => {
    process.env.CHECKOUT_QUOTE_SECRET =
      "test-secret-with-at-least-32-characters";
    const sealed = sealPaymentSource({ sourceId: "test-nonce" }, "attempt-one");
    expect(sealed).not.toContain("test-nonce");
    expect(openPaymentSource(sealed, "attempt-one").sourceId).toBe(
      "test-nonce",
    );
    expect(() => openPaymentSource(sealed, "attempt-two")).toThrow();
  });
  it("disables operational endpoints without a strong secret", () => {
    expect(
      hasBearer(
        new Request("https://test", {
          headers: { authorization: "Bearer undefined" },
        }),
        undefined,
      ),
    ).toBe(false);
    const key = "x".repeat(40);
    expect(
      hasBearer(
        new Request("https://test", {
          headers: { authorization: `Bearer ${key}` },
        }),
        key,
      ),
    ).toBe(true);
  });
  it("limits streamed request sizes", async () => {
    await expect(
      readLimitedBody(
        new Request("https://test", { method: "POST", body: "too long" }),
        3,
      ),
    ).rejects.toThrow();
  });
  it("reflects partial and complete refunds without presenting payment success", () => {
    expect(
      paymentStatus({
        status: "COMPLETED",
        amount_money: { amount: 100 },
        refunded_money: { amount: 50 },
      }),
    ).toBe("PARTIALLY_REFUNDED");
    expect(
      paymentStatus({
        status: "COMPLETED",
        amount_money: { amount: 100 },
        refunded_money: { amount: 100 },
      }),
    ).toBe("REFUNDED");
  });
});
