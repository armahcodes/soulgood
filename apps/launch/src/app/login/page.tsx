import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/Button";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import { getAuth } from "@/lib/auth";
import { safeAccountRedirect } from "@/lib/safe-redirect";
import { BRAND_NAME } from "@/lib/brand";

export const metadata = {
  title: `Sign in — ${BRAND_NAME}`,
  description: "Securely sign in by email to view your Soul Bowls™ orders.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  const requestedRedirect = (await searchParams).redirect;
  const redirectTo = safeAccountRedirect(requestedRedirect);

  if (session) redirect(redirectTo);

  return (
    <>
      <main className="min-h-[calc(100vh-180px)] bg-oat">
        <header className="border-b border-forest/12">
          <div className="mx-auto flex min-h-20 w-full max-w-5xl items-center px-5 sm:px-8">
            <Wordmark href="/" />
          </div>
        </header>
        <section className="mx-auto grid w-full max-w-5xl gap-9 px-5 py-10 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.78fr] lg:items-center lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">
              Customer account
            </p>
            <h1 className="mx-auto mt-5 max-w-[9ch] text-6xl leading-[0.88] font-normal tracking-[-0.055em] text-forest sm:text-7xl lg:mx-0">
              Your orders, in one place.
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-forest/66 lg:mx-0">
              Sign in securely with the email used at checkout. We’ll send a
              short-lived code—no password to remember.
            </p>
          </div>
          <div className="border border-forest/14 bg-white/45 p-6 sm:p-9">
            <p className="mb-2 text-center font-serif text-3xl text-forest sm:text-left">
              Sign in to Soul Bowls™
            </p>
            <p className="mb-7 text-center text-sm leading-relaxed text-forest/55 sm:text-left">
              Returning customers can view receipts, reorder, and manage weekly
              plans.
            </p>
            <LoginForm redirectTo={redirectTo} />
            <div className="mt-7 border-t border-forest/10 pt-6 text-center">
              <p className="mb-4 text-sm text-forest/58">
                New here? No account is required to order.
              </p>
              <Button
                as="a"
                href="/checkout"
                variant="secondary"
                className="w-full"
              >
                Start an order
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
