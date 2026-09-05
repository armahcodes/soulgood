import { createHash } from "node:crypto";
import type { CheckoutInput } from "./checkout-input";
import { getMongoDatabase } from "./db/mongodb";
import { openPaymentSource, sealPaymentSource } from "./secure-payload";
import {
  getSquareCatalogConfig,
  type SquareCatalogConfig,
} from "./square-catalog";
import {
  addressToSquare,
  createItemizedSquareOrder,
  SquareApiError,
  squareRequest,
  type ItemizedSquareOrder,
  type TaxQuote,
} from "./square";
import { FULFILLMENT, LEGAL_VERSION } from "./brand";
import { persistCheckoutRecord, type CheckoutRecord } from "./checkout-record";
import { enqueueOrderEmail } from "./email-outbox";

export type CheckoutResult = {
  ok: true;
  purchaseType: CheckoutInput["purchaseType"];
  status: string;
  paymentId?: string;
  subscriptionId?: string;
  orderId: string;
  receiptUrl?: string;
  acceptedAt: string;
  legalVersion: string;
  fulfillmentMethod: CheckoutInput["fulfillmentMethod"];
  peopleCount: number;
  mealsPerDay: number;
  bowlSelection: CheckoutInput["bowlSelection"];
  tax: TaxQuote;
  paymentPending: boolean;
};

export type CheckoutAttempt = {
  _id: string;
  requestHash: string;
  input: Omit<CheckoutInput, "sourceId" | "verificationToken">;
  encryptedSource?: string;
  quote: TaxQuote;
  catalog: SquareCatalogConfig;
  locationId: string;
  squareEnvironment: "sandbox" | "production";
  fulfillmentFeeCents: number;
  createdAt: Date;
  updatedAt: Date;
  nextAttemptAt: Date;
  leaseUntil: Date;
  tries: number;
  state: "pending" | "processing" | "complete" | "failed" | "needs-review";
  customerId?: string;
  order?: ItemizedSquareOrder;
  cardId?: string;
  paymentId?: string;
  subscriptionId?: string;
  result?: CheckoutResult;
  error?: string;
};

export type AttemptStore = {
  get(id: string): Promise<CheckoutAttempt | null>;
  insert(attempt: CheckoutAttempt): Promise<void>;
  claim(id: string): Promise<CheckoutAttempt | null>;
  patch(
    id: string,
    patch: Partial<CheckoutAttempt>,
    clearSource?: boolean,
  ): Promise<void>;
};

export function checkoutAttempts() {
  return getMongoDatabase().db.collection<CheckoutAttempt>("checkout_attempts");
}

export const mongoAttemptStore: AttemptStore = {
  get: (id) => checkoutAttempts().findOne({ _id: id }),
  async insert(attempt) {
    await checkoutAttempts().updateOne(
      { _id: attempt._id },
      { $setOnInsert: attempt },
      { upsert: true },
    );
  },
  claim: (id) =>
    checkoutAttempts().findOneAndUpdate(
      {
        _id: id,
        state: { $in: ["pending", "processing"] },
        leaseUntil: { $lte: new Date() },
        nextAttemptAt: { $lte: new Date() },
      },
      {
        $set: {
          state: "processing",
          leaseUntil: new Date(Date.now() + 120_000),
          updatedAt: new Date(),
        },
        $inc: { tries: 1 },
      },
      { returnDocument: "after" },
    ),
  async patch(id, patch, clearSource) {
    await checkoutAttempts().updateOne(
      { _id: id },
      {
        $set: { ...patch, updatedAt: new Date() },
        ...(clearSource ? { $unset: { encryptedSource: "" as const } } : {}),
      },
    );
  },
};

export class AttemptConflictError extends Error {}

/** A durable immutable snapshot is required before the first external write. */
export async function startCheckoutAttempt(
  input: CheckoutInput,
  quote: TaxQuote,
  store = mongoAttemptStore,
): Promise<CheckoutAttempt> {
  const hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
  const previous = await store.get(input.idempotencyKey);
  if (previous) {
    if (previous.requestHash !== hash)
      throw new AttemptConflictError(
        "This checkout attempt belongs to a different request",
      );
    return previous;
  }
  const catalog = getSquareCatalogConfig();
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!catalog || !locationId) throw new Error("Square is not configured");
  const { sourceId, verificationToken, ...savedInput } = input;
  const attempt: CheckoutAttempt = {
    _id: input.idempotencyKey,
    requestHash: hash,
    input: savedInput,
    encryptedSource: sealPaymentSource(
      { sourceId, verificationToken },
      input.idempotencyKey,
    ),
    quote,
    catalog,
    locationId,
    squareEnvironment:
      process.env.SQUARE_ENVIRONMENT === "production"
        ? "production"
        : "sandbox",
    fulfillmentFeeCents: FULFILLMENT[input.fulfillmentMethod].amountCents,
    createdAt: new Date(),
    updatedAt: new Date(),
    leaseUntil: new Date(0),
    nextAttemptAt: new Date(),
    tries: 0,
    state: "pending",
  };
  await store.insert(attempt);
  const saved = await store.get(attempt._id);
  if (!saved || saved.requestHash !== hash)
    throw new AttemptConflictError("Checkout attempt collision");
  return saved;
}

type AttemptDeps = {
  store: AttemptStore;
  request: typeof squareRequest;
  createOrder: typeof createItemizedSquareOrder;
  persist: typeof persistCheckoutRecord;
  enqueue: typeof enqueueOrderEmail;
};

const defaultDeps: AttemptDeps = {
  store: mongoAttemptStore,
  request: squareRequest,
  createOrder: createItemizedSquareOrder,
  persist: persistCheckoutRecord,
  enqueue: enqueueOrderEmail,
};

const DECLINE_CODES = new Set([
  "CARD_DECLINED",
  "CVV_FAILURE",
  "ADDRESS_VERIFICATION_FAILURE",
  "CARD_EXPIRED",
  "INVALID_CARD_DATA",
  "INVALID_CARD",
  "GENERIC_DECLINE",
  "INSUFFICIENT_FUNDS",
  "VERIFY_AVS_FAILURE",
  "VERIFY_CVV_FAILURE",
]);

/** Resume the same operations with the same payloads and Square idempotency keys. */
export async function processCheckoutAttempt(
  id: string,
  deps: AttemptDeps = defaultDeps,
): Promise<CheckoutAttempt | null> {
  const attempt = await deps.store.claim(id);
  if (!attempt) return deps.store.get(id);
  const input = attempt.input;
  const patch = async (
    value: Partial<CheckoutAttempt>,
    clearSource = false,
  ) => {
    await deps.store.patch(id, value, clearSource);
    Object.assign(attempt, value);
  };
  let financialResponseReceived = false;
  try {
    if (
      attempt.squareEnvironment !==
      (process.env.SQUARE_ENVIRONMENT === "production"
        ? "production"
        : "sandbox")
    ) {
      await patch({
        state: "needs-review",
        error:
          "Payment configuration changed. Customer care must verify this purchase before it can continue.",
      });
      return attempt;
    }
    // Never replay a financial write indefinitely. Retain its ledger for manual reconciliation.
    if (
      !attempt.paymentId &&
      !attempt.subscriptionId &&
      Date.now() - attempt.createdAt.getTime() > 23 * 60 * 60 * 1000
    ) {
      await patch(
        {
          state: "needs-review",
          error:
            "This purchase needs customer-care verification. Do not place it again until its status is confirmed.",
        },
        true,
      );
      return attempt;
    }
    const source = attempt.encryptedSource
      ? openPaymentSource(attempt.encryptedSource, id)
      : undefined;
    if (!attempt.customerId) {
      // A guest's email is not authorization to modify an existing Square profile.
      // Order-scoped customers also keep different recipients' addresses separate.
      const response = await deps.request<{ customer?: { id?: string } }>(
        "/v2/customers",
        {
          method: "POST",
          body: JSON.stringify({
            idempotency_key: `${id}-customer`,
            reference_id: id,
            given_name: input.contact.givenName,
            family_name: input.contact.familyName,
            email_address: input.contact.email,
            phone_number: input.contact.phone,
            address: addressToSquare(
              input.deliveryAddress ?? input.billingAddress,
            ),
          }),
        },
      );
      if (!response.customer?.id) throw new Error("Missing customer response");
      await patch({ customerId: response.customer.id });
    }
    if (!attempt.order) {
      const order = await deps.createOrder({
        ...input,
        catalog: attempt.catalog,
        customerId: attempt.customerId!,
        locationId: attempt.locationId,
        quote: attempt.quote,
        leadId: id,
        idempotencyKey: `${id}-order`,
        state: input.purchaseType === "weekly" ? "DRAFT" : "OPEN",
      });
      await patch({ order });
    }
    let status: string;
    let receiptUrl: string | undefined;
    if (input.purchaseType === "one-time") {
      if (!attempt.paymentId && !source)
        throw new Error("Missing payment source");
      const response = attempt.paymentId
        ? await deps.request<{
            payment?: { id?: string; status?: string; receipt_url?: string };
          }>(`/v2/payments/${encodeURIComponent(attempt.paymentId)}`)
        : await deps.request<{
            payment?: { id?: string; status?: string; receipt_url?: string };
          }>("/v2/payments", {
            method: "POST",
            body: JSON.stringify({
              idempotency_key: `${id}-payment`,
              source_id: source!.sourceId,
              ...(source!.verificationToken
                ? { verification_token: source!.verificationToken }
                : {}),
              amount_money: {
                amount: attempt.quote.totalCents,
                currency: "USD",
              },
              autocomplete: true,
              customer_id: attempt.customerId,
              location_id: attempt.locationId,
              order_id: attempt.order!.id,
              reference_id: id,
              buyer_email_address: input.contact.email,
              buyer_phone_number: input.contact.phone,
              billing_address: addressToSquare(input.billingAddress),
              ...(input.deliveryAddress
                ? { shipping_address: addressToSquare(input.deliveryAddress) }
                : {}),
            }),
          });
      const payment = response.payment;
      if (!payment?.id) throw new Error("Missing payment response");
      financialResponseReceived = true;
      await patch({ paymentId: payment.id }, true);
      status = payment.status || "PENDING";
      receiptUrl = payment.receipt_url;
      if (status === "FAILED" || status === "CANCELED") {
        await patch(
          {
            state: "failed",
            error:
              "Square did not complete this payment. You can try another payment method.",
          },
          true,
        );
        return attempt;
      }
      if (status !== "COMPLETED") {
        await patch({
          state: "pending",
          leaseUntil: new Date(0),
          nextAttemptAt: new Date(Date.now() + 15_000),
        });
        return attempt;
      }
    } else {
      if (!attempt.cardId) {
        if (!source) throw new Error("Missing payment source");
        const response = await deps.request<{ card?: { id?: string } }>(
          "/v2/cards",
          {
            method: "POST",
            body: JSON.stringify({
              idempotency_key: `${id}-card`,
              source_id: source.sourceId,
              card: {
                customer_id: attempt.customerId,
                cardholder_name: `${input.billingName.givenName} ${input.billingName.familyName}`,
                billing_address: addressToSquare(input.billingAddress),
              },
            }),
          },
        );
        if (!response.card?.id) throw new Error("Missing saved card response");
        await patch({ cardId: response.card.id }, true);
      }
      if (!attempt.subscriptionId) {
        const response = await deps.request<{ subscription?: { id?: string } }>(
          "/v2/subscriptions",
          {
            method: "POST",
            body: JSON.stringify({
              idempotency_key: `${id}-subscription`,
              location_id: attempt.locationId,
              plan_variation_id: attempt.catalog.weeklyPlanVariationId,
              customer_id: attempt.customerId,
              card_id: attempt.cardId,
              phases: [{ ordinal: 0, order_template_id: attempt.order!.id }],
              timezone: "America/Los_Angeles",
              source: { name: `Soul Bowls checkout ${id}` },
            }),
          },
        );
        if (!response.subscription?.id)
          throw new Error("Missing subscription response");
        financialResponseReceived = true;
        await patch({ subscriptionId: response.subscription.id }, true);
      }
      status = "PENDING_PAYMENT";
    }
    const squareObjectId = attempt.paymentId || attempt.subscriptionId!;
    const record: CheckoutRecord = {
      squareObjectId,
      squareObjectType:
        input.purchaseType === "weekly" ? "subscription" : "payment",
      squareOrderId: attempt.order!.id,
      squareCustomerId: attempt.customerId!,
      customerEmail: input.contact.email,
      customerName: `${input.contact.givenName} ${input.contact.familyName}`,
      leadId: id,
      purchaseType: input.purchaseType,
      fulfillmentMethod: input.fulfillmentMethod,
      deliveryAddress: input.deliveryAddress ?? undefined,
      bowlSelection: input.bowlSelection,
      peopleCount: input.peopleCount,
      mealsPerDay: input.mealsPerDay,
      subtotalCents: attempt.quote.subtotalCents,
      taxCents: attempt.quote.taxCents,
      totalCents: attempt.quote.totalCents,
      fulfillmentFeeCents: attempt.fulfillmentFeeCents,
      orderStatus: status,
      receiptUrl,
      acceptedAt: attempt.createdAt.toISOString(),
      legalVersion: LEGAL_VERSION,
    };
    if (!(await deps.persist(record)))
      throw new Error("Checkout record was not saved");
    await deps.enqueue(record);
    const result: CheckoutResult = {
      ok: true,
      purchaseType: input.purchaseType,
      status,
      paymentPending: status === "PENDING_PAYMENT",
      paymentId: attempt.paymentId,
      subscriptionId: attempt.subscriptionId,
      orderId: attempt.order!.id,
      receiptUrl,
      acceptedAt: record.acceptedAt,
      legalVersion: LEGAL_VERSION,
      fulfillmentMethod: input.fulfillmentMethod,
      peopleCount: input.peopleCount,
      mealsPerDay: input.mealsPerDay,
      bowlSelection: input.bowlSelection,
      tax: attempt.quote,
    };
    await patch({ state: "complete", result }, true);
  } catch (error) {
    // Never disable a card or assert non-payment for a timeout/unknown outcome.
    const declined =
      !financialResponseReceived &&
      error instanceof SquareApiError &&
      error.status < 500 &&
      error.codes.some((code) => DECLINE_CODES.has(code));
    await patch(
      {
        state: declined ? "failed" : "pending",
        leaseUntil: new Date(0),
        nextAttemptAt: new Date(
          Date.now() +
            Math.min(300_000, 5_000 * 2 ** Math.min(attempt.tries, 6)),
        ),
        error: declined
          ? "The payment method was declined. Check its details or try another card."
          : "We are verifying this purchase with Square. Do not place another order for the same purchase.",
      },
      declined,
    ).catch(() => {
      // The pre-charge record survives. Its lease expires and the worker replays the same keys.
      console.error("[checkout] Recovery record temporarily unavailable", {
        attemptId: id,
      });
    });
  }
  return attempt;
}

export function attemptResponse(attempt: CheckoutAttempt | null) {
  if (!attempt)
    return {
      status: 404,
      body: { error: "No saved checkout attempt was found.", missing: true },
    };
  if (attempt.state === "complete" && attempt.result)
    return { status: 200, body: attempt.result };
  if (attempt.state === "failed")
    return { status: 422, body: { error: attempt.error, safeToRetry: true } };
  return {
    status: 202,
    body: {
      pending: true,
      needsReview: attempt.state === "needs-review",
      attemptId: attempt._id,
      message:
        attempt.error ||
        "Your purchase is being verified. Please do not submit another payment.",
    },
  };
}
