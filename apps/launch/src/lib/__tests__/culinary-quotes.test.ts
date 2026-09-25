import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  balancedCulinarySelection,
  type CulinaryInput,
  type CulinaryRequest,
} from "../culinary-booking";
import {
  createCulinaryQuote,
  requestCulinaryBooking,
  queueCulinaryEmails,
  queuePendingCulinaryEmails,
  type CulinaryQuoteRecord,
  type CulinaryQuoteStore,
} from "../culinary-quotes";
import { withSoldOut } from "./sold-out";

const mocks = vi.hoisted(() => ({
  enqueue: vi.fn(),
  update: vi.fn(),
  rows: new Map<string, CulinaryQuoteRecord>(),
}));
vi.mock("../email-outbox", () => ({ enqueueEmail: mocks.enqueue }));
vi.mock("../square", () => ({
  lookupCaliforniaTax: vi.fn(() => {
    throw new Error("Live lookup not allowed in unit tests");
  }),
}));
vi.mock("../db/mongodb", () => ({
  getMongoDatabase: () => ({
    db: {
      collection: () => ({
        updateOne: mocks.update,
        find: () => ({
          sort: () => ({
            limit: () => ({
              toArray: async () =>
                [...mocks.rows.values()].filter(
                  (row) =>
                    row.status === "requested" && !row.notificationsQueued,
                ),
            }),
          }),
        }),
      }),
    },
  }),
}));
const input: CulinaryInput = {
  experience: "plated",
  guestCount: 10,
  bowlSelection: balancedCulinarySelection(10),
  eventDate: "2026-10-10",
  eventTime: "13:00",
  occasion: "Team lunch",
  address: {
    addressLine1: "123 Test Street",
    addressLine2: "",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90012",
  },
};
const tax = vi.fn(async () => ({
  rate: 0.0975,
  county: "LOS ANGELES",
  jurisdiction: "Los Angeles",
}));
const store: CulinaryQuoteStore = {
  insert: async (record) => {
    mocks.rows.set(record.id, structuredClone(record));
  },
  get: async (id) => structuredClone(mocks.rows.get(id) ?? null),
  request: async (id, request, requestHash) => {
    const record = mocks.rows.get(id)!;
    if (
      record.status === "estimate" &&
      Date.parse(record.expiresAt) > Date.now()
    ) {
      Object.assign(record, {
        status: "requested",
        request,
        requestHash,
        requestedAt: new Date(),
        notificationsQueued: false,
      });
      delete record.purgeAfter;
    }
  },
};
function request(quoteId: string): CulinaryRequest {
  return {
    quoteId,
    contact: {
      name: "Test Guest",
      email: "test@example.com",
      phone: "2135550100",
    },
    notes: "Sesame allergy",
    company: "Test Company",
    acceptedEstimate: true,
  };
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-08T18:00:00Z"));
  vi.clearAllMocks();
  mocks.rows.clear();
  mocks.enqueue.mockResolvedValue(undefined);
  mocks.update.mockResolvedValue({ modifiedCount: 1 });
  tax.mockResolvedValue({
    rate: 0.0975,
    county: "LOS ANGELES",
    jurisdiction: "Los Angeles",
  });
});
afterEach(() => vi.useRealTimers());

describe("server-priced culinary quotes", () => {
  it("persists a whole-group food style without inventing recipe allocations", async () => {
    const quote = await createCulinaryQuote(
      {
        ...input,
        platedMenu: "plant-forward",
        bowlSelection: balancedCulinarySelection(0),
      },
      { store, tax },
    );
    expect(quote.input.platedMenu).toBe("plant-forward");
    expect(quote.bowlCount).toBe(10);
    expect(quote.items[0]).toMatchObject({
      kind: "plated",
      quantity: 10,
      label: "Plated menu — Plant-forward",
    });
    expect(quote.totalCents).toBe(116761);
    const saved = await requestCulinaryBooking(request(quote.id), store);
    expect(saved.input.platedMenu).toBe("plant-forward");
    expect(saved.input.bowlSelection).toEqual(balancedCulinarySelection(0));
  });
  it("requires a fresh quote when an unsubmitted estimate uses historical pricing", async () => {
    const quote = await createCulinaryQuote(input, { store, tax });
    delete mocks.rows.get(quote.id)!.pricingVersion;
    await expect(
      requestCulinaryBooking(request(quote.id), store),
    ).rejects.toMatchObject({ status: 409, expired: true });
    expect(mocks.rows.get(quote.id)!.status).toBe("estimate");
  });
  it("persists a plated quote with $500 support above the $555 food minimum and address tax", async () => {
    const quote = await createCulinaryQuote(input, { store, tax });
    expect(quote).toMatchObject({
      subtotalCents: 106388,
      taxCents: 10373,
      totalCents: 116761,
      pricingVersion: 2,
      paymentSchedule: {
        depositCents: 58381,
        balanceCents: 58380,
        balanceDueDate: "2026-10-10",
      },
      taxPercentage: "9.75",
      bowlCount: 10,
    });
    expect(mocks.rows.get(quote.id)?.status).toBe("estimate");
    expect(Date.parse(quote.expiresAt) - Date.parse(quote.createdAt)).toBe(
      30 * 60 * 1000,
    );
    expect(tax).toHaveBeenCalledWith(input.address);
  });
  it("calculates the independent delivery-only minimum without plated fees", async () => {
    const quote = await createCulinaryQuote(
      { ...input, experience: "delivery" },
      { store, tax },
    );
    expect(quote).toMatchObject({
      subtotalCents: 18488,
      taxCents: 1803,
      totalCents: 20291,
    });
  });
  it("rejects non-LA addresses without saving an estimate", async () => {
    tax.mockResolvedValue({
      rate: 0.0775,
      county: "ORANGE",
      jurisdiction: "Irvine",
    });
    await expect(createCulinaryQuote(input, { store, tax })).rejects.toThrow(
      "Los Angeles County",
    );
    expect(mocks.rows.size).toBe(0);
  });
  it.each([NaN, Infinity, 0, -0.05, 0.2])(
    "fails closed on invalid tax rate %s",
    async (rate) => {
      tax.mockResolvedValue({
        rate,
        county: "LOS ANGELES",
        jurisdiction: "Los Angeles",
      });
      await expect(createCulinaryQuote(input, { store, tax })).rejects.toThrow(
        "verify the tax rate",
      );
      expect(mocks.rows.size).toBe(0);
    },
  );
  it("does not return an estimate when lookup or persistence fails", async () => {
    tax.mockRejectedValueOnce(new Error("Tax offline"));
    await expect(createCulinaryQuote(input, { store, tax })).rejects.toThrow(
      "Tax offline",
    );
    await expect(
      createCulinaryQuote(input, {
        store: {
          ...store,
          insert: async () => {
            throw new Error("DB offline");
          },
        },
        tax,
      }),
    ).rejects.toThrow("DB offline");
  });
});

describe("durable booking requests", () => {
  it("saves before acknowledgement, retains requested quotes, and deduplicates identical late retries", async () => {
    const quote = await createCulinaryQuote(input, { store, tax });
    const saved = await requestCulinaryBooking(request(quote.id), store);
    expect(saved.status).toBe("requested");
    expect(saved.purgeAfter).toBeUndefined();
    expect(saved.request?.notes).toBe("Sesame allergy");
    vi.setSystemTime(Date.now() + 60 * 60 * 1000);
    expect(await requestCulinaryBooking(request(quote.id), store)).toEqual(
      saved,
    );
    expect(mocks.rows.size).toBe(1);
  });
  it("rejects a missing or expired quote", async () => {
    await expect(
      requestCulinaryBooking(
        request("fa0066bc-1ba4-4ed2-97a0-154076135c23"),
        store,
      ),
    ).rejects.toMatchObject({ status: 404, expired: true });
    const quote = await createCulinaryQuote(input, { store, tax });
    vi.setSystemTime(Date.now() + 30 * 60 * 1000);
    await expect(
      requestCulinaryBooking(request(quote.id), store),
    ).rejects.toMatchObject({ status: 409, expired: true });
    expect(mocks.rows.get(quote.id)?.status).toBe("estimate");
  });
  it("does not overwrite a submitted request with a different contact", async () => {
    const quote = await createCulinaryQuote(input, { store, tax });
    const original = request(quote.id);
    await requestCulinaryBooking(original, store);
    await expect(
      requestCulinaryBooking(
        {
          ...original,
          contact: { ...original.contact, email: "changed@example.com" },
        },
        store,
      ),
    ).rejects.toMatchObject({ status: 409 });
    expect(mocks.rows.get(quote.id)?.request).toEqual(original);
  });
  it("revalidates the saved menu before accepting and rejects lost conditional writes", async () => {
    const quote = await createCulinaryQuote(input, { store, tax });
    await expect(
      requestCulinaryBooking(request(quote.id), {
        ...store,
        request: async () => {},
      }),
    ).rejects.toMatchObject({ status: 409 });
    mocks.rows.get(quote.id)!.input.bowlSelection["herb-chicken-nourish-bowl"] =
      1;
    await withSoldOut("herb-chicken-nourish-bowl", () =>
      expect(
        requestCulinaryBooking(request(quote.id), store),
      ).rejects.toMatchObject({ expired: true }),
    );
  });
  it("queues both recipient notifications using stable IDs before marking completion", async () => {
    const quote = await createCulinaryQuote(input, { store, tax });
    const saved = await requestCulinaryBooking(request(quote.id), store);
    await queueCulinaryEmails(saved);
    expect(
      mocks.enqueue.mock.calls.map((call) => [
        call[0],
        call[1],
        call[2].audience,
      ]),
    ).toEqual([
      [`culinary:${quote.id}:customer`, "culinary", "customer"],
      [`culinary:${quote.id}:team`, "culinary", "team"],
    ]);
    expect(mocks.update).toHaveBeenCalledWith(
      { _id: quote.id, status: "requested" },
      { $set: { notificationsQueued: true } },
    );
  });
  it("leaves failed notifications recoverable by the scheduler", async () => {
    const quote = await createCulinaryQuote(input, { store, tax });
    const saved = await requestCulinaryBooking(request(quote.id), store);
    mocks.enqueue.mockRejectedValueOnce(new Error("Outbox offline"));
    await expect(queueCulinaryEmails(saved)).rejects.toThrow("Outbox offline");
    expect(mocks.update).not.toHaveBeenCalled();
    await queuePendingCulinaryEmails();
    expect(mocks.update).toHaveBeenCalledOnce();
  });
});
