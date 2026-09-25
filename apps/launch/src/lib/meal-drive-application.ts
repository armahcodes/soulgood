import { createHash } from "node:crypto";
import { getMongoDatabase } from "./db/mongodb";
import { enqueueEmail } from "./email-outbox";
import { reviewChecklist, type ChecklistItem, type MealDriveApplication } from "./meal-drive";

export type MealDriveApplicationRecord = MealDriveApplication & {
  _id: string;
  reference: string;
  status: "received";
  checklist: ChecklistItem[];
  receivedAt: string;
};

/**
 * Save a host application once (identical retries reuse the same record and
 * emails), then queue a team notification and an applicant acknowledgment.
 * Applications are reviewed in `receivedAt` order.
 */
export async function submitMealDriveApplication(input: MealDriveApplication, today: string): Promise<{ reference: string }> {
  const details = { ...input, website: undefined };
  const _id = createHash("sha256").update(JSON.stringify(details)).digest("hex");
  const reference = `FFS-${_id.slice(0, 6).toUpperCase()}`;
  const record = await getMongoDatabase()
    .db.collection<MealDriveApplicationRecord>("meal_drive_applications")
    .findOneAndUpdate(
      { _id },
      {
        $setOnInsert: {
          ...input,
          _id,
          reference,
          status: "received",
          checklist: reviewChecklist(input, today),
          receivedAt: new Date().toISOString(),
        },
      },
      { upsert: true, returnDocument: "after" },
    );
  if (!record) throw new Error("Meal drive application was not saved");
  await enqueueEmail(`meal-drive:${_id}:team`, "mealDriveTeam", record);
  await enqueueEmail(`meal-drive:${_id}:applicant`, "mealDriveApplicant", {
    email: record.email,
    contactName: record.contactName,
    organizationName: record.organizationName,
    reference: record.reference,
    preferredDate: record.preferredDate,
  });
  return { reference: record.reference };
}
