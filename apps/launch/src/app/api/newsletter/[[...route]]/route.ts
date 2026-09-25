import { after } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { drainEmailOutbox } from "@/lib/email-outbox";
import {
  confirmSubscription,
  newsletterSignupSchema,
  newsletterUnsubscribeSchema,
  subscribe,
  unsubscribe,
} from "@/lib/newsletter";
import { allowNewsletterRequest } from "@/lib/request-limit";

export const runtime = "nodejs";
const app = new Hono({ strict: false }).basePath("/api/newsletter");
app.use("*", async (context, next) => {
  context.header("Cache-Control", "no-store");
  const origin = context.req.header("origin");
  // Mail providers send one-click unsubscribes without an Origin header.
  if (origin && origin !== new URL(context.req.url).origin)
    return context.json({ error: "Invalid request origin." }, 403);
  await next();
});
app.use("*", bodyLimit({ maxSize: 4 * 1024, onError: (context) => context.json({ error: "Request too large." }, 413) }));
app.onError((_error, context) => {
  console.error("[newsletter] Request temporarily unavailable");
  return context.json({ error: "We couldn’t update your subscription. Please try again in a moment." }, 503);
});

const drain = () =>
  after(async () => {
    await drainEmailOutbox(2).catch(() => console.error("[newsletter] Email queued for retry"));
  });

app.post("/", async (context) => {
  const parsed = newsletterSignupSchema.safeParse(await context.req.json().catch(() => null));
  if (!parsed.success) return context.json({ error: parsed.error.issues[0]?.message || "Please check your email." }, 400);
  if (!(await allowNewsletterRequest(context.req.raw)))
    return context.json({ error: "Too many requests. Please wait a few minutes and try again." }, 429);
  if (!parsed.data.website) await subscribe(parsed.data);
  drain();
  // Same response whether or not the address was already subscribed.
  return context.json({ received: true }, 202);
});

app.get("/confirm", async (context) => {
  const token = context.req.query("token") ?? "";
  const confirmed = token.length >= 20 && (await confirmSubscription(token));
  if (confirmed) drain();
  return context.redirect(`/newsletter?status=${confirmed ? "confirmed" : "expired"}`, 303);
});

// Link scanners follow GETs, so a GET only shows the confirmation page.
app.get("/unsubscribe", (context) =>
  context.redirect(`/newsletter?unsubscribe=${encodeURIComponent(context.req.query("token") ?? "")}`, 303),
);

app.post("/unsubscribe", async (context) => {
  const queryToken = context.req.query("token");
  const contentType = context.req.header("content-type")?.toLowerCase() ?? "";
  // RFC 8058 one-click: form body "List-Unsubscribe=One-Click" with the token in the URL.
  const body = contentType.startsWith("application/json")
    ? await context.req.json().catch(() => null)
    : queryToken
      ? { token: queryToken }
      : null;
  const parsed = newsletterUnsubscribeSchema.safeParse(body);
  if (!parsed.success) return context.json({ error: "Please enter a valid email." }, 400);
  if (!(await allowNewsletterRequest(context.req.raw)))
    return context.json({ error: "Too many requests. Please wait a few minutes and try again." }, 429);
  await unsubscribe(parsed.data);
  return context.json({ unsubscribed: true }, 200);
});

export const GET = handle(app);
export const POST = handle(app);
