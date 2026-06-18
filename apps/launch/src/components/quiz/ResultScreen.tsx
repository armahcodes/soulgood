"use client";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { PATHWAY_DEFINITIONS } from "@/lib/pathways";
import type { Pathway } from "@/lib/lead-schema";

interface ResultScreenProps {
  pathway: Pathway;
}

/**
 * The quiz result: shows the matched pathway name + its three-word descriptor
 * and supporting line (verbatim from the PDF), with a CTA forward to /join.
 */
export function ResultScreen({ pathway }: ResultScreenProps) {
  const def = PATHWAY_DEFINITIONS[pathway];
  return (
    <div className="flex flex-col items-center gap-7 text-center">
      <Logo size={52} className="text-sage" />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium tracking-[0.22em] text-clay uppercase">
          Your Soul Good pathway
        </p>
        <h1 className="text-4xl leading-tight font-medium text-forest">
          {def.name}
        </h1>
        <p className="text-lg font-medium text-sage">{def.descriptor}</p>
      </div>
      <p className="max-w-[34ch] text-base leading-relaxed text-forest/75">
        {def.description}
      </p>
      <div className="flex w-full max-w-sm flex-col gap-3 pt-2">
        <Button as="a" href="/join" size="lg" className="w-full">
          Become a Founding Member
        </Button>
      </div>
    </div>
  );
}
