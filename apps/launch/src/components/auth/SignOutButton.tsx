"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      className="text-xs font-bold tracking-[0.1em] text-forest/58 uppercase underline decoration-forest/20 underline-offset-4 hover:text-clay disabled:opacity-50"
      onClick={async () => {
        setPending(true);
        setError(false);
        try {
          const result = await authClient.signOut();
          if (result.error) throw new Error("Sign-out failed");
          window.sessionStorage.removeItem("soulbowls:checkoutContact");
          window.sessionStorage.removeItem("soulbowls:lastOrder");
          router.push("/");
          router.refresh();
        } catch {
          setError(true);
        } finally {
          setPending(false);
        }
      }}
    >
      {pending
        ? "Signing out…"
        : error
          ? "Sign-out failed — retry"
          : "Sign out"}
    </button>
  );
}
