"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SECONDARY_NAV_LINKS, BRAND } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-50 transition-opacity duration-500 lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-full max-w-sm bg-white z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <Link
            href="/"
            className="font-heading text-xl tracking-[0.02em]"
            onClick={onClose}
          >
            SOUL GOOD
          </Link>
          <button
            onClick={onClose}
            className="p-1 hover:bg-cream transition-colors duration-300"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-3 font-sans text-sm uppercase tracking-[0.08em] font-medium hover:text-primary transition-colors duration-300 border-b border-border/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary Links */}
          <div className="mt-8 pt-6 border-t border-border">
            <ul className="space-y-1">
              {SECONDARY_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.children ? (
                    <div>
                      <span className="block py-2 font-sans text-xs uppercase tracking-[0.08em] font-medium text-black/50">
                        {link.label}
                      </span>
                      <ul className="pl-4 space-y-1">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className="block py-2 font-sans text-xs uppercase tracking-[0.06em] font-medium hover:text-primary transition-colors duration-300"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block py-3 font-sans text-xs uppercase tracking-[0.06em] font-medium hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border">
          <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-black/40 text-center">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </>
  );
}
