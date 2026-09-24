import { cn } from "@/lib/utils";

/** Brand adaptation of 21st.dev shadcn/skeleton. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-md bg-forest/8 motion-safe:animate-pulse", className)} />;
}
