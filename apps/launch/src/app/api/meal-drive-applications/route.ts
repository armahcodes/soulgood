import { after } from "next/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { bodyLimit } from "hono/body-limit";
import { todayInLosAngeles } from "@/lib/culinary-booking";
import { drainEmailOutbox } from "@/lib/email-outbox";
import { mealDriveApplicationSchema } from "@/lib/meal-drive";
import { submitMealDriveApplication } from "@/lib/meal-drive-application";
import { allowMealDriveRequest } from "@/lib/request-limit";

export const runtime = "nodejs";
const app = new Hono({ strict: false }).basePath("/api/meal-drive-applications");
app.use("*", async (context, next) => {
  context.header("Cache-Control", "no-store");
  const origin = context.req.header("origin");
  if (origin && origin !== new URL(context.req.url).origin) return context.json({ error: "Invalid request origin." }, 403);
  await next();
});
app.use("*", bodyLimit({ maxSize: 24 * 1024, onError: (context) => context.json({ error: "Please shorten your answers and try again." }, 413) }));
app.onError((_error, context) => {
  console.error("[meal-drive] Application temporarily unavailable");
  return context.json({ error: "We couldn’t save your application. Your answers are still here—please try again." }, 503);
});
app.post("/", async (context) => {
  if (!context.req.header("content-type")?.toLowerCase().startsWith("application/json"))
    return context.json({ error: "Expected a JSON request." }, 415);
  const today = todayInLosAngeles();
  const parsed = mealDriveApplicationSchema(today).safeParse(await context.req.json().catch(() => null));
  if (!parsed.success)
    return context.json({ error: parsed.error.issues[0]?.message || "Please check your application.", field: String(parsed.error.issues[0]?.path.join(".") ?? "") }, 400);
  if (!(await allowMealDriveRequest(context.req.raw)))
    return context.json({ error: "Too many applications from this connection. Please try again later or email us." }, 429);
  const { reference } = await submitMealDriveApplication(parsed.data, today);
  after(async () => {
    await drainEmailOutbox(3).catch(() => console.error("[meal-drive] Emails queued for retry"));
  });
  return context.json({ received: true, reference }, 202);
});
export const POST = handle(app);
