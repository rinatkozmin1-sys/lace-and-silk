import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-accent/90 text-white",
  secondary: "bg-primary/90 text-body",
  destructive: "bg-red-500 text-white",
  outline: "border border-primary/30 text-primary bg-transparent",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: string;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium uppercase tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
