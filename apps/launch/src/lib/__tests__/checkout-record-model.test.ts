import { describe, expect, it } from "vitest";
import { CheckoutRecordModel } from "../db/checkout-record-model";
import { address, selection, quote } from "./checkout-fixtures";

describe("checkout persistence schema", () => {
  it.each(["payment", "subscription", "invoice"])(
    "validates %s records without dropping the bowl mix",
    async (squareObjectType) => {
      const record = new CheckoutRecordModel({
        squareObjectId: "test-id",
        squareObjectType,
        squareOrderId: "test-order",
        squareCustomerId: "test-customer",
        customerEmail: "test@example.com",
        customerName: "Test Customer",
        leadId: "test-attempt",
        purchaseType: squareObjectType === "payment" ? "one-time" : "weekly",
        fulfillmentMethod: "delivery",
        peopleCount: 1,
        mealsPerDay: 1,
        deliveryAddress: address,
        bowlSelection: selection,
        subtotalCents: quote.subtotalCents,
        taxCents: quote.taxCents,
        totalCents: quote.totalCents,
        orderStatus: "PENDING_PAYMENT",
        acceptedAt: new Date(),
        legalVersion: "test",
        confirmationEmail: { status: "pending", updatedAt: new Date() },
      });
      await expect(record.validate()).resolves.toBeUndefined();
      expect(JSON.parse(JSON.stringify(record)).bowlSelection).toMatchObject(
        selection,
      );
    },
  );
});
