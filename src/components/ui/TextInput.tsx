import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export function TextInput({
  className,
  type = "text",
  disabled,
  ref,
  ...props
}: TextInputProps) {
  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        "w-full h-12 md:h-11 min-h-[44px] px-3.5 text-base text-foreground bg-surface rounded-control shadow-border transition-all duration-150 ease-out outline-none",
        "placeholder:text-muted/60",
        "hover:shadow-border-hover",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:shadow-transparent",
        "aria-invalid:ring-2 aria-invalid:ring-danger aria-invalid:shadow-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-border",
        className
      )}
      {...props}
    />
  );
}
