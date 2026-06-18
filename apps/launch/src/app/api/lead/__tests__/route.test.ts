import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { POST } from "../route";

const captureFile = path.join(process.cwd(), "public", "leads.local.jsonl");

async function lineCount(): Promise<number> {
  try {
    const contents = await fs.readFile(captureFile, "utf8");
    return contents.trim() === "" ? 0 : contents.trim().split("\n").length;
  } catch {
    return 0;
  }
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

let before = 0;

beforeEach(async () => {
  // Ensure no Airtable config so the route uses the local file.
  delete process.env.AIRTABLE_API_KEY;
  delete process.env.AIRTABLE_BASE_ID;
  delete process.env.AIRTABLE_TABLE_NAME;
  before = await lineCount();
});

afterEach(async () => {
  // Trim any test-appended lines back to the original count to keep the file clean.
  try {
    const contents = await fs.readFile(captureFile, "utf8");
    const lines = contents.trim() === "" ? [] : contents.trim().split("\n");
    if (lines.length > before) {
      const kept = lines.slice(0, before);
      await fs.writeFile(captureFile, kept.length ? kept.join("\n") + "\n" : "");
    }
  } catch {
    // no file — nothing to trim
  }
});

describe("POST /api/lead", () => {
  it("persists a valid lead and returns 200 { ok, id }", async () => {
    const res = await POST(
      makeRequest({
        email: "valid@example.com",
        phone: "3105550134",
        pathway: "detox",
        intent: "buyer",
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.id).toBeTruthy();

    const after = await lineCount();
    expect(after).toBe(before + 1);

    const contents = await fs.readFile(captureFile, "utf8");
    const last = JSON.parse(contents.trim().split("\n").at(-1)!);
    expect(last.email).toBe("valid@example.com");
    expect(last.phone).toBe("3105550134");
    expect(last.pathway).toBe("detox");
    expect(last.id).toBe(json.id);
    expect(last.capturedAt).toBeTruthy();
  });

  it("rejects an invalid lead with 400 and does not persist", async () => {
    const res = await POST(makeRequest({ email: "bad", phone: "" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.errors).toBeTruthy();

    const after = await lineCount();
    expect(after).toBe(before);
  });
});
