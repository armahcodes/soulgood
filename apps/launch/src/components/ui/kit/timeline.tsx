import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/kit/reveal";

export type TimelineStep = { title: string; body: string };

/**
 * Brand adaptation of 21st.dev shadcnui-blocks/timeline-04. Vertical on small
 * screens, a horizontal rail on large screens.
 */
export function Timeline({ steps, className }: { steps: readonly TimelineStep[]; className?: string }) {
  return (
    <Reveal
      as="ol"
      stagger
      className={cn(
        "relative grid gap-0 lg:grid-cols-(--timeline-cols) lg:gap-8",
        "before:absolute before:inset-y-2 before:left-[1.125rem] before:w-px before:bg-forest/15 lg:before:inset-x-0 lg:before:top-[1.125rem] lg:before:bottom-auto lg:before:h-px lg:before:w-auto",
        className,
      )}
      style={{ "--timeline-cols": `repeat(${steps.length}, minmax(0, 1fr))` } as React.CSSProperties}
    >
      {steps.map((step, index) => (
        <li key={step.title} className="relative grid grid-cols-[2.25rem_1fr] gap-5 pb-9 last:pb-0 lg:grid-cols-1 lg:gap-6 lg:pb-0">
          <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-forest/20 bg-oat font-serif text-lg text-clay ring-8 ring-oat">
            {index + 1}
          </span>
          <div className="pt-1 lg:pt-0">
            <h3 className="text-xl leading-tight font-normal text-forest">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-forest/68">{step.body}</p>
          </div>
        </li>
      ))}
    </Reveal>
  );
}
