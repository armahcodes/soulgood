import { FOUNDER, TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface BrandFooterProps {
  className?: string;
}

/**
 * Small, shared brand sign-off used across the capture flow so the canonical
 * tagline and founder render on every page. Pulls strings from `lib/brand.ts`
 * (never hardcoded) and stays tasteful + mobile-first.
 */
export function BrandFooter({ className }: BrandFooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto flex flex-col items-center gap-1 pt-4 text-center",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-[0.22em] text-sage">
        {TAGLINE}
      </p>
      <p className="text-xs tracking-wide text-forest/55">
        Crafted with care by {FOUNDER}
      </p>
    </footer>
  );
}
