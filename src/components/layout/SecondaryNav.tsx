"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SECONDARY_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SecondaryNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="bg-black text-white hidden lg:block"
      aria-label="Secondary navigation"
    >
      <div className="max-container flex items-center justify-between px-8 py-2">
        {/* Left: Promo text */}
        <p className="font-sans text-[11px] uppercase tracking-[0.08em] font-medium">
          GET 15% OFF YOUR FIRST ORDER
        </p>

        {/* Right: Utility links */}
        <div className="flex items-center gap-6" ref={dropdownRef}>
          {SECONDARY_NAV_LINKS.map((link) => (
            <div key={link.label} className="relative">
              {link.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.label ? null : link.label
                      )
                    }
                    className="flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.08em] font-medium hover:text-white/80 transition-colors duration-300"
                    aria-expanded={openDropdown === link.label}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-300",
                        openDropdown === link.label && "rotate-180"
                      )}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full right-0 mt-2 bg-white text-black shadow-none border border-border min-w-[180px] z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.06em] font-medium hover:bg-cream transition-colors duration-300"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className="font-sans text-[11px] uppercase tracking-[0.08em] font-medium hover:text-white/80 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
