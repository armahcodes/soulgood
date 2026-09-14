import { headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import { CustomerShell } from "@/components/account/CustomerShell";
import { AccountUnavailable } from "@/components/account/AccountUnavailable";
import { CancellationHelp } from "@/components/account/CancellationHelp";
import {
  WeeklyPlans,
  type CustomerPlan,
} from "@/components/account/WeeklyPlans";
import { Button } from "@/components/ui/Button";
import { getAuth } from "@/lib/auth";
import { BRAND_NAME } from "@/lib/brand";
import { listCheckoutRecordsForEmail } from "@/lib/checkout-record";
import { cancellationJobs } from "@/lib/subscription-cancellation";

export const metadata = {
  title: `Manage weekly plans — ${BRAND_NAME}`,
  description:
    "View your weekly plans and cancel future Soul Bowls™ renewals online.",
};

export const dynamic = "force-dynamic";

export default async function CancelPage() {
  const requestHeaders = await headers();
  let session;
  try {
    session = getSessionCookie(requestHeaders, { cookiePrefix: "soul-good" })
      ? await getAuth().api.getSession({ headers: requestHeaders })
      : null;
  } catch {
    return (
      <CustomerShell active="plans">
        <AccountUnavailable plans />
      </CustomerShell>
    );
  }
  if (!session)
    return (
      <CustomerShell active="plans">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.16em] text-clay uppercase">
              Weekly plan management
            </p>
            <h1 className="mt-4 text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
              Your plans. Your choice.
            </h1>
            <p className="mt-4 text-base leading-7 text-forest/75">
              View your weekly plan or cancel future renewals online. We’ll show
              you the status and send confirmation when cancellation is
              confirmed.
            </p>
          </div>
          <section className="my-8 border border-forest/15 bg-white/50 p-6 sm:p-8">
            <h2 className="text-3xl">Find your weekly plan</h2>
            <p className="mt-3 text-sm leading-6 text-forest/75">
              Use the email you entered at checkout. We’ll send a secure sign-in
              code—no password, phone call, or cancellation reason needed.
            </p>
            <Button
              as="a"
              href="/login?redirect=%2Fcancel"
              className="mt-6 w-full"
            >
              Sign in to manage my plan
            </Button>
            <p className="mt-4 text-xs leading-5 text-forest/70">
              One-time orders do not renew. Canceling a weekly plan does not
              reverse an order already charged and committed to preparation.
            </p>
          </section>
          <CancellationHelp />
        </div>
      </CustomerShell>
    );

  let plans: CustomerPlan[];
  try {
    const records = await listCheckoutRecordsForEmail(session.user.email, {
      subscriptionsOnly: true,
    });
    const jobs = records.length
      ? await cancellationJobs()
          .find({
            _id: { $in: records.map((record) => record.id) },
            customerEmail: session.user.email.trim().toLowerCase(),
          })
          .toArray()
      : [];
    const jobsById = new Map(jobs.map((job) => [job._id, job]));
    plans = records.map((record) => {
      const job = jobsById.get(record.id);
      return {
        ...record,
        cancellationScheduledFor:
          record.cancellationScheduledFor || job?.effectiveDate,
        cancellationPending: job?.state === "pending",
      };
    });
  } catch {
    return (
      <CustomerShell active="plans" signedIn>
        <AccountUnavailable plans />
      </CustomerShell>
    );
  }
  return (
    <CustomerShell active="plans" signedIn>
      <WeeklyPlans plans={plans} email={session.user.email} />
    </CustomerShell>
  );
}
