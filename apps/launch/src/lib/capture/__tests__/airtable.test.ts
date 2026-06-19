import { describe, it, expect, vi, afterEach } from "vitest";
import { sendToAirtable } from "../airtable";
import type { LeadRecord } from "../index";

const record: LeadRecord = {
  id: "rec-local-1",
  email: "a@b.com",
  phone: "3105550134",
  name: "Jane",
  pathway: "alignment",
  intent: "buyer",
  dietary: ["vegan"],
  allergens: ["nuts"],
  foods: ["greens"],
  priorities: ["energy"],
  reflectBody: "rest",
  reflectSoul: "calm",
  capturedAt: "2026-06-17T00:00:00.000Z",
};

const env = {
  AIRTABLE_API_KEY: "key123",
  AIRTABLE_BASE_ID: "baseXYZ",
  AIRTABLE_TABLE_NAME: "Launch Leads",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sendToAirtable", () => {
  it("POSTs to the encoded table URL with Bearer auth and a records payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => "{}" });
    vi.stubGlobal("fetch", fetchMock);

    await sendToAirtable(record, env);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.airtable.com/v0/baseXYZ/Launch%20Leads");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer key123");
    expect(init.headers["Content-Type"]).toBe("application/json");
    const body = JSON.parse(init.body);
    expect(body.records[0].fields.Email).toBe("a@b.com");
    expect(body.records[0].fields.Phone).toBe("3105550134");
    expect(body.records[0].fields.Pathway).toBe("alignment");
  });

  it("throws when Airtable responds non-ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 500, text: async () => "boom" });
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendToAirtable(record, env)).rejects.toThrow();
  });
});
