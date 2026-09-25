"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Compass, House, ShoppingBag, Soup, UserRound } from "lucide-react";
import { EAT_NOW } from "@/lib/ordering";
import { cn } from "@/lib/utils";

type Tab = { href: string; label: string; icon: typeof House; external?: boolean };

const TABS: readonly Tab[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/menu", label: "Menu", icon: Soup },
  { href: "/quiz", label: "Pathway", icon: Compass },
  { href: EAT_NOW.menuUrl, label: "Take Out", icon: ShoppingBag, external: true },
  { href: "/account", label: "Orders", icon: UserRound },
];

/**
 * Thumb-zone app navigation for phones — a floating, translucent tab bar with
 * a sliding active pill (brand adaptation of 21st.dev shadcnui-blocks
 * mobile-navigation-tabs and ln-dev7 animated-navigation-tabs). Always
 * available; it only steps aside while the full-screen menu is open.
 */
export function MobileTabBar({ current, hidden = false }: { current?: string; hidden?: boolean }) {
  const reduced = useReducedMotion();
  const tucked = hidden;

  // Tabs that point at the page you're already on scroll there instead of doing nothing.
  const onSamePage = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const [path, hash] = href.split("#");
    if (window.location.pathname !== (path || "/")) return;
    event.preventDefault();
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const target = hash ? document.getElementById(hash) : null;
    if (target) target.scrollIntoView({ behavior, block: "start" });
    else window.scrollTo({ top: 0, behavior });
    window.history.replaceState(null, "", hash ? `${path || "/"}#${hash}` : path || "/");
  };

  return (
    <nav
      id="mobile-tabbar"
      aria-label="App"
      className={cn(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md transition-[transform,opacity] duration-300 ease-(--ease-soft) lg:hidden",
        tucked ? "pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0" : "translate-y-0 opacity-100",
      )}
    >
      <ul className="grid grid-cols-5 rounded-full border border-forest/10 bg-oat/82 p-1.5 shadow-[0_18px_40px_-18px_rgb(44_58_52/0.55),inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-xl backdrop-saturate-150">
        {TABS.map(({ href, label, icon: Icon, external }) => {
          const active = href === current;
          const content = (
            <>
              {active ? (
                <motion.span
                  layoutId="tabbar-active"
                  className="absolute inset-0 rounded-full bg-forest"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <Icon className="relative size-5" strokeWidth={active ? 2.2 : 1.8} aria-hidden />
              <span className="relative text-[0.62rem] font-bold tracking-[0.04em]">{label}</span>
            </>
          );
          const className = cn(
            "relative flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-full transition-colors duration-200 active:scale-95",
            active ? "text-oat" : external ? "text-clay-ink" : "text-forest/80",
          );
          return (
            <li key={label}>
              {external ? (
                <a href={href} className={className}>
                  {content}
                </a>
              ) : (
                <Link href={href} aria-current={active ? "page" : undefined} className={className} onClick={(event) => onSamePage(event, href)}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
