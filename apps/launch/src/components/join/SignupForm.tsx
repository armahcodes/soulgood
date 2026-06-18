"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { assembleLead, type JoinFormValues, type Plan } from "@/lib/join-lead";
import { leadSchema, type Lead } from "@/lib/lead-schema";
import { loadPathwayState, type PathwayState } from "@/lib/pathway-state";

/** Validate just the two captured fields against the lead schema's rules. */
const formFieldSchema = leadSchema.pick({ email: true, phone: true });

const PLANS: { value: Plan; label: string; sublabel: string }[] = [
  { value: "subscription", label: "Subscription", sublabel: "Auto-renews weekly" },
  { value: "one-time", label: "One-time", sublabel: "Just this week" },
];

export function SignupForm() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>("subscription");
  const [pathwayState, setPathwayState] = useState<PathwayState | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Which intent is currently submitting (so both buttons can show progress). */
  const [pending, setPending] = useState<Lead["intent"] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormValues>({
    mode: "onSubmit",
    defaultValues: { email: "", phone: "" },
  });

  // Read the matched pathway + nutrition profile carried from the quiz. Absent on
  // a deep-link to /join — that's fine, the lead just carries pathway: null.
  useEffect(() => {
    setPathwayState(loadPathwayState());
  }, []);

  /** Persist the lead, then route. Capture-first: never route before persisting. */
  async function submit(
    values: JoinFormValues,
    intent: Lead["intent"],
  ): Promise<void> {
    if (pending) return;
    setSubmitError(null);

    // Re-validate the captured fields with the schema (defense in depth).
    const fields = formFieldSchema.safeParse(values);
    if (!fields.success) {
      setSubmitError("Please enter a valid email and phone.");
      return;
    }

    const lead = assembleLead(values, pathwayState, intent, plan);
    setPending(intent);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        throw new Error(`Capture failed (${res.status})`);
      }
      // ONLY after the lead is persisted do we navigate.
      router.push(intent === "buyer" ? "/checkout" : "/welcome");
    } catch {
      setPending(null);
      setSubmitError("Something went wrong saving your spot. Please try again.");
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => submit(values, "buyer"))}
      className="flex flex-col gap-6"
    >
      {/* Subscription vs one-time toggle */}
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium tracking-[0.16em] text-clay uppercase">
          Choose your plan
        </legend>
        <div
          role="radiogroup"
          aria-label="Plan type"
          className="grid grid-cols-2 gap-2 rounded-2xl bg-sand/50 p-1.5"
        >
          {PLANS.map((p) => {
            const selected = plan === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPlan(p.value)}
                className={[
                  "flex min-h-[56px] flex-col items-center justify-center rounded-xl px-3 py-2 text-center transition-colors",
                  selected
                    ? "bg-forest text-oat"
                    : "bg-transparent text-forest/70 hover:bg-oat/60",
                ].join(" ")}
              >
                <span className="text-sm font-medium">{p.label}</span>
                <span
                  className={selected ? "text-xs text-oat/75" : "text-xs text-forest/50"}
                >
                  {p.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-forest">
          Email
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : undefined}
          className="min-h-[48px] rounded-xl border border-forest/20 bg-oat px-4 text-base text-forest placeholder:text-forest/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
          {...register("email", {
            validate: (value) =>
              formFieldSchema.shape.email.safeParse(value).success ||
              "Enter a valid email",
          })}
        />
        {errors.email && (
          <p role="alert" className="text-sm text-clay">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone (required) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-forest">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(310) 555-0134"
          aria-invalid={errors.phone ? "true" : undefined}
          className="min-h-[48px] rounded-xl border border-forest/20 bg-oat px-4 text-base text-forest placeholder:text-forest/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
          {...register("phone", {
            validate: (value) =>
              formFieldSchema.shape.phone.safeParse(value).success ||
              "Phone is required",
          })}
        />
        {errors.phone && (
          <p role="alert" className="text-sm text-clay">
            {errors.phone.message}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-clay">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1">
        <Button type="submit" size="lg" className="w-full" disabled={pending !== null}>
          {pending === "buyer" ? "Reserving…" : "Reserve my founding spot"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={pending !== null}
          onClick={handleSubmit((values) => submit(values, "list"))}
        >
          {pending === "list" ? "Joining…" : "Join the list with your pathway"}
        </Button>
      </div>
    </form>
  );
}
