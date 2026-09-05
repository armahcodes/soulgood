import { promises as fs } from "node:fs";
import path from "node:path";
import type { LeadRecord } from "./index";

/** Default capture file — the local JSONL fallback validators inspect. */
export const DEFAULT_CAPTURE_FILE = path.join(
  process.cwd(),
  ".local-data",
  "leads.local.jsonl",
);

/**
 * Append one JSON object per line to the capture file, creating the file and its
 * parent directory if missing. This is the source-of-truth fallback for capture;
 * it must never silently drop a lead.
 */
export async function appendLeadToFile(
  record: LeadRecord,
  filePath: string = DEFAULT_CAPTURE_FILE,
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  await fs.appendFile(filePath, JSON.stringify(record) + "\n", {
    encoding: "utf8",
    mode: 0o600,
  });
}
