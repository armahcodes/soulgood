import { headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CustomerShell } from "@/components/account/CustomerShell";
import { AccountUnavailable } from "@/components/account/AccountUnavailable";
import { OrderHistory } from "@/components/account/OrderHistory";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/kit/empty-state";
import { getAuth } from "@/lib/auth";
import { BRAND_NAME, CONTACT } from "@/lib/brand";
import { listCheckoutRecordsForEmail } from "@/lib/checkout-record";
import { EAT_NOW } from "@/lib/ordering";

export const metadata = {
  title: `My orders — ${BRAND_NAME}`,
  description: "Review your Soul Bowls™ orders and weekly plans.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const requestHeaders = await headers();
  let session;
  try {
    session = getSessionCookie(requestHeaders, { cookiePrefix: "soul-good" })
      ? await getAuth().api.getSession({ headers: requestHeaders })
      : null;
  } catch {
    return (
      <CustomerShell active="orders">
        <AccountUnavailable />
      </CustomerShell>
    );
  }
  if (!session) redirect("/login?redirect=/account");
  let records;
  try {
    records = await listCheckoutRecordsForEmail(session.user.email);
  } catch {
    return (
      <CustomerShell active="orders" signedIn>
        <AccountUnavailable />
      </CustomerShell>
    );
  }
  const orders = records.filter(
    (order) => order.squareObjectType !== "subscription",
  );
  return (
    <CustomerShell active="orders" signedIn>
      <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:items-end sm:text-left">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-clay uppercase">
            Welcome to your table
          </p>
          <h1 className="mt-4 text-4xl tracking-[0.01em] sm:text-5xl">
            My orders
          </h1>
          <p className="mt-3 break-all text-sm text-forest/70">
            Signed in as {session.user.email}
          </p>
        </div>
        <Button
          as="a"
          href="/checkout"
          variant="secondary"
          className="w-full shrink-0 sm:w-auto"
        >
          Start a new order
        </Button>
      </div>
      <section className="my-8 flex flex-col gap-5 rounded-lg border border-forest/12 bg-sand/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <h2 className="text-2xl">Your weekly plans</h2>
          <p className="mt-2 text-sm leading-6 text-forest/75">
            View plans, cancel future renewals, or check a cancellation request.
          </p>
        </div>
        <Button as="a" href="/cancel" className="w-full shrink-0 sm:w-auto">
          Manage weekly plans
        </Button>
      </section>
      <section aria-labelledby="order-history">
        <div className="mb-5">
          <h2 id="order-history" className="text-3xl">
            Order history
          </h2>
          <p className="mt-2 text-sm leading-6 text-forest/75">
            Your latest orders and receipts. Weekly plan enrollment is shown
            separately under Manage weekly plans.
          </p>
        </div>
        {orders.length ? (
          <OrderHistory orders={orders} email={session.user.email} />
        ) : (
          <EmptyState
            headingLevel={3}
            title="No order receipts here yet."
            description={
              <p>
                Orders appear when the checkout email matches this verified email.
                If you just enrolled in weekly nourishment, check your plan above;
                its invoice may still be processing. For an older or missing
                order, contact us using the help below.
              </p>
            }
            action={
              <Button as="a" href="/checkout">
                Build your ritual
              </Button>
            }
          />
        )}
      </section>
      <aside className="mt-10 rounded-lg border border-forest/12 bg-card/70 p-6 sm:p-8">
        <h2 className="text-2xl">Looking for a Take Out order?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-forest/75">
          Single orders from our Take Out menu have their own Square
          confirmations and do not appear here.{" "}
          <Link
            href={`${EAT_NOW.infoPath}#order-help`}
            className="font-semibold underline underline-offset-4"
          >
            Find help with a Take Out order
          </Link>
          .
        </p>
        <p className="mt-3 text-sm leading-6 text-forest/75">
          Need help with a missing weekly nourishment order?{" "}
          <a
            href={`mailto:${CONTACT.email}`}
            className="font-semibold underline underline-offset-4"
          >
            Contact our team
          </a>
          .
        </p>
      </aside>
    </CustomerShell>
  );
}
