"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/lib/brand";
import {
  commitmentsSchema,
  communityStepSchema,
  HOST_COMMITMENTS,
  MEAL_DRIVE_COUNTIES,
  MEAL_DRIVE_LEAD_DAYS,
  NEED_INDICATORS,
  NON_DISCRIMINATION_STATEMENT,
  ORGANIZATION_TYPES,
  organizationStepSchema,
  SITE_FEATURES,
  SITE_SETTINGS,
  siteStepSchema,
  TIME_WINDOWS,
} from "@/lib/meal-drive";
import { cn } from "@/lib/utils";

const STEPS = ["Organization", "Community", "Site & date", "Commitments"] as const;
const INPUT =
  "mt-2 min-h-12 w-full min-w-0 rounded-md border border-forest/20 bg-white px-4 py-3 text-base text-forest placeholder:text-forest/40 focus:border-sage focus:ring-2 focus:ring-sage/25 focus:outline-none aria-[invalid=true]:border-clay";
const LABEL = "block text-sm font-semibold text-forest";

type Values = Record<string, string | string[] | boolean | Record<string, boolean>>;

function addDays(date: string, days: number) {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function MealDriveApplicationForm({ today }: { today: string }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({
    ...Object.fromEntries(
      ["organizationName", "organizationWebsite", "contactName", "contactRole", "email", "phone", "communityArea", "households", "needDetails", "siteName", "addressLine1", "city", "postalCode", "preferredDate", "alternateDate", "volunteers", "notes", "website"].map((key) => [key, ""]),
    ),
    organizationType: "nonprofit",
    needs: [],
    features: [],
    county: "Los Angeles",
    setting: "outdoor",
    sitePermission: "confirmed",
    timeWindow: "midday",
    commitments: {},
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "received">("idle");
  const [reference, setReference] = useState("");
  const [failure, setFailure] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const minDate = addDays(today, MEAL_DRIVE_LEAD_DAYS);

  const set = (key: string, value: Values[string]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };
  const toggle = (key: string, value: string) => {
    const list = (values[key] as string[]) ?? [];
    set(key, list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };
  const text = (key: string) => (typeof values[key] === "string" ? (values[key] as string) : "");

  function validate(index: number): boolean {
    const schema = [organizationStepSchema, communityStepSchema, siteStepSchema][index];
    const result =
      index < 3
        ? schema.safeParse(values)
        : commitmentsSchema.safeParse(values.commitments).success && values.consent === true
          ? { success: true as const }
          : { success: false as const, error: { issues: [{ path: [values.consent ? "commitments" : "consent"], message: values.consent ? "Every host commitment is required." : "Please agree to be contacted about your application." }] } };
    const extra: Record<string, string> = {};
    if (index === 1 && (values.needs as string[]).includes("other") && text("needDetails").length < 10)
      extra.needDetails = "Please describe the community need.";
    if (index === 2) {
      if (text("preferredDate") && text("preferredDate") < minDate) extra.preferredDate = `Please choose a date at least ${MEAL_DRIVE_LEAD_DAYS} days from today.`;
      if (text("alternateDate") && text("alternateDate") < minDate) extra.alternateDate = `Please choose a date at least ${MEAL_DRIVE_LEAD_DAYS} days from today.`;
    }
    const found: Record<string, string> = { ...extra };
    if (!result.success) for (const issue of result.error.issues) found[String(issue.path[0])] ??= issue.message;
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus());
    return !first;
  }

  const go = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => form.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    if (step < STEPS.length - 1) {
      if (validate(step)) go(step + 1);
      return;
    }
    if (!validate(step)) return;
    setStatus("sending");
    setFailure("");
    try {
      const response = await fetch("/api/meal-drive-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: text("website") }),
        signal: AbortSignal.timeout(25_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.received) throw new Error(typeof result?.error === "string" ? result.error : "");
      setReference(result.reference);
      setStatus("received");
    } catch (cause) {
      setFailure(cause instanceof Error && cause.message ? cause.message : "We couldn’t save your application. Your answers are still here—please try again.");
      setStatus("idle");
    }
  }

  const error = (key: string) =>
    errors[key] ? (
      <p id={`md-${key}-error`} className="mt-2 text-sm text-clay">
        {errors[key]}
      </p>
    ) : null;
  const field = (key: string, label: ReactNode, input: ReactNode, className?: string) => (
    <div className={className}>
      <label htmlFor={`md-${key}`} className={LABEL}>
        {label}
      </label>
      {input}
      {error(key)}
    </div>
  );
  const textInput = (key: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      id={`md-${key}`}
      data-field={key}
      value={text(key)}
      onChange={(event) => set(key, event.target.value)}
      aria-invalid={Boolean(errors[key]) || undefined}
      aria-describedby={errors[key] ? `md-${key}-error` : undefined}
      className={INPUT}
      {...props}
    />
  );
  const choice = (key: string, option: { value: string; label: string }, multiple = false) => {
    const selected = multiple ? ((values[key] as string[]) ?? []).includes(option.value) : values[key] === option.value;
    return (
      <label
        key={option.value}
        className={cn(
          "flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-clay",
          selected ? "border-forest bg-forest text-oat" : "border-forest/15 bg-white text-forest hover:border-forest/40",
        )}
      >
        <input
          type={multiple ? "checkbox" : "radio"}
          name={key}
          data-field={key}
          className="sr-only"
          checked={selected}
          onChange={() => (multiple ? toggle(key, option.value) : set(key, option.value))}
        />
        <span className={cn("mt-1 flex size-4 shrink-0 items-center justify-center border", multiple ? "rounded-sm" : "rounded-full", selected ? "border-oat bg-oat text-forest" : "border-forest/35")}>
          {selected ? <Check className="size-3" aria-hidden /> : null}
        </span>
        {option.label}
      </label>
    );
  };

  if (status === "received")
    return (
      <div role="status" className="flex flex-col items-center rounded-lg border border-forest/12 bg-card px-6 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-forest text-oat">
          <Check className="size-6" aria-hidden />
        </span>
        <h3 className="mt-6 text-4xl leading-tight text-forest">Application received.</h3>
        <p className="mt-3 text-sm font-medium tracking-[0.16em] text-clay uppercase">Reference {reference}</p>
        <p className="mt-4 max-w-md text-base leading-7 text-forest/75">
          Thank you. We sent a confirmation to your email. We review complete applications in the order we receive them
          and will reply about fit, timing, and next steps. Your drive isn’t confirmed until we plan it together.
        </p>
        <Link href="/food-for-the-soul" className="mt-7 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
          Back to Food for the Soul
        </Link>
      </div>
    );

  return (
    <form ref={form} onSubmit={submit} noValidate aria-busy={status === "sending"} className="scroll-mt-28 rounded-lg border border-forest/12 bg-card p-5 sm:p-8">
      <nav aria-label="Application progress" className="relative mb-8 grid grid-cols-4 gap-2">
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-[12.5%] top-3.5 h-0.5 rounded-full bg-forest/10">
          <span className="block h-full rounded-full bg-sage transition-[width] duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </span>
        {STEPS.map((label, index) => (
          <button
            key={label}
            type="button"
            disabled={index > step}
            aria-current={index === step ? "step" : undefined}
            onClick={() => go(index)}
            className="relative flex flex-col items-center gap-1.5 text-center text-[0.72rem] font-medium text-forest/70 disabled:opacity-50 aria-[current=step]:text-forest sm:text-sm"
          >
            <span className={cn("flex size-7 items-center justify-center rounded-full text-xs ring-4 ring-card", index === step ? "bg-forest text-oat" : index < step ? "bg-sage text-oat" : "bg-sand text-forest/70")}>
              {index < step ? <Check className="size-3.5" aria-hidden /> : index + 1}
            </span>
            {label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.fieldset
          key={step}
          disabled={status === "sending"}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid min-w-0 gap-6"
        >
          <legend className="mb-2 font-serif text-3xl text-forest">
            <span className="sr-only">Step {step + 1} of {STEPS.length}: </span>
            {["About your organization", "The community you’ll serve", "Where and when", "Our shared commitments"][step]}
          </legend>

          {step === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {field("organizationName", "Organization name", textInput("organizationName", { autoComplete: "organization", maxLength: 160 }), "sm:col-span-2")}
              {field(
                "organizationType",
                "Type of organization",
                <select id="md-organizationType" data-field="organizationType" value={text("organizationType")} onChange={(event) => set("organizationType", event.target.value)} className={INPUT}>
                  {ORGANIZATION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>,
              )}
              {field("organizationWebsite", "Website or social page (optional)", textInput("organizationWebsite", { type: "url", inputMode: "url", maxLength: 200, placeholder: "https://" }))}
              {field("contactName", "Your name", textInput("contactName", { autoComplete: "name", maxLength: 100 }))}
              {field("contactRole", "Your role", textInput("contactRole", { maxLength: 100, placeholder: "Organizer, director, coordinator…" }))}
              {field("email", "Email", textInput("email", { type: "email", autoComplete: "email", maxLength: 254 }))}
              {field("phone", "Phone", textInput("phone", { type: "tel", autoComplete: "tel" }))}
              <p className="text-xs leading-5 text-forest/60 sm:col-span-2">
                Every kind of organization is reviewed the same way. We ask about your group only so we can plan the drive with you.
              </p>
            </div>
          ) : step === 1 ? (
            <div className="grid gap-5">
              {field("communityArea", "Neighborhood or area you’ll serve", textInput("communityArea", { maxLength: 200, placeholder: "e.g., West Long Beach, near 7th Street" }))}
              {field("households", "About how many households do you expect?", textInput("households", { type: "number", inputMode: "numeric", min: 25, max: 2000, placeholder: "25–2,000" }), "sm:max-w-xs")}
              <fieldset className="grid gap-2">
                <legend className={LABEL}>Which describe the need nearby? Choose all that apply.</legend>
                <p className="-mt-1 mb-1 text-xs leading-5 text-forest/60">
                  We focus on households at risk of going without enough food. We never ask who the people you serve are.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">{NEED_INDICATORS.map((option) => choice("needs", option, true))}</div>
                {error("needs")}
              </fieldset>
              {field(
                "needDetails",
                "Tell us more about the need (optional)",
                <textarea
                  id="md-needDetails"
                  data-field="needDetails"
                  rows={4}
                  maxLength={1500}
                  value={text("needDetails")}
                  onChange={(event) => set("needDetails", event.target.value)}
                  placeholder="What you’re seeing in the community, such as long lines at local pantries or a recent closure. Please don’t include personal details about individuals."
                  className={cn(INPUT, "resize-y")}
                />,
              )}
            </div>
          ) : step === 2 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {field("siteName", "Site name (optional)", textInput("siteName", { maxLength: 160, placeholder: "e.g., Community center parking lot" }), "sm:col-span-2")}
              {field("addressLine1", "Street address", textInput("addressLine1", { autoComplete: "address-line1", maxLength: 200 }), "sm:col-span-2")}
              {field("city", "City", textInput("city", { autoComplete: "address-level2", maxLength: 100 }))}
              {field("postalCode", "ZIP code", textInput("postalCode", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 5 }))}
              <fieldset className="grid gap-2 sm:col-span-2">
                <legend className={LABEL}>County</legend>
                <div className="grid gap-2 sm:grid-cols-2">{MEAL_DRIVE_COUNTIES.map((county) => choice("county", { value: county, label: `${county} County` }))}</div>
                {error("county")}
              </fieldset>
              <fieldset className="grid gap-2 sm:col-span-2">
                <legend className={LABEL}>Setting</legend>
                <div className="grid gap-2 sm:grid-cols-3">{SITE_SETTINGS.map((option) => choice("setting", option))}</div>
              </fieldset>
              <fieldset className="grid gap-2 sm:col-span-2">
                <legend className={LABEL}>What does the site have? Choose all that apply.</legend>
                <div className="grid gap-2">{SITE_FEATURES.map((option) => choice("features", option, true))}</div>
              </fieldset>
              <fieldset className="grid gap-2 sm:col-span-2">
                <legend className={LABEL}>Do you have permission to use the site?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {choice("sitePermission", { value: "confirmed", label: "Yes, confirmed" })}
                  {choice("sitePermission", { value: "in-progress", label: "We’re arranging it" })}
                </div>
                {error("sitePermission")}
              </fieldset>
              {field("preferredDate", "Preferred date", textInput("preferredDate", { type: "date", min: minDate }))}
              {field("alternateDate", "Alternate date (optional)", textInput("alternateDate", { type: "date", min: minDate }))}
              <fieldset className="grid gap-2 sm:col-span-2">
                <legend className={LABEL}>Time of day</legend>
                <div className="grid gap-2 sm:grid-cols-2">{TIME_WINDOWS.map((option) => choice("timeWindow", option))}</div>
              </fieldset>
              {field("volunteers", "Volunteers you can bring", textInput("volunteers", { type: "number", inputMode: "numeric", min: 2, max: 500 }))}
              <p className="self-end text-xs leading-5 text-forest/60">
                Plan on about one volunteer for every 50 households, and at least four in total.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              <p className="rounded-lg border border-sage/30 bg-sage/8 p-4 text-sm leading-6 text-forest">
                <strong className="font-semibold">Non-discrimination commitment.</strong> {NON_DISCRIMINATION_STATEMENT}
              </p>
              <fieldset className="grid gap-2" data-field="commitments" tabIndex={-1}>
                <legend className={LABEL}>Please confirm each commitment</legend>
                {HOST_COMMITMENTS.map((item) => {
                  const checked = Boolean((values.commitments as Record<string, boolean>)[item.key]);
                  return (
                    <label key={item.key} className={cn("flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6", checked ? "border-forest/40 bg-oat" : "border-forest/15 bg-white")}>
                      <input
                        type="checkbox"
                        className="mt-1 size-5 shrink-0 accent-forest"
                        checked={checked}
                        onChange={(event) => set("commitments", { ...(values.commitments as Record<string, boolean>), [item.key]: event.target.checked })}
                      />
                      {item.label}
                    </label>
                  );
                })}
                {error("commitments")}
              </fieldset>
              {field(
                "notes",
                "Anything else we should know? (optional)",
                <textarea id="md-notes" data-field="notes" rows={3} maxLength={1500} value={text("notes")} onChange={(event) => set("notes", event.target.value)} className={cn(INPUT, "resize-y")} />,
              )}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="md-website">Leave this empty</label>
                <input id="md-website" tabIndex={-1} autoComplete="off" value={text("website")} onChange={(event) => set("website", event.target.value)} />
              </div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-forest/80">
                <input type="checkbox" data-field="consent" className="mt-1 size-5 shrink-0 accent-forest" checked={values.consent === true} onChange={(event) => set("consent", event.target.checked)} />
                <span>
                  Soul Good may contact me about this application. My details are used as described in the{" "}
                  <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
                </span>
              </label>
              {error("consent")}
            </div>
          )}
        </motion.fieldset>
      </AnimatePresence>

      {failure ? (
        <p role="alert" className="mt-6 rounded-lg border border-clay/35 bg-clay/8 p-4 text-sm leading-6 text-forest">
          {failure} You can also email <a href={`mailto:${CONTACT.email}?subject=Meal%20drive%20application`} className="underline">{CONTACT.email}</a>.
        </p>
      ) : null}

      <div className="mt-8 flex items-center gap-3 border-t border-forest/10 pt-5">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={() => go(step - 1)} className="shrink-0 !px-4">
            <ArrowLeft className="size-4" aria-hidden />
            <span className="sr-only sm:not-sr-only sm:ml-2">Back</span>
          </Button>
        ) : null}
        <Button type="submit" size="lg" className="flex-1" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <LoaderCircle className="mr-2 size-4 animate-spin" aria-hidden /> Sending application…
            </>
          ) : step < STEPS.length - 1 ? (
            <>
              Continue to {STEPS[step + 1].toLowerCase()} <ArrowRight className="ml-2 size-4" aria-hidden />
            </>
          ) : (
            "Submit application"
          )}
        </Button>
      </div>
    </form>
  );
}
