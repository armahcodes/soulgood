"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { safeAccountRedirect } from "@/lib/safe-redirect";

const INPUT_CLASS =
  "min-h-12 w-full border border-forest/18 bg-white px-4 text-base text-forest outline-none placeholder:text-forest/38 focus:border-clay";

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

  async function sendCode(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPending(true);
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { error: authError } =
        await authClient.emailOtp.sendVerificationOtp({
          email: normalizedEmail,
          type: "sign-in",
        });
      setPending(false);
      if (authError) {
        setError(
          "We could not send a sign-in code. Check the email and try again.",
        );
        return;
      }
      setEmail(normalizedEmail);
      setStep("code");
    } catch {
      setError(
        "We could not reach sign-in. Check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const { error: authError } = await authClient.signIn.emailOtp({
        email,
        otp: otp.trim(),
        name: "Soul Bowls Customer",
      });
      setPending(false);
      if (authError) {
        setError(
          "That code is invalid or expired. Request a new code and try again.",
        );
        return;
      }
      router.push(safeAccountRedirect(redirectTo));
      router.refresh();
    } catch {
      setError(
        "We could not verify the code. Check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (step === "code") {
    return (
      <form className="grid gap-5" onSubmit={verifyCode}>
        <div>
          <label
            htmlFor="login-code"
            className="mb-2 block text-xs font-bold tracking-[0.12em] text-forest/58 uppercase"
          >
            Six-digit code
          </label>
          <input
            id="login-code"
            aria-describedby="code-help"
            autoComplete="one-time-code"
            autoFocus
            className={`${INPUT_CLASS} text-center text-2xl tracking-[0.35em]`}
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="000000"
            required
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
          <p
            id="code-help"
            className="mt-2 text-sm leading-relaxed text-forest/52"
          >
            We sent a code to {email}. It expires in 10 minutes.
          </p>
        </div>
        <Button type="submit" size="lg" disabled={pending || otp.length !== 6}>
          {pending ? "Signing in…" : "View my orders"}
        </Button>
        <button
          type="button"
          disabled={pending}
          className="text-sm font-semibold text-clay underline underline-offset-4"
          onClick={() => {
            setOtp("");
            setError(null);
            setStep("email");
          }}
        >
          Use a different email
        </button>
        {error ? (
          <p role="alert" className="text-sm leading-relaxed text-clay">
            {error}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={sendCode}>
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-xs font-bold tracking-[0.12em] text-forest/58 uppercase"
        >
          Order email
        </label>
        <input
          id="login-email"
          autoComplete="email"
          autoFocus
          className={INPUT_CLASS}
          inputMode="email"
          placeholder="you@example.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <Button type="submit" size="lg" disabled={pending || !email.trim()}>
        {pending ? "Sending secure code…" : "Email me a sign-in code"}
      </Button>
      <p className="text-xs leading-relaxed text-forest/48">
        No password needed. Use the same email entered at checkout to see its
        orders.
      </p>
      {error ? (
        <p role="alert" className="text-sm leading-relaxed text-clay">
          {error}
        </p>
      ) : null}
    </form>
  );
}
