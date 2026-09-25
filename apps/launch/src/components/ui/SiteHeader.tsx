 "use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileTabBar } from "@/components/ui/MobileTabBar";
import { MenuToggleIcon } from "@/components/ui/kit/menu-toggle-icon";
import { useScroll } from "@/components/ui/kit/use-scroll";
import { NOURISHMENT } from "@/lib/brand";
import { EAT_NOW } from "@/lib/ordering";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string; external?: boolean };

export const PRIMARY_NAV: readonly NavLink[] = [
  { href: "/#bowls", label: "Menu" },
  { href: "/quiz", label: "Find your pathway" },
  { href: EAT_NOW.menuUrl, label: "Eat Now", external: true },
  { href: "/quote", label: "Gatherings" },
];

const SECONDARY_NAV: readonly NavLink[] = [
  { href: "/food-for-the-soul", label: "Food for the Soul" },
  { href: "/account", label: "My orders" },
];

function NavItem({
  link,
  className,
  active,
  onClick,
  children,
}: {
  link: NavLink;
  className: string;
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return link.external ? (
    <a href={link.href} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link href={link.href} aria-current={active ? "page" : undefined} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/**
 * Site header — brand adaptation of 21st.dev efferd/header-1: sticky,
 * scroll-aware surface, portal mobile menu with scroll lock.
 * `variant="focus"` removes navigation for checkout-style flows.
 */
export function SiteHeader({
  variant = "full",
  aside,
  current,
  cta = { href: "/checkout", label: NOURISHMENT.cta, short: "Order" },
  className,
}: {
  variant?: "full" | "focus";
  /** Replaces the right-hand actions in the focus variant. */
  aside?: React.ReactNode;
  /** `href` of the primary-nav item for the current page. */
  current?: string;
  /** Header call to action; `short` is shown on the smallest screens. */
  cta?: { href: string; label: string; short?: string };
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const scrolled = useScroll(8);

  useEffect(() => {
    if (!open) return;
    setMenuTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => href === current;

  return (
    <>
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 w-full border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open
          ? "border-forest/10 bg-oat/88 shadow-[0_1px_0_rgb(44_58_52/0.04),0_8px_24px_-18px_rgb(44_58_52/0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-oat/78"
          : "border-transparent bg-oat",
        className,
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-20 sm:px-8 lg:px-12">
        <Wordmark href="/" className="[&_img]:w-[124px] sm:[&_img]:w-[168px]" />

        {variant === "full" ? (
          <>
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {PRIMARY_NAV.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  active={isActive(link.href)}
                  className={cn(
                    "relative inline-flex min-h-11 items-center gap-1 rounded-md px-3.5 text-[0.72rem] font-bold tracking-[0.1em] uppercase transition-colors",
                    "after:absolute after:inset-x-3.5 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
                    isActive(link.href) ? "text-forest after:scale-x-100" : link.external ? "text-clay" : "text-forest/70 hover:text-forest",
                  )}
                >
                  {link.label}
                  {link.external ? <ArrowUpRight className="size-3.5" aria-hidden /> : null}
                </NavItem>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/account"
                aria-label="My orders"
                aria-current={isActive("/account") ? "page" : undefined}
                className="hidden size-11 items-center justify-center rounded-full text-forest/75 transition-colors hover:bg-forest/5 hover:text-forest sm:flex"
              >
                <UserRound className="size-5" aria-hidden />
              </Link>
              <Button as="a" href={cta.href} target="_self" size="sm" className="px-4 sm:px-5">
                {cta.short ? (
                  <>
                    <span className="sm:hidden">{cta.short}</span>
                    <span className="hidden sm:inline">{cta.label}</span>
                  </>
                ) : (
                  cta.label
                )}
              </Button>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="flex size-11 items-center justify-center rounded-md border border-forest/15 text-forest transition-colors hover:bg-forest/5 lg:hidden"
              >
                <MenuToggleIcon open={open} className="size-6" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">{aside}</div>
        )}
      </div>

      {variant === "full" ? <MobileMenu open={open} top={menuTop} onNavigate={() => setOpen(false)} isActive={isActive} /> : null}
    </header>
    {variant === "full" ? <MobileTabBar current={current} hidden={open} /> : null}
    </>
  );
}

function MobileMenu({
  open,
  top,
  onNavigate,
  isActive,
}: {
  open: boolean;
  top: number;
  onNavigate: () => void;
  isActive: (href: string) => boolean;
}) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      style={{ top }}
      className="fixed inset-x-0 bottom-0 z-30 overflow-y-auto border-t border-forest/10 bg-oat/96 backdrop-blur-xl lg:hidden"
    >
      <nav
        aria-label="Mobile"
        className="mx-auto flex min-h-full max-w-xl flex-col px-5 pt-6 pb-10 motion-safe:animate-[rise_0.45s_var(--ease-soft)]"
      >
        <ul className="divide-y divide-forest/10 border-y border-forest/10">
          {PRIMARY_NAV.map((link) => (
            <li key={link.href}>
              <NavItem
                link={link}
                active={isActive(link.href)}
                onClick={onNavigate}
                className="flex min-h-16 items-center justify-between font-serif text-3xl tracking-[-0.02em] text-forest"
              >
                {link.label}
                {link.external ? (
                  <ArrowUpRight className="size-5 text-clay" aria-hidden />
                ) : (
                  <span aria-hidden className="font-sans text-base text-clay">→</span>
                )}
              </NavItem>
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
          {SECONDARY_NAV.map((link) => (
            <li key={link.href}>
              <NavItem
                link={link}
                active={isActive(link.href)}
                onClick={onNavigate}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-forest/75 underline decoration-forest/20 underline-offset-4 hover:text-forest"
              >
                {link.label}
              </NavItem>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-3">
          <Button as="a" href="/checkout" size="lg" onClick={onNavigate}>
            {NOURISHMENT.cta}
          </Button>
        </div>
        <p className="mt-auto pt-10 text-center text-xs leading-5 text-forest/60">
          Weekly delivery Sundays · On demand Thursday–Sunday
        </p>
      </nav>
    </div>,
    document.body,
  );
}
