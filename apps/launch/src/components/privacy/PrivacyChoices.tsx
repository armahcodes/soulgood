"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEVICE_STORAGE_PREFIXES, PRIVACY_PREFERENCE_KEY, PRIVACY_REQUEST_TYPES, PRIVACY_RESPONSE_DAYS, privacyRequestSchema } from "@/lib/privacy-shared";
import { cn } from "@/lib/utils";

const INPUT =
  "mt-2 min-h-12 w-full rounded-md border border-forest/20 bg-white px-4 py-3 text-base text-forest focus:border-sage focus:ring-2 focus:ring-sage/25 focus:outline-none aria-[invalid=true]:border-clay";

const noop = () => () => {};
const gpcSignal = () => Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);

/** Read the saved opt-out (cookie + localStorage), honoring Global Privacy Control. */
export function readPrivacyOptOut(): boolean {
  if (typeof window === "undefined") return false;
  return gpcSignal() || document.cookie.split("; ").includes(`${PRIVACY_PREFERENCE_KEY}=optout`) || window.localStorage.getItem(PRIVACY_PREFERENCE_KEY) === "optout";
}

/**
 * "Do not sell or share" preference. Soul Good doesn't sell or share personal
 * information today; saving the choice (or sending GPC) keeps it that way for
 * this browser even if tools change, and future tools must check it.
 */
export function SaleSharingPreference() {
  const gpc = useSyncExternalStore(noop, gpcSignal, () => false);
  const [optedOut, setOptedOut] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setOptedOut(readPrivacyOptOut()));
  }, []);

  const save = (value: boolean) => {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${PRIVACY_PREFERENCE_KEY}=${value ? "optout" : "default"}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
    window.localStorage.setItem(PRIVACY_PREFERENCE_KEY, value ? "optout" : "default");
    setOptedOut(value || gpc);
    setSaved(true);
  };

  return (
    <div className="grid gap-4">
      {gpc ? (
        <p className="flex items-start gap-3 rounded-lg border border-sage/35 bg-sage/10 p-4 text-sm leading-6 text-forest">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-sage" aria-hidden />
          <span>
            <strong className="font-semibold">Global Privacy Control detected.</strong> Your browser is asking sites not to
            sell or share your information, and we honor it automatically.
          </span>
        </p>
      ) : null}
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-forest/15 bg-white p-4 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1 size-5 shrink-0 accent-forest"
          checked={optedOut}
          disabled={gpc}
          onChange={(event) => save(event.target.checked)}
        />
        <span>
          <strong className="font-semibold text-forest">Do not sell or share my personal information</strong>
          <span className="block text-forest/70">
            Includes targeted advertising. We don’t do either today; this saves your choice for this browser.
          </span>
        </span>
      </label>
      <p aria-live="polite" className="text-sm text-forest/70">
        {saved ? (optedOut ? "Saved: you’re opted out on this browser." : "Saved.") : optedOut ? "You’re opted out on this browser." : null}
      </p>
    </div>
  );
}

export function ClearDeviceData() {
  const [cleared, setCleared] = useState(false);
  const clear = () => {
    for (const storage of [window.sessionStorage, window.localStorage]) {
      for (const key of Object.keys(storage)) if (DEVICE_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) storage.removeItem(key);
    }
    window.dispatchEvent(new Event("soulbowls:extras-change"));
    setCleared(true);
  };
  return (
    <div className="grid gap-3">
      <Button type="button" variant="secondary" onClick={clear} className="w-full sm:w-auto">
        Clear saved data on this device
      </Button>
      <p aria-live="polite" className="text-sm text-forest/70">
        {cleared ? "Cleared your saved cart, quiz answers, and last order from this browser." : null}
      </p>
    </div>
  );
}

export function PrivacyRequestForm() {
  const [values, setValues] = useState({ requestType: "access", relationship: "self", name: "", email: "", agentFor: "", details: "", declaration: false, website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "received">("idle");
  const [reference, setReference] = useState("");
  const [failure, setFailure] = useState("");
  const set = (key: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = privacyRequestSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }
    setStatus("sending");
    setFailure("");
    try {
      const response = await fetch("/api/privacy-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.received) throw new Error(typeof result?.error === "string" ? result.error : "");
      setReference(result.reference);
      setStatus("received");
    } catch (cause) {
      setFailure(cause instanceof Error && cause.message ? cause.message : "We couldn’t send your request. Please try again or email contact@soulgood.com.");
      setStatus("idle");
    }
  }

  const error = (key: string) => (errors[key] ? <p className="mt-2 text-sm text-clay">{errors[key]}</p> : null);

  if (status === "received")
    return (
      <div role="status" className="flex items-start gap-3 rounded-lg bg-sage/10 p-5 text-sm leading-6 text-forest">
        <Check className="mt-1 size-5 shrink-0 text-sage" aria-hidden />
        <span>
          <strong className="font-semibold">Request received · {reference}.</strong>{" "}
          {values.requestType === "marketing"
            ? "You’ve been removed from marketing emails."
            : `We sent a confirmation to your email. We’ll verify it’s you, then respond within ${PRIVACY_RESPONSE_DAYS} days.`}
        </span>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate aria-busy={status === "sending"} className="grid gap-5">
      <fieldset className="grid gap-2" disabled={status === "sending"}>
        <legend className="mb-1 text-sm font-semibold text-forest">What would you like us to do?</legend>
        {PRIVACY_REQUEST_TYPES.map((type) => (
          <label
            key={type.value}
            className={cn(
              "flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6",
              values.requestType === type.value ? "border-forest bg-oat" : "border-forest/15 bg-white",
            )}
          >
            <input type="radio" name="requestType" className="mt-1 size-4 shrink-0 accent-forest" checked={values.requestType === type.value} onChange={() => set("requestType", type.value)} />
            {type.label}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-forest">
          Your name
          <input className={INPUT} autoComplete="name" maxLength={120} value={values.name} aria-invalid={Boolean(errors.name) || undefined} onChange={(event) => set("name", event.target.value)} />
          {error("name")}
        </label>
        <label className="text-sm font-semibold text-forest">
          Email you used with us
          <input className={INPUT} type="email" autoComplete="email" maxLength={254} value={values.email} aria-invalid={Boolean(errors.email) || undefined} onChange={(event) => set("email", event.target.value)} />
          {error("email")}
        </label>
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-semibold text-forest">Who is this request for?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { value: "self", label: "Me" },
            { value: "agent", label: "Someone I’m authorized to act for" },
          ].map((option) => (
            <label key={option.value} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 text-sm", values.relationship === option.value ? "border-forest bg-oat" : "border-forest/15 bg-white")}>
              <input type="radio" name="relationship" className="size-4 accent-forest" checked={values.relationship === option.value} onChange={() => set("relationship", option.value)} />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      {values.relationship === "agent" ? (
        <label className="text-sm font-semibold text-forest">
          Name of the person you’re acting for
          <input className={INPUT} maxLength={120} value={values.agentFor} aria-invalid={Boolean(errors.agentFor) || undefined} onChange={(event) => set("agentFor", event.target.value)} />
          <span className="mt-1 block text-xs font-normal text-forest/60">We’ll ask for written permission from them before acting.</span>
          {error("agentFor")}
        </label>
      ) : null}
      <label className="text-sm font-semibold text-forest">
        Details {values.requestType === "correct" ? "" : "(optional)"}
        <textarea className={cn(INPUT, "resize-y")} rows={3} maxLength={2000} value={values.details} aria-invalid={Boolean(errors.details) || undefined} onChange={(event) => set("details", event.target.value)} placeholder="Anything that helps us find your information, such as an order number. Please don’t include payment card details." />
        {error("details")}
      </label>
      <div className="hidden" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => set("website", event.target.value)} />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-forest/80">
        <input type="checkbox" className="mt-1 size-5 shrink-0 accent-forest" checked={values.declaration} onChange={(event) => set("declaration", event.target.checked)} />
        <span>The information above is accurate, and I understand Soul Good will verify my identity by email before acting.</span>
      </label>
      {error("declaration")}
      {failure ? (
        <p role="alert" className="rounded-lg border border-clay/35 bg-clay/8 p-4 text-sm text-forest">
          {failure}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden /> : null}
        Send privacy request
      </Button>
    </form>
  );
}
