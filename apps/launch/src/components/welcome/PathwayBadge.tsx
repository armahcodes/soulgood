"use client";

import { useSyncExternalStore } from "react";
import { loadPathwayState } from "@/lib/pathway-state";
import { PATHWAY_DEFINITIONS } from "@/lib/pathways";
import type { Pathway } from "@/lib/lead-schema";

/** sessionStorage never changes during this page's life — no real subscription. */
const noopSubscribe = () => () => {};

/**
 * Surfaces the guest's matched pathway on the welcome moment (read from the
 * sessionStorage handoff the quiz wrote). Renders nothing when absent — a
 * deep-linked guest still gets a complete welcome page without it. Read via
 * useSyncExternalStore so the server renders nothing and the client hydrates
 * the badge without a setState-in-effect cascade.
 */
export function PathwayBadge() {
  const pathway = useSyncExternalStore<Pathway | null>(
    noopSubscribe,
    () => loadPathwayState()?.pathway ?? null,
    () => null,
  );

  if (!pathway) return null;
  const def = PATHWAY_DEFINITIONS[pathway];

  return (
    <span className="w-fit rounded-full bg-sage/15 px-4 py-1.5 text-xs font-medium tracking-[0.16em] text-sage uppercase">
      Your pathway · {def.name}
    </span>
  );
}
