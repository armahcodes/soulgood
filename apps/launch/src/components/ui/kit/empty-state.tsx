import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand adaptation of 21st.dev serafimcloud/empty-state: a fanned stack of
 * brand tiles above a title, description, and optional action.
 */
export function EmptyState({
  title,
  description,
  action,
  headingLevel = 2,
  className,
}: {
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed border-forest/20 bg-card/70 px-6 py-12 text-center sm:px-10",
        className,
      )}
    >
      <div aria-hidden="true" className="relative mb-7 flex h-20 w-36 justify-center">
        <span className="absolute top-3 left-2 size-14 -rotate-12 rounded-lg border border-forest/10 bg-sand/70" />
        <span className="absolute top-3 right-2 size-14 rotate-12 rounded-lg border border-forest/10 bg-sage/25" />
        <span className="relative flex size-16 items-center justify-center rounded-lg border border-forest/12 bg-oat shadow-[0_12px_24px_-16px_rgb(44_58_52/0.5)]">
          <Image src="/brand/soul-good-icon-sage.png" alt="" width={28} height={41} className="h-9 w-auto" />
        </span>
      </div>
      <Heading className="max-w-md text-2xl leading-tight sm:text-3xl">{title}</Heading>
      <div className="mt-3 max-w-xl text-sm leading-6 text-forest/75">{description}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
