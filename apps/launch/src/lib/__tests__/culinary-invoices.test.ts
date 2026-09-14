import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  balancedCulinarySelection,
  culinaryLineItems,
  culinaryPaymentSchedule,
} from "../culinary-booking";
import type { CulinaryQuoteRecord } from "../culinary-quotes";
import {
  createCulinaryInvoiceDraft,
  processCulinaryInvoice,
  notifyReadyCulinaryInvoices,
} from "../culinary-invoices";

const mocks = vi.hoisted(() => ({
  claim: vi.fn(),
  update: vi.fn(),
  call: vi.fn(),
  enqueue: vi.fn(),
  ready: vi.fn(),
}));
vi.mock("../square", () => ({ squareRequest: mocks.call }));
vi.mock("../email-outbox", () => ({ enqueueEmail: mocks.enqueue }));
vi.mock("../culinary-quotes", () => ({
  culinaryQuotes: () => ({
    findOneAndUpdate: mocks.claim,
    updateOne: mocks.update,
    find: () => ({ limit: () => ({ toArray: mocks.ready }) }),
  }),
}));

function record(): CulinaryQuoteRecord {
  const id = "fa0066bc-1ba4-4ed2-97a0-154076135c23";
  return {
    _id: id,
    id,
    reference: "SG-TEST",
    pricingVersion: 2,
    status: "requested",
    input: {
      experience: "plated",
      guestCount: 10,
      bowlSelection: balancedCulinarySelection(10),
      eventDate: "2026-10-10",
      eventTime: "13:00",
      occasion: "Test gathering",
      address: {
        addressLine1: "123 Test Street",
        addressLine2: "Suite 2",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90012",
      },
    },
    items: culinaryLineItems("plated", balancedCulinarySelection(10)),
    bowlCount: 10,
    subtotalCents: 106388,
    taxCents: 10373,
    totalCents: 116761,
    paymentSchedule: culinaryPaymentSchedule(116761, "2026-10-10"),
    taxPercentage: "9.75",
    jurisdiction: "Los Angeles",
    currency: "USD",
    createdAt: "2026-09-13T12:00:00Z",
    expiresAt: "2026-09-13T12:30:00Z",
    request: {
      quoteId: id,
      contact: {
        name: "Test Guest",
        email: "guest@example.com",
        phone: "2135550100",
      },
      company: "Test Company",
      notes: "Sesame allergy; confirm access",
      acceptedEstimate: true,
    },
    invoiceJob: {
      state: "pending",
      attempts: 1,
      nextAttemptAt: new Date(0),
      leaseUntil: new Date(0),
      depositDueDate: "2026-09-13",
    },
  };
}
const body = (index: number) =>
  JSON.parse(mocks.call.mock.calls[index][1].body);
const deps = (save = vi.fn(async () => {})) => ({
  call: mocks.call,
  locationId: "TEST_LOCATION",
  save,
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-13T18:00:00Z"));
  vi.resetAllMocks();
  vi.stubEnv("SQUARE_LOCATION_ID", "TEST_LOCATION");
  vi.stubEnv("CULINARY_SQUARE_INVOICES_ENABLED", "true");
  mocks.update.mockResolvedValue({ matchedCount: 1 });
  mocks.enqueue.mockResolvedValue(undefined);
  mocks.call.mockImplementation(async (path: string) => {
    if (path === "/v2/customers") return { customer: { id: "CUSTOMER" } };
    if (path.startsWith("/v2/orders"))
      return {
        order: {
          id: "ORDER",
          total_money: { amount: 116761, currency: "USD" },
        },
      };
    if (path.startsWith("/v2/invoices"))
      return { invoice: { id: "INVOICE", status: "DRAFT" } };
    throw new Error("Unexpected Square path");
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("culinary draft invoice contract handoff", () => {
  it("carries the group food style and guest-priced line to the Square draft", async () => {
    const quote = record();
    quote.input.platedMenu = "plant-forward";
    quote.input.bowlSelection = balancedCulinarySelection(0);
    quote.items = culinaryLineItems(
      "plated",
      quote.input.bowlSelection,
      quote.input,
    );
    await createCulinaryInvoiceDraft(quote, deps());
    const order = body(1).order;
    expect(order.metadata.plated_menu).toBe("plant-forward");
    expect(order.line_items[0]).toMatchObject({
      name: "Plated menu — Plant-forward",
      quantity: "10",
      base_price_money: { amount: 5500, currency: "USD" },
    });
    expect(order.line_items).toHaveLength(4);
    expect(JSON.stringify(order.line_items)).not.toContain("Bowl™");
    expect(body(2).invoice.description).toContain("Food style: Plant-forward");
    expect(body(2).invoice.description).toContain(
      "Final dishes and dietary requests are confirmed",
    );
    expect(
      body(2).invoice.payment_requests[0].fixed_amount_requested_money.amount,
    ).toBe(58381);
    expect(
      mocks.call.mock.calls.some(([path]) => path.includes("publish")),
    ).toBe(false);
  });
  it("creates a draft with exact pricing, 50% deposit, event-date balance, and no autopay", async () => {
    const saved = vi.fn(async () => {});
    const quote = record();
    expect(await createCulinaryInvoiceDraft(quote, deps(saved))).toBe(
      "INVOICE",
    );
    expect(mocks.call.mock.calls.map((call) => call[0])).toEqual([
      "/v2/customers",
      "/v2/orders",
      "/v2/invoices",
    ]);
    expect(saved.mock.calls).toEqual([
      [{ customerId: "CUSTOMER" }],
      [{ orderId: "ORDER" }],
      [{ invoiceId: "INVOICE" }],
    ]);
    expect(body(0)).toMatchObject({
      idempotency_key: `${quote.id}:customer`,
      email_address: "guest@example.com",
      phone_number: "+12135550100",
    });
    const order = body(1).order;
    expect(order.customer_id).toBe("CUSTOMER");
    expect(order.reference_id).toBe("SG-TEST");
    expect(order.pricing_options).toEqual({
      auto_apply_taxes: false,
      auto_apply_discounts: false,
    });
    expect(
      order.line_items.reduce(
        (
          sum: number,
          item: { quantity: string; base_price_money: { amount: number } },
        ) => sum + Number(item.quantity) * item.base_price_money.amount,
        0,
      ),
    ).toBe(106388);
    expect(order.line_items[0]).toMatchObject({
      base_price_money: { amount: 5500, currency: "USD" },
    });
    expect(
      order.line_items.every(
        (item: Record<string, unknown>) => !item.catalog_object_id,
      ),
    ).toBe(true);
    expect(order).not.toHaveProperty("fulfillments");
    const invoice = body(2).invoice;
    expect(invoice).toMatchObject({
      order_id: "ORDER",
      primary_recipient: { customer_id: "CUSTOMER" },
      store_payment_method_enabled: false,
      sale_or_service_date: "2026-10-10",
    });
    expect(invoice.payment_requests).toEqual([
      {
        request_type: "DEPOSIT",
        due_date: "2026-09-13",
        fixed_amount_requested_money: { amount: 58381, currency: "USD" },
        automatic_payment_source: "NONE",
        tipping_enabled: false,
      },
      {
        request_type: "BALANCE",
        due_date: "2026-10-10",
        automatic_payment_source: "NONE",
        tipping_enabled: false,
      },
    ]);
    for (const detail of [
      "10 guests",
      "13:00",
      "Suite 2",
      "Sesame allergy",
      "BEFORE our team arrives",
      "contract is signed",
    ])
      expect(invoice.description).toContain(detail);
    expect(invoice).not.toHaveProperty("scheduled_at");
  });
  it("reuses saved customer/order IDs on retry without recreating either", async () => {
    const quote = record();
    Object.assign(quote.invoiceJob!, {
      customerId: "CUSTOMER",
      orderId: "ORDER",
    });
    await createCulinaryInvoiceDraft(quote, deps());
    expect(mocks.call.mock.calls.map((call) => call[0])).toEqual([
      "/v2/orders/ORDER",
      "/v2/invoices",
    ]);
    expect(body(1).idempotency_key).toBe(`${quote.id}:invoice`);
    expect(body(1).invoice.payment_requests[0].due_date).toBe("2026-09-13");
  });
  it("verifies an existing draft instead of creating another invoice", async () => {
    const quote = record();
    quote.invoiceJob!.invoiceId = "INVOICE";
    expect(await createCulinaryInvoiceDraft(quote, deps())).toBe("INVOICE");
    expect(mocks.call).toHaveBeenCalledExactlyOnceWith("/v2/invoices/INVOICE");
  });
  it("requires review if someone already published the saved invoice", async () => {
    const quote = record();
    quote.invoiceJob!.invoiceId = "INVOICE";
    mocks.call.mockResolvedValue({
      invoice: { id: "INVOICE", status: "UNPAID" },
    });
    await expect(createCulinaryInvoiceDraft(quote, deps())).rejects.toThrow(
      "no longer a draft",
    );
    expect(mocks.call).toHaveBeenCalledOnce();
  });
  it("refuses to invoice a total mismatch rather than silently changing the deposit", async () => {
    const quote = record();
    Object.assign(quote.invoiceJob!, {
      customerId: "CUSTOMER",
      orderId: "ORDER",
    });
    mocks.call.mockResolvedValue({
      order: { total_money: { amount: 116762, currency: "USD" } },
    });
    await expect(createCulinaryInvoiceDraft(quote, deps())).rejects.toThrow(
      "differs from the saved estimate",
    );
    expect(mocks.call).toHaveBeenCalledOnce();
  });
  it.each(["estimate", "historical", "past", "no-request"])(
    "does not create artifacts for %s requests",
    async (scenario) => {
      const quote = record();
      if (scenario === "estimate") quote.status = "estimate";
      if (scenario === "historical") delete quote.pricingVersion;
      if (scenario === "past") quote.input.eventDate = "2026-09-12";
      if (scenario === "no-request") delete quote.request;
      await expect(createCulinaryInvoiceDraft(quote, deps())).rejects.toThrow();
      expect(mocks.call).not.toHaveBeenCalled();
    },
  );
  it("requires a configured Square location before creating anything", async () => {
    await expect(
      createCulinaryInvoiceDraft(record(), { ...deps(), locationId: "" }),
    ).rejects.toThrow("not configured");
    expect(mocks.call).not.toHaveBeenCalled();
  });
  it("uses the same idempotency key when an invoice response is lost", async () => {
    const quote = record();
    Object.assign(quote.invoiceJob!, {
      customerId: "CUSTOMER",
      orderId: "ORDER",
    });
    const normalCall = mocks.call.getMockImplementation()!;
    let lost = false;
    mocks.call.mockImplementation(async (...args) => {
      if (args[0] === "/v2/invoices" && !lost) {
        lost = true;
        throw new Error("Response lost");
      }
      return normalCall(...args);
    });
    await expect(createCulinaryInvoiceDraft(quote, deps())).rejects.toThrow(
      "Response lost",
    );
    await createCulinaryInvoiceDraft(quote, deps());
    expect(body(1)).toEqual(body(3));
  });
});

describe("durable invoice worker", () => {
  it("claims only a pending, current, expired-lease job and persists its progress", async () => {
    mocks.claim.mockResolvedValueOnce(record()).mockResolvedValue(null);
    await Promise.all([
      processCulinaryInvoice(record().id),
      processCulinaryInvoice(record().id),
    ]);
    expect(mocks.claim.mock.calls[0][0]).toMatchObject({
      pricingVersion: 2,
      status: "requested",
      "invoiceJob.state": "pending",
      "invoiceJob.leaseUntil": { $lte: expect.any(Date) },
    });
    expect(mocks.call).toHaveBeenCalledTimes(3);
    expect(mocks.update).toHaveBeenLastCalledWith(
      { _id: record().id, "invoiceJob.leaseToken": expect.any(String) },
      expect.objectContaining({
        $set: expect.objectContaining({
          "invoiceJob.state": "ready",
          "invoiceJob.readyNotified": false,
        }),
      }),
    );
  });
  it("retains a failed job for retry without leaking API errors", async () => {
    mocks.claim.mockResolvedValue(record());
    mocks.call.mockRejectedValue(new Error("sensitive API detail"));
    await processCulinaryInvoice(record().id);
    const update = mocks.update.mock.calls.at(-1)![1].$set;
    expect(update["invoiceJob.state"]).toBe("pending");
    expect(update["invoiceJob.nextAttemptAt"].getTime()).toBeGreaterThan(
      Date.now(),
    );
    expect(JSON.stringify(update)).not.toContain("sensitive API detail");
  });
  it("moves exhausted jobs to team review", async () => {
    const quote = record();
    quote.invoiceJob!.attempts = 8;
    mocks.claim.mockResolvedValue(quote);
    mocks.call.mockRejectedValue(new Error("unavailable"));
    await processCulinaryInvoice(quote.id);
    expect(mocks.update.mock.calls.at(-1)![1].$set["invoiceJob.state"]).toBe(
      "needs-review",
    );
  });
  it("does not claim jobs when invoice creation is paused", async () => {
    vi.stubEnv("CULINARY_SQUARE_INVOICES_ENABLED", "false");
    await processCulinaryInvoice(record().id);
    expect(mocks.claim).not.toHaveBeenCalled();
  });
  it("queues a stable team-only draft-ready notification before marking it queued", async () => {
    const quote = record();
    Object.assign(quote.invoiceJob!, {
      state: "ready",
      invoiceId: "INVOICE",
      readyNotified: false,
    });
    mocks.ready.mockResolvedValue([quote]);
    await notifyReadyCulinaryInvoices();
    expect(mocks.enqueue).toHaveBeenCalledWith(
      `culinary:${quote.id}:invoice-ready`,
      "culinary",
      expect.objectContaining({ audience: "team", invoiceId: "INVOICE" }),
    );
    expect(mocks.update).toHaveBeenCalledWith(expect.anything(), {
      $set: { "invoiceJob.readyNotified": true },
    });
  });
});
