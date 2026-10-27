import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({
  className,
  rows = 3,
  disabled,
  ref,
  ...props
}: TextareaProps) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      className={cn(
        "w-full min-h-[96px] p-3 text-base text-foreground bg-surface rounded-control shadow-border transition-all duration-150 ease-out outline-none resize-y",
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
