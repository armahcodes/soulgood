"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const SHARE_URL = "https://soulgood.kitchen";
const SHARE_TEXT =
  "I just joined the Soul Good Founding 50 — Nourish • Heal • Thrive. Come eat with intention with me.";

/**
 * Follow/share affordance for the welcome moment. Uses the native Web Share
 * sheet when available (mobile), and falls back to copying the link to the
 * clipboard with a brief confirmation.
 */
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Soul Good",
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        return;
      } catch {
        // User dismissed the share sheet, or share failed — fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      className="w-full"
      onClick={handleShare}
      aria-live="polite"
    >
      {copied ? "Link copied — thank you!" : "Share that you joined"}
    </Button>
  );
}
