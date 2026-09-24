"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import type { FulfillmentMethod } from "@/lib/brand";
import {
  buildPathwayState,
  loadPathwayState,
  savePathwayState,
  type PathwayState,
} from "@/lib/pathway-state";
import { PATHWAYS } from "@/lib/lead-schema";
import { QUESTIONS, type QuizAnswers } from "@/lib/quiz";
import { LeadGate } from "./LeadGate";
import { QuestionStep } from "./QuestionStep";
import { QuizIntro } from "./QuizIntro";
import { QuizProgress } from "./QuizProgress";
import { ResultScreen } from "./ResultScreen";

type Phase = "intro" | "questions" | "gate" | "result";
type StepValue = string | string[] | undefined;

const TOTAL = QUESTIONS.length;
const EASE = [0.22, 1, 0.36, 1] as const;

function storedFulfillment(): FulfillmentMethod {
  return window.sessionStorage.getItem("soulbowls:fulfillment") === "pickup" ? "pickup" : "delivery";
}

/** Pathway Finder: intro → 11 questions → contact → pathway and mix. */
export function QuizFlow() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<PathwayState | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("delivery");
  const advanceTimer = useRef<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Returning in the same tab after completing the quiz shows the saved result.
  useEffect(() => {
    const saved = loadPathwayState();
    if (!saved || !PATHWAYS.includes(saved.pathway) || !window.sessionStorage.getItem("soulbowls:leadId")) return;
    queueMicrotask(() => {
      setResult(saved);
      setFulfillment(storedFulfillment());
      setPhase("result");
    });
  }, []);

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }, []);

  // Move focus to each new screen's heading and bring it into view.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      const heading = stage.current?.querySelector<HTMLElement>("h1");
      if (heading && phase !== "intro") {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, step, reduced]);

  const question = QUESTIONS[step];
  const isLast = step === TOTAL - 1;

  const finish = () => {
    const state = buildPathwayState(answers);
    savePathwayState(state);
    setResult(state);
    if (window.sessionStorage.getItem("soulbowls:leadId")) {
      setFulfillment(storedFulfillment());
      setPhase("result");
    } else {
      setPhase("gate");
    }
  };

  const goNext = () => {
    if (isLast) return finish();
    setDirection(1);
    setStep((current) => current + 1);
  };

  const goBack = () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    if (step === 0) return setPhase("intro");
    setDirection(-1);
    setStep((current) => current - 1);
  };

  const setValue = (value: StepValue) => setAnswers((current) => ({ ...current, [question.id]: value }));

  const retake = () => {
    setAnswers({});
    setStep(0);
    setDirection(1);
    setPhase("questions");
  };

  const screenMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, x: direction * 36 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction * -36 },
        transition: { duration: 0.35, ease: EASE },
      };

  return (
    <div ref={stage} className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
      {phase === "questions" ? (
        <div className="mb-10">
          <QuizProgress current={step + 1} total={TOTAL} onBack={goBack} />
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div key={phase === "questions" ? question.id : phase} {...screenMotion} className="flex flex-1 flex-col">
          {phase === "intro" ? (
            <div className="flex flex-1 items-center justify-center">
              <QuizIntro
                onBegin={() => {
                  setDirection(1);
                  setPhase("questions");
                }}
              />
            </div>
          ) : phase === "questions" ? (
            <QuestionStep
              question={question}
              value={answers[question.id] as StepValue}
              onChange={setValue}
              onAdvance={() => {
                if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
                advanceTimer.current = window.setTimeout(goNext, reduced ? 0 : 260);
              }}
            />
          ) : phase === "gate" && result ? (
            <LeadGate
              state={result}
              onComplete={(method) => {
                setFulfillment(method);
                setPhase("result");
              }}
            />
          ) : result ? (
            <ResultScreen state={result} fulfillment={fulfillment} onRetake={retake} />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {phase === "questions" && question.type !== "single" ? (
        <div className="sticky bottom-0 z-10 -mx-5 mt-10 flex items-center justify-between gap-3 border-t border-forest/10 bg-oat/95 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-8 sm:px-8">
          <p className="text-xs text-forest/60">
            {Array.isArray(answers[question.id]) && (answers[question.id] as string[]).length
              ? `${(answers[question.id] as string[]).length} selected`
              : "Optional"}
          </p>
          <Button type="button" onClick={goNext} className="min-w-[10rem]">
            {isLast ? "See my pathway" : "Continue"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
