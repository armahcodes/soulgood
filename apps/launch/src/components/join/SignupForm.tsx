"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { assembleLead, type JoinFormValues } from "@/lib/join-lead";
import { leadFieldSchemas, leadSchema, type Lead } from "@/lib/lead-schema";
import type { FulfillmentMethod } from "@/lib/brand";

const INPUT_CLASS =
  "min-h-[52px] rounded-none border border-forest/18 bg-white/70 px-4 text-base text-forest placeholder:text-forest/35 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20";

export function SignupForm({ initialFulfillment = "delivery" }: { initialFulfillment?: FulfillmentMethod }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Which intent is currently submitting (so both buttons can show progress). */
  const [pending, setPending] = useState<Lead["intent"] | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JoinFormValues>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      fulfillmentMethod: initialFulfillment,
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

    const lead = assembleLead(values, null, intent);
    // Re-validate the complete lead, including conditional delivery rules.
    const fields = leadSchema.safeParse(lead);
    if (!fields.success) {
      setSubmitError(
        values.fulfillmentMethod === "delivery"
          ? "Complete your contact information and confirm an eligible LA County delivery ZIP."
          : "Complete your contact information and pickup preference.",
      );
      return;
    }

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
      window.sessionStorage.setItem("soulbowls:fulfillment", values.fulfillmentMethod);
      const nameParts = values.name.trim().split(/\s+/);
      window.sessionStorage.setItem(
        "soulbowls:checkoutContact",
        JSON.stringify({
          givenName: nameParts.shift() ?? "",
          familyName: nameParts.join(" "),
          email: values.email.trim(),
          phone: values.phone.trim(),
        }),
      );
      router.push(`/checkout?fulfillment=${values.fulfillmentMethod}`);
    } catch {
      setPending(null);
      setSubmitError("Something went wrong saving your spot. Please try again.");
    }
  }

  const fulfillmentMethod = useWatch({ control, name: "fulfillmentMethod" });

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
              leadFieldSchemas.name.safeParse(value).success ||
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
              leadFieldSchemas.email.safeParse(value).success ||
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
              leadFieldSchemas.phone.safeParse(value).success ||
              "Phone is required",
          })}
        />
        {errors.phone && (
          <p role="alert" className="text-sm text-clay">
            {errors.phone.message}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-forest">
          How do you want your bowls?
        </legend>
        <label className="flex cursor-pointer items-center justify-between gap-4 border border-forest/15 bg-white/70 p-4 text-sm text-forest/75 transition-colors hover:border-sage">
          <span className="flex items-center gap-3">
            <input
              type="radio"
              value="pickup"
              className="h-5 w-5 accent-forest"
              {...register("fulfillmentMethod")}
            />
            <span>
              <strong className="block text-forest">Pickup</strong>
              Location and Sunday window confirmed before fulfillment
            </span>
          </span>
          <strong className="text-forest">$0</strong>
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-4 border border-forest/15 bg-white/70 p-4 text-sm text-forest/75 transition-colors hover:border-sage">
          <span className="flex items-center gap-3">
            <input
              type="radio"
              value="delivery"
              className="h-5 w-5 accent-forest"
              {...register("fulfillmentMethod")}
            />
            <span>
              <strong className="block text-forest">LA County delivery</strong>
              Sunday delivery throughout Los Angeles County
            </span>
          </span>
          <strong className="text-forest">$8.88/wk</strong>
        </label>
      </fieldset>

      {fulfillmentMethod === "delivery" && (
        <>
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
                  fulfillmentMethod !== "delivery" ||
                  /^\d{5}$/.test(value.trim()) ||
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
            <label className="flex cursor-pointer items-start gap-3 border border-forest/15 bg-sand/25 p-4 text-sm leading-relaxed text-forest/72">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
                aria-invalid={errors.deliveryCountyConfirmed ? "true" : undefined}
                {...register("deliveryCountyConfirmed", {
                  validate: (value) =>
                    fulfillmentMethod !== "delivery" ||
                    value ||
                    "Confirm that your delivery address is in Los Angeles County",
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
        </>
      )}

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
