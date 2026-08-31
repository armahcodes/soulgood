import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { BOWL_IDS } from "../current-offer";

const selectionShape = Object.fromEntries(
  BOWL_IDS.map((id) => [id, { type: Number, required: true, min: 0, max: 5 }]),
);

const checkoutRecordSchema = new mongoose.Schema(
  {
    squareObjectId: { type: String, required: true, unique: true, index: true },
    squareObjectType: {
      type: String,
      enum: ["payment", "subscription"],
      required: true,
    },
    squareCustomerId: { type: String, required: true, index: true },
    leadId: { type: String, required: true, index: true },
    purchaseType: {
      type: String,
      enum: ["one-time", "weekly"],
      required: true,
    },
    fulfillmentMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    bowlSelection: { type: selectionShape, required: true, _id: false },
    subtotalCents: { type: Number, required: true },
    taxCents: { type: Number, required: true },
    totalCents: { type: Number, required: true },
    acceptedAt: { type: Date, required: true },
    legalVersion: { type: String, required: true },
  },
  { collection: "checkout_records", timestamps: true },
);

export type CheckoutRecordDocument = InferSchemaType<typeof checkoutRecordSchema>;

export const CheckoutRecordModel: Model<CheckoutRecordDocument> =
  (mongoose.models.CheckoutRecord as Model<CheckoutRecordDocument>) ??
  mongoose.model<CheckoutRecordDocument>("CheckoutRecord", checkoutRecordSchema);
