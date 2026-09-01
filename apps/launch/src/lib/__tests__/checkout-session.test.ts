import { describe, expect, it } from "vitest";
import { DEFAULT_BOWL_SELECTION } from "../bowl-selection";
import {
  parseLastOrderConfirmation,
  type LastOrderConfirmation,
} from "../checkout-session";

const confirmation: LastOrderConfirmation = {
  version: 1,
  purchaseType: "one-time",
  status: "COMPLETED",
  squareObjectId: "payment-123",
  squareOrderId: "order-123",
  receiptUrl: "https://square.test/receipt/payment-123",
  acceptedAt: "2026-09-01T18:00:00.000Z",
  fulfillmentMethod: "pickup",
  peopleCount: 1,
  mealsPerDay: 1,
  bowlSelection: DEFAULT_BOWL_SELECTION,
  subtotalCents: 8800,
  taxCents: 836,
  totalCents: 9636,
};

describe("checkout session confirmation", () => {
  it("parses a complete Square checkout confirmation", () => {
    expect(parseLastOrderConfirmation(JSON.stringify(confirmation))).toEqual(
      confirmation,
    );
  });

  it("rejects missing Square references and malformed amounts", () => {
    expect(
      parseLastOrderConfirmation(
        JSON.stringify({ ...confirmation, squareObjectId: "" }),
      ),
    ).toBeNull();
    expect(
      parseLastOrderConfirmation(
        JSON.stringify({ ...confirmation, totalCents: -1 }),
      ),
    ).toBeNull();
  });

  it("rejects a confirmation whose bowl mix does not match its order size", () => {
    expect(
      parseLastOrderConfirmation(
        JSON.stringify({ ...confirmation, peopleCount: 2 }),
      ),
    ).toBeNull();
  });
});
