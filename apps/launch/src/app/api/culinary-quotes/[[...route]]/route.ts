import { after } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import {
  culinaryInputSchema,
  culinaryRequestSchema,
} from "@/lib/culinary-booking";
import {
  createCulinaryQuote,
  CulinaryQuoteError,
  queueCulinaryEmails,
  requestCulinaryBooking,
} from "@/lib/culinary-quotes";
import { allowCulinaryRequest } from "@/lib/request-limit";
import { drainEmailOutbox } from "@/lib/email-outbox";
import {
  processCulinaryInvoice,
  notifyReadyCulinaryInvoices,
} from "@/lib/culinary-invoices";

export const runtime = "nodejs";
export const maxDuration = 60;
const app = new Hono({ strict: false }).basePath("/api/culinary-quotes");
app.use("*", async (context, next) => {
  context.header("Cache-Control", "no-store");
  const origin = context.req.header("origin");
  if (origin && origin !== new URL(context.req.url).origin)
    return context.json({ error: "Invalid request origin" }, 403);
  await next();
});
app.use(
  "*",
  bodyLimit({
    maxSize: 16 * 1024,
    onError: (context) => context.json({ error: "Request too large" }, 413),
  }),
);
app.onError((error, context) => {
  if (error instanceof CulinaryQuoteError)
    return context.json(
      { error: error.message, expired: error.expired },
      error.status as 404 | 409 | 422,
    );
  console.error("[culinary] Quote service temporarily unavailable");
  return context.json(
    {
      error:
        "We could not complete this request. Please try again shortly or contact us. No payment has been taken.",
    },
    503,
  );
});
app.post("/", async (context) => {
  const parsed = culinaryInputSchema.safeParse(
    await context.req.json().catch(() => null),
  );
  if (!parsed.success)
    return context.json(
      { error: parsed.error.issues[0]?.message || "Check your event details" },
      400,
    );
  if (!(await allowCulinaryRequest(context.req.raw)))
    return context.json(
      { error: "Too many requests. Please try again in a few minutes." },
      429,
    );
  return context.json({ quote: await createCulinaryQuote(parsed.data) }, 201);
});
app.post("/request", async (context) => {
  const parsed = culinaryRequestSchema.safeParse(
    await context.req.json().catch(() => null),
  );
  if (!parsed.success)
    return context.json(
      {
        error: parsed.error.issues[0]?.message || "Check your contact details",
      },
      400,
    );
  if (!(await allowCulinaryRequest(context.req.raw)))
    return context.json(
      { error: "Too many requests. Please try again in a few minutes." },
      429,
    );
  const record = await requestCulinaryBooking(parsed.data);
  // The request is durable before acknowledgement. Failed notification enqueues
  // are retried by the existing scheduler; email failure never loses a booking request.
  after(async () => {
    await queueCulinaryEmails(record)
      .then(() => drainEmailOutbox(2))
      .catch(() =>
        console.error("[culinary] Booking notifications queued for recovery"),
      );
    await processCulinaryInvoice(record.id)
      .then(() => notifyReadyCulinaryInvoices(3))
      .then(() => drainEmailOutbox(3))
      .catch(() =>
        console.error("[culinary] Invoice draft queued for recovery"),
      );
  });
  return context.json(
    {
      received: true,
      reference: record.reference,
      message:
        "Request received. Our team will confirm availability and event details. This is not a confirmed booking and no payment has been taken.",
    },
    202,
  );
});
export const POST = handle(app);
