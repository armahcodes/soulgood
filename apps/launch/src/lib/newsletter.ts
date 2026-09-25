import { createHash, randomBytes } from "node:crypto";
import { Resend } from "resend";
import { getMongoDatabase } from "./db/mongodb";
import { enqueueEmail } from "./email-outbox";
import { NEWSLETTER_CONSENT, type NewsletterSignup } from "./newsletter-shared";

export { NEWSLETTER_CONSENT, newsletterSignupSchema, newsletterUnsubscribeSchema, type NewsletterSignup } from "./newsletter-shared";

/**
 * The Soul Good newsletter. Double opt-in: a signup stores a pending subscriber
 * and emails a confirmation link; only confirmed subscribers are synced to
 * Resend (optionally into RESEND_NEWSLETTER_SEGMENT_ID) for broadcasts. Every
 * email carries a one-click unsubscribe link, and unsubscribing is honored in
 * both places. Responses never reveal whether an address is already subscribed.
 */

export type NewsletterSubscriber = {
  _id: string;
  email: string;
  status: "pending" | "subscribed" | "unsubscribed";
  source: NewsletterSignup["source"];
  consentText: string;
  consentAt: Date;
  confirmTokenHash?: string;
  confirmExpiresAt?: Date;
  /** Every unsubscribe link we've sent stays valid. */
  unsubscribeTokenHashes: string[];
  confirmedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const CONFIRM_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const NEWSLETTER_URL = "https://www.soulgood.kitchen";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const token = () => randomBytes(32).toString("base64url");
export const subscriberId = (email: string) => hash(`newsletter:${email.trim().toLowerCase()}`);

function subscribers() {
  return getMongoDatabase().db.collection<NewsletterSubscriber>("newsletter_subscribers");
}

export function confirmUrl(rawToken: string): string {
  return `${NEWSLETTER_URL}/api/newsletter/confirm?token=${encodeURIComponent(rawToken)}`;
}

export function unsubscribeUrl(rawToken: string): string {
  return `${NEWSLETTER_URL}/newsletter?unsubscribe=${encodeURIComponent(rawToken)}`;
}

/**
 * Start (or restart) double opt-in. Already-confirmed subscribers are left as is
 * and receive nothing, so the response can't be used to test addresses.
 */
export async function subscribe(input: NewsletterSignup, now = new Date()): Promise<void> {
  const _id = subscriberId(input.email);
  const existing = await subscribers().findOne({ _id });
  if (existing?.status === "subscribed") return;

  const confirmToken = token();
  const unsubscribeToken = token();
  await subscribers().updateOne(
    { _id },
    {
      $set: {
        email: input.email,
        status: "pending",
        source: input.source,
        consentText: NEWSLETTER_CONSENT,
        consentAt: now,
        confirmTokenHash: hash(confirmToken),
        confirmExpiresAt: new Date(now.getTime() + CONFIRM_TTL_MS),
        updatedAt: now,
      },
      $addToSet: { unsubscribeTokenHashes: hash(unsubscribeToken) },
      $setOnInsert: { createdAt: now },
      $unset: { unsubscribedAt: "" },
    },
    { upsert: true },
  );
  await enqueueEmail(`newsletter-confirm:${_id}:${hash(confirmToken).slice(0, 16)}`, "newsletterConfirm", {
    email: input.email,
    confirmUrl: confirmUrl(confirmToken),
    unsubscribeUrl: unsubscribeUrl(unsubscribeToken),
  });
}

/** Confirm a pending subscription. Returns false for unknown or expired links. */
export async function confirmSubscription(rawToken: string, now = new Date()): Promise<boolean> {
  const unsubscribeToken = token();
  const subscriber = await subscribers().findOneAndUpdate(
    { confirmTokenHash: hash(rawToken), confirmExpiresAt: { $gt: now }, status: "pending" },
    {
      $set: { status: "subscribed", confirmedAt: now, updatedAt: now },
      $addToSet: { unsubscribeTokenHashes: hash(unsubscribeToken) },
      $unset: { confirmTokenHash: "", confirmExpiresAt: "" },
    },
    { returnDocument: "after" },
  );
  if (!subscriber) return false;
  await syncResendContact(subscriber.email, true);
  await enqueueEmail(`newsletter-welcome:${subscriber._id}:${now.toISOString().slice(0, 10)}`, "newsletterWelcome", {
    email: subscriber.email,
    unsubscribeUrl: unsubscribeUrl(unsubscribeToken),
  });
  return true;
}

/**
 * Unsubscribe by the link in any newsletter email, or by email address from the
 * Privacy Choices page. Always succeeds from the caller's point of view.
 */
export async function unsubscribe(input: { token: string } | { email: string }, now = new Date()): Promise<void> {
  const filter = "token" in input ? { unsubscribeTokenHashes: hash(input.token) } : { _id: subscriberId(input.email) };
  const subscriber = await subscribers().findOneAndUpdate(
    filter,
    { $set: { status: "unsubscribed", unsubscribedAt: now, updatedAt: now }, $unset: { confirmTokenHash: "", confirmExpiresAt: "" } },
    { returnDocument: "after" },
  );
  const email = subscriber?.email ?? ("email" in input ? input.email : undefined);
  if (email) await syncResendContact(email, false);
}

/** Mirror a subscriber's status into Resend Contacts (no-op without an API key). */
export async function syncResendContact(email: string, subscribed: boolean): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  if (!subscribed) {
    const { error } = await resend.contacts.update({ email, unsubscribed: true });
    // A contact that was never synced has nothing to unsubscribe.
    if (error && !/not.?found/i.test(error.message)) throw new Error(`Resend unsubscribe failed: ${error.message}`);
    return;
  }
  const created = await resend.contacts.create({ email, unsubscribed: false, ...(segmentId ? { segments: [{ id: segmentId }] } : {}) });
  if (!created.error) return;
  const updated = await resend.contacts.update({ email, unsubscribed: false });
  if (updated.error) throw new Error(`Resend subscribe failed: ${updated.error.message}`);
  if (segmentId) await resend.contacts.segments.add({ email, segmentId });
}
