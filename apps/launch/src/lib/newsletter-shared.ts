import { z } from "zod";

/** Newsletter pieces safe for client components (no database or crypto). */

export const NEWSLETTER_CONSENT =
  "Send me the Soul Good newsletter: new menus, community drives, and kitchen news. I can unsubscribe anytime.";

export const NEWSLETTER_SOURCES = ["footer", "quiz", "food-for-the-soul", "privacy-choices", "newsletter-page"] as const;

export const newsletterSignupSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email.").max(254)),
  source: z.enum(NEWSLETTER_SOURCES).default("footer"),
  consent: z.literal(true, { error: "Please confirm you’d like the newsletter." }),
  /** Honeypot: real people leave it empty. */
  website: z.string().max(0).default(""),
});
export type NewsletterSignup = z.infer<typeof newsletterSignupSchema>;

export const newsletterUnsubscribeSchema = z.union([
  z.object({ token: z.string().min(20).max(200) }),
  z.object({ email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email.").max(254)) }),
]);
