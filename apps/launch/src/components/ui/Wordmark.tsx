import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  href?: string;
  className?: string;
  variant?: "full-color" | "cream";
}

export function Wordmark({ href, className, variant = "full-color" }: WordmarkProps) {
  const image = (
    <Image
      src={
        variant === "cream"
          ? "/brand/soul-good-horizontal-cream.png"
          : "/brand/soul-good-horizontal.png"
      }
      alt={BRAND_NAME}
      width={212}
      height={74}
      priority
      sizes="212px"
      className="h-auto w-[148px] sm:w-[188px]"
    />
  );

  const classes = cn("inline-flex shrink-0 items-center", className);

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={`${BRAND_NAME} home`}>
        {image}
      </Link>
    );
  }

  return <div className={classes}>{image}</div>;
}
