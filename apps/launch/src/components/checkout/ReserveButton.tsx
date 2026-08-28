"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FEES, formatCents, PRICING } from "@/lib/brand";

type CheckoutResponse = {
  url?: string | null;
  disabled?: boolean;
  reason?: string;
  error?: string;
};

export function ReserveButton() {
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const feesReady =
    FEES.delivery.amountCents !== null &&
    FEES.containerDeposit.amountCents !== null;

  async function reserve(): Promise<void> {
    if (pending || !accepted || !feesReady) return;

    setError(null);
    const leadId = window.sessionStorage.getItem("soulbowls:leadId");
    const deliveryZip = window.sessionStorage.getItem("soulbowls:deliveryZip");

    if (!leadId || !deliveryZip) {
      setError("Complete the reservation form before starting payment.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acceptedTerms: true,
          deliveryZip,
          leadId,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | CheckoutResponse
        | null;

      if (response.ok && data?.url) {
        window.location.href = data.url;
        return;
      }

      if (data?.reason === "fees-unconfigured") {
        setError("Online payment is paused until the delivery and deposit amounts are approved.");
      } else if (data?.reason === "stripe-unconfigured") {
        setError("Online payment is temporarily unavailable. Your reservation is saved.");
      } else {
        setError(data?.error ?? "Payment could not be started. Please try again.");
      }
    } catch {
      setError("Payment could not be started. Your reservation is still saved.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-forest/12 bg-white/60 p-4 text-sm leading-relaxed text-forest/72">
        <p className="font-bold tracking-[0.08em] text-forest uppercase">
          Automatic renewal
        </p>
        <p className="mt-2">
          {PRICING.weekly} base plan every 7 days until canceled, plus{" "}
          {formatCents(FEES.delivery.amountCents)} delivery each week. A{" "}
          {formatCents(FEES.containerDeposit.amountCents)} one-time refundable
          reusable-container deposit applies when the plan begins. Cancel future
          renewals online anytime.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-forest/72">
        <input
          type="checkbox"
          checked={accepted}
          disabled={!feesReady || pending}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
        />
        <span>
          I expressly agree to the automatic weekly renewal and accept the{" "}
          <Link href="/terms" className="font-semibold underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/customer-agreement"
            className="font-semibold underline underline-offset-2"
          >
            Customer Agreement
          </Link>
          .
        </span>
      </label>

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={pending || !accepted || !feesReady}
        onClick={reserve}
      >
        {pending ? "Redirecting…" : `Start Soul Bowls™ — ${PRICING.weekly}/week`}
      </Button>

      {!feesReady && (
        <p role="status" className="text-sm leading-relaxed text-clay">
          Online payment is paused until the delivery charge and refundable
          container-deposit amount are approved.
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm leading-relaxed text-clay">
          {error}{" "}
          {error.includes("reservation form") && (
            <Link href="/#join" className="font-semibold underline underline-offset-2">
              Reserve your spot.
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
