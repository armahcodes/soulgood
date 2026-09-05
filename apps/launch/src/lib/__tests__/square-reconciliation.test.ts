import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  reconcileInvoice,
  reconcilePayment,
  reconcileSubscription,
} from "../square-reconciliation";
import { configureCheckout, selection } from "./checkout-fixtures";

const mocks = vi.hoisted(() => ({
  request: vi.fn(),
  find: vi.fn(),
  update: vi.fn(),
  persist: vi.fn(),
  orderEmail: vi.fn(),
  email: vi.fn(),
  attempt: vi.fn(),
  resume: vi.fn(),
  sync: vi.fn(),
}));
vi.mock("../square", () => ({ squareRequest: mocks.request }));
vi.mock("../db/mongoose", () => ({ connectToDatabase: vi.fn() }));
vi.mock("../db/checkout-record-model", () => ({
  CheckoutRecordModel: {
    findOne: (filter: unknown) => ({ lean: () => mocks.find(filter) }),
    updateOne: mocks.update,
  },
}));
vi.mock("../checkout-record", () => ({ persistCheckoutRecord: mocks.persist }));
vi.mock("../checkout-attempt", () => ({
  checkoutAttempts: () => ({ findOne: mocks.attempt }),
  processCheckoutAttempt: mocks.resume,
}));
vi.mock("../email-outbox", () => ({
  enqueueOrderEmail: mocks.orderEmail,
  enqueueEmail: mocks.email,
}));
vi.mock("../square-jobs", () => ({ enqueueSquareSync: mocks.sync }));

const parent = {
  squareObjectId: "subscription-one",
  squareObjectType: "subscription",
  squareCustomerId: "customer-one",
  customerEmail: "test@example.com",
  customerName: "Test Customer",
  leadId: "test-attempt",
  purchaseType: "weekly",
  peopleCount: 1,
  mealsPerDay: 1,
  fulfillmentMethod: "delivery",
  bowlSelection: selection,
  subtotalCents: 9688,
  taxCents: 945,
  totalCents: 10633,
  orderStatus: "PENDING_PAYMENT",
  acceptedAt: new Date("2026-09-01T00:00:00Z"),
  legalVersion: "test",
};

beforeEach(() => {
  vi.resetAllMocks();
  configureCheckout();
  mocks.update.mockResolvedValue({ matchedCount: 1 });
  mocks.persist.mockResolvedValue(true);
  mocks.attempt.mockResolvedValue(null);
});

describe("Square reconciliation", () => {
  it("does not confirm or adopt unrelated Square purchases", async () => {
    mocks.request.mockResolvedValue({
      payment: {
        id: "unrelated",
        status: "COMPLETED",
        reference_id: "someone-else",
      },
    });
    mocks.find.mockResolvedValue(null);
    await reconcilePayment("unrelated");
    expect(mocks.persist).not.toHaveBeenCalled();
    expect(mocks.orderEmail).not.toHaveBeenCalled();
  });

  it("does not send a stale paid email when a newer status won the update", async () => {
    mocks.request.mockResolvedValue({
      payment: {
        id: "payment-one",
        status: "COMPLETED",
        updated_at: "2026-09-01T00:00:00Z",
      },
    });
    mocks.find.mockResolvedValue({
      ...parent,
      squareObjectId: "payment-one",
      squareObjectType: "payment",
    });
    mocks.update.mockResolvedValue({ matchedCount: 0 });
    await reconcilePayment("payment-one");
    expect(mocks.orderEmail).not.toHaveBeenCalled();
    expect(mocks.update.mock.calls[0][0]).toMatchObject({
      $or: expect.any(Array),
    });
  });

  it("records a refund from authoritative payment state", async () => {
    mocks.request.mockResolvedValue({
      payment: {
        id: "payment-one",
        status: "COMPLETED",
        amount_money: { amount: 1000 },
        refunded_money: { amount: 1000 },
        updated_at: "2026-09-02T00:00:00Z",
      },
    });
    mocks.find.mockResolvedValue(parent);
    await reconcilePayment("payment-one");
    expect(mocks.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        $set: expect.objectContaining({ orderStatus: "REFUNDED" }),
      }),
    );
    expect(mocks.orderEmail).not.toHaveBeenCalled();
    expect(mocks.email).toHaveBeenCalledWith(
      "payment-update:payment-one:REFUNDED",
      "paymentUpdate",
      expect.objectContaining({ status: "REFUNDED" }),
    );
  });

  it("saves actual invoice quantities and totals rather than the original plan estimate", async () => {
    mocks.find.mockResolvedValue(parent);
    mocks.request.mockImplementation(async (path: string) =>
      path.startsWith("/v2/invoices/")
        ? {
            invoice: {
              id: "invoice-one",
              subscription_id: "subscription-one",
              order_id: "order-renewal",
              status: "PAID",
              created_at: "2026-09-02T00:00:00Z",
              updated_at: "2026-09-02T00:00:01Z",
            },
          }
        : {
            order: {
              total_money: { amount: 20000 },
              total_tax_money: { amount: 1600 },
              line_items: [
                {
                  catalog_object_id: "test-GLOW_BOWL",
                  quantity: "10",
                  total_money: { amount: 19000 },
                },
                {
                  catalog_object_id: "test-SOUL_BOWLS_DELIVERY",
                  quantity: "1",
                  total_money: { amount: 1000 },
                  total_tax_money: { amount: 112 },
                },
              ],
            },
          },
    );
    await reconcileInvoice("invoice-one");
    expect(mocks.persist).toHaveBeenCalledWith(
      expect.objectContaining({
        squareObjectType: "invoice",
        subscriptionId: "subscription-one",
        totalCents: 20000,
        subtotalCents: 18400,
        fulfillmentFeeCents: 888,
        bowlSelection: expect.objectContaining({
          "glow-bowl": 10,
          "jerk-wellness-bowl": 0,
        }),
      }),
    );
    expect(mocks.orderEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        squareObjectId: "invoice-one",
        totalCents: 20000,
        orderStatus: "PAID",
      }),
    );
  });

  it("does not treat an ACTIVE subscription as proof of payment", async () => {
    mocks.find.mockResolvedValue(parent);
    mocks.request.mockResolvedValue({
      subscription: {
        id: "subscription-one",
        customer_id: "customer-one",
        status: "ACTIVE",
        invoice_ids: ["invoice-one"],
      },
    });
    await reconcileSubscription("subscription-one");
    expect(mocks.update).toHaveBeenCalledWith(expect.anything(), {
      $set: expect.objectContaining({ subscriptionStatus: "ACTIVE" }),
    });
    expect(mocks.update.mock.calls[0][1].$set).not.toHaveProperty(
      "orderStatus",
    );
    expect(mocks.orderEmail).not.toHaveBeenCalled();
    expect(mocks.sync).toHaveBeenCalledWith(
      "invoice-backfill:invoice-one",
      "invoice",
      "invoice-one",
    );
  });
});
