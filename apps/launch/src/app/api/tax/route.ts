import { NextResponse } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { timing } from "hono/timing";
import { z } from "zod";
import {
  MAX_BOWLS_PER_ORDER,
  MAX_MEALS_PER_DAY,
  MAX_MEAL_SETS_PER_ORDER,
  MAX_PEOPLE_PER_ORDER,
  mealSetCount,
} from "@/lib/bowl-selection";
import { getTaxQuote } from "@/lib/square";
import { createTaxQuoteToken, TAX_QUOTE_TTL_MS } from "@/lib/tax-quote-token";

export const runtime = "nodejs";

const addressSchema = z.object({
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: z.string().trim().max(200).default(""),
  city: z.string().trim().min(2).max(100),
  state: z.literal("CA"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/),
});

const orderSizeShape = {
  peopleCount: z.number().int().min(1).max(MAX_PEOPLE_PER_ORDER).default(1),
  mealsPerDay: z.number().int().min(1).max(MAX_MEALS_PER_DAY).default(1),
};

const requestSchema = z
  .discriminatedUnion("fulfillmentMethod", [
    z.object({
      fulfillmentMethod: z.literal("pickup"),
      deliveryAddress: z.null(),
      ...orderSizeShape,
    }),
    z.object({
      fulfillmentMethod: z.literal("delivery"),
      deliveryAddress: addressSchema,
      ...orderSizeShape,
    }),
  ])
  .refine(
    (value) =>
      mealSetCount(value.peopleCount, value.mealsPerDay) <=
      MAX_MEAL_SETS_PER_ORDER,
    {
      message: `This online order supports up to ${MAX_BOWLS_PER_ORDER} bowls.`,
    },
  );

async function handleTaxQuote(request: Request) {
  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a complete California address." },
      { status: 400 },
    );
  }

  try {
    const quote = await getTaxQuote(
      parsed.data.fulfillmentMethod,
      parsed.data.deliveryAddress,
      mealSetCount(parsed.data.peopleCount, parsed.data.mealsPerDay),
    );
    const quoteToken = createTaxQuoteToken(
      quote,
      parsed.data.fulfillmentMethod,
      parsed.data.deliveryAddress,
      parsed.data.peopleCount,
      parsed.data.mealsPerDay,
    );
    if (!quoteToken)
      return NextResponse.json(
        {
          error: "Checkout is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    return NextResponse.json(
      { ...quote, quoteToken, expiresAt: Date.now() + TAX_QUOTE_TTL_MS },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Tax could not be calculated.",
      },
      { status: 422 },
    );
  }
}

const taxApp = new Hono().basePath("/api");
taxApp.use("*", timing());
taxApp.post("/tax", (context) => handleTaxQuote(context.req.raw));

export const POST = handle(taxApp);
