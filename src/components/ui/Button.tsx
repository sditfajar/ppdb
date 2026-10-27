import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  disabled,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 ease-out select-none rounded-control cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-accent text-white shadow-sm hover:opacity-95 active:opacity-90 dark:text-white",
    secondary:
      "bg-surface text-foreground shadow-border hover:shadow-border-hover active:bg-black/5 dark:active:bg-white/5",
    ghost:
      "text-foreground hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10",
    danger:
      "bg-danger text-white shadow-sm hover:opacity-95 active:opacity-90",
  };

  const sizeStyles = {
    sm: "h-9 min-h-[44px] sm:min-h-[36px] text-sm gap-1.5 px-3",
    md: "h-11 min-h-[44px] text-base gap-2 px-4",
    lg: "h-12 min-h-[48px] text-base gap-2.5 px-5",
  };

  // Optical alignment: sedot sedikit padding pada sisi yang memuat ikon
  const opticalPadding = {
    sm: {
      left: iconLeft ? "pl-2.5 pr-3" : "",
      right: iconRight ? "pl-3 pr-2.5" : "",
      both: iconLeft && iconRight ? "px-2.5" : "",
    },
    md: {
      left: iconLeft ? "pl-3 pr-4" : "",
      right: iconRight ? "pl-4 pr-3" : "",
      both: iconLeft && iconRight ? "px-3" : "",
    },
    lg: {
      left: iconLeft ? "pl-3.5 pr-5" : "",
      right: iconRight ? "pl-5 pr-3.5" : "",
      both: iconLeft && iconRight ? "px-3.5" : "",
    },
  };

  const currentOptical =
    iconLeft && iconRight
      ? opticalPadding[size].both
      : iconLeft
      ? opticalPadding[size].left
      : iconRight
      ? opticalPadding[size].right
      : "";

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        currentOptical,
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="shrink-0 -ml-0.5">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="shrink-0 -mr-0.5">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
