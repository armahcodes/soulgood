"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mic, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================
   Zod Schema — manual validation pattern
   (no @hookform/resolvers, Zod v4 compatible)
   ============================================ */

const podcastSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type PodcastFormData = z.infer<typeof podcastSchema>;

/* ============================================
   Podcast Coming Soon Content
   ============================================ */

export function PodcastContent() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<PodcastFormData>({
    defaultValues: { email: "" },
  });

  const onSubmit = (data: PodcastFormData) => {
    /* Manual Zod validation (Zod v4 pattern, no @hookform/resolvers) */
    const result = podcastSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        if (issue.path[0] === "email") {
          setError("email", { message: issue.message });
        }
      }
      return;
    }

    // TODO: Backend Integration - Submit email to podcast notification API
    console.log("Podcast notification signup:", result.data);
    setIsSuccess(true);
    reset();
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="max-container section-padding text-center">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            PODCAST
          </p>
          <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
            Coming Soon
          </h1>
          <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
            A new podcast from Chef Kyla exploring the intersection of soul food,
            healing nutrition, and intentional living.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-container section-padding">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto bg-cream flex items-center justify-center mb-8">
            <Mic className="w-10 h-10 text-primary" />
          </div>

          {/* Description */}
          <h2 className="font-heading text-2xl md:text-3xl mb-6">
            The Soul Good Podcast
          </h2>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed mb-4">
            Join Chef Kyla as she sits down with wellness experts, fellow chefs,
            and community leaders to talk about the power of food as medicine,
            the rich heritage of Southern soul food, and how to nourish your body
            and spirit with intention.
          </p>
          <p className="font-body text-base md:text-lg text-black/70 leading-relaxed mb-12">
            From stories of transformation to practical cooking tips, each
            episode will inspire you to bring more soul, more love, and more
            wellness into your kitchen and your life.
          </p>

          {/* Divider */}
          <hr className="border-border mb-12" />

          {/* Email signup */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-sans text-xs uppercase tracking-[0.16em] font-medium">
              BE THE FIRST TO KNOW
            </h3>
          </div>
          <p className="font-body text-base text-black/70 leading-relaxed mb-8">
            Sign up to be notified when the Soul Good Podcast launches.
          </p>

          {isSuccess ? (
            <div className="py-6">
              <p className="font-body text-base text-accent font-medium">
                You&apos;re on the list! We&apos;ll notify you when the podcast
                launches.
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
                  aria-label="Email address for podcast notification"
                  {...register("email", {
                    validate: (v) => {
                      const r = podcastSchema.shape.email.safeParse(v);
                      return r.success
                        ? true
                        : r.error.issues[0]?.message ||
                            "Please enter a valid email address";
                    },
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
                NOTIFY ME
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
