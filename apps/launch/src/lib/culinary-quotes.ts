import { createHash, randomUUID } from "node:crypto";
import { getMongoDatabase } from "./db/mongodb";
import { lookupCaliforniaTax } from "./square";
import {
  CULINARY_QUOTE_TTL_MS,
  culinaryInputSchema,
  culinaryLineItems,
  culinaryRequestSchema,
  culinaryPaymentSchedule,
  culinaryServingCount,
  type CulinaryInput,
  type CulinaryQuote,
  type CulinaryRequest,
} from "./culinary-booking";
import { enqueueEmail } from "./email-outbox";
import type { CulinaryInvoiceJob } from "./culinary-invoices";

export type CulinaryQuoteRecord = CulinaryQuote & {
  _id: string;
  status: "estimate" | "requested";
  purgeAfter?: Date;
  request?: CulinaryRequest;
  requestHash?: string;
  requestedAt?: Date;
  notificationsQueued?: boolean;
  invoiceJob?: CulinaryInvoiceJob;
};
export function culinaryQuotes() {
  return getMongoDatabase().db.collection<CulinaryQuoteRecord>(
    "culinary_quotes",
  );
}
export type CulinaryQuoteStore = {
  insert(record: CulinaryQuoteRecord): Promise<void>;
  get(id: string): Promise<CulinaryQuoteRecord | null>;
  request(id: string, input: CulinaryRequest, hash: string): Promise<void>;
};
const mongoStore: CulinaryQuoteStore = {
  async insert(record) {
    await culinaryQuotes().insertOne(record);
  },
  get: (id) => culinaryQuotes().findOne({ _id: id }),
  async request(id, input, hash) {
    await culinaryQuotes().updateOne(
      {
        _id: id,
        status: "estimate",
        expiresAt: { $gt: new Date().toISOString() },
      },
      {
        $set: {
          status: "requested",
          request: input,
          requestHash: hash,
          requestedAt: new Date(),
          notificationsQueued: false,
          invoiceJob: {
            state: "pending",
            attempts: 0,
            nextAttemptAt: new Date(),
            leaseUntil: new Date(0),
            depositDueDate: new Date().toLocaleDateString("en-CA", {
              timeZone: "America/Los_Angeles",
            }),
          },
        },
        $unset: { purgeAfter: "" },
      },
    );
  },
};

export class CulinaryQuoteError extends Error {
  constructor(
    message: string,
    readonly status = 422,
    readonly expired = false,
  ) {
    super(message);
  }
}

/** Prices and mandatory support are always derived on the server, never from a client total. */
export async function createCulinaryQuote(
  input: CulinaryInput,
  deps = {
    store: mongoStore,
    tax: (address: CulinaryInput["address"]) =>
      lookupCaliforniaTax(address, fetch),
  },
): Promise<CulinaryQuote> {
  const validated = culinaryInputSchema.parse(input);
  const tax = await deps.tax(validated.address);
  if (tax.county !== "LOS ANGELES")
    throw new CulinaryQuoteError(
      "Culinary bookings are currently available only in Los Angeles County.",
    );
  if (!Number.isFinite(tax.rate) || tax.rate <= 0 || tax.rate >= 0.2)
    throw new CulinaryQuoteError(
      "We could not verify the tax rate for this address. Please check the address and try again.",
    );
  const items = culinaryLineItems(
    validated.experience,
    validated.bowlSelection,
    validated,
  );
  const subtotalCents = items.reduce(
    (total, item) => total + item.amountCents,
    0,
  );
  // Catering food, mandatory meal-service labor, and our prepared-food delivery
  // follow the site's taxable prepared-meal treatment. This is an estimate, not a tax invoice.
  const taxCents = Math.round(subtotalCents * tax.rate);
  const id = randomUUID();
  const quote: CulinaryQuote = {
    id,
    reference: `SG-${id.slice(0, 8).toUpperCase()}`,
    input: validated,
    items,
    bowlCount: culinaryServingCount(validated),
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
    taxPercentage: String(Number((tax.rate * 100).toFixed(4))),
    jurisdiction: tax.jurisdiction,
    currency: "USD",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + CULINARY_QUOTE_TTL_MS).toISOString(),
    pricingVersion: 2,
    paymentSchedule: culinaryPaymentSchedule(
      subtotalCents + taxCents,
      validated.eventDate,
    ),
  };
  await deps.store.insert({
    ...quote,
    _id: id,
    status: "estimate",
    purgeAfter: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  return quote;
}

export async function requestCulinaryBooking(
  raw: CulinaryRequest,
  store = mongoStore,
): Promise<CulinaryQuoteRecord> {
  const input = culinaryRequestSchema.parse(raw);
  const hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
  const quote = await store.get(input.quoteId);
  if (!quote)
    throw new CulinaryQuoteError(
      "This estimate is no longer available. Generate a new quote.",
      404,
      true,
    );
  if (quote.status === "requested") {
    if (quote.requestHash !== hash)
      throw new CulinaryQuoteError(
        "This quote has already been requested. Contact us to update the booking details.",
        409,
      );
    return quote;
  }
  if (quote.pricingVersion !== 2)
    throw new CulinaryQuoteError(
      "Our event pricing has changed. Please generate a fresh quote.",
      409,
      true,
    );
  if (Date.parse(quote.expiresAt) <= Date.now())
    throw new CulinaryQuoteError(
      "This estimate expired. Generate a fresh quote before sending your request.",
      409,
      true,
    );
  // Also recheck event date and menu availability before accepting a request.
  if (!culinaryInputSchema.safeParse(quote.input).success)
    throw new CulinaryQuoteError(
      "The event details or menu changed. Please generate a fresh quote.",
      409,
      true,
    );
  await store.request(quote.id, input, hash);
  const saved = await store.get(quote.id);
  if (saved?.status !== "requested" || saved.requestHash !== hash)
    throw new CulinaryQuoteError(
      "We could not accept this version of the request. Please check the quote and try again.",
      409,
    );
  return saved;
}

export async function queueCulinaryEmails(
  record: CulinaryQuoteRecord,
): Promise<void> {
  if (
    !record.request ||
    record.status !== "requested" ||
    record.notificationsQueued
  )
    return;
  const payload = { quote: record, request: record.request };
  await enqueueEmail(`culinary:${record.id}:customer`, "culinary", {
    ...payload,
    audience: "customer",
  });
  await enqueueEmail(`culinary:${record.id}:team`, "culinary", {
    ...payload,
    audience: "team",
  });
  await culinaryQuotes().updateOne(
    { _id: record.id, status: "requested" },
    { $set: { notificationsQueued: true } },
  );
}

export async function queuePendingCulinaryEmails(limit = 5): Promise<void> {
  const pending = await culinaryQuotes()
    .find({ status: "requested", notificationsQueued: false })
    .sort({ requestedAt: 1 })
    .limit(limit)
    .toArray();
  for (const record of pending) await queueCulinaryEmails(record);
}
