"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { ResultScreen } from "@/components/quiz/ResultScreen";
import { QUESTIONS, type QuizAnswers } from "@/lib/quiz";
import {
  buildPathwayState,
  savePathwayState,
  type PathwayState,
} from "@/lib/pathway-state";

type StepValue = string | string[] | undefined;

const TOTAL = QUESTIONS.length;

export default function QuizPage() {
  const [step, setStep] = useState(0);
  /** Animation direction: 1 = forward, -1 = back. */
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<PathwayState | null>(null);

  const question = QUESTIONS[step];
  const isLast = step === TOTAL - 1;

  const currentValue = answers[question.id] as StepValue;

  function setValue(value: StepValue) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    if (isLast) {
      finish();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function finish() {
    const state = buildPathwayState(answers);
    savePathwayState(state);
    setResult(state);
  }

  if (result) {
    return (
      <Shell>
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ResultScreen pathway={result.pathway} />
        </motion.div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <QuizProgress current={step + 1} total={TOTAL} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <QuestionStep
              question={question}
              value={currentValue}
              onChange={setValue}
              onAdvance={goNext}
            />
          </motion.div>
        </AnimatePresence>

        {/* Single-select advances on tap, so it needs no Continue button. */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="text-sm font-medium text-forest/60 underline-offset-4 hover:underline disabled:opacity-0"
          >
            Back
          </button>

          {question.type !== "single" && (
            <Button
              type="button"
              onClick={goNext}
              className="min-w-[8rem]"
            >
              {isLast ? "See my pathway" : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-8 px-5 py-8">
      <header className="flex items-center gap-2">
        <Logo size={32} className="text-forest" />
        <span className="font-serif text-sm tracking-[0.18em] text-forest uppercase">
          Soul Good
        </span>
      </header>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </main>
  );
}
