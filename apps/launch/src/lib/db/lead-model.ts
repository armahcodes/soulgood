import mongoose, { type InferSchemaType, type Model } from "mongoose";
import { PATHWAYS } from "../lead-schema";

/**
 * Mongoose schema for a captured lead. Mirrors the validated `Lead` shape plus
 * the server-stamped `localId` (the dispatcher-generated capture id) and
 * `capturedAt`. Validation already happens via Zod at the API boundary, so this
 * schema is intentionally permissive — its job is durable storage, not a second
 * validation layer.
 */
const leadSchema = new mongoose.Schema(
  {
    localId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },
    pathway: { type: String, enum: [...PATHWAYS, null], default: null },
    intent: { type: String, enum: ["buyer", "list"], required: true },
    dietary: { type: [String], default: [] },
    allergens: { type: [String], default: [] },
    foods: { type: [String], default: [] },
    priorities: { type: [String], default: [] },
    reflectBody: { type: String },
    reflectSoul: { type: String },
    capturedAt: { type: Date, required: true },
  },
  { collection: "leads", timestamps: true },
);

export type LeadDocument = InferSchemaType<typeof leadSchema>;

/**
 * Reuse the compiled model across hot-reloads / warm serverless containers
 * (Mongoose throws if a model is compiled twice).
 */
export const LeadModel: Model<LeadDocument> =
  (mongoose.models.Lead as Model<LeadDocument>) ??
  mongoose.model<LeadDocument>("Lead", leadSchema);
