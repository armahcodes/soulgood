"use client";

import { SeedOfLife } from "@/components/ui/SeedOfLife";
import { Button } from "@/components/ui/Button";

interface QuizIntroProps {
  /** Begin the questions (advance to the first question). */
  onBegin: () => void;
}

/**
 * "Take a breath." — a calm threshold step shown BEFORE the quiz questions.
 * Centered column with a large blooming Seed of Life mark, a serif heading, the
 * lede copy (verbatim), and an "I'm ready" button that begins the questions.
 */
export function QuizIntro({ onBegin }: QuizIntroProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
        <SeedOfLife size={92} className="text-sage" bloom title="" />
        <h2 className="font-serif text-3xl leading-tight font-medium text-forest">
          Take a breath.
        </h2>
        <p className="max-w-[34ch] text-base leading-relaxed text-forest/75">
          The next few questions aren&rsquo;t a test. They&rsquo;re a way of
          noticing what your body and your days are asking for — so the food can
          answer it.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBegin}
          className="mt-2"
        >
          I&rsquo;m ready
        </Button>
    </div>
  );
}
