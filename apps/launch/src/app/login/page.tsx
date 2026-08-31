import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";
import { auth } from "@/lib/auth";
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
  const session = await auth.api.getSession({ headers: await headers() });
  const requestedRedirect = (await searchParams).redirect;
  const redirectTo =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/account";

  if (session) redirect(redirectTo);

  return (
    <>
      <main className="min-h-[calc(100vh-180px)] bg-oat">
        <header className="border-b border-forest/12">
          <div className="mx-auto flex min-h-20 w-full max-w-5xl items-center px-5 sm:px-8">
            <Wordmark href="/" />
          </div>
        </header>
        <section className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">Customer account</p>
            <h1 className="mt-5 max-w-[9ch] text-6xl leading-[0.88] font-normal tracking-[-0.055em] text-forest sm:text-7xl">
              Your orders, in one place.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-forest/66">
              Sign in securely with the email used at checkout. We’ll send a
              short-lived code—no password to remember.
            </p>
          </div>
          <div className="border border-forest/14 bg-white/45 p-6 sm:p-9">
            <p className="mb-7 font-serif text-3xl text-forest">Sign in to Soul Bowls™</p>
            <LoginForm redirectTo={redirectTo} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
