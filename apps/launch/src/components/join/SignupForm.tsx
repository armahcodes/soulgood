"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { assembleLead, type JoinFormValues } from "@/lib/join-lead";
import { leadSchema, type Lead } from "@/lib/lead-schema";

/** Validate just the captured fields against the lead schema's rules. */
const formFieldSchema = leadSchema.pick({
  name: true,
  email: true,
  phone: true,
  deliveryZip: true,
  deliveryCountyConfirmed: true,
});

const INPUT_CLASS =
  "min-h-[54px] rounded-2xl border border-forest/15 bg-white px-4 text-base text-forest shadow-sm placeholder:text-forest/35 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25";

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
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      deliveryZip: "",
      deliveryCountyConfirmed: false,
    },
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
      setSubmitError("Complete your contact information and confirm an eligible delivery ZIP.");
      return;
    }

    const lead = assembleLead(values, null, intent);
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
      const result = (await res.json()) as { id?: string };
      if (result.id) {
        window.sessionStorage.setItem("soulbowls:leadId", result.id);
      }
      window.sessionStorage.setItem("soulbowls:deliveryZip", values.deliveryZip.trim());
      router.push("/checkout");
    } catch {
      setPending(null);
      setSubmitError("Something went wrong saving your spot. Please try again.");
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => submit(values, "buyer"))}
      className="flex flex-col gap-5"
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
          className={INPUT_CLASS}
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
          className={INPUT_CLASS}
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
          className={INPUT_CLASS}
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="deliveryZip" className="text-sm font-medium text-forest">
          Delivery ZIP
        </label>
        <input
          id="deliveryZip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="90012"
          aria-invalid={errors.deliveryZip ? "true" : undefined}
          className={INPUT_CLASS}
          {...register("deliveryZip", {
            validate: (value) =>
              formFieldSchema.shape.deliveryZip.safeParse(value).success ||
              "Enter a 5-digit delivery ZIP",
          })}
        />
        {errors.deliveryZip && (
          <p role="alert" className="text-sm text-clay">
            {errors.deliveryZip.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-forest/12 bg-sand/25 p-4 text-sm leading-relaxed text-forest/72">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
            aria-invalid={errors.deliveryCountyConfirmed ? "true" : undefined}
            {...register("deliveryCountyConfirmed", {
              validate: (value) =>
                value || "Confirm that your delivery address is in Los Angeles County",
            })}
          />
          <span>I confirm my delivery address is in Los Angeles County, California.</span>
        </label>
        {errors.deliveryCountyConfirmed && (
          <p role="alert" className="text-sm text-clay">
            {errors.deliveryCountyConfirmed.message}
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
          {pending ? "Reserving…" : "Reserve my Soul Bowls™"}
        </Button>
        <p className="text-center text-xs leading-relaxed text-forest/55">
          No charge on this step. Purchase terms are shown before payment. By
          continuing, you agree to our <Link href="/terms" className="underline underline-offset-2">Terms</Link>
          {` `}and acknowledge the <Link href="/customer-agreement" className="underline underline-offset-2">Customer Agreement</Link>.
        </p>
      </div>
    </form>
  );
}
