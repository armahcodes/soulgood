import { randomUUID } from "node:crypto";
import { squareRequest } from "./square";
import { culinaryQuotes, type CulinaryQuoteRecord } from "./culinary-quotes";
import {
  culinaryPaymentSchedule,
  platedMenuName,
  todayInLosAngeles,
} from "./culinary-booking";
import { enqueueEmail } from "./email-outbox";

export type CulinaryInvoiceJob = {
  state: "pending" | "ready" | "needs-review";
  attempts: number;
  nextAttemptAt: Date;
  leaseUntil: Date;
  leaseToken?: string;
  depositDueDate: string;
  customerId?: string;
  orderId?: string;
  invoiceId?: string;
  readyNotified?: boolean;
  lastError?: string;
};

type SquareCall = <T>(path: string, init?: RequestInit) => Promise<T>;
type Progress = Partial<
  Pick<CulinaryInvoiceJob, "customerId" | "orderId" | "invoiceId">
>;
class InvoiceReviewRequired extends Error {}

/** Creates a draft only. Native Square Contracts and signature gating require team review in Square. */
export async function createCulinaryInvoiceDraft(
  record: CulinaryQuoteRecord,
  deps: {
    call: SquareCall;
    locationId: string;
    save: (progress: Progress) => Promise<void>;
  },
): Promise<string> {
  if (
    record.status !== "requested" ||
    !record.request ||
    record.pricingVersion !== 2 ||
    !record.invoiceJob
  )
    throw new InvoiceReviewRequired(
      "Only current, submitted booking requests may create invoices",
    );
  if (record.invoiceJob.invoiceId) {
    const existing = await deps.call<{
      invoice: { id: string; status: string };
    }>(`/v2/invoices/${encodeURIComponent(record.invoiceJob.invoiceId)}`);
    if (existing.invoice?.status !== "DRAFT")
      throw new InvoiceReviewRequired(
        "Invoice is no longer a draft; review in Square before any further action",
      );
    return record.invoiceJob.invoiceId;
  }
  if (!deps.locationId) throw new Error("Square location is not configured");
  if (record.input.eventDate < todayInLosAngeles())
    throw new InvoiceReviewRequired(
      "The event date has passed; review the booking before invoicing",
    );

  const schedule = culinaryPaymentSchedule(
    record.totalCents,
    record.input.eventDate,
  );
  const post = <T>(path: string, body: unknown) =>
    deps.call<T>(path, { method: "POST", body: JSON.stringify(body) });
  const contact = record.request.contact;
  let customerId = record.invoiceJob.customerId;
  if (!customerId) {
    const result = await post<{ customer: { id: string } }>("/v2/customers", {
      idempotency_key: `${record.id}:customer`,
      given_name: contact.name,
      email_address: contact.email,
      phone_number: `+${contact.phone.length === 10 ? "1" : ""}${contact.phone}`,
      ...(record.request.company
        ? { company_name: record.request.company }
        : {}),
      reference_id: record.reference,
    });
    customerId = result.customer?.id;
    if (!customerId) throw new Error("Square customer was not returned");
    await deps.save({ customerId });
  }
  let orderId = record.invoiceJob.orderId;
  let orderTotal: number;
  if (!orderId) {
    const result = await post<{
      order: { id: string; total_money: { amount: number; currency: string } };
    }>("/v2/orders", {
      idempotency_key: `${record.id}:order`,
      order: {
        location_id: deps.locationId,
        customer_id: customerId,
        reference_id: record.reference,
        metadata: {
          culinary_quote_id: record.id,
          experience: record.input.experience,
          event_date: record.input.eventDate,
          ...(record.input.platedMenu
            ? { plated_menu: record.input.platedMenu }
            : {}),
        },
        pricing_options: {
          auto_apply_taxes: false,
          auto_apply_discounts: false,
        },
        // Event servings are intentionally ad-hoc: plated $55 portions must not
        // override or decrement the $17.60 retail jar catalog.
        line_items: record.items.map((item) => ({
          name:
            item.kind === "bowl" && record.input.experience === "plated"
              ? `${item.label} — plated serving`
              : item.label,
          quantity: String(item.quantity),
          base_price_money: { amount: item.unitCents, currency: "USD" },
          note:
            item.kind === "plated"
              ? "Food style for the whole group. Final dishes and dietary requests confirmed before booking."
              : item.kind === "bowl"
                ? record.input.experience === "plated"
                  ? "One plated serving per guest"
                  : "32 oz jar"
                : undefined,
        })),
        taxes: [
          {
            uid: "event-tax",
            name: `CA sales tax (${record.jurisdiction})`,
            percentage: record.taxPercentage,
            scope: "ORDER",
            type: "ADDITIVE",
          },
        ],
      },
    });
    orderId = result.order?.id;
    if (!orderId || result.order.total_money?.currency !== "USD")
      throw new Error("Square order was not returned");
    await deps.save({ orderId });
    orderTotal = result.order.total_money.amount;
  } else {
    const result = await deps.call<{
      order: { total_money: { amount: number; currency: string } };
    }>(`/v2/orders/${encodeURIComponent(orderId)}`);
    if (result.order?.total_money?.currency !== "USD")
      throw new InvoiceReviewRequired("Square currency requires review");
    orderTotal = result.order.total_money.amount;
  }
  if (orderTotal !== record.totalCents)
    throw new InvoiceReviewRequired(
      "Square total differs from the saved estimate; review tax and pricing before invoicing",
    );

  const address = record.input.address;
  const result = await post<{ invoice: { id: string; status: string } }>(
    "/v2/invoices",
    {
      idempotency_key: `${record.id}:invoice`,
      invoice: {
        location_id: deps.locationId,
        order_id: orderId,
        primary_recipient: { customer_id: customerId },
        title: `Soul Good culinary booking · ${record.reference}`,
        description: [
          `${record.input.experience === "plated" ? `Plated experience for ${record.input.guestCount} guests` : `Bowl delivery: ${record.bowlCount} jars`}.`,
          record.input.platedMenu
            ? `Food style: ${platedMenuName(record.input.platedMenu)}. Final dishes and dietary requests are confirmed with the team before booking.`
            : "",
          `Event: ${record.input.eventDate} at ${record.input.eventTime} (America/Los_Angeles). ${record.input.occasion}`,
          `Venue: ${address.addressLine1}${address.addressLine2 ? `, ${address.addressLine2}` : ""}, ${address.city}, CA ${address.postalCode}.`,
          "50% deposit to reserve after team approval and contract signature. Remaining balance due on the event date BEFORE our team arrives. Arrival time is confirmed by our team.",
          "The booking is not confirmed until availability is approved, the contract is signed, and the deposit is paid.",
          record.request.notes
            ? `Event notes / dietary requests (subject to confirmation): ${record.request.notes}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        sale_or_service_date: record.input.eventDate,
        delivery_method: "EMAIL",
        accepted_payment_methods: {
          card: true,
          bank_account: false,
          square_gift_card: false,
          buy_now_pay_later: false,
          cash_app_pay: false,
        },
        store_payment_method_enabled: false,
        payment_requests: [
          {
            request_type: "DEPOSIT",
            due_date: record.invoiceJob.depositDueDate,
            fixed_amount_requested_money: {
              amount: schedule.depositCents,
              currency: "USD",
            },
            automatic_payment_source: "NONE",
            tipping_enabled: false,
          },
          {
            request_type: "BALANCE",
            due_date: record.input.eventDate,
            automatic_payment_source: "NONE",
            tipping_enabled: false,
          },
        ],
      },
    },
  );
  if (!result.invoice?.id) throw new Error("Square invoice was not returned");
  await deps.save({ invoiceId: result.invoice.id });
  if (result.invoice.status !== "DRAFT")
    throw new InvoiceReviewRequired("Invoice is not a draft; review in Square");
  return result.invoice.id;
}

/** Atomic lease + stable API keys prevent duplicate artifacts on retries and concurrent requests. */
export async function processCulinaryInvoice(id: string): Promise<void> {
  if (process.env.CULINARY_SQUARE_INVOICES_ENABLED === "false") return;
  const collection = culinaryQuotes();
  const leaseToken = randomUUID();
  const record = await collection.findOneAndUpdate(
    {
      _id: id,
      status: "requested",
      pricingVersion: 2,
      "invoiceJob.state": "pending",
      "invoiceJob.nextAttemptAt": { $lte: new Date() },
      "invoiceJob.leaseUntil": { $lte: new Date() },
    },
    {
      $set: {
        "invoiceJob.leaseToken": leaseToken,
        "invoiceJob.leaseUntil": new Date(Date.now() + 120_000),
      },
      $inc: { "invoiceJob.attempts": 1 },
    },
    { returnDocument: "after" },
  );
  if (!record?.invoiceJob) return;
  const filter = { _id: id, "invoiceJob.leaseToken": leaseToken };
  try {
    await createCulinaryInvoiceDraft(record, {
      call: squareRequest,
      locationId: process.env.SQUARE_LOCATION_ID?.trim() || "",
      save: async (progress) => {
        const result = await collection.updateOne(filter, {
          $set: Object.fromEntries(
            Object.entries(progress).map(([key, value]) => [
              `invoiceJob.${key}`,
              value,
            ]),
          ),
        });
        if (!result.matchedCount) throw new Error("Invoice lease lost");
      },
    });
    await collection.updateOne(filter, {
      $set: {
        "invoiceJob.state": "ready",
        "invoiceJob.readyNotified": false,
        "invoiceJob.leaseUntil": new Date(0),
      },
      $unset: { "invoiceJob.lastError": "", "invoiceJob.leaseToken": "" },
    });
  } catch (error) {
    const review =
      error instanceof InvoiceReviewRequired || record.invoiceJob.attempts >= 8;
    await collection.updateOne(filter, {
      $set: {
        "invoiceJob.state": review ? "needs-review" : "pending",
        "invoiceJob.lastError":
          error instanceof InvoiceReviewRequired
            ? error.message
            : "Square invoice creation needs a retry; no invoice was sent by this app.",
        "invoiceJob.nextAttemptAt": new Date(
          Date.now() +
            Math.min(60 * 60_000, 30_000 * 2 ** record.invoiceJob.attempts),
        ),
        "invoiceJob.leaseUntil": new Date(0),
      },
      $unset: { "invoiceJob.leaseToken": "" },
    });
    console.error("[culinary] Invoice requires retry or team review", {
      reference: record.reference,
    });
  }
}

export async function reconcileCulinaryInvoices(limit = 3): Promise<void> {
  const collection = culinaryQuotes();
  const pending = await collection
    .find({
      status: "requested",
      pricingVersion: 2,
      "invoiceJob.state": "pending",
      "invoiceJob.nextAttemptAt": { $lte: new Date() },
      "invoiceJob.leaseUntil": { $lte: new Date() },
    })
    .sort({ requestedAt: 1 })
    .limit(limit)
    .toArray();
  for (const record of pending) await processCulinaryInvoice(record.id);
  await notifyReadyCulinaryInvoices(limit);
}

export async function notifyReadyCulinaryInvoices(limit = 3): Promise<void> {
  const collection = culinaryQuotes();
  const ready = await collection
    .find({
      status: "requested",
      "invoiceJob.state": "ready",
      "invoiceJob.readyNotified": false,
    })
    .limit(limit)
    .toArray();
  for (const record of ready) {
    if (!record.request || !record.invoiceJob?.invoiceId) continue;
    await enqueueEmail(`culinary:${record.id}:invoice-ready`, "culinary", {
      quote: record,
      request: record.request,
      audience: "team",
      invoiceId: record.invoiceJob.invoiceId,
    });
    await collection.updateOne(
      { _id: record.id, "invoiceJob.state": "ready" },
      { $set: { "invoiceJob.readyNotified": true } },
    );
  }
}
