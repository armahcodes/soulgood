import { after } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { drainEmailOutbox } from "@/lib/email-outbox";
import { submitPrivacyRequest } from "@/lib/privacy-requests";
import { privacyRequestSchema } from "@/lib/privacy-shared";
import { allowPrivacyRequest } from "@/lib/request-limit";

export const runtime = "nodejs";
const app = new Hono({ strict: false }).basePath("/api/privacy-requests");
app.use("*", async (context, next) => {
  context.header("Cache-Control", "no-store");
  const origin = context.req.header("origin");
  if (origin && origin !== new URL(context.req.url).origin) return context.json({ error: "Invalid request origin." }, 403);
  await next();
});
app.use("*", bodyLimit({ maxSize: 8 * 1024, onError: (context) => context.json({ error: "Please shorten your request." }, 413) }));
app.onError((_error, context) => {
  console.error("[privacy] Request temporarily unavailable");
  return context.json({ error: "We couldn’t save your request. Please try again or email contact@soulgood.com." }, 503);
});
app.post("/", async (context) => {
  if (!context.req.header("content-type")?.toLowerCase().startsWith("application/json"))
    return context.json({ error: "Expected a JSON request." }, 415);
  const parsed = privacyRequestSchema.safeParse(await context.req.json().catch(() => null));
  if (!parsed.success) return context.json({ error: parsed.error.issues[0]?.message || "Please check your request." }, 400);
  if (!(await allowPrivacyRequest(context.req.raw)))
    return context.json({ error: "Too many requests from this connection. Please try again later or email us." }, 429);
  const { reference } = await submitPrivacyRequest(parsed.data);
  after(async () => {
    await drainEmailOutbox(2).catch(() => console.error("[privacy] Emails queued for retry"));
  });
  return context.json({ received: true, reference }, 202);
});
export const POST = handle(app);
