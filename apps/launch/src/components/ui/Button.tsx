"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link";
  size?: "default" | "sm" | "lg";
  as?: "button" | "a";
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      as = "button",
      href,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-none border border-transparent font-sans text-xs font-bold tracking-[0.08em] uppercase transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-oat";

    const variants = {
      primary:
        "bg-forest text-oat hover:bg-sage active:bg-sage/90",
      secondary:
        "bg-transparent text-forest border border-forest hover:bg-forest hover:text-oat active:bg-forest/90",
      link: "bg-transparent text-clay hover:text-forest underline underline-offset-4 decoration-1",
    };

    // Sizes keep primary/secondary controls at ≥44px tall (thumb targets).
    const sizes = {
      sm: "min-h-[44px] px-5 py-2.5",
      default: "min-h-[48px] px-8 py-3",
      lg: "min-h-[52px] px-9 py-4",
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      variant !== "link" && sizes[size],
      variant === "link" && "px-0 py-0 text-base",
      className
    );

    if (as === "a" && href) {
      // Use Next.js Link for internal routes (SPA client-side routing).
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link
            href={href}
            className={classes}
            onClick={
              onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
            }
          >
            {children}
          </Link>
        );
      }
      // Use plain <a> for external URLs.
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={
            onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
          }
        >
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} onClick={onClick} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
