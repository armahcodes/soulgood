interface QuizProgressProps {
  /** 1-based index of the current step. */
  current: number;
  total: number;
}

/** A slim progress bar + "Step X of Y" label for the quiz header. */
export function QuizProgress({ current, total }: QuizProgressProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest/10">
        <div
          className="h-full rounded-full bg-sage transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs tracking-wide text-forest/55">
        Step {current} of {total}
      </p>
    </div>
  );
}
