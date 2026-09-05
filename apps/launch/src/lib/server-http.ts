import { timingSafeEqual } from "node:crypto";
import { hasStrongSecret } from "./strong-secret";

export function hasBearer(
  request: Request,
  secret: string | undefined,
): boolean {
  if (!hasStrongSecret(secret)) return false;
  const supplied = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

export async function readLimitedBody(
  request: Request,
  limit = 256 * 1024,
): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new Error("Request body too large");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
