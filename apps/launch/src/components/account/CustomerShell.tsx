import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { cn } from "@/lib/utils";

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
      <SiteHeader current="/account" />
      <main
        id="main-content"
        className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 pt-8 pb-14 sm:px-8 sm:pt-10 sm:pb-20"
      >
        {active !== "signin" ? (
          <div className="mb-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-forest/10 pb-6 sm:mb-12">
            {/* Pill tabs — brand adaptation of 21st.dev preetsuthar17/animated-tabs */}
            <nav
              aria-label="Customer account"
              className="inline-flex rounded-full border border-forest/12 bg-card p-1"
            >
              {[
                { key: "orders", href: "/account", label: "My orders" },
                { key: "plans", href: "/cancel", label: "Manage weekly plans" },
              ].map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active === item.key ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors duration-200",
                    active === item.key
                      ? "bg-forest text-oat shadow-[0_1px_2px_rgb(44_58_52/0.25)]"
                      : "text-forest/72 hover:bg-forest/5 hover:text-forest",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {signedIn ? <SignOutButton /> : null}
          </div>
        ) : null}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
