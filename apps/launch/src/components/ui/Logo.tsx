import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  title?: string;
  variant?: "full-color" | "cream" | "sage";
}

const ICONS = {
  "full-color": "/brand/soul-good-icon.png",
  cream: "/brand/soul-good-icon-cream.png",
  sage: "/brand/soul-good-icon-sage.png",
} as const;

export function Logo({
  size = 40,
  className,
  title = "Soul Good",
  variant = "full-color",
}: LogoProps) {
  return (
    <Image
      src={ICONS[variant]}
      alt={title}
      aria-hidden={title === "" ? true : undefined}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn("h-auto shrink-0 object-contain", className)}
      style={{ width: size, height: "auto" }}
    />
  );
}
