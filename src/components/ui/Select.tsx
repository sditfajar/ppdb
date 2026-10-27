import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  placeholder?: string;
  ref?: React.Ref<HTMLSelectElement>;
}

export function Select({
  className,
  options,
  placeholder,
  children,
  disabled,
  ref,
  ...props
}: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full h-12 md:h-11 min-h-[44px] pl-3.5 pr-10 text-base text-foreground bg-surface rounded-control shadow-border appearance-none transition-all duration-150 ease-out outline-none cursor-pointer",
          "hover:shadow-border-hover",
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:shadow-transparent",
          "aria-invalid:ring-2 aria-invalid:ring-danger aria-invalid:shadow-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-border",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted">
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </div>
    </div>
  );
}
