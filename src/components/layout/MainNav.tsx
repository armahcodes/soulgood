"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { Badge } from "@/components/ui/Badge";

interface MainNavProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
  onMobileMenuOpen: () => void;
}

export function MainNav({
  onSearchOpen,
  onCartOpen,
  onMobileMenuOpen,
}: MainNavProps) {
  const { itemCount } = useCart();

  // Only show main nav links (Meal Plans, Shop) in the center
  const mainLinks = NAV_LINKS.filter(
    (link) => link.label === "MEAL PLANS" || link.label === "SHOP"
  );

  return (
    <nav className="bg-white border-b border-border" aria-label="Main navigation">
      <div className="max-container flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-1 hover:bg-cream transition-colors duration-300"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-2xl lg:text-3xl tracking-[0.02em]"
          >
            SOUL GOOD
          </Link>
        </div>

        {/* Center: Nav Links (desktop only) */}
        <div className="hidden lg:flex items-center gap-10">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-xs uppercase tracking-[0.08em] font-medium hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Search + Cart icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSearchOpen}
            className="p-2 hover:bg-cream transition-colors duration-300"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={onCartOpen}
            className="relative p-2 hover:bg-cream transition-colors duration-300"
            aria-label={`Open cart, ${itemCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 py-0 text-[9px]"
              >
                {itemCount}
              </Badge>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
