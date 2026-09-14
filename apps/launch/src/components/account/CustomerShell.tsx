import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Wordmark } from "@/components/ui/Wordmark";

export function CustomerShell({
  children,
  active,
  signedIn = false,
}: {
  children: React.ReactNode;
  active: "orders" | "plans" | "signin";
  signedIn?: boolean;
}) {
  return (
    <div className="min-h-screen bg-oat text-forest">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-forest focus:px-5 focus:py-3 focus:text-oat"
      >
        Skip to account content
      </a>
      <header className="border-b border-forest/12">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Wordmark href="/" />
          {signedIn ? (
            <SignOutButton />
          ) : (
            <Link
              href="/"
              className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold underline underline-offset-4"
            >
              Home
            </Link>
          )}
        </div>
        <nav
          aria-label="Customer account"
          className="mx-auto flex max-w-6xl gap-6 px-5 sm:px-8"
        >
          {[
            { key: "orders", href: "/account", label: "My orders" },
            { key: "plans", href: "/cancel", label: "Manage weekly plans" },
          ].map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active === item.key ? "page" : undefined}
              className={`inline-flex min-h-12 items-center border-b-2 text-sm font-semibold ${active === item.key ? "border-forest text-forest" : "border-transparent text-forest/65 hover:border-forest/30 hover:text-forest"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main
        id="main-content"
        className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
