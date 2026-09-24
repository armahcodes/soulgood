"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

type OtpInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "maxLength"> & {
  value: string;
  onValueChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
};

/**
 * Brand adaptation of 21st.dev ddoemonn/otp-input. One real input (so paste,
 * SMS/email autofill, and screen readers behave natively) drawn as separate slots.
 */
export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(function OtpInput(
  { value, onValueChange, length = 6, invalid = false, className, onFocus, onBlur, ...props },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, length - 1);

  return (
    <div className={cn("relative", className)}>
      <div aria-hidden="true" className="grid gap-2" style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}>
        {Array.from({ length }, (_, index) => {
          const char = value[index];
          const isActive = focused && index === active;
          return (
            <div
              key={index}
              className={cn(
                "relative flex aspect-[4/5] max-h-16 items-center justify-center rounded-md border bg-white font-serif text-3xl text-forest transition-[border-color,box-shadow] duration-150",
                invalid ? "border-clay" : char ? "border-forest/40" : "border-forest/18",
                isActive && "border-forest shadow-[0_0_0_3px_rgb(119_145_111/0.25)]",
              )}
            >
              {char ?? (isActive ? <span className="h-7 w-px animate-pulse bg-forest motion-reduce:animate-none" /> : null)}
            </div>
          );
        })}
      </div>
      <input
        ref={ref}
        {...props}
        value={value}
        onChange={(event) => onValueChange(event.target.value.replace(/\D/g, "").slice(0, length))}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className="absolute inset-0 h-full w-full cursor-text rounded-md bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
      />
    </div>
  );
});
