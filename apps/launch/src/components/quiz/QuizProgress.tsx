import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Segmented quiz progress — brand adaptation of 21st.dev
 * sean0205/questionnaire-segmented-progress, with a back control.
 */
export function QuizProgress({
  current,
  total,
  onBack,
}: {
  /** 1-based index of the current question. */
  current: number;
  total: number;
  onBack: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-forest/15 bg-card text-forest/75 transition-colors hover:border-forest/40 hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden />
      </button>
      <div
        className="flex flex-1 gap-1"
        role="progressbar"
        aria-label="Pathway Finder progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`Question ${current} of ${total}`}
      >
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-forest/10">
            <span
              className={cn(
                "block h-full rounded-full bg-sage transition-[width] duration-500 ease-(--ease-soft)",
                index < current ? "w-full" : "w-0",
              )}
            />
          </span>
        ))}
      </div>
      <p className="shrink-0 text-xs font-bold text-forest/72 tabular-nums">
        {current}/{total}
      </p>
    </div>
  );
}
