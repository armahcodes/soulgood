import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

function Tag({ className, variant = "default", children, ...props }: TagProps) {
  const variants = {
    default: "bg-primary/10 text-primary",
    outline: "bg-transparent text-black border border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-[10px] font-sans uppercase tracking-[0.08em] font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Tag };
export type { TagProps };
