import { NextResponse } from "next/server";
import { z } from "zod";
import { leadSchema } from "@/lib/lead-schema";
import { captureLead } from "@/lib/capture";

export const runtime = "nodejs";

/**
 * POST /api/lead — the capture endpoint.
 *
 * - Invalid body → 400 with field errors, NO persistence.
 * - Valid body → captureLead() → 200 { ok: true, id }.
 * - A downstream (MongoDB) failure still returns 200 via the local-file fallback;
 *   a lead is never dropped.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { _root: ["Invalid JSON body"] } },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const { id } = await captureLead(parsed.data);
  return NextResponse.json({ ok: true, id }, { status: 200 });
}
