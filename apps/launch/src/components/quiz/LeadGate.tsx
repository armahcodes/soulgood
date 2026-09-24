"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { SeedOfLife } from "@/components/ui/SeedOfLife";
import { FULFILLMENT, formatCents, type FulfillmentMethod } from "@/lib/brand";
import { assembleLead, type JoinFormValues } from "@/lib/join-lead";
import { leadSchema } from "@/lib/lead-schema";
import type { PathwayState } from "@/lib/pathway-state";
import { cn } from "@/lib/utils";

const INPUT =
  "min-h-12 w-full rounded-md border border-forest/18 bg-white px-4 text-base text-forest transition-[border-color,box-shadow] placeholder:text-forest/35 focus:border-forest/60 focus:ring-4 focus:ring-sage/20 focus:outline-none aria-[invalid=true]:border-clay";
const LABEL = "grid gap-2 text-xs font-bold tracking-[0.1em] text-forest/70 uppercase";

type FieldErrors = Partial<Record<keyof JoinFormValues | "_root", string>>;

/**
 * Required contact step before the pathway reveal. Captures the lead through
 * the existing `/api/lead` endpoint (intent "list") with the full quiz profile,
 * then prefills checkout contact details for a smooth hand-off.
 */
export function LeadGate({
  state,
  onComplete,
}: {
  state: PathwayState;
  onComplete: (fulfillment: FulfillmentMethod) => void;
}) {
  const [values, setValues] = useState<JoinFormValues>({
    name: "",
    email: "",
    phone: "",
    fulfillmentMethod: "delivery",
    deliveryZip: "",
    deliveryCountyConfirmed: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const set = <K extends keyof JoinFormValues>(key: K, value: JoinFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, _root: undefined }));
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const lead = assembleLead(values, state, "list");
    const parsed = leadSchema.safeParse(lead);
    if (!parsed.success) {
      const fields = z.flattenError(parsed.error).fieldErrors as Record<string, string[] | undefined>;
      setErrors(Object.fromEntries(Object.entries(fields).map(([key, messages]) => [key, messages?.[0]])));
      requestAnimationFrame(() =>
        (event.target as HTMLFormElement).querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    setPending(true);
    setErrors({});
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) throw new Error(String(response.status));
      const result = (await response.json()) as { id?: string };
      if (result.id) window.sessionStorage.setItem("soulbowls:leadId", result.id);
      const [givenName = "", ...rest] = values.name.trim().split(/\s+/);
      window.sessionStorage.setItem(
        "soulbowls:checkoutContact",
        JSON.stringify({ givenName, familyName: rest.join(" "), email: values.email.trim(), phone: values.phone.trim() }),
      );
      window.sessionStorage.setItem("soulbowls:fulfillment", values.fulfillmentMethod);
      if (values.fulfillmentMethod === "delivery") {
        window.sessionStorage.setItem("soulbowls:deliveryZip", values.deliveryZip.trim());
      }
      onComplete(values.fulfillmentMethod);
    } catch {
      setPending(false);
      setErrors({ _root: "We couldn’t save your details just now. Please try again." });
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  const fieldError = (key: keyof JoinFormValues) =>
    errors[key] ? (
      <span id={`lead-${key}-error`} className="text-sm font-normal tracking-normal text-clay normal-case">
        {errors[key]}
      </span>
    ) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-5 text-center">
        <SeedOfLife size={72} className="text-sage" bloom title="" />
        <p className="text-[0.68rem] font-bold tracking-[0.22em] text-clay uppercase">Your pathway is ready</p>
        <h1 className="text-[clamp(2.4rem,8vw,3.6rem)] leading-[0.95] font-normal tracking-[-0.045em] text-forest">
          Where should we send it?
        </h1>
        <p className="max-w-[36ch] text-base leading-7 text-forest/72">
          Share a few details to see your pathway and your five-bowl mix. We’ll keep your
          answers with them so our team can help you get started.
        </p>
      </div>

      <form noValidate onSubmit={submit} aria-busy={pending} className="grid gap-5 rounded-lg border border-forest/12 bg-card p-5 sm:p-7">
        <label className={LABEL}>
          Full name
          <input
            className={INPUT}
            autoComplete="name"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
            onChange={(event) => set("name", event.target.value)}
          />
          {fieldError("name")}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={LABEL}>
            Email
            <input
              className={INPUT}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "lead-email-error" : undefined}
              onChange={(event) => set("email", event.target.value)}
            />
            {fieldError("email")}
          </label>
          <label className={LABEL}>
            Phone
            <input
              className={INPUT}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "lead-phone-error" : undefined}
              onChange={(event) => set("phone", event.target.value)}
            />
            {fieldError("phone")}
          </label>
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-2 text-xs font-bold tracking-[0.1em] text-forest/70 uppercase">How would you like your bowls?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["pickup", "delivery"] as const).map((method) => (
              <label
                key={method}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 text-sm transition-colors",
                  "border-forest/15 bg-oat/70 hover:border-forest/40 has-checked:border-forest has-checked:bg-oat has-checked:shadow-[0_0_0_1px_var(--color-forest)]",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="lead-fulfillment"
                    value={method}
                    checked={values.fulfillmentMethod === method}
                    onChange={() => set("fulfillmentMethod", method)}
                    className="size-5 accent-forest"
                  />
                  <strong className="text-forest">{FULFILLMENT[method].label}</strong>
                </span>
                <span className="font-semibold text-forest/70">
                  {FULFILLMENT[method].amountCents === 0 ? "Free, one-time" : formatCents(FULFILLMENT[method].amountCents)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {values.fulfillmentMethod === "delivery" ? (
          <div className="grid gap-3">
            <label className={cn(LABEL, "sm:max-w-[12rem]")}>
              Delivery ZIP
              <input
                className={INPUT}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={values.deliveryZip}
                aria-invalid={Boolean(errors.deliveryZip)}
                aria-describedby={errors.deliveryZip ? "lead-deliveryZip-error" : undefined}
                onChange={(event) => set("deliveryZip", event.target.value.replace(/\D/g, ""))}
              />
              {fieldError("deliveryZip")}
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-forest/12 bg-oat/70 p-4 text-sm leading-relaxed text-forest/75">
              <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-forest"
                checked={values.deliveryCountyConfirmed}
                aria-invalid={Boolean(errors.deliveryCountyConfirmed)}
                onChange={(event) => set("deliveryCountyConfirmed", event.target.checked)}
              />
              <span>
                I confirm my delivery address is in Los Angeles County, California.
                {errors.deliveryCountyConfirmed ? <span className="mt-1 block text-clay">{errors.deliveryCountyConfirmed}</span> : null}
              </span>
            </label>
          </div>
        ) : null}

        {errors._root ? (
          <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-md border border-clay/30 bg-clay/8 px-4 py-3 text-sm text-forest outline-none">
            {errors._root}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending ? "Saving…" : "Reveal my pathway"}
        </Button>
        <p className="text-center text-xs leading-relaxed text-forest/65">
          No charge and no order on this step. By continuing, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2">Terms of Service</Link>.
        </p>
      </form>
    </div>
  );
}
