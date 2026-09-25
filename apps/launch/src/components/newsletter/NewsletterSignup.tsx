"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { NEWSLETTER_CONSENT, type NewsletterSignup as Signup } from "@/lib/newsletter-shared";
import { cn } from "@/lib/utils";

/**
 * Newsletter signup (double opt-in). Brand adaptation of 21st.dev
 * shadcnblockscom/newsletter-01: one email field, one action, and an inline
 * confirmation state — no modal, no pre-checked consent.
 */
export function NewsletterSignup({
  source,
  tone = "light",
  className,
}: {
  source: Signup["source"];
  tone?: "light" | "dark";
  className?: string;
}) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const dark = tone === "dark";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    if (form.get("consent") !== "on") return setError("Please confirm you’d like the newsletter.");
    setError("");
    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), source, consent: true, website: form.get("website") ?? "" }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(typeof result?.error === "string" ? result.error : "");
      setStatus("sent");
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : "We couldn’t sign you up just now. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent")
    return (
      <div role="status" className={cn("flex items-start gap-3 rounded-lg p-4", dark ? "bg-oat/8 text-oat" : "bg-sage/10 text-forest", className)}>
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", dark ? "bg-gold text-forest" : "bg-forest text-oat")}>
          <Check className="size-4" aria-hidden />
        </span>
        <p className="text-sm leading-6">
          <strong className="font-semibold">Check your inbox.</strong> We sent a link to confirm your subscription.
          You won’t receive the newsletter until you confirm.
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate aria-busy={status === "sending"} className={cn("grid gap-3", className)}>
      <label htmlFor={`${id}-email`} className={cn("text-sm font-semibold", dark ? "text-oat" : "text-forest")}>
        Newsletter email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          placeholder="you@example.com"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "min-h-12 w-full min-w-0 flex-1 rounded-md border px-4 text-base focus:ring-2 focus:outline-none",
            dark
              ? "border-oat/25 bg-oat/8 text-oat placeholder:text-oat/45 focus:border-gold focus:ring-gold/30"
              : "border-forest/20 bg-white text-forest placeholder:text-forest/40 focus:border-sage focus:ring-sage/25",
          )}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md px-5 text-[0.78rem] font-medium tracking-[0.16em] uppercase transition-colors disabled:opacity-60",
            dark ? "bg-gold text-forest hover:bg-sand" : "bg-forest text-oat hover:bg-forest/90",
          )}
        >
          {status === "sending" ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
          Subscribe
          {status === "sending" ? null : <ArrowRight className="size-4" aria-hidden />}
        </button>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this empty</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className={cn("flex items-start gap-2.5 text-xs leading-5", dark ? "text-oat/75" : "text-forest/70")}>
        <input type="checkbox" name="consent" className={cn("mt-0.5 size-4 shrink-0", dark ? "accent-gold" : "accent-forest")} />
        <span>
          {NEWSLETTER_CONSENT} See our{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className={cn("text-sm", dark ? "text-gold" : "text-clay")}>
          {error}
        </p>
      ) : null}
    </form>
  );
}
