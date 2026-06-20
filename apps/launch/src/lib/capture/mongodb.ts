import type { EnvLike, LeadRecord } from "./index";
import { connectToDatabase } from "../db/mongoose";
import { LeadModel } from "../db/lead-model";

/**
 * Persist a lead to MongoDB via Mongoose. Throws on any failure so the
 * dispatcher can fall back to the local file (capture-first; never drop a lead).
 */
export async function saveLeadToMongo(
  record: LeadRecord,
  env: EnvLike = process.env,
): Promise<void> {
  await connectToDatabase(env.MONGODB_URI);

  await LeadModel.create({
    localId: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    pathway: record.pathway ?? null,
    intent: record.intent,
    dietary: record.dietary,
    allergens: record.allergens,
    foods: record.foods,
    priorities: record.priorities,
    reflectBody: record.reflectBody,
    reflectSoul: record.reflectSoul,
    capturedAt: new Date(record.capturedAt),
  });
}
