"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Compass, House, ShoppingBag, Soup, UserRound } from "lucide-react";
import { useScrollDirection } from "@/components/ui/kit/use-scroll-direction";
import { EAT_NOW } from "@/lib/ordering";
import { cn } from "@/lib/utils";

type Tab = { href: string; label: string; icon: typeof House; external?: boolean };

const TABS: readonly Tab[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/#bowls", label: "Menu", icon: Soup },
  { href: "/quiz", label: "Pathway", icon: Compass },
  { href: EAT_NOW.menuUrl, label: "Eat Now", icon: ShoppingBag, external: true },
  { href: "/account", label: "Orders", icon: UserRound },
];

/**
 * Thumb-zone app navigation for phones — a floating, translucent tab bar with
 * a sliding active pill (brand adaptation of 21st.dev shadcnui-blocks
 * mobile-navigation-tabs and ln-dev7 animated-navigation-tabs). It tucks away
 * while reading down the page and returns on the first scroll up.
 */
export function MobileTabBar({ current, hidden = false }: { current?: string; hidden?: boolean }) {
  const direction = useScrollDirection();
  const reduced = useReducedMotion();
  const tucked = hidden || direction === "down";

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
            active ? "text-oat" : external ? "text-clay" : "text-forest/70",
          );
          return (
            <li key={label}>
              {external ? (
                <a href={href} className={className}>
                  {content}
                </a>
              ) : (
                <Link href={href} aria-current={active ? "page" : undefined} className={className}>
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
