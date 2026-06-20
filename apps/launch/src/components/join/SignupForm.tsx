"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { assembleLead, type JoinFormValues } from "@/lib/join-lead";
import { leadSchema, type Lead } from "@/lib/lead-schema";
import { loadPathwayState } from "@/lib/pathway-state";

/** Validate just the captured fields against the lead schema's rules. */
const formFieldSchema = leadSchema.pick({ name: true, email: true, phone: true });

export function SignupForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Which intent is currently submitting (so both buttons can show progress). */
  const [pending, setPending] = useState<Lead["intent"] | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFormValues>({
    mode: "onSubmit",
    defaultValues: { name: "", email: "", phone: "" },
  });

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
      setSubmitError("Please enter your name, a valid email, and phone.");
      return;
    }

    // Read the matched pathway + nutrition profile carried from the quiz at
    // submit time. Absent on a deep-link to /join — that's fine, the lead just
    // carries pathway: null. (sessionStorage is available in this client handler.)
    const lead = assembleLead(values, loadPathwayState(), intent);
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
      // Capture-first, no charge for now: once the lead is persisted, go straight
      // to the welcome/confirmation page. (Payment is intentionally disabled.)
      router.push("/welcome");
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
      {/* Full name (required) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-forest">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={errors.name ? "true" : undefined}
          className="min-h-[48px] rounded-xl border border-forest/20 bg-oat px-4 text-base text-forest placeholder:text-forest/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
          {...register("name", {
            validate: (value) =>
              formFieldSchema.shape.name.safeParse(value).success ||
              "Name is required",
          })}
        />
        {errors.name && (
          <p role="alert" className="text-sm text-clay">
            {errors.name.message}
          </p>
        )}
      </div>

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
          {pending ? "Reserving…" : "Reserve my spot"}
        </Button>
        <p className="text-center text-xs leading-relaxed text-forest/55">
          No charge today — just your details. We&rsquo;ll reach out to start your
          plan.
        </p>
      </div>
    </form>
  );
}
