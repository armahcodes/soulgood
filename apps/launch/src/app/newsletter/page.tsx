import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { UnsubscribePanel } from "@/components/newsletter/UnsubscribePanel";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Newsletter — ${BRAND_NAME}`,
  description: "New menus, Food for the Soul meal drives, and news from the Soul Good kitchen.",
  robots: { index: false },
};

const eyebrow = "text-[0.68rem] font-medium tracking-[0.22em] text-clay uppercase";

export default async function NewsletterPage({ searchParams }: { searchParams: Promise<{ status?: string; unsubscribe?: string }> }) {
  const { status, unsubscribe } = await searchParams;
  const heading =
    unsubscribe !== undefined
      ? "Leave the newsletter?"
      : status === "confirmed"
        ? "You’re subscribed."
        : status === "expired"
          ? "That link has expired."
          : "Good news from our kitchen.";

  return (
    <>
      <SiteHeader current="/newsletter" />
      <main className="bg-oat">
        <section className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
          <p className={eyebrow}>The Soul Good newsletter</p>
          <h1 className="mt-4 text-5xl leading-[1.02] tracking-[0.01em] text-forest sm:text-6xl">{heading}</h1>

          {unsubscribe !== undefined ? (
            <div className="mt-8 grid gap-5">
              <p className="text-base leading-7 text-forest/75">
                Confirm below and we’ll stop sending the newsletter to this address. Emails about orders, plans, and
                bookings you make will still arrive.
              </p>
              <UnsubscribePanel token={unsubscribe.length >= 20 ? unsubscribe : undefined} />
            </div>
          ) : status === "confirmed" ? (
            <p className="mt-6 text-base leading-7 text-forest/75">
              Thanks for confirming. We’ll write when there’s a new menu, a Food for the Soul meal drive, or a note from
              the kitchen. Every email has an unsubscribe link. <Link href="/menu" className="font-semibold underline underline-offset-4">See the menu</Link>.
            </p>
          ) : (
            <div className="mt-6 grid gap-8">
              <p className="text-base leading-7 text-forest/75">
                {status === "expired"
                  ? "Confirmation links last 7 days and work once. Enter your email again and we’ll send a fresh link."
                  : "New menus, community meal drives, and kitchen news, a few times a month at most. We’ll email you a link to confirm first."}
              </p>
              <NewsletterSignup source="newsletter-page" />
              <p className="text-sm leading-6 text-forest/65">
                Already subscribed and want to stop? <Link href="/privacy-choices#email" className="font-semibold underline underline-offset-4">Manage your email choices</Link>.
              </p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
