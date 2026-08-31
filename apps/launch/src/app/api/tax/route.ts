import { NextResponse } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { timing } from "hono/timing";
import { z } from "zod";
import { getTaxQuote } from "@/lib/square";
import { createTaxQuoteToken } from "@/lib/tax-quote-token";

export const runtime = "nodejs";

const addressSchema = z.object({
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: z.string().trim().max(200).default(""),
  city: z.string().trim().min(2).max(100),
  state: z.literal("CA"),
  postalCode: z.string().trim().regex(/^\d{5}$/),
});

const requestSchema = z.discriminatedUnion("fulfillmentMethod", [
  z.object({ fulfillmentMethod: z.literal("pickup"), deliveryAddress: z.null() }),
  z.object({
    fulfillmentMethod: z.literal("delivery"),
    deliveryAddress: addressSchema,
  }),
]);

async function handleTaxQuote(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a complete California address." }, { status: 400 });
  }

  try {
    const quote = await getTaxQuote(
      parsed.data.fulfillmentMethod,
      parsed.data.deliveryAddress,
    );
    const quoteToken = createTaxQuoteToken(
      quote,
      parsed.data.fulfillmentMethod,
      parsed.data.deliveryAddress,
    );
    return NextResponse.json({ ...quote, quoteToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tax could not be calculated." },
      { status: 422 },
    );
  }
}

const taxApp = new Hono().basePath("/api");
taxApp.use("*", timing());
taxApp.post("/tax", (context) => handleTaxQuote(context.req.raw));

export const POST = handle(taxApp);
