import type { Lead } from "../lead-schema";
import { appendLeadToFile } from "./local-file";
import { saveLeadToMongo } from "./mongodb";

/** A persisted lead: the validated lead plus a generated id and server-set timestamp. */
export type LeadRecord = Lead & {
  id: string;
  capturedAt: string;
};

/** A read-only environment shape (compatible with `process.env`). */
export type EnvLike = Record<string, string | undefined>;

export type CaptureAdapter = "mongodb" | "local-file";

export interface CaptureResult {
  id: string;
  adapter: CaptureAdapter;
}

interface CaptureDeps {
  env?: EnvLike;
  toMongo?: (record: LeadRecord, env: EnvLike) => Promise<void>;
  toLocalFile?: (record: LeadRecord) => Promise<void>;
}

/** True when a MongoDB connection string is configured. */
export function hasMongoConfig(env: EnvLike = process.env): boolean {
  return Boolean(env.MONGODB_URI);
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Persist a lead in MongoDB. Local development may explicitly opt into a private
 * file adapter. Production storage failures must be reported to the customer.
 */
export async function captureLead(
  lead: Lead,
  deps: CaptureDeps = {},
): Promise<CaptureResult> {
  const env = deps.env ?? process.env;
  const toMongo = deps.toMongo ?? saveLeadToMongo;
  const toLocalFile = deps.toLocalFile ?? appendLeadToFile;

  const record: LeadRecord = {
    ...lead,
    id: generateId(),
    capturedAt: new Date().toISOString(),
  };

  if (hasMongoConfig(env)) {
    try {
      await toMongo(record, env);
      return { id: record.id, adapter: "mongodb" };
    } catch {
      console.error("[capture] MongoDB unavailable");
    }
  }

  if (
    env.NODE_ENV === "production" ||
    env.VERCEL ||
    env.ALLOW_LOCAL_LEAD_CAPTURE !== "true"
  ) {
    throw new Error("Lead storage is temporarily unavailable");
  }
  await toLocalFile(record);
  return { id: record.id, adapter: "local-file" };
}
