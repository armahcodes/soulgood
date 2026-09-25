import { createHash } from "node:crypto";
import { getMongoDatabase } from "./db/mongodb";
import { enqueueEmail } from "./email-outbox";
import { unsubscribe } from "./newsletter";
import { PRIVACY_RESPONSE_DAYS, type PrivacyRequest } from "./privacy-shared";

export type PrivacyRequestRecord = PrivacyRequest & {
  _id: string;
  reference: string;
  status: "received";
  receivedAt: string;
  respondBy: string;
};

/**
 * Record a consumer privacy request (CCPA/CPRA) and queue a team notice plus an
 * acknowledgment. Marketing opt-outs take effect immediately; other requests are
 * verified by email before any information is disclosed or deleted. Records are
 * kept for at least 24 months, as California requires.
 */
export async function submitPrivacyRequest(input: PrivacyRequest, now = new Date()): Promise<{ reference: string }> {
  const details = { ...input, website: undefined, day: now.toISOString().slice(0, 10) };
  const _id = createHash("sha256").update(JSON.stringify(details)).digest("hex");
  const reference = `PR-${_id.slice(0, 6).toUpperCase()}`;
  const respondBy = new Date(now.getTime() + PRIVACY_RESPONSE_DAYS * 86_400_000).toISOString().slice(0, 10);
  const record = await getMongoDatabase()
    .db.collection<PrivacyRequestRecord>("privacy_requests")
    .findOneAndUpdate(
      { _id },
      { $setOnInsert: { ...input, _id, reference, status: "received", receivedAt: now.toISOString(), respondBy } },
      { upsert: true, returnDocument: "after" },
    );
  if (!record) throw new Error("Privacy request was not saved");
  if (record.requestType === "marketing" && record.relationship === "self") await unsubscribe({ email: record.email });
  await enqueueEmail(`privacy:${_id}:team`, "privacyTeam", record);
  await enqueueEmail(`privacy:${_id}:requester`, "privacyAck", {
    email: record.email,
    name: record.name,
    reference: record.reference,
    requestType: record.requestType,
    respondBy: record.respondBy,
  });
  return { reference: record.reference };
}
