"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/lib/brand";
import {
  COMMUNITY_DRIVE,
  COMMUNITY_INTERESTS,
  communityInterestSchema,
  type CommunityInterestKind,
} from "@/lib/community-drive";

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-forest/30 bg-oat/40 px-4 py-3 text-base text-forest placeholder:text-forest/50 aria-[invalid=true]:border-red-700";

export function CommunityInterestForm() {
  const [interest, setInterest] = useState<CommunityInterestKind>("host");
  const [status, setStatus] = useState<"idle" | "sending" | "received">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState("");
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "received") successRef.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setFailure("");
    const fields = new FormData(event.currentTarget);
    const parsed = communityInterestSchema.safeParse({
      name: fields.get("name"),
      email: fields.get("email"),
      interest,
      community: fields.get("community"),
      organization: fields.get("organization"),
      message: fields.get("message"),
      consent: fields.get("consent") === "on",
      website: fields.get("website"),
    });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues)
        nextErrors[String(issue.path[0])] ??= issue.message;
      setErrors(nextErrors);
      const firstField = Object.keys(nextErrors)[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstField}"]`)
        ?.focus();
      return;
    }
    setErrors({});
    submitting.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/community-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(25_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.received !== true) {
        setFailure(
          typeof result?.error === "string"
            ? result.error
            : "We couldn’t complete your request. Please try again or email our team below.",
        );
        setStatus("idle");
        return;
      }
      setStatus("received");
    } catch {
      setFailure(
        "We couldn’t confirm your request. Your details are still here—please try again or email our team below.",
      );
      setStatus("idle");
    } finally {
      submitting.current = false;
    }
  }

  function fieldError(field: string) {
    return errors[field] ? (
      <p id={`community-${field}-error`} className="mt-2 text-sm text-red-800">
        {errors[field]}
      </p>
    ) : null;
  }

  return (
    <section
      id="get-involved"
      aria-labelledby="connection-heading"
      className="scroll-mt-8 bg-sand/35 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="text-center lg:text-left">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-forest/75">
            A place for you at the table
          </p>
          <h2
            id="connection-heading"
            className="mt-5 text-5xl leading-[1.02] tracking-[0.01em] sm:text-6xl"
          >
            Let’s bring a little
            <br className="hidden sm:block" /> good together.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-7 text-forest/80 lg:mx-0">
            We provide the meals. You bring a connection to your community. Tell
            us a little about yourself, and let’s explore what we can do
            together.
          </p>
          <div className="mx-auto mt-8 max-w-md border-t border-forest/20 pt-6 lg:mx-0">
            <p className="text-sm font-bold">What happens next?</p>
            <p className="mt-2 text-sm leading-6 text-forest/75">
              Your interest goes to the Soul Good team. We’ll connect about next
              steps, fit, and available ways to participate. A conversation
              comes before any commitment.
            </p>
          </div>
          <p className="mt-6 text-sm leading-6">
            Prefer a conversation by email?
            <br />
            <a
              className="inline-flex min-h-11 items-center break-all underline underline-offset-4"
              href={`mailto:${CONTACT.email}?subject=Food%20for%20the%20Soul`}
            >
              {CONTACT.email}
            </a>
          </p>
        </div>
        <div className="border border-forest/15 bg-oat p-5 sm:p-8 rounded-lg">
          {status === "received" ? (
            <div
              className="flex min-h-[400px] flex-col items-center justify-center text-center"
              role="status"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-oat">
                <Check aria-hidden="true" size={25} />
              </span>
              <h3
                ref={successRef}
                tabIndex={-1}
                className="mt-6 text-4xl leading-tight outline-none"
              >
                You’re part of the conversation.
              </h3>
              <p className="mt-4 max-w-md text-base leading-7 text-forest/80">
                Your interest has been received by Soul Good. Our team will
                follow up using the email you shared.
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-forest/75">
                This isn’t a confirmed meal drive, volunteer placement, or meal
                reservation. We’ll discuss the details with you directly.
              </p>
              <a
                href="#next-drive"
                className="mt-7 inline-flex min-h-12 items-center gap-2 font-bold underline underline-offset-4"
              >
                See the October 15 drive{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          ) : (
            <>
              <noscript>
                <style>{".community-interest-form { display: none; }"}</style>
                <p className="text-base leading-7">
                  To get involved,{" "}
                  <a
                    className="underline"
                    href={`mailto:${CONTACT.email}?subject=Food%20for%20the%20Soul`}
                  >
                    email the Soul Good team
                  </a>{" "}
                  with your name, community, and how you’d like to participate.
                </p>
              </noscript>
              <form
                ref={formRef}
                className="community-interest-form"
                onSubmit={submit}
                action="/api/community-interest"
                method="post"
                noValidate
                aria-busy={status === "sending"}
              >
                <fieldset disabled={status === "sending"}>
                  <legend className="mb-4 text-base font-bold">
                    How would you like to connect?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {COMMUNITY_INTERESTS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex min-h-24 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${interest === option.value ? "border-forest bg-forest text-oat" : "border-forest/25 hover:border-forest"}`}
                      >
                        <input
                          type="radio"
                          name="interest"
                          value={option.value}
                          checked={interest === option.value}
                          onChange={() => {
                            setInterest(option.value);
                            if (option.value !== "host") {
                              setErrors((current) => ({
                                ...current,
                                community: "",
                              }));
                            }
                          }}
                          className="mt-1 size-4 shrink-0 accent-clay"
                        />
                        <span>
                          <span className="block text-sm font-bold leading-5">
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 block text-xs leading-5 ${interest === option.value ? "text-oat/80" : "text-forest/75"}`}
                          >
                            {option.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {interest === "host" ? (
                    <p className="mt-4 rounded-lg border border-sage/30 bg-sage/10 p-3 text-sm leading-6 text-forest">
                      Representing an organization and ready to plan?{" "}
                      <a href="/food-for-the-soul/host" className="font-bold underline underline-offset-4">
                        Use the host application
                      </a>
                      . Not sure yet? Start a conversation here.
                    </p>
                  ) : null}
                  <p className="mt-6 text-xs text-forest/75">
                    All fields required unless marked optional.
                  </p>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="community-name"
                        className="text-sm font-bold"
                      >
                        Your name
                      </label>
                      <input
                        id="community-name"
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={100}
                        className={inputClass}
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "community-name-error" : undefined
                        }
                      />
                      {fieldError("name")}
                    </div>
                    <div>
                      <label
                        htmlFor="community-email"
                        className="text-sm font-bold"
                      >
                        Email address
                      </label>
                      <input
                        id="community-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        className={inputClass}
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "community-email-error" : undefined
                        }
                      />
                      {fieldError("email")}
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="community-city"
                        className="text-sm font-bold"
                      >
                        Community or city
                        {interest !== "host" ? " (optional)" : ""}
                      </label>
                      <input
                        id="community-city"
                        name="community"
                        autoComplete="address-level2"
                        required={interest === "host"}
                        maxLength={160}
                        placeholder="Where would you like to make a difference?"
                        className={inputClass}
                        aria-invalid={!!errors.community}
                        aria-describedby={
                          errors.community
                            ? "community-community-error"
                            : undefined
                        }
                      />
                      {fieldError("community")}
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="community-organization"
                        className="text-sm font-bold"
                      >
                        Organization (optional)
                      </label>
                      <input
                        id="community-organization"
                        name="organization"
                        autoComplete="organization"
                        maxLength={160}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="community-message"
                        className="text-sm font-bold"
                      >
                        Anything you’d like us to know? (optional)
                      </label>
                      <textarea
                        id="community-message"
                        name="message"
                        rows={3}
                        maxLength={1500}
                        placeholder="Share your idea, the community you serve, or how you’d like to help. Please don’t include private details about meal recipients."
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  </div>
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="community-website">Leave this empty</label>
                    <input
                      id="community-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <label className="mt-5 flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-6">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-1 size-5 shrink-0 accent-forest"
                      aria-invalid={!!errors.consent}
                      aria-describedby={
                        errors.consent ? "community-consent-error" : undefined
                      }
                    />
                    <span>
                      Soul Good may contact me about Food for the Soul and my
                      interest in participating. This does not sign me up for a
                      meal plan or unrelated marketing.
                    </span>
                  </label>
                  {fieldError("consent")}
                  {failure && (
                    <p
                      role="alert"
                      className="mt-5 border border-red-800/30 bg-red-50 p-4 text-sm leading-6 text-red-900 rounded-lg"
                    >
                      {failure}
                    </p>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    className="mt-6 w-full gap-3"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />{" "}
                        Sending your interest…
                      </>
                    ) : (
                      <>
                        Let’s connect{" "}
                        <ArrowRight size={18} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                  <p className="mt-4 text-center text-xs leading-5 text-forest/75">
                    An invitation to connect. No payment or commitment required.
                    <br />
                    Contact us anytime to update or remove your details. See our{" "}
                    <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
                  </p>
                </fieldset>
              </form>
            </>
          )}
        </div>
      </div>
      <p className="sr-only">
        Next Food for the Soul meal drive: {COMMUNITY_DRIVE.date}.
      </p>
    </section>
  );
}
