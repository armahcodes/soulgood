"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/**
 * Reserve CTA for /checkout. Uses an explicit `router.push("/welcome")` click
 * handler (rather than a bare <Link>) so a tap registers reliably even if it
 * lands immediately on arrival, before a Link would have fully hydrated.
 */
export function ReserveButton() {
  const router = useRouter();
  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      onClick={() => router.push("/welcome")}
    >
      Reserve my spot &amp; continue
    </Button>
  );
}
