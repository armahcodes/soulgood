import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "dark";
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-white",
    accent: "bg-accent text-white",
    dark: "bg-black text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-[10px] font-sans uppercase tracking-[0.08em] font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
