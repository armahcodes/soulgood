"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CancelSubscriptionButton({
  cancellationScheduledFor,
  subscriptionId,
}: {
  cancellationScheduledFor?: string;
  subscriptionId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(cancellationScheduledFor);
  const [error, setError] = useState("");

  async function cancelSubscription() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/account/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
        { method: "POST" },
      );
      const result = (await response.json().catch(() => null)) as
        | { error?: string; effectiveDate?: string }
        | null;
      if (!response.ok || !result?.effectiveDate) {
        throw new Error(result?.error || "We could not cancel the plan. Please try again.");
      }
      setEffectiveDate(result.effectiveDate);
      setConfirming(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not cancel the plan. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (effectiveDate) {
    return (
      <p className="text-sm font-semibold text-forest">
        Plan ends {effectiveDate}. Future renewals are stopped.
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        className="text-sm font-semibold text-clay underline underline-offset-4"
        onClick={() => setConfirming(true)}
      >
        Cancel future renewals
      </button>
    );
  }

  return (
    <div className="border border-clay/25 bg-clay/6 p-4 text-left">
      <p className="text-sm leading-relaxed text-forest/70">
        This stops renewals at the end of the current billing period. An order
        already charged and committed to production remains active.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="sm" onClick={cancelSubscription} disabled={loading}>
          {loading ? "Canceling…" : "Confirm cancellation"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setConfirming(false);
            setError("");
          }}
          disabled={loading}
        >
          Keep my plan
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-clay" role="alert">{error}</p> : null}
    </div>
  );
}
