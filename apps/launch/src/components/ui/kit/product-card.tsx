import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand adaptation of 21st.dev deltacomponents/product-card: a compound card
 * with an image well that lifts on hover, an overlaid badge, and a content footer.
 */

export function ProductCard({ className, children, ...props }: React.ComponentProps<"article">) {
  return (
    <article data-slot="product-card" className={cn("group/card flex min-w-0 flex-col", className)} {...props}>
      {children}
    </article>
  );
}

export function ProductCardImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 30vw, 72vw",
  children,
  muted = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  children?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-lg bg-sand/40", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes={sizes}
        className={cn(
          "object-cover transition-transform duration-700 ease-(--ease-soft) group-hover/card:scale-[1.035]",
          muted && "grayscale-[0.35]",
        )}
      />
      {children}
    </div>
  );
}

export function ProductCardBadge({
  className,
  tone = "light",
  children,
}: {
  className?: string;
  tone?: "light" | "dark";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute top-3 left-3 rounded-md px-2.5 py-1.5 text-[0.62rem] font-bold tracking-[0.14em] uppercase backdrop-blur-sm",
        tone === "dark" ? "bg-forest text-oat" : "bg-oat/90 text-forest",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProductCardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-1 flex-col pt-5", className)}>{children}</div>;
}

export function ProductCardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("text-[1.7rem] leading-[1.02] font-normal tracking-[-0.025em] text-forest", className)}>{children}</h3>;
}

export function ProductCardSubtitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("mt-3 text-sm leading-6 text-forest/68", className)}>{children}</p>;
}
