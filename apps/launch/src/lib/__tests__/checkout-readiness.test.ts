import { describe, expect, it } from "vitest";
import { checkoutOperationsReady } from "../checkout-readiness";

const configured = {
  SQUARE_ENVIRONMENT: "production",
  MONGODB_URI: "test-only-db",
  RESEND_API_KEY: "test-only-mail",
  SQUARE_WEBHOOK_SIGNATURE_KEY: "test-only-hook",
  SQUARE_WEBHOOK_NOTIFICATION_URL:
    "https://www.soulgood.kitchen/api/webhooks/square",
  BETTER_AUTH_SECRET: "test-only-auth-32-characters-long-secret",
  CHECKOUT_QUOTE_SECRET: "test-only-quote-32-characters-long-secret",
  CRON_SECRET: "test-only-cron-32-characters-long-secret",
};
describe("live checkout readiness", () => {
  it("allows sandbox tests and configured live operations", () => {
    expect(checkoutOperationsReady({ SQUARE_ENVIRONMENT: "sandbox" })).toBe(
      true,
    );
    expect(checkoutOperationsReady(configured)).toBe(true);
  });
  it.each([
    "MONGODB_URI",
    "RESEND_API_KEY",
    "SQUARE_WEBHOOK_SIGNATURE_KEY",
    "BETTER_AUTH_SECRET",
    "CHECKOUT_QUOTE_SECRET",
    "CRON_SECRET",
  ])("fails closed without %s", (name) => {
    expect(checkoutOperationsReady({ ...configured, [name]: "" })).toBe(false);
  });
  it("rejects short encryption keys and non-HTTPS webhook URLs", () => {
    expect(
      checkoutOperationsReady({
        ...configured,
        CHECKOUT_ENCRYPTION_SECRET: "short",
      }),
    ).toBe(false);
    expect(
      checkoutOperationsReady({
        ...configured,
        SQUARE_WEBHOOK_NOTIFICATION_URL: "http://localhost/api/webhooks/square",
      }),
    ).toBe(false);
  });
  it.each([
    "placeholder-secret-that-is-long-enough",
    "better-auth-secret-with-32-characters",
    "replace-me-with-a-longer-secret-value",
  ])("rejects the same placeholder secrets as authentication", (value) => {
    expect(
      checkoutOperationsReady({ ...configured, BETTER_AUTH_SECRET: value }),
    ).toBe(false);
  });
});
