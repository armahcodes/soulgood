"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/**
 * Reserve CTA for /checkout. Initiates Stripe Checkout for the $50 founding-spot
 * deposit: POSTs to /api/checkout, then redirects to the returned hosted URL.
 *
 * Graceful fallback: if the route reports the Stripe seam is disabled (blank
 * keys → { url: null, disabled: true }) or the request fails for any reason, we
 * route the (already-captured) lead straight to /welcome. The user is never
 * trapped on this page.
 */
export function ReserveButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function reserve(): Promise<void> {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json().catch(() => null)) as
        | { url?: string | null }
        | null;
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      // Disabled seam or no URL → spot already reserved; continue to welcome.
      router.push("/welcome");
    } catch {
      router.push("/welcome");
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      disabled={pending}
      onClick={reserve}
    >
      {pending ? "Redirecting…" : "Reserve my spot — $50 deposit"}
    </Button>
  );
}
