import { createHash } from "node:crypto";
import { getMongoDatabase } from "./db/mongodb";
import { enqueueEmail } from "./email-outbox";
import {
  COMMUNITY_DRIVE,
  type CommunityInterest,
  type CommunityInterestRecord,
} from "./community-drive";

export async function captureCommunityInterest(
  input: CommunityInterest,
): Promise<void> {
  // Identical retries reuse one lead and one notification without exposing email in an ID.
  const details = {
    name: input.name,
    email: input.email,
    interest: input.interest,
    community: input.community,
    organization: input.organization,
    message: input.message,
    consent: input.consent,
    campaign: COMMUNITY_DRIVE.campaign,
  };
  const id = createHash("sha256").update(JSON.stringify(details)).digest("hex");
  const record = await getMongoDatabase()
    .db.collection<CommunityInterestRecord & { _id: string }>(
      "community_interests",
    )
    .findOneAndUpdate(
      { _id: id },
      {
        $setOnInsert: { ...details, id, capturedAt: new Date().toISOString() },
      },
      { upsert: true, returnDocument: "after" },
    );
  if (!record) throw new Error("Community interest was not saved");
  // Both writes must finish before acknowledging. Retrying after a partial failure is safe.
  await enqueueEmail(`community:${id}`, "community", record);
}
