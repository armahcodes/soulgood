import { NextResponse } from "next/server";
import { z } from "zod";
import { allowCheckoutStatusRequest } from "@/lib/request-limit";
import { readLimitedBody } from "@/lib/server-http";
import {
  attemptResponse,
  processCheckoutAttempt,
} from "@/lib/checkout-attempt";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const noStore = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403, headers: noStore },
    );
  let raw: string;
  try {
    raw = await readLimitedBody(request, 4096);
  } catch {
    return NextResponse.json(
      { error: "Request body too large" },
      { status: 413, headers: noStore },
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Invalid checkout reference" },
      { status: 400, headers: noStore },
    );
  }
  // The unpredictable UUID is a bearer recovery capability; never include it in URLs.
  const body = z.object({ attemptId: z.string().uuid() }).safeParse(parsed);
  if (!body.success)
    return NextResponse.json(
      { error: "Invalid checkout reference" },
      { status: 400, headers: noStore },
    );
  try {
    if (!(await allowCheckoutStatusRequest(request)))
      return NextResponse.json(
        {
          pending: true,
          message:
            "Please wait a minute before checking again. Do not submit another payment.",
        },
        { status: 429, headers: { ...noStore, "Retry-After": "60" } },
      );
    const result = attemptResponse(
      await processCheckoutAttempt(body.data.attemptId),
    );
    return NextResponse.json(result.body, {
      status: result.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        pending: true,
        message:
          "Purchase verification is temporarily unavailable. Keep this page and try checking again.",
      },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  }
}
