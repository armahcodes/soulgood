import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface WordmarkProps {
  href?: string;
  className?: string;
  markClassName?: string;
}

export function Wordmark({
  href,
  className,
  markClassName,
}: WordmarkProps) {
  const content = (
    <>
      <Logo size={34} className={markClassName} title="" />
      <span className="font-serif text-xl leading-none font-semibold tracking-[-0.02em]">
        Soul Bowls<sup className="ml-0.5 text-[0.42em] align-super">™</sup>
      </span>
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={BRAND_NAME}>
        {content}
      </Link>
    );
  }

  return (
    <div className={classes} aria-label={BRAND_NAME}>
      {content}
    </div>
  );
}
