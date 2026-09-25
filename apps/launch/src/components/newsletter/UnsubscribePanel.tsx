"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Unsubscribe from the newsletter by the link token (from an email) or by email
 * address (from Privacy Choices). A button press is required so link scanners
 * can't unsubscribe people by following the link.
 */
export function UnsubscribePanel({ token }: { token?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { token } : { email }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(typeof result?.error === "string" ? result.error : "");
      setStatus("done");
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : "We couldn’t update your subscription. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done")
    return (
      <p role="status" className="flex items-start gap-3 rounded-lg bg-sage/10 p-4 text-sm leading-6 text-forest">
        <Check className="mt-1 size-4 shrink-0 text-sage-ink" aria-hidden />
        <span>
          <strong className="font-semibold">You’re unsubscribed.</strong> You won’t receive the newsletter anymore. Order,
          account, and booking emails you request will still arrive.
        </span>
      </p>
    );

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      {token ? null : (
        <label className="grid gap-2 text-sm font-semibold text-forest">
          Email to unsubscribe
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            className="min-h-12 rounded-md border border-forest/20 bg-white px-4 text-base font-normal focus:border-sage focus:ring-2 focus:ring-sage/25 focus:outline-none"
          />
        </label>
      )}
      <Button type="submit" variant="secondary" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden /> : null}
        Unsubscribe from the newsletter
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-clay-ink">
          {error}
        </p>
      ) : null}
    </form>
  );
}
