"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { BrandFooter } from "@/components/ui/BrandFooter";
import { QuestionStep } from "@/components/quiz/QuestionStep";
import { QuizIntro } from "@/components/quiz/QuizIntro";
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
  /** Whether the guest has passed the "Take a breath" intro into the questions. */
  const [started, setStarted] = useState(false);
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
    // From the first question, step back to the Intro threshold screen.
    if (step === 0) {
      setStarted(false);
      return;
    }
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

  // "Take a breath" threshold — shown first at /quiz, before any questions.
  if (!started) {
    return (
      <Shell>
        <motion.div
          key="intro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <QuizIntro
            onBegin={() => {
              setDirection(1);
              setStep(0);
              setStarted(true);
            }}
          />
        </motion.div>
      </Shell>
    );
  }

  // Multi-select and text (reflection) steps can run option-heavy and push the
  // advance control below the 390x844 fold. For those we pin the Back/Continue
  // bar to the bottom of the viewport so it stays reachable without hunting,
  // while the option list scrolls above it. Single-select advances on tap, so it
  // keeps the simple in-flow Back link with no Continue button.
  const sticky = question.type !== "single";

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <QuizProgress current={step + 1} total={TOTAL} onBack={goBack} />

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

        {/* Multi/text steps don't auto-advance, so they need a Continue control.
            Pinned to the bottom of the viewport so it stays in thumb reach while
            the options scroll above it. Back lives in the header (circular). */}
        {sticky && (
          <div className="sticky bottom-0 z-10 -mx-5 mt-2 flex items-center justify-end gap-3 border-t border-forest/10 bg-oat/95 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
            <Button type="button" onClick={goNext} className="min-w-[8rem]">
              {isLast ? "See my pathway" : "Continue"}
            </Button>
          </div>
        )}
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
      <BrandFooter />
    </main>
  );
}
