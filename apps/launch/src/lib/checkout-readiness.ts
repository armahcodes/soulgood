import { hasStrongSecret } from "./strong-secret";

/** Do not accept new live charges without the services required to recover them. */
export function checkoutOperationsReady(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (env.SQUARE_ENVIRONMENT !== "production") return true;
  if (
    !env.MONGODB_URI ||
    !env.RESEND_API_KEY ||
    !env.SQUARE_WEBHOOK_SIGNATURE_KEY
  )
    return false;
  if (
    !hasStrongSecret(env.BETTER_AUTH_SECRET) ||
    !hasStrongSecret(env.CHECKOUT_QUOTE_SECRET) ||
    !hasStrongSecret(
      env.CHECKOUT_ENCRYPTION_SECRET || env.CHECKOUT_QUOTE_SECRET,
    ) ||
    !hasStrongSecret(env.CRON_SECRET)
  )
    return false;
  try {
    const url = new URL(env.SQUARE_WEBHOOK_NOTIFICATION_URL || "");
    return (
      url.protocol === "https:" &&
      url.pathname === "/api/webhooks/square" &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}
