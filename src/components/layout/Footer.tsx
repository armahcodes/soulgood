"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND, FOOTER_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* Simple SVG icon components for social media */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.84.55 9.38.55 9.38.55s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.54 15.57V8.43L15.82 12l-6.28 3.57z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<
    "idle" | "error" | "success"
  >("idle");

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterState("error");
      return;
    }
    // TODO: Backend Integration - Submit email to newsletter API
    console.log("Newsletter signup:", email);
    setNewsletterState("success");
    setEmail("");
  }

  return (
    <footer className="bg-black text-white" role="contentinfo">
      {/* Social Icons */}
      <div className="max-container px-6 lg:px-8 pt-16 pb-10">
        <div className="flex items-center justify-center gap-6 mb-12">
          <a
            href={BRAND.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-primary transition-colors duration-300"
            aria-label="Follow us on Instagram"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>
          <a
            href={BRAND.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-primary transition-colors duration-300"
            aria-label="Follow us on TikTok"
          >
            <TikTokIcon className="w-5 h-5" />
          </a>
          <a
            href={BRAND.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:text-primary transition-colors duration-300"
            aria-label="Subscribe on YouTube"
          >
            <YouTubeIcon className="w-5 h-5" />
          </a>
        </div>

        {/* 4-Column Link Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Meal Plans */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.08em] font-semibold mb-5">
              Meal Plans
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.mealPlans.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Learn */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.08em] font-semibold mb-5">
              Learn
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.08em] font-semibold mb-5">
              Information
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.information.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-[0.08em] font-semibold mb-5">
              Stay Connected
            </h3>
            <p className="font-body text-sm text-white/60 mb-5">
              Sign up for Soul Good updates, recipes, and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (newsletterState !== "idle") setNewsletterState("idle");
                  }}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-0 border-b border-white/30 px-0 py-3 font-body text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors duration-300"
                  aria-label="Email address for newsletter"
                />
                {newsletterState === "error" && (
                  <p className="mt-1.5 text-xs font-sans text-primary">
                    Please enter a valid email address
                  </p>
                )}
                {newsletterState === "success" && (
                  <p className="mt-1.5 text-xs font-sans text-accent">
                    Thank you for signing up!
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="font-sans text-xs uppercase tracking-[0.08em] font-semibold bg-white text-black px-6 py-3 hover:bg-white/90 transition-colors duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] w-full"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Legal Bar */}
      <div className="border-t border-white/10">
        <div className="max-container px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/40">
            © {new Date().getFullYear()} Soul Good. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-xs text-white/40 hover:text-white transition-colors duration-300"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
