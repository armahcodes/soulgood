"use client";

import { useSyncExternalStore } from "react";
import { CollectionMenu } from "@/components/menu/CollectionMenu";
import { loadPathwayState } from "@/lib/pathway-state";
import { PATHWAY_DEFINITIONS } from "@/lib/pathways";
import type { Pathway } from "@/lib/lead-schema";

/** sessionStorage never changes during this page's life — no real subscription. */
const noopSubscribe = () => () => {};

/**
 * Reveals the matched pathway's full menu on the welcome page (read from the
 * sessionStorage handoff the quiz wrote). Renders nothing when absent so a
 * deep-linked guest still gets a complete welcome page. Read via
 * useSyncExternalStore so the server renders nothing and the client hydrates
 * without a setState-in-effect cascade.
 */
export function WelcomeMenu() {
  const pathway = useSyncExternalStore<Pathway | null>(
    noopSubscribe,
    () => loadPathwayState()?.pathway ?? null,
    () => null,
  );

  if (!pathway) return null;
  const def = PATHWAY_DEFINITIONS[pathway];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-xl font-medium text-forest">
          Your {def.name} menu
        </h2>
        <p className="max-w-[36ch] text-sm leading-relaxed text-forest/70">
          Every box is curated to your pathway. Here&rsquo;s the full menu your
          meals and juices are drawn from.
        </p>
      </div>
      <CollectionMenu collection={pathway} eyebrow="On your plan" />
    </section>
  );
}
