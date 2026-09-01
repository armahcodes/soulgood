import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { MAX_MEAL_SETS_PER_ORDER } from "../bowl-selection";
import { BOWL_IDS } from "../current-offer";

const selectionShape = Object.fromEntries(
  BOWL_IDS.map((id) => [
    id,
    { type: Number, required: true, min: 0, max: MAX_MEAL_SETS_PER_ORDER * 2 },
  ]),
);

const checkoutRecordSchema = new mongoose.Schema(
  {
    squareObjectId: { type: String, required: true, unique: true, index: true },
    squareObjectType: {
      type: String,
      enum: ["payment", "subscription"],
      required: true,
    },
    squareOrderId: { type: String, trim: true, index: true },
    squareCustomerId: { type: String, required: true, index: true },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    customerName: { type: String, required: true, trim: true },
    leadId: { type: String, required: true, index: true },
    purchaseType: {
      type: String,
      enum: ["one-time", "weekly"],
      required: true,
    },
    peopleCount: { type: Number, required: true, min: 1, max: 6, default: 1 },
    mealsPerDay: { type: Number, required: true, min: 1, max: 3, default: 1 },
    fulfillmentMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    deliveryAddress: {
      addressLine1: { type: String, trim: true, maxlength: 200 },
      addressLine2: { type: String, trim: true, maxlength: 200 },
      city: { type: String, trim: true, maxlength: 100 },
      state: { type: String, enum: ["CA"] },
      postalCode: { type: String, trim: true, match: /^\d{5}$/ },
      _id: false,
    },
    bowlSelection: { type: selectionShape, required: true, _id: false },
    subtotalCents: { type: Number, required: true },
    taxCents: { type: Number, required: true },
    totalCents: { type: Number, required: true },
    orderStatus: { type: String, required: true, trim: true },
    receiptUrl: { type: String, trim: true },
    cancellationScheduledFor: { type: String, trim: true },
    confirmationEmail: {
      status: {
        type: String,
        enum: ["pending", "sent", "failed", "not-configured"],
        required: true,
      },
      resendEmailId: { type: String, trim: true },
      error: { type: String, trim: true },
      updatedAt: { type: Date, required: true },
      _id: false,
    },
    acceptedAt: { type: Date, required: true },
    legalVersion: { type: String, required: true },
  },
  { collection: "checkout_records", timestamps: true },
);

export type CheckoutRecordDocument = InferSchemaType<typeof checkoutRecordSchema>;

export const CheckoutRecordModel: Model<CheckoutRecordDocument> =
  (mongoose.models.CheckoutRecord as Model<CheckoutRecordDocument>) ??
  mongoose.model<CheckoutRecordDocument>("CheckoutRecord", checkoutRecordSchema);
