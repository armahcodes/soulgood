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
      "inline-flex items-center justify-center font-sans uppercase tracking-[0.06em] font-medium transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-black text-white hover:bg-black/80 active:bg-black/70",
      secondary:
        "bg-transparent text-black border border-black hover:bg-black hover:text-white active:bg-black/90",
      link: "bg-transparent text-primary hover:text-primary-dark underline underline-offset-4 decoration-1",
    };

    const sizes = {
      sm: "px-5 py-2.5 text-xs",
      default: "px-8 py-4 text-sm",
      lg: "px-10 py-5 text-sm",
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      variant !== "link" && sizes[size],
      variant === "link" && "px-0 py-0 text-sm",
      className
    );

    if (as === "a" && href) {
      // Use Next.js Link for internal routes (SPA client-side routing)
      if (href.startsWith("/") || href.startsWith("#")) {
        return (
          <Link
            href={href}
            className={classes}
            onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          >
            {children}
          </Link>
        );
      }
      // Use plain <a> for external URLs
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
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
