"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { CateringInquiry } from "@/lib/types";

/* ============================================
   Zod Schema — manual validation pattern
   (no @hookform/resolvers, Zod v4 compatible)
   ============================================ */

const cateringSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  numberOfGuests: z.coerce.number().min(1, "Number of guests is required"),
  budgetRange: z.string().min(1, "Please select a budget range"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  location: z.string().min(1, "Location is required"),
  eventType: z.string().min(1, "Please select an event type"),
  dietaryRestrictions: z.array(z.string()).optional().default([]),
  dietaryOther: z.string().optional().default(""),
  cuisinePreferences: z.string().optional().default(""),
  serviceType: z.string().min(1, "Please select a service type"),
  additionalNotes: z.string().optional().default(""),
});

type CateringFormData = z.infer<typeof cateringSchema>;

const BUDGET_OPTIONS = [
  { value: "", label: "Select budget range" },
  { value: "Under $5K", label: "Under $5K" },
  { value: "$5K-$10K", label: "$5K – $10K" },
  { value: "$10K-$20K", label: "$10K – $20K" },
  { value: "$20K+", label: "$20K+" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "", label: "Select event type" },
  { value: "Sit-Down Dinner Party", label: "Sit-Down Dinner Party" },
  { value: "Catering", label: "Catering" },
  { value: "Tray-Passed Hors d'Oeuvres", label: "Tray-Passed Hors d'Oeuvres" },
  { value: "Corporate Event", label: "Corporate Event" },
];

const SERVICE_TYPE_OPTIONS = [
  { value: "", label: "Select service type" },
  { value: "Buffet", label: "Buffet" },
  { value: "Tray-Passed", label: "Tray-Passed" },
  { value: "Sit-Down", label: "Sit-Down" },
];

const DIETARY_OPTIONS = [
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Nut Allergy",
  "Shellfish Allergy",
];

/* ============================================
   Hero Section
   ============================================ */

function CateringHero() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          BOOK CHEF KYLA
        </p>
        <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Private Chef &amp; Catering
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
          From intimate sit-down dinners to large-scale corporate events, Chef
          Kyla brings her signature blend of soul food heritage and functional
          nutrition to your table. Every dish is made with intention and seasoned
          with love.
        </p>
      </div>
    </section>
  );
}

/* ============================================
   Full-Width Image
   ============================================ */

function CateringImage() {
  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[55vh]">
      <Image
        src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1800&h=900&fit=crop"
        alt="Beautifully plated catering spread with vibrant dishes and elegant table setting"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        data-placeholder="true"
      />
    </section>
  );
}

/* ============================================
   Select Component (reusable within this file)
   ============================================ */

interface SelectFieldProps {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  id?: string;
}

function SelectField({
  label,
  error,
  options,
  id,
  ...props
}: SelectFieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="block font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/70 mb-2"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "w-full bg-transparent border-0 border-b px-0 py-3 appearance-none",
          "font-body text-base text-black",
          "focus:outline-none transition-colors duration-300",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M6%208L1%203h10z%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-no-repeat bg-[right_0_center] bg-[length:12px]",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-border focus:border-black"
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs font-sans text-red-500">{error}</p>
      )}
    </div>
  );
}

/* ============================================
   Textarea Component (reusable within this file)
   ============================================ */

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

function TextareaField({
  label,
  error,
  id,
  ...props
}: TextareaFieldProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      <label
        htmlFor={textareaId}
        className="block font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/70 mb-2"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "w-full bg-transparent border-0 border-b px-0 py-3 resize-none",
          "font-body text-base text-black placeholder:text-black/40",
          "focus:outline-none transition-colors duration-300",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-border focus:border-black"
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-sans text-red-500">{error}</p>
      )}
    </div>
  );
}

/* ============================================
   Catering Inquiry Form
   ============================================ */

function CateringInquiryForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [otherChecked, setOtherChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<CateringFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      numberOfGuests: undefined as unknown as number,
      budgetRange: "",
      eventDate: "",
      eventTime: "",
      location: "",
      eventType: "",
      dietaryRestrictions: [],
      dietaryOther: "",
      cuisinePreferences: "",
      serviceType: "",
      additionalNotes: "",
    },
  });

  const onSubmit = (data: CateringFormData) => {
    // Validate with Zod
    const result = cateringSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CateringFormData;
        if (field) {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    // Build the CateringInquiry data
    const inquiryData: CateringInquiry = {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      numberOfGuests: result.data.numberOfGuests,
      budgetRange: result.data.budgetRange,
      eventDate: result.data.eventDate,
      eventTime: result.data.eventTime,
      location: result.data.location,
      eventType: result.data.eventType,
      dietaryRestrictions: [
        ...(result.data.dietaryRestrictions || []),
        ...(otherChecked && result.data.dietaryOther
          ? [`Other: ${result.data.dietaryOther}`]
          : []),
      ],
      cuisinePreferences: result.data.cuisinePreferences || "",
      serviceType: result.data.serviceType,
      additionalNotes: result.data.additionalNotes || "",
    };

    // TODO: Backend Integration - Submit catering inquiry data to API endpoint
    console.log("Catering inquiry submitted:", inquiryData);
    setIsSuccess(true);
    reset();
  };

  if (isSuccess) {
    return (
      <section className="max-container section-padding">
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="mb-6">
            <span className="inline-block w-16 h-16 bg-accent/10 flex items-center justify-center mx-auto">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            Thank You for Your Inquiry
          </h2>
          <p className="font-body text-lg text-black/70 leading-relaxed mb-8 max-w-xl mx-auto">
            We&apos;ve received your catering request. Chef Kyla or a member of
            our team will be in touch within 24–48 hours to discuss your event.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className={cn(
              "inline-flex items-center justify-center",
              "font-sans text-sm uppercase tracking-[0.06em] font-medium",
              "bg-black text-white px-8 py-4",
              "hover:bg-black/80 active:bg-black/70",
              "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
            )}
          >
            SUBMIT ANOTHER INQUIRY
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-container section-padding">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="label-text text-primary mb-4 text-xs tracking-widest">
            TELL US ABOUT YOUR EVENT
          </p>
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            Catering Inquiry
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed max-w-xl mx-auto">
            Fill out the form below and we&apos;ll work with you to create a
            custom menu that fits your vision, dietary needs, and budget.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-8"
        >
          {/* ---- Contact Info ---- */}
          <fieldset>
            <legend className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6">
              Contact Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input
                label="Name"
                placeholder="Your full name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@email.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="(555) 123-4567"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <Input
                label="Number of Guests"
                type="number"
                placeholder="e.g. 50"
                min={1}
                error={errors.numberOfGuests?.message}
                {...register("numberOfGuests", { valueAsNumber: true })}
              />
            </div>
          </fieldset>

          {/* ---- Event Details ---- */}
          <fieldset>
            <legend className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6">
              Event Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <SelectField
                label="Budget Range"
                options={BUDGET_OPTIONS}
                error={errors.budgetRange?.message}
                {...register("budgetRange")}
              />
              <SelectField
                label="Event Type"
                options={EVENT_TYPE_OPTIONS}
                error={errors.eventType?.message}
                {...register("eventType")}
              />
              <Input
                label="Event Date"
                type="date"
                error={errors.eventDate?.message}
                {...register("eventDate")}
              />
              <Input
                label="Event Time"
                type="time"
                error={errors.eventTime?.message}
                {...register("eventTime")}
              />
              <div className="md:col-span-2">
                <Input
                  label="Location"
                  placeholder="Event venue or address"
                  error={errors.location?.message}
                  {...register("location")}
                />
              </div>
            </div>
          </fieldset>

          {/* ---- Dietary / Allergy Restrictions ---- */}
          <fieldset>
            <legend className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6">
              Dietary &amp; Allergy Restrictions
            </legend>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DIETARY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    value={option}
                    {...register("dietaryRestrictions")}
                    className={cn(
                      "w-5 h-5 border border-border bg-transparent",
                      "checked:bg-black checked:border-black",
                      "focus:outline-none focus:ring-2 focus:ring-primary/30",
                      "transition-colors duration-200 cursor-pointer",
                      "accent-black"
                    )}
                  />
                  <span className="font-body text-sm text-black/80 group-hover:text-black transition-colors">
                    {option}
                  </span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={otherChecked}
                  onChange={(e) => setOtherChecked(e.target.checked)}
                  className={cn(
                    "w-5 h-5 border border-border bg-transparent",
                    "checked:bg-black checked:border-black",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30",
                    "transition-colors duration-200 cursor-pointer",
                    "accent-black"
                  )}
                />
                <span className="font-body text-sm text-black/80 group-hover:text-black transition-colors">
                  Other
                </span>
              </label>
            </div>
            {otherChecked && (
              <div className="mt-4">
                <Input
                  label="Please specify"
                  placeholder="Other dietary restrictions or allergies"
                  {...register("dietaryOther")}
                />
              </div>
            )}
          </fieldset>

          {/* ---- Menu Preferences ---- */}
          <fieldset>
            <legend className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6">
              Menu Preferences
            </legend>
            <div className="space-y-6">
              <TextareaField
                label="Cuisine Preferences"
                placeholder="Tell us about your desired cuisine style, specific dishes, or flavors you love"
                {...register("cuisinePreferences")}
              />
              <SelectField
                label="Service Type"
                options={SERVICE_TYPE_OPTIONS}
                error={errors.serviceType?.message}
                {...register("serviceType")}
              />
            </div>
          </fieldset>

          {/* ---- Additional Notes ---- */}
          <fieldset>
            <legend className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-6">
              Additional Information
            </legend>
            <TextareaField
              label="Additional Notes"
              placeholder="Anything else you'd like us to know about your event"
              {...register("additionalNotes")}
            />
          </fieldset>

          {/* ---- Submit ---- */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full md:w-auto inline-flex items-center justify-center",
                "font-sans text-sm uppercase tracking-[0.06em] font-medium",
                "bg-black text-white px-12 py-4",
                "hover:bg-black/80 active:bg-black/70",
                "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              SUBMIT INQUIRY
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ============================================
   Main Export
   ============================================ */

export function CateringContent() {
  return (
    <>
      <CateringHero />
      <CateringImage />
      <CateringInquiryForm />
    </>
  );
}
