"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { COMMUNITY_DRIVE } from "@/lib/community-drive";

export function ShareDrive() {
  const [state, setState] = useState<"idle" | "copied" | "fallback">("idle");
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(COMMUNITY_DRIVE.url);
      setState("copied");
    } catch {
      setState("fallback");
    }
  }
  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-12 items-center justify-center gap-2 border border-forest/30 px-6 text-sm font-bold transition-colors hover:bg-forest hover:text-oat"
      >
        {state === "copied" ? (
          <Check aria-hidden="true" size={16} />
        ) : (
          <Copy aria-hidden="true" size={16} />
        )}
        {state === "copied" ? "Link copied" : "Share the good · Copy link"}
      </button>
      <div aria-live="polite">
        {state === "copied" && (
          <p className="mt-3 text-sm">Ready to share with your community.</p>
        )}
        {state === "fallback" && (
          <div className="mx-auto mt-4 max-w-md">
            <label htmlFor="drive-share-url" className="text-sm">
              Copy this link to share the drive:
            </label>
            <input
              id="drive-share-url"
              readOnly
              value={COMMUNITY_DRIVE.url}
              onFocus={(event) => event.target.select()}
              className="mt-2 min-h-12 w-full border border-forest/30 bg-oat px-3 text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
