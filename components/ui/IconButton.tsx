"use client";

import { cn } from "@/lib/utils";

export function IconButton({
  children,
  onClick,
  "aria-label": ariaLabel,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  "aria-label": string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-accent/50",
        className
      )}
    >
      {children}
    </button>
  );
}
