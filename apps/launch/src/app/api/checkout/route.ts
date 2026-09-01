import { after, NextResponse } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { timing } from "hono/timing";
import { z } from "zod";
import {
  bowlSelectionDraftSchema,
  bowlSelectionSchemaForPlan,
  MAX_BOWLS_PER_ORDER,
  MAX_MEALS_PER_DAY,
  MAX_MEAL_SETS_PER_ORDER,
  MAX_PEOPLE_PER_ORDER,
  mealSetCount,
  selectionSourceName,
} from "@/lib/bowl-selection";
import {
  BRAND_NAME,
  LEGAL_VERSION,
  type FulfillmentMethod,
} from "@/lib/brand";
import {
  persistCheckoutRecord,
  updateCheckoutConfirmationEmail,
} from "@/lib/checkout-record";
import { sendOrderConfirmationEmail } from "@/lib/email";
import {
  addressToSquare,
  createItemizedSquareOrder,
  getTaxQuote,
  SquareApiError,
  squareRequest,
  type CheckoutAddress,
} from "@/lib/square";
import { getSquareCatalogConfig } from "@/lib/square-catalog";
import { verifyTaxQuoteToken } from "@/lib/tax-quote-token";

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
    bowlSelection: bowlSelectionDraftSchema,
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
    mealsPerDay: z.number().int().min(1).max(MAX_MEALS_PER_DAY).default(1),
    peopleCount: z.number().int().min(1).max(MAX_PEOPLE_PER_ORDER).default(1),
    purchaseType: z.enum(["one-time", "weekly"]),
    sourceId: z.string().min(1).max(16384),
    taxQuoteToken: z.string().max(4096).optional(),
  })
  .superRefine((value, context) => {
    if (value.fulfillmentMethod === "delivery" && !value.deliveryAddress) {
      context.addIssue({
        code: "custom",
        path: ["deliveryAddress"],
        message: "Delivery address is required",
      });
    }
    if (
      mealSetCount(value.peopleCount, value.mealsPerDay) >
      MAX_MEAL_SETS_PER_ORDER
    ) {
      context.addIssue({
        code: "custom",
        path: ["peopleCount"],
        message: `This online order supports up to ${MAX_BOWLS_PER_ORDER} bowls`,
      });
    }
    const selection = bowlSelectionSchemaForPlan(
      value.peopleCount,
      value.mealsPerDay,
    ).safeParse(value.bowlSelection);
    if (!selection.success) {
      for (const issue of selection.error.issues) {
        context.addIssue({
          code: "custom",
          path: ["bowlSelection", ...issue.path],
          message: issue.message,
        });
      }
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

function formatDeliveryAddress(address: CheckoutAddress | null): string | undefined {
  if (!address) return undefined;
  return [
    address.addressLine1,
    address.addressLine2,
    `${address.city}, CA ${address.postalCode}`,
  ]
    .filter(Boolean)
    .join(", ");
}

function scheduleOrderConfirmation(
  input: Parameters<typeof sendOrderConfirmationEmail>[0],
): void {
  if (!process.env.RESEND_API_KEY) return;
  after(async () => {
    try {
      const resendEmailId = await sendOrderConfirmationEmail(input);
      await updateCheckoutConfirmationEmail(input.squareObjectId, {
        status: "sent",
        resendEmailId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email error";
      console.error("[checkout] Order completed but confirmation email failed", {
        squareObjectId: input.squareObjectId,
        error: message,
      });
      await updateCheckoutConfirmationEmail(input.squareObjectId, {
        status: "failed",
        error: message,
      }).catch(() => undefined);
    }
  });
}

async function findOrCreateCustomer(input: {
  customerAddress: CheckoutAddress;
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
    address: addressToSquare(input.customerAddress),
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
async function handleCheckout(request: Request) {
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
  const catalog = getSquareCatalogConfig();
  if (
    !process.env.SQUARE_ACCESS_TOKEN ||
    !locationId ||
    !catalog
  ) {
    return NextResponse.json(
      { disabled: true, reason: "square-unconfigured" },
      { status: 503 },
    );
  }

  let cardId: string | null = null;
  let squareOrderId: string | null = null;
  try {
    const mealSets = mealSetCount(input.peopleCount, input.mealsPerDay);
    const quote =
      (input.taxQuoteToken
        ? verifyTaxQuoteToken(
            input.taxQuoteToken,
            input.fulfillmentMethod as FulfillmentMethod,
            input.deliveryAddress,
            input.peopleCount,
            input.mealsPerDay,
          )
        : null) ??
      (await getTaxQuote(
        input.fulfillmentMethod as FulfillmentMethod,
        input.deliveryAddress,
        mealSets,
      ));
    const customer = await findOrCreateCustomer({
      customerAddress: input.deliveryAddress ?? input.billingAddress,
      email: input.contact.email.toLowerCase(),
      familyName: input.contact.familyName,
      givenName: input.contact.givenName,
      idempotencyKey: input.idempotencyKey,
      leadId: input.leadId,
      phone,
    });

    const acceptedAt = new Date().toISOString();
    const itemizedOrder = await createItemizedSquareOrder({
      bowlSelection: input.bowlSelection,
      catalog,
      contact: { ...input.contact, phone },
      customerId: customer.id,
      deliveryAddress: input.deliveryAddress,
      fulfillmentMethod: input.fulfillmentMethod,
      idempotencyKey: key(input.idempotencyKey, "order", 128),
      leadId: input.leadId,
      locationId,
      mealsPerDay: input.mealsPerDay,
      peopleCount: input.peopleCount,
      purchaseType: input.purchaseType,
      quote,
      state: input.purchaseType === "weekly" ? "DRAFT" : "OPEN",
    });
    squareOrderId = itemizedOrder.id;

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
          order_id: itemizedOrder.id,
          reference_id: input.leadId.slice(0, 40),
          buyer_email_address: input.contact.email.toLowerCase(),
          buyer_phone_number: phone,
          billing_address: addressToSquare(input.billingAddress),
          ...(input.fulfillmentMethod === "delivery" && input.deliveryAddress
            ? { shipping_address: addressToSquare(input.deliveryAddress) }
            : {}),
          note: selectionSourceName(
            input.bowlSelection,
            input.peopleCount,
            input.mealsPerDay,
          ),
        }),
      });
      const payment = paymentResponse.payment;
      if (!payment?.id) throw new Error("Square did not return a payment");
      const customerName = `${input.contact.givenName} ${input.contact.familyName}`;
      const customerEmail = input.contact.email.toLowerCase();
      const orderStatus = payment.status ?? "COMPLETED";

      let checkoutRecorded = false;
      try {
        checkoutRecorded = await persistCheckoutRecord({
          squareObjectId: payment.id,
          squareObjectType: "payment",
          squareCustomerId: customer.id,
          squareOrderId: itemizedOrder.id,
          customerEmail,
          customerName,
          leadId: input.leadId,
          purchaseType: input.purchaseType,
          fulfillmentMethod: input.fulfillmentMethod,
          deliveryAddress: input.deliveryAddress ?? undefined,
          bowlSelection: input.bowlSelection,
          mealsPerDay: input.mealsPerDay,
          peopleCount: input.peopleCount,
          subtotalCents: quote.subtotalCents,
          taxCents: quote.taxCents,
          totalCents: quote.totalCents,
          orderStatus,
          receiptUrl: payment.receipt_url,
          acceptedAt,
          legalVersion: LEGAL_VERSION,
        });
      } catch (recordError) {
        console.error("[checkout] Payment completed but internal record failed", {
          paymentId: payment.id,
          orderId: itemizedOrder.id,
          error: recordError instanceof Error ? recordError.message : "unknown",
        });
      }

      scheduleOrderConfirmation({
        bowlSelection: input.bowlSelection,
        customerEmail,
        customerName,
        deliveryAddress: formatDeliveryAddress(input.deliveryAddress),
        fulfillmentMethod: input.fulfillmentMethod,
        mealsPerDay: input.mealsPerDay,
        peopleCount: input.peopleCount,
        purchaseType: input.purchaseType,
        receiptUrl: payment.receipt_url,
        squareObjectId: payment.id,
        subtotalCents: quote.subtotalCents,
        taxCents: quote.taxCents,
        totalCents: quote.totalCents,
      });

      return NextResponse.json(
        {
          ok: true,
          purchaseType: input.purchaseType,
          status: payment.status,
          paymentId: payment.id,
          orderId: itemizedOrder.id,
          receiptUrl: payment.receipt_url,
          acceptedAt,
          legalVersion: LEGAL_VERSION,
          fulfillmentMethod: input.fulfillmentMethod,
          mealsPerDay: input.mealsPerDay,
          peopleCount: input.peopleCount,
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
        plan_variation_id: catalog.weeklyPlanVariationId,
        customer_id: customer.id,
        card_id: cardId,
        phases: [{ ordinal: 0, order_template_id: itemizedOrder.id }],
        timezone: "America/Los_Angeles",
        source: {
          name: selectionSourceName(
            input.bowlSelection,
            input.peopleCount,
            input.mealsPerDay,
          ),
        },
      }),
    });
    const subscription = subscriptionResponse.subscription;
    if (!subscription?.id) throw new Error("Square did not return a subscription");
    const customerName = `${input.contact.givenName} ${input.contact.familyName}`;
    const customerEmail = input.contact.email.toLowerCase();
    const orderStatus = subscription.status ?? "ACTIVE";

    let checkoutRecorded = false;
    try {
      checkoutRecorded = await persistCheckoutRecord({
        squareObjectId: subscription.id,
        squareObjectType: "subscription",
        squareCustomerId: customer.id,
        squareOrderId: itemizedOrder.id,
        customerEmail,
        customerName,
        leadId: input.leadId,
        purchaseType: input.purchaseType,
        fulfillmentMethod: input.fulfillmentMethod,
        deliveryAddress: input.deliveryAddress ?? undefined,
        bowlSelection: input.bowlSelection,
        mealsPerDay: input.mealsPerDay,
        peopleCount: input.peopleCount,
        subtotalCents: quote.subtotalCents,
        taxCents: quote.taxCents,
        totalCents: quote.totalCents,
        orderStatus,
        acceptedAt,
        legalVersion: LEGAL_VERSION,
      });
    } catch (recordError) {
      console.error("[checkout] Subscription created but internal record failed", {
        subscriptionId: subscription.id,
        orderTemplateId: itemizedOrder.id,
        error: recordError instanceof Error ? recordError.message : "unknown",
      });
    }

    scheduleOrderConfirmation({
      bowlSelection: input.bowlSelection,
      customerEmail,
      customerName,
      deliveryAddress: formatDeliveryAddress(input.deliveryAddress),
      fulfillmentMethod: input.fulfillmentMethod,
      mealsPerDay: input.mealsPerDay,
      peopleCount: input.peopleCount,
      purchaseType: input.purchaseType,
      squareObjectId: subscription.id,
      subtotalCents: quote.subtotalCents,
      taxCents: quote.taxCents,
      totalCents: quote.totalCents,
    });

    return NextResponse.json(
      {
        ok: true,
        purchaseType: input.purchaseType,
        status: subscription.status,
        subscriptionId: subscription.id,
        orderTemplateId: itemizedOrder.id,
        acceptedAt,
        legalVersion: LEGAL_VERSION,
        fulfillmentMethod: input.fulfillmentMethod,
        mealsPerDay: input.mealsPerDay,
        peopleCount: input.peopleCount,
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
      squareOrderId,
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

const checkoutApp = new Hono().basePath("/api");
checkoutApp.use("*", timing());
checkoutApp.post("/checkout", (context) => handleCheckout(context.req.raw));

export const POST = handle(checkoutApp);
