import { checkoutInputSchema } from "../checkout-input";
import { createTaxQuoteToken } from "../tax-quote-token";
import type { AttemptStore, CheckoutAttempt } from "../checkout-attempt";

export const address = {
  addressLine1: "123 Test Street",
  addressLine2: "",
  city: "Los Angeles",
  state: "CA" as const,
  postalCode: "90012",
};
export const selection = {
  "glow-bowl": 1,
  "golden-harvest-bowl": 1,
  "jerk-wellness-bowl": 1,
  "performance-power-bowl": 1,
  "herb-chicken-nourish-bowl": 0,
  "anti-inflammatory-bowl": 1,
};
export const quote = {
  subtotalCents: 9688,
  taxCents: 945,
  totalCents: 10633,
  percentage: "9.75",
  jurisdiction: "LOS ANGELES",
  county: "LOS ANGELES" as const,
};

export function configureCheckout() {
  process.env.CHECKOUT_QUOTE_SECRET =
    "test-only-quote-secret-32-characters-long";
  process.env.SQUARE_ACCESS_TOKEN = "test-only-square-token";
  process.env.SQUARE_LOCATION_ID = "test-location";
  for (const name of [
    "GLOW_BOWL",
    "GOLDEN_HARVEST_BOWL",
    "JERK_WELLNESS_BOWL",
    "PERFORMANCE_POWER_BOWL",
    "HERB_CHICKEN_BOWL",
    "ANTI_INFLAMMATORY_BOWL",
    "SOUL_BOWLS_DELIVERY",
    "WEEKLY_ITEMIZED_PLAN",
  ])
    process.env[`SQUARE_${name}_VARIATION_ID`] = `test-${name}`;
}

export function rawCheckout(overrides: Record<string, unknown> = {}) {
  return {
    acceptedTerms: true,
    billingAddress: address,
    billingName: { givenName: "Avery", familyName: "Jones" },
    bowlSelection: selection,
    contact: {
      givenName: "Avery",
      familyName: "Jones",
      email: "avery@example.com",
      phone: "3105550100",
    },
    deliveryAddress: address,
    fulfillmentMethod: "delivery",
    idempotencyKey: "f6ac292b-72dc-4b7c-9b3b-d38ee1848c40",
    leadId: "test-lead",
    peopleCount: 1,
    mealsPerDay: 1,
    purchaseType: "one-time",
    paymentMethod: "card",
    sourceId: "test-payment-source",
    taxQuoteToken: createTaxQuoteToken(quote, "delivery", address, 1, 1),
    expectedTotalCents: quote.totalCents,
    ...overrides,
  };
}
export function checkoutInput(overrides: Record<string, unknown> = {}) {
  return checkoutInputSchema.parse(rawCheckout(overrides));
}

export function memoryAttempts(): AttemptStore & {
  rows: Map<string, CheckoutAttempt>;
} {
  const rows = new Map<string, CheckoutAttempt>();
  return {
    rows,
    async get(id) {
      return rows.has(id) ? structuredClone(rows.get(id)!) : null;
    },
    async insert(attempt) {
      if (!rows.has(attempt._id))
        rows.set(attempt._id, structuredClone(attempt));
    },
    async claim(id) {
      const row = rows.get(id);
      if (
        !row ||
        !["pending", "processing"].includes(row.state) ||
        row.leaseUntil.getTime() > Date.now() ||
        row.nextAttemptAt.getTime() > Date.now()
      )
        return null;
      row.state = "processing";
      row.leaseUntil = new Date(Date.now() + 120_000);
      row.tries++;
      return structuredClone(row);
    },
    async patch(id, patch, clearSource) {
      Object.assign(rows.get(id)!, structuredClone(patch));
      if (clearSource) delete rows.get(id)!.encryptedSource;
    },
  };
}
