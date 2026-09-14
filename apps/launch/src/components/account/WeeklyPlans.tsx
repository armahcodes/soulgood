import Link from "next/link";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";
import { CancellationHelp } from "./CancellationHelp";
import { formatCents } from "@/lib/brand";
import type { CustomerOrder } from "@/lib/checkout-record";
import { formatCustomerDate, planHasEnded } from "@/lib/customer-experience";

export type CustomerPlan = CustomerOrder & { cancellationPending?: boolean };

export function WeeklyPlans({
  plans,
  email,
}: {
  plans: CustomerPlan[];
  email: string;
}) {
  const sortedPlans = [...plans].sort(
    (a, b) =>
      Number(
        Boolean(a.cancellationScheduledFor) ||
          planHasEnded(a.subscriptionStatus),
      ) -
      Number(
        Boolean(b.cancellationScheduledFor) ||
          planHasEnded(b.subscriptionStatus),
      ),
  );
  return (
    <>
      <div className="max-w-2xl text-center sm:text-left">
        <p className="text-xs font-bold tracking-[0.16em] text-clay uppercase">
          Your weekly nourishment
        </p>
        <h1 className="mt-4 text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
          Your plans. Your choice.
        </h1>
        <p className="mt-4 text-base leading-7 text-forest/75">
          Manage future renewals here. Canceling a plan does not reverse an
          order already charged and committed to preparation.
        </p>
        <p className="mt-3 break-words text-sm text-forest/70">
          Signed in as {email}
        </p>
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
        <div className="min-w-0 space-y-7">
          {sortedPlans.length ? (
            sortedPlans.map((plan) => (
              <article
                key={plan.id}
                className="border border-forest/15 bg-white/50 p-5 sm:p-7"
              >
                <p className="text-xs font-bold tracking-[0.12em] text-forest/65 uppercase">
                  Weekly plan · {plan.id.slice(-8).toUpperCase()}
                </p>
                <h2 className="mt-3 text-3xl">Soul Bowls™</h2>
                <p className="mt-2 text-sm leading-6 text-forest/75">
                  {plan.peopleCount}{" "}
                  {plan.peopleCount === 1 ? "person" : "people"} ·{" "}
                  {plan.mealsPerDay} {plan.mealsPerDay === 1 ? "meal" : "meals"}{" "}
                  per person, per day · 5 days
                </p>
                <dl className="my-5 grid gap-3 border-y border-forest/10 py-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-forest/65">Started</dt>
                    <dd className="mt-1 font-semibold">
                      {formatCustomerDate(plan.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-forest/65">Last quoted weekly total</dt>
                    <dd className="mt-1 font-semibold">
                      {formatCents(plan.totalCents)}
                    </dd>
                  </div>
                </dl>
                <CancelSubscriptionButton
                  subscriptionId={plan.id}
                  subscriptionStatus={plan.subscriptionStatus || plan.status}
                  cancellationScheduledFor={plan.cancellationScheduledFor}
                  cancellationPending={plan.cancellationPending}
                />
              </article>
            ))
          ) : (
            <section className="border border-forest/15 bg-white/50 p-6 sm:p-8">
              <h2 className="text-3xl">
                No weekly plans found for this email.
              </h2>
              <p className="mt-4 text-sm leading-6 text-forest/75">
                A one-time purchase does not renew, so there is nothing to
                cancel. If you expected a weekly plan, check that you signed in
                with the email used at checkout, or contact us below.
              </p>
              <Link
                href="/account"
                className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
              >
                View my orders
              </Link>
            </section>
          )}
          <CancellationHelp />
        </div>
        <aside className="border border-forest/12 bg-sand/25 p-6">
          <h2 className="text-2xl">What to expect</h2>
          <ol className="mt-5 space-y-5 text-sm leading-6 text-forest/75">
            <li>
              <strong className="block text-forest">1. Choose your plan</strong>
              Each weekly plan is managed separately.
            </li>
            <li>
              <strong className="block text-forest">
                2. Confirm cancellation
              </strong>
              No phone call or reason required.
            </li>
            <li>
              <strong className="block text-forest">3. Check the result</strong>
              A saved request is still pending until the plan’s end date is
              confirmed. We’ll also email confirmation.
            </li>
          </ol>
          <p className="mt-6 border-t border-forest/12 pt-4 text-sm leading-6 text-forest/75">
            For an order already paid,{" "}
            <Link
              href="/account"
              className="font-semibold underline underline-offset-4"
            >
              open your order history
            </Link>{" "}
            to find its receipt and get help.
          </p>
        </aside>
      </div>
    </>
  );
}
