import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  attemptResponse,
  AttemptConflictError,
  processCheckoutAttempt,
  startCheckoutAttempt,
} from "../checkout-attempt";
import { SquareApiError, type squareRequest } from "../square";
import {
  checkoutInput,
  configureCheckout,
  memoryAttempts,
  quote,
} from "./checkout-fixtures";
import { openPaymentSource } from "../secure-payload";

beforeEach(() => {
  configureCheckout();
  vi.useFakeTimers({ toFake: ["Date"] });
});
afterEach(() => vi.useRealTimers());

function harness() {
  const store = memoryAttempts();
  const request = vi.fn(async <T>(path: string): Promise<T> => {
    const value =
      path === "/v2/customers"
        ? { customer: { id: "customer-one" } }
        : path === "/v2/cards"
          ? { card: { id: "card-one" } }
          : path === "/v2/subscriptions"
            ? { subscription: { id: "subscription-one", status: "ACTIVE" } }
            : {
                payment: {
                  id: "payment-one",
                  status: "COMPLETED",
                  receipt_url: "https://square.example/receipt",
                },
              };
    return value as T;
  });
  const createOrder = vi.fn(async () => ({
    id: "order-one",
    version: 1,
    state: "OPEN" as const,
    totalCents: quote.totalCents,
  }));
  const persist = vi.fn(async () => true);
  const enqueue = vi.fn(async () => {});
  return {
    store,
    request: request as typeof squareRequest & typeof request,
    createOrder,
    persist,
    enqueue,
  };
}

describe("durable checkout attempts", () => {
  it("saves an encrypted immutable request before external writes and deduplicates completion", async () => {
    const deps = harness();
    const input = checkoutInput();
    const attempt = await startCheckoutAttempt(input, quote, deps.store);
    expect(JSON.stringify(attempt)).not.toContain(input.sourceId);
    expect(
      openPaymentSource(attempt.encryptedSource!, attempt._id).sourceId,
    ).toBe(input.sourceId);
    const result = await processCheckoutAttempt(attempt._id, deps);
    expect(result?.result?.status).toBe("COMPLETED");
    expect(deps.persist).toHaveBeenCalledOnce();
    expect(deps.enqueue).toHaveBeenCalledOnce();
    expect(deps.store.rows.get(attempt._id)?.encryptedSource).toBeUndefined();
    const requests = deps.request.mock.calls.length;
    await processCheckoutAttempt(attempt._id, deps);
    expect(deps.request).toHaveBeenCalledTimes(requests);
  });

  it("never searches or overwrites an existing guest customer, even on a decline", async () => {
    const deps = harness();
    const original = deps.request.getMockImplementation()!;
    deps.request.mockImplementation(async (path: string) => {
      if (path === "/v2/payments")
        throw new SquareApiError("declined", 400, ["CARD_DECLINED"]);
      return original(path);
    });
    const attempt = await startCheckoutAttempt(
      checkoutInput(),
      quote,
      deps.store,
    );
    const result = await processCheckoutAttempt(attempt._id, deps);
    expect(attemptResponse(result)).toMatchObject({
      status: 422,
      body: { safeToRetry: true },
    });
    expect(deps.request.mock.calls.map(([path]) => path)).not.toContain(
      "/v2/customers/search",
    );
    expect(deps.enqueue).not.toHaveBeenCalled();
  });

  it.each(["one-time", "weekly"] as const)(
    "recovers a lost %s response with exactly the same financial request",
    async (purchaseType) => {
      const deps = harness();
      const original = deps.request.getMockImplementation()!;
      const target =
        purchaseType === "weekly" ? "/v2/subscriptions" : "/v2/payments";
      const bodies: string[] = [];
      let failed = false;
      deps.request.mockImplementation(
        async <T>(path: string, ...args: unknown[]) => {
          if (path === target) {
            bodies.push(JSON.stringify(args));
            if (!failed) {
              failed = true;
              throw new Error("response lost after creation");
            }
          }
          return original(path) as Promise<T>;
        },
      );
      const attempt = await startCheckoutAttempt(
        checkoutInput({ purchaseType }),
        quote,
        deps.store,
      );
      expect((await processCheckoutAttempt(attempt._id, deps))?.state).toBe(
        "pending",
      );
      vi.setSystemTime(Date.now() + 60_000);
      const result = await processCheckoutAttempt(attempt._id, deps);
      expect(result?.state).toBe("complete");
      expect(bodies).toHaveLength(2);
      expect(bodies[0]).toBe(bodies[1]);
      expect(
        deps.request.mock.calls.some(([path]) => path.includes("/disable")),
      ).toBe(false);
      expect(result?.result?.paymentPending).toBe(purchaseType === "weekly");
      if (purchaseType === "weekly")
        expect(result?.result?.status).toBe("PENDING_PAYMENT");
    },
  );

  it("recovers a database failure after payment without charging again", async () => {
    const deps = harness();
    deps.persist.mockRejectedValueOnce(new Error("database unavailable"));
    const attempt = await startCheckoutAttempt(
      checkoutInput(),
      quote,
      deps.store,
    );
    expect((await processCheckoutAttempt(attempt._id, deps))?.state).toBe(
      "pending",
    );
    vi.setSystemTime(Date.now() + 60_000);
    expect((await processCheckoutAttempt(attempt._id, deps))?.state).toBe(
      "complete",
    );
    expect(
      deps.request.mock.calls.filter(([path]) => path === "/v2/payments"),
    ).toHaveLength(1);
    expect(deps.request.mock.calls.map(([path]) => path)).toContain(
      "/v2/payments/payment-one",
    );
  });

  it.each(["FAILED", "CANCELED", "APPROVED", "PENDING"])(
    "never confirms a %s payment",
    async (status) => {
      const deps = harness();
      const original = deps.request.getMockImplementation()!;
      deps.request.mockImplementation(async (path: string) =>
        path === "/v2/payments"
          ? { payment: { id: "payment-one", status } }
          : original(path),
      );
      const attempt = await startCheckoutAttempt(
        checkoutInput(),
        quote,
        deps.store,
      );
      const result = await processCheckoutAttempt(attempt._id, deps);
      expect(result?.state).not.toBe("complete");
      expect(deps.enqueue).not.toHaveBeenCalled();
    },
  );

  it("claims concurrent requests atomically", async () => {
    const deps = harness();
    const attempt = await startCheckoutAttempt(
      checkoutInput(),
      quote,
      deps.store,
    );
    await Promise.all([
      processCheckoutAttempt(attempt._id, deps),
      processCheckoutAttempt(attempt._id, deps),
    ]);
    expect(
      deps.request.mock.calls.filter(([path]) => path === "/v2/payments"),
    ).toHaveLength(1);
  });

  it("rejects a changed payload using an existing attempt key", async () => {
    const deps = harness();
    const input = checkoutInput();
    await startCheckoutAttempt(input, quote, deps.store);
    await expect(
      startCheckoutAttempt(
        { ...input, sourceId: "replacement" },
        quote,
        deps.store,
      ),
    ).rejects.toBeInstanceOf(AttemptConflictError);
  });

  it("stops automatic financial replay after the recovery window", async () => {
    const deps = harness();
    const attempt = await startCheckoutAttempt(
      checkoutInput(),
      quote,
      deps.store,
    );
    vi.setSystemTime(Date.now() + 24 * 60 * 60 * 1000);
    expect((await processCheckoutAttempt(attempt._id, deps))?.state).toBe(
      "needs-review",
    );
    expect(deps.request).not.toHaveBeenCalled();
    expect(deps.store.rows.get(attempt._id)?.encryptedSource).toBeUndefined();
  });
});
