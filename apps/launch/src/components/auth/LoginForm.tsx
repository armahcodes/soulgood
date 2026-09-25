"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/kit/otp-input";
import { authClient } from "@/lib/auth-client";
import { safeAccountRedirect } from "@/lib/safe-redirect";

const INPUT_CLASS =
  "min-h-12 w-full rounded-md border border-forest/18 bg-white px-4 text-base text-forest outline-none transition-[border-color,box-shadow] placeholder:text-forest/38 focus:border-forest/60 focus:ring-4 focus:ring-sage/20";

export function LoginForm({
  redirectTo = "/account",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [notice, setNotice] = useState("");
  const inFlight = useRef(false);
  const codeInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const managingPlan =
    safeAccountRedirect(redirectTo).split("?")[0] === "/cancel";

  useEffect(() => {
    if (step === "code") codeInput.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!resendAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (!remaining) clearInterval(timer);
    };
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [resendAt]);

  async function sendCode(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await requestCode();
  }

  async function requestCode(): Promise<void> {
    if (inFlight.current || Date.now() < resendAt) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    setNotice("");
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { error: authError } =
        await authClient.emailOtp.sendVerificationOtp({
          email: normalizedEmail,
          type: "sign-in",
        });
      if (authError) {
        setError(
          "We could not send a sign-in code. Check the email and try again.",
        );
        return;
      }
      setEmail(normalizedEmail);
      setOtp("");
      setResendAt(Date.now() + 60_000);
      setSecondsRemaining(60);
      setNotice(
        step === "code"
          ? "A new code is on its way. Use the most recent code."
          : "Check your inbox for your sign-in code.",
      );
      setStep("code");
      if (step === "code") codeInput.current?.focus();
    } catch {
      setError(
        "We could not reach sign-in. Check your connection and try again.",
      );
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    try {
      const { error: authError } = await authClient.signIn.emailOtp({
        email,
        otp: otp.trim(),
        name: "Soul Bowls Customer",
      });
      if (authError) {
        setError(
          "That code is invalid or expired. Request a new code and try again.",
        );
        codeInput.current?.focus();
        return;
      }
      router.push(safeAccountRedirect(redirectTo));
      router.refresh();
    } catch {
      setError(
        "We could not verify the code. Check your connection and try again.",
      );
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  if (step === "code") {
    return (
      <form className="grid gap-5" onSubmit={verifyCode} aria-busy={pending}>
        <div>
          <label
            htmlFor="login-code"
            className="mb-2 block text-xs font-medium tracking-[0.12em] text-forest/58 uppercase"
          >
            Six-digit code
          </label>
          <OtpInput
            id="login-code"
            ref={codeInput}
            aria-describedby={`code-help${error ? " login-error" : ""}`}
            aria-invalid={Boolean(error)}
            invalid={Boolean(error)}
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            required
            value={otp}
            onValueChange={setOtp}
          />
          <p
            id="code-help"
            className="mt-2 break-words text-sm leading-relaxed text-forest/75"
          >
            We sent a code to {email}. It expires in 10 minutes.
          </p>
        </div>
        <Button type="submit" size="lg" disabled={pending || otp.length !== 6}>
          {pending
            ? "Please wait…"
            : managingPlan
              ? "Manage my weekly plan"
              : "View my orders"}
        </Button>
        {error ? (
          <p
            id="login-error"
            role="alert"
            className="rounded-md border border-clay/30 bg-clay/8 px-4 py-3 text-sm leading-6 text-forest"
          >
            {error}
          </p>
        ) : null}
        {notice ? (
          <p role="status" className="text-sm leading-6 text-forest/75">
            {notice}
          </p>
        ) : null}
        <div className="border-t border-forest/12 pt-3">
          <p className="text-sm leading-6 text-forest/75">
            No code yet? Check spam or junk, then request a new one.
          </p>
          <button
            type="button"
            disabled={pending || secondsRemaining > 0}
            className="mt-1 flex min-h-11 w-full items-center justify-center text-sm font-semibold underline underline-offset-4 disabled:no-underline disabled:opacity-60"
            onClick={() => void requestCode()}
          >
            {secondsRemaining > 0
              ? `Resend code in ${secondsRemaining}s`
              : "Resend code"}
          </button>
          <button
            type="button"
            disabled={pending}
            className="flex min-h-11 w-full items-center justify-center text-sm font-semibold underline underline-offset-4"
            onClick={() => {
              setOtp("");
              setError(null);
              setNotice("");
              setStep("email");
              requestAnimationFrame(() => emailInput.current?.focus());
            }}
          >
            Use a different email
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={sendCode} aria-busy={pending}>
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-xs font-medium tracking-[0.12em] text-forest/58 uppercase"
        >
          Order email
        </label>
        <input
          id="login-email"
          ref={emailInput}
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="email"
          className={INPUT_CLASS}
          inputMode="email"
          placeholder="you@example.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending || !email.trim() || secondsRemaining > 0}
      >
        {pending
          ? "Sending secure code…"
          : secondsRemaining > 0
            ? `Send a new code in ${secondsRemaining}s`
            : "Email me a sign-in code"}
      </Button>
      <p className="text-xs leading-relaxed text-forest/70">
        Use the same email entered at checkout to find your{" "}
        {managingPlan ? "weekly plan" : "orders"}. Signing in does not place an
        order or change a plan.
      </p>
      {error ? (
        <p
          id="login-error"
          role="alert"
          className="rounded-md border border-clay/30 bg-clay/8 px-4 py-3 text-sm leading-relaxed text-forest"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
