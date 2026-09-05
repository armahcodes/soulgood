import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { hasStrongSecret } from "./strong-secret";

function encryptionKey(): Buffer {
  const secret =
    process.env.CHECKOUT_ENCRYPTION_SECRET || process.env.CHECKOUT_QUOTE_SECRET;
  if (!hasStrongSecret(secret))
    throw new Error("Checkout encryption is not configured");
  return createHash("sha256")
    .update(`checkout-encryption:v1:${secret}`)
    .digest();
}

/** Encrypt short-lived Square nonces; never persist raw card data or plaintext tokens. */
export function sealPaymentSource(
  value: { sourceId: string; verificationToken?: string },
  attemptId: string,
): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(Buffer.from(attemptId));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), ciphertext]
    .map((part) => part.toString("base64url"))
    .join(".");
}

export function openPaymentSource(
  value: string,
  attemptId: string,
): { sourceId: string; verificationToken?: string } {
  const [iv, tag, ciphertext] = value
    .split(".")
    .map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAAD(Buffer.from(attemptId));
  decipher.setAuthTag(tag);
  return JSON.parse(
    Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      "utf8",
    ),
  );
}
