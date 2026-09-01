import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CancelSubscriptionButton } from "@/components/account/CancelSubscriptionButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import { auth } from "@/lib/auth";
import { BRAND_NAME, formatCents } from "@/lib/brand";
import { listCheckoutRecordsForEmail } from "@/lib/checkout-record";
import { CURRENT_BOWLS } from "@/lib/current-offer";

export const metadata = {
  title: `My orders — ${BRAND_NAME}`,
  description: "Review your Soul Bowls™ orders and weekly plans.",
};

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account");

  const orders = await listCheckoutRecordsForEmail(session.user.email);

  return (
    <>
      <main className="min-h-screen bg-oat">
        <header className="border-b border-forest/12">
          <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-5 px-5 sm:px-8">
            <Wordmark href="/" />
            <SignOutButton />
          </div>
        </header>

        <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-5 border-b border-forest/12 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">Customer account</p>
              <h1 className="mt-4 text-5xl leading-none font-normal tracking-[-0.05em] text-forest sm:text-6xl">My orders</h1>
              <p className="mt-4 text-sm text-forest/58">Signed in as {session.user.email}</p>
            </div>
            <Button as="a" href="/join" variant="secondary">Order another five</Button>
          </div>

          {orders.length === 0 ? (
            <div className="my-12 border border-forest/12 bg-white/42 p-8 text-center sm:p-12">
              <h2 className="text-3xl font-normal text-forest">No orders found yet.</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-forest/60">
                Orders appear here when the email used at checkout matches this
                verified account email. Older orders placed before accounts launched
                may need customer-care assistance to link.
              </p>
              <Button as="a" href="/join" className="mt-7">Choose my five</Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-6">
              {orders.map((order) => {
                const selectedBowls = CURRENT_BOWLS.filter(
                  (bowl) => order.bowlSelection[bowl.id] > 0,
                );
                return (
                  <article key={order.id} className="border border-forest/14 bg-white/42 p-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-5 border-b border-forest/10 pb-6 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-xs font-bold tracking-[0.14em] text-clay uppercase">
                          {order.type === "weekly" ? "Weekly plan" : "One-time order"}
                        </p>
                        <h2 className="mt-2 text-3xl font-normal text-forest">
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "long",
                            timeZone: "America/Los_Angeles",
                          }).format(new Date(order.createdAt))}
                        </h2>
                        <p className="mt-2 text-xs text-forest/48">Order {order.id.slice(-8).toUpperCase()}</p>
                        <p className="mt-3 text-sm font-semibold text-forest/65">
                          {order.peopleCount} {order.peopleCount === 1 ? "person" : "people"}
                          {" · "}{order.mealsPerDay} {order.mealsPerDay === 1 ? "meal" : "meals"} per person, per day
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="inline-flex bg-sage/14 px-3 py-2 text-xs font-bold tracking-[0.1em] text-forest uppercase">
                          {order.status}
                        </span>
                        <p className="mt-3 font-serif text-3xl text-forest">{formatCents(order.totalCents)}</p>
                      </div>
                    </div>

                    <div className="grid gap-7 pt-6 md:grid-cols-[1.1fr_0.9fr]">
                      <div>
                        <p className="text-xs font-bold tracking-[0.12em] text-forest/55 uppercase">Bowl mix</p>
                        <ul className="mt-4 grid gap-2 text-sm text-forest/68 sm:grid-cols-2">
                          {selectedBowls.map((bowl) => (
                            <li key={bowl.id} className="flex justify-between gap-3 border-b border-forest/8 pb-2">
                              <span>{bowl.name}</span>
                              <strong className="text-forest">× {order.bowlSelection[bowl.id]}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <dl className="grid content-start gap-3 text-sm text-forest/62">
                        <div className="flex justify-between gap-4">
                          <dt>Fulfillment</dt>
                          <dd className="max-w-[70%] text-right font-semibold text-forest">
                            {order.fulfillmentMethod === "delivery"
                              ? "LA County delivery"
                              : "Pickup"}
                            {order.deliveryAddress ? (
                              <span className="mt-1 block text-xs font-normal leading-relaxed text-forest/52">
                                {order.deliveryAddress.addressLine1}
                                {order.deliveryAddress.addressLine2
                                  ? `, ${order.deliveryAddress.addressLine2}`
                                  : ""}
                                <br />
                                {order.deliveryAddress.city}, CA {order.deliveryAddress.postalCode}
                              </span>
                            ) : null}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{formatCents(order.subtotalCents)}</dd></div>
                        <div className="flex justify-between gap-4"><dt>Sales tax</dt><dd>{formatCents(order.taxCents)}</dd></div>
                        {order.receiptUrl ? (
                          <div className="pt-2 text-right">
                            <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-clay underline underline-offset-4">Square receipt</a>
                          </div>
                        ) : null}
                        {order.type === "weekly" ? (
                          <div className="pt-3 text-right">
                            <CancelSubscriptionButton
                              cancellationScheduledFor={order.cancellationScheduledFor}
                              subscriptionId={order.id}
                            />
                          </div>
                        ) : null}
                      </dl>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
