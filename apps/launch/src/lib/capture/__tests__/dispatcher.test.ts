import { describe, it, expect, vi } from "vitest";
import { captureLead, hasAirtableConfig } from "../index";
import type { Lead } from "../../lead-schema";

const baseLead: Lead = {
  email: "a@b.com",
  phone: "3105550134",
  name: "Jane Guest",
  pathway: "performance",
  intent: "buyer",
  dietary: [],
  allergens: [],
  foods: [],
  priorities: [],
  reflectBody: undefined,
  reflectSoul: undefined,
};

const fullEnv = {
  AIRTABLE_API_KEY: "key",
  AIRTABLE_BASE_ID: "base",
  AIRTABLE_TABLE_NAME: "Leads",
};

describe("hasAirtableConfig", () => {
  it("is true only when all three env vars are present", () => {
    expect(hasAirtableConfig(fullEnv)).toBe(true);
    expect(hasAirtableConfig({ AIRTABLE_API_KEY: "key" })).toBe(false);
    expect(hasAirtableConfig({})).toBe(false);
  });
});

describe("captureLead adapter selection", () => {
  it("uses Airtable when all env vars are set", async () => {
    const toAirtable = vi.fn().mockResolvedValue(undefined);
    const toLocalFile = vi.fn().mockResolvedValue(undefined);

    const result = await captureLead(baseLead, { env: fullEnv, toAirtable, toLocalFile });

    expect(toAirtable).toHaveBeenCalledOnce();
    expect(toLocalFile).not.toHaveBeenCalled();
    expect(result.adapter).toBe("airtable");
    expect(result.id).toBeTruthy();
  });

  it("uses the local file when env vars are missing", async () => {
    const toAirtable = vi.fn().mockResolvedValue(undefined);
    const toLocalFile = vi.fn().mockResolvedValue(undefined);

    const result = await captureLead(baseLead, {
      env: {},
      toAirtable,
      toLocalFile,
    });

    expect(toAirtable).not.toHaveBeenCalled();
    expect(toLocalFile).toHaveBeenCalledOnce();
    expect(result.adapter).toBe("local-file");
  });

  it("falls back to the local file when Airtable throws (lead never dropped)", async () => {
    const toAirtable = vi.fn().mockRejectedValue(new Error("airtable 500"));
    const toLocalFile = vi.fn().mockResolvedValue(undefined);

    const result = await captureLead(baseLead, { env: fullEnv, toAirtable, toLocalFile });

    expect(toAirtable).toHaveBeenCalledOnce();
    expect(toLocalFile).toHaveBeenCalledOnce();
    expect(result.adapter).toBe("local-file");
    expect(result.id).toBeTruthy();
  });

  it("stamps a generated id and server-set capturedAt on the record", async () => {
    let captured: { id: string; capturedAt: string } | undefined;
    const toLocalFile = vi.fn().mockImplementation(async (r) => {
      captured = r;
    });

    await captureLead(baseLead, { env: {}, toLocalFile });

    expect(captured?.id).toBeTruthy();
    expect(captured?.capturedAt).toBeTruthy();
    expect(() => new Date(captured!.capturedAt).toISOString()).not.toThrow();
  });
});
