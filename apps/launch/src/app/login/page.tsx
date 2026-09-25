import { headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import { redirect } from "next/navigation";
import { CustomerShell } from "@/components/account/CustomerShell";
import { CancellationHelp } from "@/components/account/CancellationHelp";
import { LoginForm } from "@/components/auth/LoginForm";
import { getAuth } from "@/lib/auth";
import { safeAccountRedirect } from "@/lib/safe-redirect";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Sign in — ${BRAND_NAME}`,
  description:
    "Securely sign in by email to view your Soul Bowls™ orders and manage weekly plans.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const redirectTo = safeAccountRedirect((await searchParams).redirect);
  const managingPlan = redirectTo.split("?")[0] === "/cancel";
  const requestHeaders = await headers();
  let session;
  // Keep the sign-in form and help reachable if the session lookup is unavailable.
  try {
    session = getSessionCookie(requestHeaders, { cookiePrefix: "soul-good" })
      ? await getAuth().api.getSession({ headers: requestHeaders })
      : null;
  } catch {
    session = null;
  }
  if (session) redirect(redirectTo);
  return (
    <CustomerShell active={managingPlan ? "plans" : "signin"}>
      <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="text-center lg:pt-6 lg:text-left">
          <p className="text-xs font-medium tracking-[0.16em] text-clay-ink uppercase">
            {managingPlan ? "Weekly plan management" : "Welcome back"}
          </p>
          <h1 className="mt-4 text-4xl leading-tight tracking-[0.01em] sm:text-5xl">
            {managingPlan
              ? "Let’s find your weekly plan."
              : "Your orders, in one place."}
          </h1>
          <p className="mt-5 text-base leading-7 text-forest/75">
            {managingPlan
              ? "Sign in to view your plan, cancel future renewals, or check a request you already sent."
              : "Review your receipts, order your favorite mix again, and manage your weekly nourishment."}
          </p>
          <p className="mt-4 text-sm leading-6 text-forest/75">
            Use the email entered at checkout. We’ll send a short-lived code—no
            password to remember.
          </p>
        </div>
        <section
          aria-labelledby="signin-title"
          className="min-w-0 rounded-lg border border-forest/12 bg-card shadow-[0_20px_40px_-36px_rgb(44_58_52/0.45)] p-5 sm:p-8"
        >
          <h2 id="signin-title" className="mb-5 text-3xl">
            Sign in securely
          </h2>
          <LoginForm redirectTo={redirectTo} />
        </section>
        <div className="lg:col-span-2">
          <CancellationHelp />
        </div>
      </div>
    </CustomerShell>
  );
}
