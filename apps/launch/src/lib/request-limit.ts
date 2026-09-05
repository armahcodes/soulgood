import { createHash } from "node:crypto";
import { getMongoDatabase } from "./db/mongodb";

export async function allowCheckoutRequest(request: Request): Promise<boolean> {
  return allowRequest(request, "checkout", 600_000, 30);
}

export async function allowCheckoutStatusRequest(
  request: Request,
): Promise<boolean> {
  return allowRequest(request, "checkout-status", 60_000, 120);
}

async function allowRequest(
  request: Request,
  scope: string,
  windowMs: number,
  limit: number,
): Promise<boolean> {
  const ip = (request.headers.get("x-forwarded-for") || "local")
    .split(",")[0]
    .trim();
  const bucket = Math.floor(Date.now() / windowMs);
  const key = createHash("sha256")
    .update(`${scope}:${bucket}:${ip}`)
    .digest("hex");
  const record = await getMongoDatabase()
    .db.collection<{ _id: string; count: number; expiresAt: Date }>(
      "request_limits",
    )
    .findOneAndUpdate(
      { _id: key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) },
      },
      { upsert: true, returnDocument: "after" },
    );
  return (record?.count || 0) <= limit;
}
