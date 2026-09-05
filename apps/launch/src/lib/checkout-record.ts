import type { BowlSelection } from "./bowl-selection";
import type { FulfillmentMethod, PurchaseType } from "./brand";
import { CheckoutRecordModel } from "./db/checkout-record-model";
import { connectToDatabase } from "./db/mongoose";
import type { CheckoutAddress } from "./square";

export type CheckoutRecord = {
  squareObjectId: string;
  squareObjectType: "payment" | "subscription" | "invoice";
  subscriptionId?: string;
  squareOrderId?: string;
  squareCustomerId: string;
  customerEmail: string;
  customerName: string;
  leadId: string;
  purchaseType: PurchaseType;
  peopleCount: number;
  mealsPerDay: number;
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress?: CheckoutAddress;
  bowlSelection: BowlSelection;
  subtotalCents: number;
  fulfillmentFeeCents?: number;
  taxCents: number;
  totalCents: number;
  orderStatus: string;
  receiptUrl?: string;
  acceptedAt: string;
  legalVersion: string;
};

/**
 * Insert once without overwriting a later reconciled payment status. The durable
 * checkout attempt retries persistence before acknowledging checkout completion.
 */
export async function persistCheckoutRecord(
  record: CheckoutRecord,
): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;

  await connectToDatabase();
  await CheckoutRecordModel.findOneAndUpdate(
    { squareObjectId: record.squareObjectId },
    {
      $setOnInsert: {
        ...record,
        acceptedAt: new Date(record.acceptedAt),
        confirmationEmail: {
          status: process.env.RESEND_API_KEY ? "pending" : "not-configured",
          updatedAt: new Date(),
        },
      },
    },
    { upsert: true, runValidators: true },
  );
  return true;
}

export async function updateCheckoutConfirmationEmail(
  squareObjectId: string,
  result:
    | { status: "sent"; resendEmailId: string }
    | { status: "failed"; error: string },
): Promise<void> {
  if (!process.env.MONGODB_URI) return;
  await connectToDatabase();
  await CheckoutRecordModel.updateOne(
    { squareObjectId },
    {
      $set: {
        confirmationEmail: {
          ...result,
          error:
            result.status === "failed" ? result.error.slice(0, 500) : undefined,
          updatedAt: new Date(),
        },
      },
    },
  );
}

export type CustomerOrder = {
  id: string;
  squareOrderId?: string;
  type: PurchaseType;
  peopleCount: number;
  mealsPerDay: number;
  squareObjectType: "payment" | "subscription" | "invoice";
  subscriptionStatus?: string;
  status: string;
  fulfillmentMethod: FulfillmentMethod;
  deliveryAddress?: CheckoutAddress;
  bowlSelection: BowlSelection;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  receiptUrl?: string;
  cancellationScheduledFor?: string;
  createdAt: string;
};

export type OwnedSubscription = {
  customerEmail: string;
  customerName: string;
  cancellationScheduledFor?: string;
};

export async function getOwnedSubscription(
  email: string,
  subscriptionId: string,
): Promise<OwnedSubscription | null> {
  if (!process.env.MONGODB_URI) return null;
  await connectToDatabase();
  const record = await CheckoutRecordModel.findOne({
    squareObjectId: subscriptionId,
    squareObjectType: "subscription",
    customerEmail: email.trim().toLowerCase(),
  }).exec();

  if (!record) return null;
  return {
    customerEmail: record.customerEmail,
    customerName: record.customerName,
    cancellationScheduledFor: record.cancellationScheduledFor || undefined,
  };
}

export async function markSubscriptionCancellation(
  subscriptionId: string,
  effectiveDate: string,
  status: string,
): Promise<void> {
  await connectToDatabase();
  await CheckoutRecordModel.updateOne(
    { squareObjectId: subscriptionId, squareObjectType: "subscription" },
    {
      $set: {
        cancellationScheduledFor: effectiveDate,
        orderStatus: status,
      },
    },
  );
}

export async function listCheckoutRecordsForEmail(
  email: string,
): Promise<CustomerOrder[]> {
  if (!process.env.MONGODB_URI) return [];
  await connectToDatabase();
  const records = await CheckoutRecordModel.find({
    customerEmail: email.trim().toLowerCase(),
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .exec();

  return records.map((record) => {
    const savedAddress = record.deliveryAddress;
    const deliveryAddress: CheckoutAddress | undefined =
      savedAddress?.addressLine1 && savedAddress.city && savedAddress.postalCode
        ? {
            addressLine1: savedAddress.addressLine1,
            addressLine2: savedAddress.addressLine2 || "",
            city: savedAddress.city,
            state: "CA",
            postalCode: savedAddress.postalCode,
          }
        : undefined;

    return {
      id: record.squareObjectId,
      squareOrderId: record.squareOrderId || undefined,
      type: record.purchaseType as PurchaseType,
      peopleCount: record.peopleCount || 1,
      mealsPerDay: record.mealsPerDay || 1,
      squareObjectType: record.squareObjectType,
      subscriptionStatus: record.subscriptionStatus || undefined,
      status: record.orderStatus,
      fulfillmentMethod: record.fulfillmentMethod as FulfillmentMethod,
      deliveryAddress,
      bowlSelection: record.bowlSelection as BowlSelection,
      subtotalCents: record.subtotalCents,
      taxCents: record.taxCents,
      totalCents: record.totalCents,
      receiptUrl: record.receiptUrl || undefined,
      cancellationScheduledFor: record.cancellationScheduledFor || undefined,
      createdAt: (
        (record.get("createdAt") as Date | undefined) ?? record.acceptedAt
      ).toISOString(),
    };
  });
}
