import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { appendLeadToFile } from "../local-file";

let tmpDir: string;
let target: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "leads-"));
  target = path.join(tmpDir, "nested", "leads.local.jsonl");
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

const lead = {
  email: "a@b.com",
  phone: "3105550134",
  name: undefined,
  pathway: "mindful" as const,
  intent: "list" as const,
  plan: null,
  dietary: [],
  allergens: [],
  foods: [],
  priorities: [],
  reflectBody: undefined,
  reflectSoul: undefined,
  capturedAt: new Date().toISOString(),
};

describe("appendLeadToFile", () => {
  it("creates the file/dir if missing and appends a parseable JSONL line", async () => {
    const record = { ...lead, id: "abc123" };
    await appendLeadToFile(record, target);

    const contents = await fs.readFile(target, "utf8");
    const lines = contents.trim().split("\n");
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]);
    expect(parsed.email).toBe("a@b.com");
    expect(parsed.id).toBe("abc123");
    expect(parsed.pathway).toBe("mindful");
  });

  it("appends additional leads as new lines", async () => {
    await appendLeadToFile({ ...lead, id: "one" }, target);
    await appendLeadToFile({ ...lead, id: "two" }, target);

    const contents = await fs.readFile(target, "utf8");
    const lines = contents.trim().split("\n");
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).id).toBe("one");
    expect(JSON.parse(lines[1]).id).toBe("two");
  });
});
