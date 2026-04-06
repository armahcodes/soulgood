import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

function Rating({ value, max = 5, size = "md", showValue = false, className }: RatingProps) {
  const sizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const stars = Array.from({ length: max }, (_, i) => {
    const fillPercent = Math.min(Math.max(value - i, 0), 1);
    return { index: i, fillPercent };
  });

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {stars.map(({ index, fillPercent }) => (
        <span key={index} className="relative">
          {/* Empty star (background) */}
          <Star
            className={cn(sizes[size], "text-border")}
            fill="currentColor"
            strokeWidth={0}
          />
          {/* Filled star (overlay) */}
          {fillPercent > 0 && (
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent * 100}%` }}
            >
              <Star
                className={cn(sizes[size], "text-primary")}
                fill="currentColor"
                strokeWidth={0}
              />
            </span>
          )}
        </span>
      ))}
      {showValue && (
        <span className="ml-1.5 font-sans text-xs text-black/60">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { Rating };
export type { RatingProps };
