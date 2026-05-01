import { cn } from "@/lib/utils";

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-body disabled:opacity-50";
  const variants = {
    primary: "bg-accent text-white hover:opacity-90 hover:shadow-md",
    secondary:
      "border border-primary/20 bg-body text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </button>
  );
}
