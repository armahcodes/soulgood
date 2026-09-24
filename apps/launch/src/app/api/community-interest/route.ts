import { after } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { communityInterestSchema } from "@/lib/community-drive";
import { captureCommunityInterest } from "@/lib/community-interest";
import { allowCommunityRequest } from "@/lib/request-limit";
import { drainEmailOutbox } from "@/lib/email-outbox";

export const runtime = "nodejs";
const app = new Hono({ strict: false }).basePath("/api/community-interest");
app.use("*", async (context, next) => {
  context.header("Cache-Control", "no-store");
  const origin = context.req.header("origin");
  if (origin && origin !== new URL(context.req.url).origin)
    return context.json({ error: "Invalid request origin." }, 403);
  await next();
});
app.use(
  "*",
  bodyLimit({
    maxSize: 8 * 1024,
    onError: (context) =>
      context.json(
        { error: "Please shorten your message and try again." },
        413,
      ),
  }),
);
app.onError((_error, context) => {
  console.error("[community] Interest capture temporarily unavailable");
  return context.json(
    {
      error:
        "We couldn’t complete your request. Please try again or email our team below.",
    },
    503,
  );
});
app.post("/", async (context) => {
  if (
    !context.req
      .header("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return context.json({ error: "Expected a JSON request." }, 415);
  const parsed = communityInterestSchema.safeParse(
    await context.req.json().catch(() => null),
  );
  if (!parsed.success)
    return context.json(
      {
        error: parsed.error.issues[0]?.message || "Please check your details.",
      },
      400,
    );
  if (!(await allowCommunityRequest(context.req.raw)))
    return context.json(
      {
        error:
          "Too many requests. Please wait a few minutes before trying again.",
      },
      429,
    );
  await captureCommunityInterest(parsed.data);
  after(async () => {
    await drainEmailOutbox(2).catch(() =>
      console.error("[community] Team notification queued for retry"),
    );
  });
  return context.json({ received: true }, 202);
});
export const POST = handle(app);
