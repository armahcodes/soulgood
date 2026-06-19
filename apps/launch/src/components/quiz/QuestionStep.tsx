"use client";

import { useMemo } from "react";
import type { QuizQuestion } from "@/lib/quiz";
import { toggleSelection } from "@/lib/pathway-state";
import { OptionButton } from "./OptionButton";
import { Pill } from "./Pill";

type StepValue = string | string[] | undefined;

interface QuestionStepProps {
  question: QuizQuestion;
  value: StepValue;
  onChange: (value: StepValue) => void;
  /** For single-select: advance to the next step immediately on tap. */
  onAdvance: () => void;
}

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
}: QuestionStepProps) {
  const selectedArray = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value],
  );

  if (question.type === "text") {
    return (
      <div className="flex flex-col gap-4">
        <Header question={question} />
        <textarea
          id={`q-${question.id}`}
          aria-label={question.prompt}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="Optional — share a few words"
          className="w-full resize-none rounded-2xl border border-forest/15 bg-white/70 px-5 py-4 text-base text-forest placeholder:text-forest/35 focus:border-sage focus:outline-none"
        />
      </div>
    );
  }

  if (question.type === "single") {
    return (
      <div className="flex flex-col gap-4">
        <Header question={question} />
        <div
          role="radiogroup"
          aria-label={question.prompt}
          className="flex flex-col gap-3"
        >
          {question.options?.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              role="radio"
              selected={value === opt.value}
              onSelect={() => {
                onChange(opt.value);
                onAdvance();
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // multi — compact wrap-flowing pills (toggle chips)
  const max = question.maxSelections;
  const atCap = typeof max === "number" && selectedArray.length >= max;
  return (
    <div className="flex flex-col gap-4">
      <Header question={question} />
      <div
        role="group"
        aria-label={question.prompt}
        className="flex flex-wrap gap-[9px]"
      >
        {question.options?.map((opt) => {
          const selected = selectedArray.includes(opt.value);
          return (
            <Pill
              key={opt.value}
              label={opt.label}
              selected={selected}
              disabled={atCap && !selected}
              onToggle={() =>
                onChange(toggleSelection(selectedArray, opt.value, max))
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function Header({ question }: { question: QuizQuestion }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl leading-tight font-medium text-forest">
        {question.prompt}
      </h2>
      {question.helper && (
        <p className="text-sm text-clay">{question.helper}</p>
      )}
    </div>
  );
}
