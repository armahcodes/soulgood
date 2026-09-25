"use client";

import type { QuizQuestion } from "@/lib/quiz";
import { toggleSelection } from "@/lib/pathway-state";
import { OptionButton } from "./OptionButton";
import { Pill } from "./Pill";

type StepValue = string | string[] | undefined;

/**
 * Renders one quiz question. Single-select advances on tap; multi-select toggles
 * (honoring `maxSelections`); text renders an optional free-text area. All
 * prompts, helper lines, and option labels are passed through VERBATIM.
 */
export function QuestionStep({
  question,
  value,
  onChange,
  onAdvance,
}: {
  question: QuizQuestion;
  value: StepValue;
  onChange: (value: StepValue) => void;
  /** For single-select: advance to the next step after a tap. */
  onAdvance: () => void;
}) {
  const selected = Array.isArray(value) ? value : [];
  const headingId = `q-${question.id}-heading`;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <h1 id={headingId} className="text-[clamp(2rem,6vw,2.9rem)] leading-[1.02] font-normal tracking-[0.01em] text-forest">
          {question.prompt}
        </h1>
        {question.helper ? (
          <p className="text-sm font-semibold text-clay-ink">{question.helper}</p>
        ) : question.type === "multi" ? (
          <p className="text-sm text-forest/72">Choose any that apply, or continue.</p>
        ) : question.type === "text" ? (
          <p className="text-sm text-forest/72">Optional. A few words is plenty.</p>
        ) : null}
      </div>

      {question.type === "text" ? (
        <textarea
          id={`q-${question.id}`}
          aria-labelledby={headingId}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Share a few words"
          className="w-full resize-none rounded-lg border border-forest/15 bg-card px-5 py-4 text-lg text-forest placeholder:text-forest/35 focus:border-forest/50 focus:ring-4 focus:ring-sage/20 focus:outline-none"
        />
      ) : question.type === "single" ? (
        <div role="radiogroup" aria-labelledby={headingId} className="grid gap-3">
          {question.options?.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              selected={value === option.value}
              onSelect={() => {
                onChange(option.value);
                onAdvance();
              }}
            />
          ))}
        </div>
      ) : (
        <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-2.5">
          {question.options?.map((option) => {
            const isSelected = selected.includes(option.value);
            const atCap = typeof question.maxSelections === "number" && selected.length >= question.maxSelections;
            return (
              <Pill
                key={option.value}
                label={option.label}
                selected={isSelected}
                disabled={atCap && !isSelected}
                onToggle={() => onChange(toggleSelection(selected, option.value, question.maxSelections))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
