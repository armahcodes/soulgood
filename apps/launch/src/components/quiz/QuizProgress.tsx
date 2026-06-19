interface QuizProgressProps {
  /** 1-based index of the current step. */
  current: number;
  total: number;
  /** Go to the previous step (or the Intro from the first question). */
  onBack: () => void;
}

/**
 * The quiz header row: a circular back button, a slim progress bar, and a
 * compact "n / total" step count. The back button is always available here —
 * on the first question it returns to the Intro screen.
 */
export function QuizProgress({ current, total, onBack }: QuizProgressProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex w-full items-center gap-3.5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-forest/15 bg-white/70 text-lg text-forest/70 transition-colors hover:border-sage/60 hover:text-forest"
      >
        <span aria-hidden>←</span>
      </button>
      <div className="flex-1">
        <div className="h-[5px] w-full overflow-hidden rounded-full bg-forest/10">
          <div
            className="h-full rounded-full bg-sage transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-forest/40 tabular-nums">
        <span className="sr-only">Step </span>
        {current}
        <span className="sr-only"> of </span>
        <span aria-hidden> / </span>
        {total}
      </p>
    </div>
  );
}
