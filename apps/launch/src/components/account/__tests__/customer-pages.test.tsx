import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CancelPage from "@/app/cancel/page";
import AccountPage from "@/app/account/page";
import type { CustomerOrder } from "@/lib/checkout-record";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  list: vi.fn(),
  jobs: vi.fn(),
  find: vi.fn(),
}));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: "soul-good.session_token=fixture" }) }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
}));
vi.mock("@/lib/auth", () => ({
  getAuth: () => ({ api: { getSession: mocks.session } }),
}));
vi.mock("@/lib/checkout-record", () => ({
  listCheckoutRecordsForEmail: mocks.list,
}));
vi.mock("@/lib/subscription-cancellation", () => ({
  cancellationJobs: () => ({ find: mocks.find }),
}));

const plan: CustomerOrder = {
  id: "test-plan-12345678",
  type: "weekly",
  squareObjectType: "subscription",
  status: "ACTIVE",
  peopleCount: 1,
  mealsPerDay: 1,
  fulfillmentMethod: "delivery",
  bowlSelection: {
    "glow-bowl": 1,
    "golden-harvest-bowl": 1,
    "jerk-wellness-bowl": 1,
    "performance-power-bowl": 1,
    "anti-inflammatory-bowl": 1,
    "herb-chicken-nourish-bowl": 0,
  },
  subtotalCents: 8800,
  fulfillmentFeeCents: 888,
  taxCents: 945,
  totalCents: 10633,
  createdAt: "2026-09-12T15:00:00Z",
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ user: { email: "test@example.com" } });
  mocks.list.mockResolvedValue([plan]);
  mocks.jobs.mockResolvedValue([]);
  mocks.find.mockReturnValue({ toArray: mocks.jobs });
});

describe("customer account journey", () => {
  it("offers online management to guests with a cancellation-specific sign-in destination", async () => {
    mocks.session.mockResolvedValue(null);
    const html = renderToStaticMarkup(await CancelPage());
    expect(html).toContain("/login?redirect=%2Fcancel");
    expect(html).toContain("Sign in to manage my plan");
    expect(html).toContain("Email a cancellation request");
    expect(mocks.list).not.toHaveBeenCalled();
  });
  it("loads plans separately from the capped receipt history", async () => {
    const html = renderToStaticMarkup(await CancelPage());
    expect(mocks.list).toHaveBeenCalledWith("test@example.com", {
      subscriptionsOnly: true,
    });
    expect(mocks.find).toHaveBeenCalledWith({
      _id: { $in: [plan.id] },
      customerEmail: "test@example.com",
    });
    expect(html).toContain("Cancel future renewals");
  });
  it("restores a saved pending request after leaving the page", async () => {
    mocks.jobs.mockResolvedValue([{ _id: plan.id, state: "pending" }]);
    const html = renderToStaticMarkup(await CancelPage());
    expect(html).toContain("Request received");
    expect(html).toContain("not confirmed canceled yet");
    expect(html).not.toContain(">Cancel future renewals<");
  });
  it("restores a provider-confirmed date even when later synchronization remains pending", async () => {
    mocks.jobs.mockResolvedValue([
      { _id: plan.id, state: "pending", effectiveDate: "2026-09-20" },
    ]);
    const html = renderToStaticMarkup(await CancelPage());
    expect(html).toContain("Cancellation confirmed");
    expect(html).toContain("September 20, 2026");
    expect(html).not.toContain("Request received");
  });
  it("does not misrepresent a loading failure as no weekly plans", async () => {
    mocks.list.mockRejectedValue(new Error("offline"));
    const html = renderToStaticMarkup(await CancelPage());
    expect(html).toContain("We couldn’t load your");
    expect(html).toContain("Try again");
    expect(html).not.toContain("No weekly plans found");
  });
  it("explains one-time orders in the plan empty state", async () => {
    mocks.list.mockResolvedValue([]);
    const html = renderToStaticMarkup(await CancelPage());
    expect(html).toContain("A one-time purchase does not renew");
    expect(mocks.find).not.toHaveBeenCalled();
  });
  it("separates subscription enrollment from paid receipts and keeps fee details", async () => {
    mocks.list.mockResolvedValue([
      plan,
      {
        ...plan,
        id: "test-receipt",
        squareObjectType: "invoice",
        status: "PAID",
      },
    ]);
    const html = renderToStaticMarkup(await AccountPage());
    expect(html).toContain("Manage weekly plans");
    expect(html).toContain("<details");
    expect(html).toContain("$8.88");
    expect(html).toContain("Paid");
    expect(html).not.toContain(">Cancel future renewals<");
    expect(html).not.toContain("test-plan-12345678");
  });
});
