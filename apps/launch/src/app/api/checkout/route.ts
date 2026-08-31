import { NextResponse } from "next/server";
import { z } from "zod";
import { bowlSelectionSchema, selectionSourceName } from "@/lib/bowl-selection";
import {
  BRAND_NAME,
  LEGAL_VERSION,
  type FulfillmentMethod,
} from "@/lib/brand";
import { persistCheckoutRecord } from "@/lib/checkout-record";
import {
  addressToSquare,
  getTaxQuote,
  SquareApiError,
  squareRequest,
  type CheckoutAddress,
} from "@/lib/square";

export const runtime = "nodejs";

const addressSchema = z.object({
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: z.string().trim().max(200).default(""),
  city: z.string().trim().min(2).max(100),
  state: z.literal("CA"),
  postalCode: z.string().trim().regex(/^\d{5}$/),
});

const requestSchema = z
  .object({
    acceptedTerms: z.literal(true),
    billingAddress: addressSchema,
    bowlSelection: bowlSelectionSchema,
    contact: z.object({
      givenName: z.string().trim().min(1).max(100),
      familyName: z.string().trim().min(1).max(100),
      email: z.string().trim().email().max(254),
      phone: z.string().trim().min(9).max(30),
    }),
    deliveryAddress: addressSchema.nullable(),
    fulfillmentMethod: z.enum(["pickup", "delivery"]),
    idempotencyKey: z.string().uuid(),
    leadId: z.string().trim().min(1).max(200),
    purchaseType: z.enum(["one-time", "weekly"]),
    sourceId: z.string().min(1).max(16384),
  })
  .superRefine((value, context) => {
    if (value.fulfillmentMethod === "delivery" && !value.deliveryAddress) {
      context.addIssue({
        code: "custom",
        path: ["deliveryAddress"],
        message: "Delivery address is required",
      });
    }
  });

type SquareCustomer = {
  id: string;
  version?: number;
};

function normalizeUsPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function key(base: string, suffix: string, max = 45): string {
  return `${base}-${suffix}`.slice(0, max);
}

async function findOrCreateCustomer(input: {
  billingAddress: CheckoutAddress;
  email: string;
  familyName: string;
  givenName: string;
  idempotencyKey: string;
  leadId: string;
  phone: string;
}): Promise<SquareCustomer> {
  const search = await squareRequest<{ customers?: SquareCustomer[] }>(
    "/v2/customers/search",
    {
      method: "POST",
      body: JSON.stringify({
        limit: 1,
        query: { filter: { email_address: { exact: input.email } } },
      }),
    },
  );
  const existing = search.customers?.[0];
  const customerBody = {
    given_name: input.givenName,
    family_name: input.familyName,
    email_address: input.email,
    phone_number: input.phone,
    address: addressToSquare(input.billingAddress),
  };

  if (existing) {
    const updated = await squareRequest<{ customer?: SquareCustomer }>(
      `/v2/customers/${encodeURIComponent(existing.id)}`,
      {
        method: "PUT",
        body: JSON.stringify({ ...customerBody, version: existing.version }),
      },
    );
    return updated.customer ?? existing;
  }

  const created = await squareRequest<{ customer?: SquareCustomer }>(
    "/v2/customers",
    {
      method: "POST",
      body: JSON.stringify({
        ...customerBody,
        idempotency_key: key(input.idempotencyKey, "customer"),
        reference_id: input.leadId.slice(0, 100),
        note: `${BRAND_NAME} website customer`,
      }),
    },
  );
  if (!created.customer?.id) throw new Error("Square did not return a customer");
  return created.customer;
}

/** Complete a one-time payment or create an immediately billed weekly subscription. */
export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Complete the customer, address, consent, and payment fields." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const phone = normalizeUsPhone(input.contact.phone);
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid US phone number." }, { status: 400 });
  }

  const locationId = process.env.SQUARE_LOCATION_ID;
  const planVariationId =
    input.fulfillmentMethod === "delivery"
      ? process.env.SQUARE_DELIVERY_PLAN_VARIATION_ID
      : process.env.SQUARE_PICKUP_PLAN_VARIATION_ID;
  if (
    !process.env.SQUARE_ACCESS_TOKEN ||
    !locationId ||
    (input.purchaseType === "weekly" && !planVariationId)
  ) {
    return NextResponse.json(
      { disabled: true, reason: "square-unconfigured" },
      { status: 503 },
    );
  }

  let cardId: string | null = null;
  try {
    const quote = await getTaxQuote(
      input.fulfillmentMethod as FulfillmentMethod,
      input.deliveryAddress,
    );
    const customer = await findOrCreateCustomer({
      billingAddress: input.billingAddress,
      email: input.contact.email.toLowerCase(),
      familyName: input.contact.familyName,
      givenName: input.contact.givenName,
      idempotencyKey: input.idempotencyKey,
      leadId: input.leadId,
      phone,
    });

    const acceptedAt = new Date().toISOString();

    if (input.purchaseType === "one-time") {
      const paymentResponse = await squareRequest<{
        payment?: { id?: string; status?: string; receipt_url?: string };
      }>("/v2/payments", {
        method: "POST",
        body: JSON.stringify({
          idempotency_key: key(input.idempotencyKey, "payment"),
          source_id: input.sourceId,
          amount_money: { amount: quote.totalCents, currency: "USD" },
          autocomplete: true,
          customer_id: customer.id,
          location_id: locationId,
          reference_id: input.leadId.slice(0, 40),
          note: selectionSourceName(input.bowlSelection),
        }),
      });
      const payment = paymentResponse.payment;
      if (!payment?.id) throw new Error("Square did not return a payment");

      let checkoutRecorded = false;
      try {
        checkoutRecorded = await persistCheckoutRecord({
          squareObjectId: payment.id,
          squareObjectType: "payment",
          squareCustomerId: customer.id,
          leadId: input.leadId,
          purchaseType: input.purchaseType,
          fulfillmentMethod: input.fulfillmentMethod,
          bowlSelection: input.bowlSelection,
          subtotalCents: quote.subtotalCents,
          taxCents: quote.taxCents,
          totalCents: quote.totalCents,
          acceptedAt,
          legalVersion: LEGAL_VERSION,
        });
      } catch (recordError) {
        console.error("[checkout] Payment completed but internal record failed", {
          paymentId: payment.id,
          error: recordError instanceof Error ? recordError.message : "unknown",
        });
      }

      return NextResponse.json(
        {
          ok: true,
          purchaseType: input.purchaseType,
          status: payment.status,
          paymentId: payment.id,
          receiptUrl: payment.receipt_url,
          acceptedAt,
          legalVersion: LEGAL_VERSION,
          fulfillmentMethod: input.fulfillmentMethod,
          bowlSelection: input.bowlSelection,
          checkoutRecorded,
          tax: quote,
        },
        { status: 200 },
      );
    }

    const cardResponse = await squareRequest<{ card?: { id?: string } }>("/v2/cards", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: key(input.idempotencyKey, "card"),
        source_id: input.sourceId,
        card: {
          customer_id: customer.id,
          cardholder_name: `${input.contact.givenName} ${input.contact.familyName}`,
          billing_address: addressToSquare(input.billingAddress),
        },
      }),
    });
    cardId = cardResponse.card?.id ?? null;
    if (!cardId) throw new Error("Square did not return a saved card");

    const subscriptionResponse = await squareRequest<{
      subscription?: { id?: string; status?: string };
    }>("/v2/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: key(input.idempotencyKey, "subscription", 128),
        location_id: locationId,
        plan_variation_id: planVariationId,
        customer_id: customer.id,
        card_id: cardId,
        tax_percentage: quote.percentage,
        timezone: "America/Los_Angeles",
        source: { name: selectionSourceName(input.bowlSelection) },
      }),
    });
    const subscription = subscriptionResponse.subscription;
    if (!subscription?.id) throw new Error("Square did not return a subscription");

    let checkoutRecorded = false;
    try {
      checkoutRecorded = await persistCheckoutRecord({
        squareObjectId: subscription.id,
        squareObjectType: "subscription",
        squareCustomerId: customer.id,
        leadId: input.leadId,
        purchaseType: input.purchaseType,
        fulfillmentMethod: input.fulfillmentMethod,
        bowlSelection: input.bowlSelection,
        subtotalCents: quote.subtotalCents,
        taxCents: quote.taxCents,
        totalCents: quote.totalCents,
        acceptedAt,
        legalVersion: LEGAL_VERSION,
      });
    } catch (recordError) {
      console.error("[checkout] Subscription created but internal record failed", {
        subscriptionId: subscription.id,
        error: recordError instanceof Error ? recordError.message : "unknown",
      });
    }

    return NextResponse.json(
      {
        ok: true,
        purchaseType: input.purchaseType,
        status: subscription.status,
        subscriptionId: subscription.id,
        acceptedAt,
        legalVersion: LEGAL_VERSION,
        fulfillmentMethod: input.fulfillmentMethod,
        bowlSelection: input.bowlSelection,
        checkoutRecorded,
        tax: quote,
      },
      { status: 200 },
    );
  } catch (error) {
    if (cardId) {
      await squareRequest(`/v2/cards/${encodeURIComponent(cardId)}/disable`, {
        method: "POST",
      }).catch(() => undefined);
    }
    const codes = error instanceof SquareApiError ? error.codes : [];
    console.error("[checkout] Square checkout failed", {
      codes,
      purchaseType: input.purchaseType,
    });
    return NextResponse.json(
      {
        error: codes.includes("CARD_DECLINED")
          ? "The card was declined. Try another card or contact your bank."
          : input.purchaseType === "weekly"
            ? "Square could not start the weekly plan. No subscription was created."
            : "Square could not complete this order. No payment was completed.",
      },
      { status: error instanceof SquareApiError && error.status < 500 ? 422 : 502 },
    );
  }
}
