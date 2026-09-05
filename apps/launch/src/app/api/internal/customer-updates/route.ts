import { after, NextResponse } from "next/server";
import { z } from "zod";
import { hasBearer, readLimitedBody } from "@/lib/server-http";
import { CheckoutRecordModel } from "@/lib/db/checkout-record-model";
import { connectToDatabase } from "@/lib/db/mongoose";
import { drainEmailOutbox, enqueueEmail } from "@/lib/email-outbox";

const schema = z.object({
  orderId: z.string().min(1).max(200),
  caseId: z.string().min(1).max(100),
  updateId: z.string().uuid(),
  update: z.string().trim().min(10).max(2000),
});
export const runtime = "nodejs";

/** Server-to-server customer-care integration; never expose the operations secret to browsers. */
export async function POST(request: Request) {
  if (!hasBearer(request, process.env.OPERATIONS_SECRET))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(JSON.parse(await readLimitedBody(request, 8192)));
  } catch {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  try {
    await connectToDatabase();
    const record = await CheckoutRecordModel.findOne({
      squareObjectId: input.orderId,
    }).lean();
    if (!record)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    await enqueueEmail(
      `exchange:${input.caseId}:${input.updateId}`,
      "exchange",
      {
        ...input,
        customerEmail: record.customerEmail,
        customerName: record.customerName,
      },
    );
    after(async () => {
      await drainEmailOutbox(1).catch(() => undefined);
    });
    return NextResponse.json({ queued: true }, { status: 202 });
  } catch {
    return NextResponse.json(
      { error: "Update could not be saved" },
      { status: 503 },
    );
  }
}
