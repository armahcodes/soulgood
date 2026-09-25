"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SeedOfLife } from "@/components/ui/SeedOfLife";
import { AVAILABLE_BOWLS } from "@/lib/current-offer";
import { QUESTIONS } from "@/lib/quiz";

/**
 * "Take a breath." — the calm threshold before the questions (lede copy
 * verbatim from the Pathway Finder), with what to expect.
 */
export function QuizIntro({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex flex-col items-center gap-7 text-center">
      <SeedOfLife size={88} className="text-sage-ink" bloom title="" />
      <div>
        <p className="text-[0.68rem] font-medium tracking-[0.22em] text-clay-ink uppercase">The Pathway Finder</p>
        <h1 className="mt-4 text-[clamp(3rem,10vw,4.5rem)] leading-[1.02] font-normal tracking-[0.01em] text-forest">
          Take a breath.
        </h1>
      </div>
      <p className="max-w-[34ch] text-lg leading-relaxed text-forest/75">
        The next few questions aren&rsquo;t a test. They&rsquo;re a way of
        noticing how your days look and how you like to eat — so we can suggest
        bowls, salads, and sides to start with.
      </p>
      <ul className="flex flex-wrap justify-center gap-2 text-xs font-medium tracking-[0.08em] text-forest/72 uppercase">
        <li className="rounded-full border border-forest/12 bg-card px-3 py-1.5">{QUESTIONS.length} questions</li>
        <li className="rounded-full border border-forest/12 bg-card px-3 py-1.5">About 2 minutes</li>
        <li className="rounded-full border border-forest/12 bg-card px-3 py-1.5">Bowls matched to you</li>
      </ul>
      <Button type="button" size="lg" onClick={onBegin} className="w-full sm:w-auto">
        I&rsquo;m ready
      </Button>
      <div aria-hidden="true" className="mt-2 flex -space-x-4">
        {AVAILABLE_BOWLS.map((bowl, index) => (
          <div
            key={bowl.id}
            className="relative size-14 overflow-hidden rounded-full border-4 border-oat bg-sand shadow-sm"
            style={{ zIndex: AVAILABLE_BOWLS.length - index }}
          >
            <Image src={bowl.imagePath} alt="" fill unoptimized sizes="56px" className="scale-150 object-cover object-[50%_60%]" />
          </div>
        ))}
      </div>
    </div>
  );
}
