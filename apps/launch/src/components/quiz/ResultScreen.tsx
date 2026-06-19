"use client";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SeedOfLife } from "@/components/ui/SeedOfLife";
import { PATHWAY_DEFINITIONS } from "@/lib/pathways";
import type { Pathway } from "@/lib/lead-schema";

interface ResultScreenProps {
  pathway: Pathway;
}

/**
 * The quiz result: shows the matched pathway name + its three-word descriptor
 * and supporting line (verbatim from the PDF), a warm "note" card, and a "taste
 * of what's on your plan" dish preview, with a CTA forward to /join.
 */
export function ResultScreen({ pathway }: ResultScreenProps) {
  const def = PATHWAY_DEFINITIONS[pathway];
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <SeedOfLife size={104} className="text-sage" bloom title="" />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold tracking-[0.22em] text-sage uppercase">
          Your Soul Good pathway
        </p>
        <h1 className="font-serif text-5xl leading-[1.04] font-medium text-forest">
          {def.name}
        </h1>
        <p className="text-base font-semibold tracking-[0.03em] text-sage">
          {def.descriptor}
        </p>
      </div>
      <p className="max-w-[34ch] text-base leading-relaxed text-forest/75">
        {def.description}
      </p>

      {/* Note card — a warm line cradled by a small leaf mark. */}
      <div className="flex w-full items-start gap-3 rounded-3xl border border-forest/10 bg-white/70 px-[18px] py-4 text-left">
        <Logo size={20} className="mt-0.5 shrink-0 text-sage" title="" />
        <p className="text-[14.5px] leading-relaxed text-forest/75">{def.note}</p>
      </div>

      {/* A taste of what's on your plan — small sand-colored dish pills. */}
      <div className="flex w-full flex-col items-center gap-2.5">
        <p className="text-xs font-bold tracking-[0.18em] text-forest/40 uppercase">
          A taste of what&rsquo;s on your plan
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {def.dishes.map((dish) => (
            <span
              key={dish}
              className="rounded-full border border-sand bg-sand/50 px-3 py-[7px] text-[13px] text-forest/70"
            >
              {dish}
            </span>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3 pt-2">
        <Button as="a" href="/join" size="lg" className="w-full">
          Become a Founding Member
        </Button>
      </div>
    </div>
  );
}
