import { describe, it, expect, vi } from "vitest";
import { captureLead, hasMongoConfig } from "../index";
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

const mongoEnv = {
  MONGODB_URI: "mongodb+srv://user:pass@cluster.example.net/db",
};

describe("hasMongoConfig", () => {
  it("is true only when MONGODB_URI is present", () => {
    expect(hasMongoConfig(mongoEnv)).toBe(true);
    expect(hasMongoConfig({ MONGODB_URI: "" })).toBe(false);
    expect(hasMongoConfig({})).toBe(false);
  });
});

describe("captureLead adapter selection", () => {
  it("uses MongoDB when MONGODB_URI is set", async () => {
    const toMongo = vi.fn().mockResolvedValue(undefined);
    const toLocalFile = vi.fn().mockResolvedValue(undefined);

    const result = await captureLead(baseLead, { env: mongoEnv, toMongo, toLocalFile });

    expect(toMongo).toHaveBeenCalledOnce();
    expect(toLocalFile).not.toHaveBeenCalled();
    expect(result.adapter).toBe("mongodb");
    expect(result.id).toBeTruthy();
  });

  it("uses the local file when MONGODB_URI is missing", async () => {
    const toMongo = vi.fn().mockResolvedValue(undefined);
    const toLocalFile = vi.fn().mockResolvedValue(undefined);

    const result = await captureLead(baseLead, {
      env: {},
      toMongo,
      toLocalFile,
    });

    expect(toMongo).not.toHaveBeenCalled();
    expect(toLocalFile).toHaveBeenCalledOnce();
    expect(result.adapter).toBe("local-file");
  });

  it("falls back to the local file when MongoDB throws (lead never dropped)", async () => {
    const toMongo = vi.fn().mockRejectedValue(new Error("mongo down"));
    const toLocalFile = vi.fn().mockResolvedValue(undefined);

    const result = await captureLead(baseLead, { env: mongoEnv, toMongo, toLocalFile });

    expect(toMongo).toHaveBeenCalledOnce();
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
