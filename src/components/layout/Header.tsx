"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { AnnouncementBar } from "./AnnouncementBar";
import { SecondaryNav } from "./SecondaryNav";
import { MainNav } from "./MainNav";
import { SearchOverlay } from "./SearchOverlay";
import { CartSlideIn } from "./CartSlideIn";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isCartOpen, openCart, closeCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-shadow duration-300",
          isScrolled && "shadow-[0_1px_0_0_var(--color-border)]"
        )}
      >
        <AnnouncementBar />
        <SecondaryNav />
        <div className="relative">
          <MainNav
            onSearchOpen={() => setIsSearchOpen(true)}
            onCartOpen={openCart}
            onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          />
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      </header>

      {/* Overlays outside of header for proper z-index stacking */}
      <CartSlideIn
        isOpen={isCartOpen}
        onClose={closeCart}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
