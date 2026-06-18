import type { Lead } from "../lead-schema";
import { appendLeadToFile } from "./local-file";
import { sendToAirtable } from "./airtable";

/** A persisted lead: the validated lead plus a generated id and server-set timestamp. */
export type LeadRecord = Lead & {
  id: string;
  capturedAt: string;
};

/** A read-only environment shape (compatible with `process.env`). */
export type EnvLike = Record<string, string | undefined>;

export type CaptureAdapter = "airtable" | "local-file";

export interface CaptureResult {
  id: string;
  adapter: CaptureAdapter;
}

interface CaptureDeps {
  env?: EnvLike;
  toAirtable?: (record: LeadRecord, env: EnvLike) => Promise<void>;
  toLocalFile?: (record: LeadRecord) => Promise<void>;
}

/** True only when all three Airtable env vars are present. */
export function hasAirtableConfig(env: EnvLike = process.env): boolean {
  return Boolean(
    env.AIRTABLE_API_KEY && env.AIRTABLE_BASE_ID && env.AIRTABLE_TABLE_NAME,
  );
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Persist a lead. Uses the Airtable adapter only when all three env vars are set;
 * otherwise the local-file adapter. If Airtable throws, logs and falls back to the
 * local file so a lead is NEVER dropped.
 */
export async function captureLead(
  lead: Lead,
  deps: CaptureDeps = {},
): Promise<CaptureResult> {
  const env = deps.env ?? process.env;
  const toAirtable = deps.toAirtable ?? sendToAirtable;
  const toLocalFile = deps.toLocalFile ?? appendLeadToFile;

  const record: LeadRecord = {
    ...lead,
    id: generateId(),
    capturedAt: new Date().toISOString(),
  };

  if (hasAirtableConfig(env)) {
    try {
      await toAirtable(record, env);
      return { id: record.id, adapter: "airtable" };
    } catch (error) {
      console.error(
        "[capture] Airtable failed, falling back to local file:",
        error,
      );
    }
  }

  await toLocalFile(record);
  return { id: record.id, adapter: "local-file" };
}
