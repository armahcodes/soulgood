import type { EnvLike, LeadRecord } from "./index";

/**
 * Map a lead record to Airtable column names. These must match the columns the
 * founder creates in the Airtable table (documented in `.env.example`).
 */
function toFields(record: LeadRecord): Record<string, unknown> {
  return {
    Email: record.email,
    Phone: record.phone,
    Name: record.name ?? "",
    Pathway: record.pathway ?? "",
    Intent: record.intent,
    Dietary: record.dietary.join(", "),
    Allergens: record.allergens.join(", "),
    Foods: record.foods.join(", "),
    Priorities: record.priorities.join(", "),
    "Body Needs": record.reflectBody ?? "",
    "Soul Needs": record.reflectSoul ?? "",
    "Captured At": record.capturedAt,
    "Local Id": record.id,
  };
}

/**
 * POST a lead to the Airtable REST API. Throws on any non-ok response so the
 * dispatcher can fall back to the local file (capture-first; never drop a lead).
 */
export async function sendToAirtable(
  record: LeadRecord,
  env: EnvLike = process.env,
): Promise<void> {
  const apiKey = env.AIRTABLE_API_KEY;
  const baseId = env.AIRTABLE_BASE_ID;
  const tableName = env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    throw new Error("Airtable is not fully configured");
  }

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields: toFields(record) }] }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Airtable request failed (${response.status}): ${detail}`);
  }
}
