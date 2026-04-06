"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<NewsletterFormData>({
    defaultValues: { email: "" },
  });

  const onSubmit = (data: NewsletterFormData) => {
    // Validate with Zod
    const result = newsletterSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.issues;
      for (const issue of fieldErrors) {
        if (issue.path[0] === "email") {
          setError("email", { message: issue.message });
        }
      }
      return;
    }

    // TODO: Backend Integration - Submit email to newsletter API endpoint
    console.log("Newsletter signup:", result.data);
    setIsSuccess(true);
    reset();
  };

  const handleValidation = (value: string) => {
    const result = newsletterSchema.shape.email.safeParse(value);
    if (!result.success) {
      return result.error.issues[0]?.message || "Please enter a valid email address";
    }
    return true;
  };

  return (
    <section className="section-padding max-container bg-cream-dark">
      <div className="max-w-2xl mx-auto text-center">
        {/* Headline */}
        <h2 className="font-sans text-sm uppercase tracking-[0.16em] font-medium mb-4">
          STAY CONNECTED
        </h2>

        {/* Body text */}
        <p className="font-body text-base md:text-lg text-black/70 leading-relaxed mb-8">
          Sign up to receive Soul Good updates and exclusive offers.
        </p>

        {/* Form */}
        {isSuccess ? (
          <div className="py-6">
            <p className="font-body text-base text-accent font-medium">
              Thank you for signing up! We&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col sm:flex-row items-start gap-4 max-w-lg mx-auto"
          >
            <div className="w-full flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                {...register("email", {
                  validate: handleValidation,
                })}
                className={cn(
                  "w-full bg-transparent border-0 border-b px-0 py-3",
                  "font-body text-base text-black placeholder:text-black/40",
                  "focus:outline-none transition-colors duration-300",
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-border focus:border-black"
                )}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-sans text-red-500 text-left">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center justify-center",
                "font-sans text-sm uppercase tracking-[0.06em] font-medium",
                "bg-black text-white px-8 py-3.5",
                "hover:bg-black/80 active:bg-black/70",
                "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
                "disabled:opacity-50 disabled:pointer-events-none",
                "w-full sm:w-auto shrink-0"
              )}
            >
              SIGN UP
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
