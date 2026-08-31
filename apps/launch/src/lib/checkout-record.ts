import type { BowlSelection } from "./bowl-selection";
import type { FulfillmentMethod, PurchaseType } from "./brand";
import { CheckoutRecordModel } from "./db/checkout-record-model";
import { connectToDatabase } from "./db/mongoose";

export type CheckoutRecord = {
  squareObjectId: string;
  squareObjectType: "payment" | "subscription";
  squareCustomerId: string;
  leadId: string;
  purchaseType: PurchaseType;
  fulfillmentMethod: FulfillmentMethod;
  bowlSelection: BowlSelection;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  acceptedAt: string;
  legalVersion: string;
};

/**
 * Store the operational checkout record when MongoDB is configured.
 * The Square payment note or subscription source still carries the exact mix,
 * so a database outage never makes a successful checkout unidentifiable.
 */
export async function persistCheckoutRecord(record: CheckoutRecord): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;

  await connectToDatabase();
  await CheckoutRecordModel.findOneAndUpdate(
    { squareObjectId: record.squareObjectId },
    {
      $setOnInsert: {
        ...record,
        acceptedAt: new Date(record.acceptedAt),
      },
    },
    { upsert: true, runValidators: true },
  );
  return true;
}
