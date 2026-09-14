"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  cancellationSnapshotSchema,
  formatCustomerDate,
  planHasEnded,
  type CancellationSnapshot,
} from "@/lib/customer-experience";

class CancellationError extends Error {
  constructor(readonly status: number) {
    super("Cancellation could not be verified");
  }
}

async function readResult(
  endpoint: string,
  method: "GET" | "POST",
  signal: AbortSignal,
) {
  const response = await fetch(endpoint, { method, cache: "no-store", signal });
  if (!response.ok) throw new CancellationError(response.status);
  const parsed = cancellationSnapshotSchema.safeParse(await response.json());
  if (!parsed.success || (method === "POST" && parsed.data.state === "active"))
    throw new CancellationError(502);
  return parsed.data;
}

export function CancelSubscriptionButton({
  cancellationScheduledFor,
  subscriptionId,
  subscriptionStatus,
  cancellationPending = false,
}: {
  cancellationScheduledFor?: string;
  subscriptionId: string;
  subscriptionStatus?: string;
  cancellationPending?: boolean;
}) {
  const initial: CancellationSnapshot = cancellationScheduledFor
    ? { state: "scheduled", effectiveDate: cancellationScheduledFor }
    : planHasEnded(subscriptionStatus)
      ? { state: "ended" }
      : { state: cancellationPending ? "pending" : "active" };
  const [snapshot, setSnapshot] = useState<CancellationSnapshot>(initial);
  const [reviewing, setReviewing] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [busy, setBusy] = useState<"submit" | "check" | null>(null);
  const [error, setError] = useState("");
  const [authExpired, setAuthExpired] = useState(false);
  const inFlight = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusRequested = useRef(false);
  const headingId = useId();
  const endpoint = `/api/account/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`;

  useEffect(() => {
    if (focusRequested.current) {
      heading.current?.focus();
      focusRequested.current = false;
    }
  }, [reviewing, uncertain, snapshot.state, authExpired]);

  // A saved request survives navigation. Poll only its status; never repeat POST.
  useEffect(() => {
    if (snapshot.state !== "pending" || authExpired) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let checks = 0;
    async function poll() {
      if (controller.signal.aborted) return;
      checks += 1;
      try {
        const result = await readResult(
          endpoint,
          "GET",
          AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]),
        );
        if (controller.signal.aborted) return;
        if (result.state === "scheduled" || result.state === "ended") {
          setSnapshot(result);
          setError("");
          return;
        }
      } catch (cause) {
        if (controller.signal.aborted) return;
        if (cause instanceof CancellationError && cause.status === 401) {
          setAuthExpired(true);
          return;
        }
      }
      if (checks < 5) timer = setTimeout(poll, 3000);
    }
    timer = setTimeout(poll, 2500);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [endpoint, snapshot.state, authExpired]);

  async function act(method: "GET" | "POST") {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(method === "POST" ? "submit" : "check");
    setError("");
    try {
      const result = await readResult(
        endpoint,
        method,
        AbortSignal.timeout(20000),
      );
      if (result.state === "active") {
        setUncertain(true);
        setError(
          "No confirmed cancellation is available yet. You can check again or retry the request for this same plan.",
        );
      } else {
        focusRequested.current = true;
        setSnapshot(result);
        setReviewing(false);
        setUncertain(false);
      }
    } catch (cause) {
      if (cause instanceof CancellationError && cause.status === 401) {
        focusRequested.current = true;
        setAuthExpired(true);
        setError(
          "Your sign-in expired. Sign in again to check this request or continue.",
        );
      } else {
        if (method === "POST") {
          focusRequested.current = true;
          setUncertain(true);
          setReviewing(false);
        }
        setError(
          method === "POST"
            ? "We lost confirmation of your request. Check its status before trying again."
            : "We couldn’t check the status. Your last confirmed status is shown below; please try again.",
        );
      }
    } finally {
      inFlight.current = false;
      setBusy(null);
    }
  }

  if (snapshot.state === "scheduled" || snapshot.state === "ended")
    return (
      <section
        aria-labelledby={headingId}
        className="border border-sage/40 bg-sage/10 p-5 sm:p-6"
      >
        <div role="status" aria-live="polite">
          <h3
            ref={heading}
            id={headingId}
            tabIndex={-1}
            className="text-2xl outline-none"
          >
            {snapshot.state === "scheduled"
              ? "Cancellation confirmed"
              : "This plan has ended"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-forest/80">
            {snapshot.state === "scheduled"
              ? `Your plan ends ${formatCustomerDate(snapshot.effectiveDate)}. It will not renew after that date.`
              : "This plan has no future renewals."}{" "}
            Orders already charged and committed to preparation are unchanged.
          </p>
        </div>
        <Link
          href="/account"
          className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
        >
          View existing orders
        </Link>
      </section>
    );

  const pending = snapshot.state === "pending";
  if (pending || uncertain || authExpired)
    return (
      <section
        aria-labelledby={headingId}
        aria-busy={Boolean(busy)}
        className="border border-gold/50 bg-gold/10 p-5 sm:p-6"
      >
        <div role="status" aria-live="polite">
          <h3
            ref={heading}
            id={headingId}
            tabIndex={-1}
            className="text-2xl outline-none"
          >
            {pending ? "Request received" : "Cancellation not yet confirmed"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-forest/80">
            {pending
              ? "Your request is saved. We’re waiting for Square to confirm it. Your plan is not confirmed canceled yet. You can leave this page and return to check the same request."
              : "We haven’t confirmed that renewals have stopped. Check the request status, or retry cancellation for this same plan."}
          </p>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm leading-6 text-forest">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {authExpired ? (
            <Button as="a" href="/login?redirect=%2Fcancel">
              Sign in again
            </Button>
          ) : (
            <>
              <Button
                onClick={() => void act("GET")}
                disabled={Boolean(busy)}
                variant="secondary"
              >
                {busy === "check" ? "Checking…" : "Check request status"}
              </Button>
              {!pending ? (
                <Button
                  variant="link"
                  className="min-h-11"
                  disabled={Boolean(busy)}
                  onClick={() => {
                    focusRequested.current = true;
                    setUncertain(false);
                    setError("");
                    setReviewing(true);
                  }}
                >
                  Try cancellation again
                </Button>
              ) : null}
            </>
          )}
        </div>
      </section>
    );

  if (!reviewing)
    return (
      <Button
        ref={trigger}
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={() => {
          focusRequested.current = true;
          setReviewing(true);
        }}
      >
        Cancel future renewals
      </Button>
    );

  return (
    <section
      aria-labelledby={headingId}
      aria-busy={Boolean(busy)}
      className="border border-forest/20 bg-oat p-5 sm:p-6"
    >
      <h3
        ref={heading}
        id={headingId}
        tabIndex={-1}
        className="text-2xl outline-none"
      >
        Cancel this weekly plan?
      </h3>
      <p className="mt-3 text-sm leading-6 text-forest/80">
        This stops renewals at the end of the current billing period. Orders
        already charged and committed to preparation are unchanged.
      </p>
      <p className="mt-2 text-sm leading-6 text-forest/80">
        No phone call or reason is needed. We’ll show confirmation here when
        Square confirms the end date.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button onClick={() => void act("POST")} disabled={Boolean(busy)}>
          {busy === "submit"
            ? "Submitting cancellation…"
            : "Confirm cancellation"}
        </Button>
        <Button
          variant="secondary"
          disabled={Boolean(busy)}
          onClick={() => {
            setReviewing(false);
            requestAnimationFrame(() => trigger.current?.focus());
          }}
        >
          Go back
        </Button>
      </div>
    </section>
  );
}
