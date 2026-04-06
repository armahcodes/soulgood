"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Clock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ============================================
   Zod Schema — manual validation pattern
   (no @hookform/resolvers, Zod v4 compatible)
   ============================================ */

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const SUBJECT_OPTIONS = [
  { value: "", label: "Select a subject" },
  { value: "General", label: "General" },
  { value: "Meal Plans", label: "Meal Plans" },
  { value: "Catering", label: "Catering" },
  { value: "Events", label: "Events" },
  { value: "Other", label: "Other" },
];

/* ============================================
   Social SVG Icons (matching Footer pattern)
   ============================================ */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.84.55 9.38.55 9.38.55s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.54 15.57V8.43L15.82 12l-6.28 3.57z" />
    </svg>
  );
}

/* ============================================
   Hero Section
   ============================================ */

function ContactHero() {
  return (
    <section className="bg-cream">
      <div className="max-container section-padding text-center">
        <p className="label-text text-primary mb-5 text-xs tracking-widest">
          REACH OUT
        </p>
        <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6 max-w-4xl mx-auto">
          Get In Touch
        </h1>
        <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
          Have a question, feedback, or want to work with us? We&apos;d love to
          hear from you.
        </p>
      </div>
    </section>
  );
}

/* ============================================
   Contact Information Sidebar
   ============================================ */

function ContactInfo() {
  return (
    <div className="space-y-10">
      {/* Email */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-sans text-xs uppercase tracking-[0.16em] font-medium">
            EMAIL
          </h3>
        </div>
        <a
          href={`mailto:${BRAND.email}`}
          className="font-body text-base text-black/70 hover:text-primary transition-colors duration-300"
        >
          {BRAND.email}
        </a>
      </div>

      {/* Social Media */}
      <div>
        <h3 className="font-sans text-xs uppercase tracking-[0.16em] font-medium mb-4">
          FOLLOW US
        </h3>
        <div className="flex gap-4">
          <a
            href={BRAND.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black/70 hover:text-primary transition-colors duration-300"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-5 h-5" />
            <span className="font-body text-sm">Instagram</span>
          </a>
          <a
            href={BRAND.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black/70 hover:text-primary transition-colors duration-300"
            aria-label="TikTok"
          >
            <TikTokIcon className="w-5 h-5" />
            <span className="font-body text-sm">TikTok</span>
          </a>
          <a
            href={BRAND.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-black/70 hover:text-primary transition-colors duration-300"
            aria-label="YouTube"
          >
            <YouTubeIcon className="w-5 h-5" />
            <span className="font-body text-sm">YouTube</span>
          </a>
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-sans text-xs uppercase tracking-[0.16em] font-medium">
            BUSINESS HOURS
          </h3>
        </div>
        <div className="font-body text-base text-black/70 space-y-1">
          <p>Monday – Friday: 9:00 AM – 6:00 PM PST</p>
          <p>Saturday: 10:00 AM – 4:00 PM PST</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Contact Form
   ============================================ */

function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    /* Manual Zod validation (Zod v4 pattern, no @hookform/resolvers) */
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        setError(field, { message: issue.message });
      }
      return;
    }

    // TODO: Backend Integration - Submit contact form data to API endpoint
    console.log("Contact form submitted:", result.data);
    setIsSuccess(true);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="bg-cream p-10 text-center">
        <div className="mb-4">
          <div className="w-14 h-14 mx-auto bg-accent/10 flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-accent" />
          </div>
        </div>
        <h3 className="font-heading text-2xl mb-3">Message Sent!</h3>
        <p className="font-body text-base text-black/70 leading-relaxed mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24–48
          hours.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className={cn(
            "inline-flex items-center justify-center",
            "font-sans text-sm uppercase tracking-[0.06em] font-medium",
            "bg-black text-white px-8 py-3.5",
            "hover:bg-black/80 active:bg-black/70",
            "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          )}
        >
          SEND ANOTHER MESSAGE
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Name */}
      <Input
        label="Name"
        placeholder="Your full name"
        {...register("name", {
          validate: (v) => {
            const r = contactSchema.shape.name.safeParse(v);
            return r.success ? true : r.error.issues[0]?.message || "Name is required";
          },
        })}
        error={errors.name?.message}
      />

      {/* Email */}
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        {...register("email", {
          validate: (v) => {
            const r = contactSchema.shape.email.safeParse(v);
            return r.success ? true : r.error.issues[0]?.message || "Email is required";
          },
        })}
        error={errors.email?.message}
      />

      {/* Subject */}
      <div className="w-full">
        <label
          htmlFor="subject"
          className="block font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/70 mb-2"
        >
          Subject
        </label>
        <select
          id="subject"
          {...register("subject", {
            validate: (v) => {
              const r = contactSchema.shape.subject.safeParse(v);
              return r.success ? true : r.error.issues[0]?.message || "Please select a subject";
            },
          })}
          className={cn(
            "w-full bg-transparent border-0 border-b px-0 py-3",
            "font-body text-base text-black",
            "focus:outline-none transition-colors duration-300",
            "appearance-none cursor-pointer",
            errors.subject
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-black"
          )}
        >
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p className="mt-1.5 text-xs font-sans text-red-500">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="w-full">
        <label
          htmlFor="message"
          className="block font-sans text-xs uppercase tracking-[0.06em] font-medium text-black/70 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="How can we help you?"
          {...register("message", {
            validate: (v) => {
              const r = contactSchema.shape.message.safeParse(v);
              return r.success ? true : r.error.issues[0]?.message || "Message is required";
            },
          })}
          className={cn(
            "w-full bg-transparent border-0 border-b px-0 py-3 resize-none",
            "font-body text-base text-black placeholder:text-black/40",
            "focus:outline-none transition-colors duration-300",
            errors.message
              ? "border-red-500 focus:border-red-500"
              : "border-border focus:border-black"
          )}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs font-sans text-red-500">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full inline-flex items-center justify-center",
          "font-sans text-sm uppercase tracking-[0.06em] font-medium",
          "bg-black text-white px-8 py-4",
          "hover:bg-black/80 active:bg-black/70",
          "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        SEND MESSAGE
      </button>
    </form>
  );
}

/* ============================================
   Contact Page Content (assembled)
   ============================================ */

export function ContactContent() {
  return (
    <>
      <ContactHero />

      <section className="max-container section-padding">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Form Column */}
          <div className="flex-1">
            <h2 className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-8">
              SEND US A MESSAGE
            </h2>
            <ContactForm />
          </div>

          {/* Info Column */}
          <div className="lg:w-80 shrink-0">
            <h2 className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-black/50 mb-8">
              CONTACT INFORMATION
            </h2>
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
