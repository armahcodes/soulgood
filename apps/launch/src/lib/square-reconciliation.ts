import { CheckoutRecordModel } from "./db/checkout-record-model";
import { connectToDatabase } from "./db/mongoose";
import { squareRequest } from "./square";
import { checkoutAttempts, processCheckoutAttempt } from "./checkout-attempt";
import { persistCheckoutRecord, type CheckoutRecord } from "./checkout-record";
import { enqueueEmail, enqueueOrderEmail } from "./email-outbox";
import { getSquareCatalogConfig } from "./square-catalog";
import { BOWL_IDS } from "./current-offer";
import type { BowlSelection } from "./bowl-selection";
import { enqueueSquareSync } from "./square-jobs";

type SquareOrder = {
  id?: string;
  total_money?: { amount: number };
  total_tax_money?: { amount: number };
  line_items?: Array<{
    catalog_object_id?: string;
    quantity: string;
    total_money?: { amount: number };
    total_tax_money?: { amount: number };
  }>;
  fulfillments?: Array<{ state?: string; type?: string }>;
};

async function storedRecord(id: string): Promise<CheckoutRecord | null> {
  await connectToDatabase();
  const value = await CheckoutRecordModel.findOne({
    squareObjectId: id,
  }).lean();
  if (!value) return null;
  return {
    ...value,
    acceptedAt: value.acceptedAt.toISOString(),
  } as unknown as CheckoutRecord;
}

async function saveStatus(
  id: string,
  status: string,
  updatedAt?: string,
  extras: Record<string, unknown> = {},
) {
  if (!updatedAt || !Number.isFinite(Date.parse(updatedAt)))
    throw new Error("Square status timestamp is missing");
  const timestamp = new Date(updatedAt);
  const result = await CheckoutRecordModel.updateOne(
    {
      squareObjectId: id,
      $or: [
        { squareUpdatedAt: { $exists: false } },
        { squareUpdatedAt: { $lte: timestamp } },
      ],
    },
    {
      $set: {
        ...extras,
        orderStatus: status,
        squareUpdatedAt: timestamp,
        lastReconciledAt: new Date(),
      },
    },
  );
  return result.matchedCount > 0;
}

export function paymentStatus(payment: {
  status?: string;
  amount_money?: { amount: number };
  refunded_money?: { amount: number };
}): string {
  const refunded = payment.refunded_money?.amount || 0;
  if (refunded > 0)
    return refunded >= (payment.amount_money?.amount || Infinity)
      ? "REFUNDED"
      : "PARTIALLY_REFUNDED";
  return payment.status || "PENDING";
}

export async function reconcilePayment(id: string): Promise<void> {
  const { payment } = await squareRequest<{
    payment?: {
      id: string;
      status?: string;
      updated_at?: string;
      reference_id?: string;
      order_id?: string;
      receipt_url?: string;
      amount_money?: { amount: number };
      refunded_money?: { amount: number };
    };
  }>(`/v2/payments/${encodeURIComponent(id)}`);
  if (!payment) throw new Error("Square payment not found");
  let record = await storedRecord(id);
  if (!record) {
    if (payment.order_id) {
      const invoice = await CheckoutRecordModel.findOne({
        squareOrderId: payment.order_id,
        squareObjectType: "invoice",
      }).lean();
      if (invoice) {
        await reconcileInvoice(invoice.squareObjectId);
        const status = paymentStatus(payment);
        if (
          ["FAILED", "REFUNDED", "PARTIALLY_REFUNDED", "CANCELED"].includes(
            status,
          )
        )
          await enqueueEmail(
            `payment-update:${id}:${status}`,
            "paymentUpdate",
            {
              customerEmail: invoice.customerEmail,
              customerName: invoice.customerName,
              orderId: id,
              status,
            },
          );
        return;
      }
    }
    const attempt = await checkoutAttempts().findOne({
      $or: [
        { paymentId: id },
        { _id: payment.reference_id || "" },
        { "order.id": payment.order_id || "" },
      ],
    });
    if (!attempt) return; // Not a checkout owned by this application.
    await processCheckoutAttempt(attempt._id);
    record = await storedRecord(id);
    if (!record) throw new Error("Checkout record is still recovering");
  }
  const status = paymentStatus(payment);
  if (
    !(await saveStatus(id, status, payment.updated_at, {
      receiptUrl: payment.receipt_url,
    }))
  )
    return;
  if (status === "COMPLETED")
    await enqueueOrderEmail({
      ...record,
      orderStatus: status,
      receiptUrl: payment.receipt_url,
    });
  if (
    ["FAILED", "REFUNDED", "PARTIALLY_REFUNDED", "CANCELED"].includes(status)
  ) {
    await enqueueEmail(`payment-update:${id}:${status}`, "paymentUpdate", {
      customerEmail: record.customerEmail,
      customerName: record.customerName,
      orderId: id,
      status,
    });
  }
}

export async function reconcileInvoice(id: string): Promise<void> {
  const { invoice } = await squareRequest<{
    invoice?: {
      id: string;
      subscription_id?: string;
      order_id?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
      public_url?: string;
    };
  }>(`/v2/invoices/${encodeURIComponent(id)}`);
  if (!invoice?.subscription_id || !invoice.order_id) return;
  let parent = await storedRecord(invoice.subscription_id);
  if (!parent) {
    const attempt = await checkoutAttempts().findOne({
      subscriptionId: invoice.subscription_id,
    });
    if (!attempt) {
      await reconcileSubscription(invoice.subscription_id, false);
    } else await processCheckoutAttempt(attempt._id);
    parent = await storedRecord(invoice.subscription_id);
    if (!parent) return;
  }
  const { order } = await squareRequest<{ order?: SquareOrder }>(
    `/v2/orders/${encodeURIComponent(invoice.order_id)}`,
  );
  if (!order?.total_money || !order.total_tax_money || !invoice.created_at)
    throw new Error("Incomplete invoice order");
  const catalog = getSquareCatalogConfig();
  if (!catalog)
    throw new Error("Catalog unavailable for invoice reconciliation");
  const selection = Object.fromEntries(
    BOWL_IDS.map((bowlId) => [bowlId, 0]),
  ) as BowlSelection;
  for (const item of order.line_items || []) {
    const bowlId = BOWL_IDS.find(
      (key) => catalog.bowlVariationIds[key] === item.catalog_object_id,
    );
    if (bowlId) selection[bowlId] += Number(item.quantity);
  }
  if (!Object.values(selection).some((quantity) => quantity > 0))
    throw new Error("Invoice bowl mapping needs review");
  const total = order.total_money.amount;
  const tax = order.total_tax_money.amount;
  const fulfillmentFeeCents = (order.line_items || [])
    .filter((item) => item.catalog_object_id === catalog.deliveryVariationId)
    .reduce(
      (amount, item) =>
        amount +
        (item.total_money?.amount || 0) -
        (item.total_tax_money?.amount || 0),
      0,
    );
  const record: CheckoutRecord = {
    ...parent,
    squareObjectId: id,
    squareObjectType: "invoice",
    subscriptionId: invoice.subscription_id,
    squareOrderId: invoice.order_id,
    bowlSelection: selection,
    orderStatus: invoice.status || "UNPAID",
    subtotalCents: total - tax,
    taxCents: tax,
    totalCents: total,
    fulfillmentFeeCents,
    receiptUrl: invoice.public_url,
    acceptedAt: invoice.created_at,
  };
  await persistCheckoutRecord(record);
  if (
    !(await saveStatus(id, record.orderStatus, invoice.updated_at, {
      receiptUrl: invoice.public_url,
      bowlSelection: selection,
      subtotalCents: total - tax,
      taxCents: tax,
      totalCents: total,
      fulfillmentFeeCents,
    }))
  )
    return;
  const invoiceDate = new Date(invoice.created_at);
  await CheckoutRecordModel.updateOne(
    {
      squareObjectId: invoice.subscription_id,
      $or: [
        { latestInvoiceDate: { $exists: false } },
        { latestInvoiceDate: { $lt: invoiceDate } },
        {
          latestInvoiceDate: invoiceDate,
          squareUpdatedAt: { $lte: new Date(invoice.updated_at!) },
        },
      ],
    },
    {
      $set: {
        orderStatus:
          invoice.status === "PAID"
            ? "ACTIVE"
            : invoice.status === "UNPAID"
              ? "PENDING_PAYMENT"
              : invoice.status,
        latestInvoiceDate: invoiceDate,
        squareUpdatedAt: new Date(invoice.updated_at!),
        lastReconciledAt: new Date(),
      },
    },
  );
  if (invoice.status === "PAID") await enqueueOrderEmail(record);
}

export async function reconcileSubscription(
  id: string,
  includeInvoices = true,
): Promise<void> {
  const { subscription } = await squareRequest<{
    subscription?: {
      id: string;
      customer_id: string;
      status?: string;
      canceled_date?: string;
      invoice_ids?: string[];
    };
  }>(`/v2/subscriptions/${encodeURIComponent(id)}`);
  if (!subscription) throw new Error("Subscription not found");
  let record = await storedRecord(id);
  if (!record) {
    const attempt = await checkoutAttempts().findOne({
      input: { $exists: true },
      $or: [{ subscriptionId: id }, { customerId: subscription.customer_id }],
    });
    if (!attempt) return;
    await processCheckoutAttempt(attempt._id);
    record = await storedRecord(id);
    if (!record) throw new Error("Subscription record is still recovering");
  }
  await CheckoutRecordModel.updateOne(
    { squareObjectId: id },
    {
      $set: {
        subscriptionStatus: subscription.status || "PENDING",
        cancellationScheduledFor: subscription.canceled_date || "",
        lastReconciledAt: new Date(),
      },
    },
  );
  if (includeInvoices) {
    // Queue backfill without unbounded external API calls during a customer request.
    for (const invoiceId of subscription.invoice_ids || [])
      await enqueueSquareSync(
        `invoice-backfill:${invoiceId}`,
        "invoice",
        invoiceId,
      );
  }
}

export async function reconcileOrder(id: string): Promise<void> {
  const { order } = await squareRequest<{ order?: SquareOrder }>(
    `/v2/orders/${encodeURIComponent(id)}`,
  );
  if (
    !order?.fulfillments?.some(
      (fulfillment) => fulfillment.state === "PREPARED",
    )
  )
    return;
  await connectToDatabase();
  const record = await CheckoutRecordModel.findOne({
    squareOrderId: id,
    squareObjectType: { $ne: "subscription" },
    orderStatus: { $in: ["COMPLETED", "PAID"] },
  }).lean();
  if (!record) return;
  await enqueueEmail(`fulfillment:${id}`, "fulfillment", {
    customerEmail: record.customerEmail,
    customerName: record.customerName,
    orderId: id,
    fulfillmentDetails:
      record.fulfillmentMethod === "pickup"
        ? "Your order has been prepared for pickup. Please follow the pickup window confirmed by our team."
        : "Your order has been prepared for LA County delivery. Please follow the delivery window confirmed by our team.",
  });
}

export async function reconcileSquareObject(
  kind: string,
  id: string,
  eventType?: string,
): Promise<void> {
  if (kind === "payment") await reconcilePayment(id);
  if (kind === "invoice") {
    await reconcileInvoice(id);
    if (eventType === "invoice.scheduled_charge_failed") {
      const record = await storedRecord(id);
      // A delayed failure event must not overwrite or contradict a subsequent payment.
      if (record?.orderStatus === "UNPAID")
        await enqueueEmail(`invoice-failed:${id}`, "paymentUpdate", {
          customerEmail: record.customerEmail,
          customerName: record.customerName,
          orderId: id,
          status: "FAILED",
        });
    }
  }
  if (kind === "subscription") await reconcileSubscription(id);
  if (kind === "order") await reconcileOrder(id);
  if (kind === "refund") {
    const { refund } = await squareRequest<{
      refund?: { payment_id?: string };
    }>(`/v2/refunds/${encodeURIComponent(id)}`);
    if (refund?.payment_id) await reconcilePayment(refund.payment_id);
  }
}
