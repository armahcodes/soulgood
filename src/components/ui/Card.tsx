import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section";
}

function Card({ className, as: Component = "div", children, ...props }: CardProps) {
  return (
    <Component
      className={cn("bg-white", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: string;
}

function CardImage({ className, aspectRatio = "3/4", children, ...props }: CardImageProps) {
  return (
    <div
      className={cn("relative overflow-hidden bg-gray-light", className)}
      style={{ aspectRatio }}
      {...props}
    >
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-sans text-sm uppercase tracking-[0.06em] font-medium",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("font-body text-sm text-black/60 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export { Card, CardImage, CardContent, CardTitle, CardDescription };
export type { CardProps };
