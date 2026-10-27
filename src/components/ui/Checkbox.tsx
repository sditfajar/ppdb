import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export function Checkbox({
  id: customId,
  label,
  description,
  error,
  disabled,
  checked,
  defaultChecked,
  onChange,
  className,
  ref,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const id = customId || generatedId;

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex items-start gap-3 min-h-[44px] py-2 cursor-pointer select-none text-left",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 rounded-[6px] shadow-border bg-surface flex items-center justify-center transition-all duration-150 ease-out",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2",
            "peer-checked:bg-accent peer-checked:text-white peer-checked:shadow-none",
            error && "ring-2 ring-danger"
          )}
        >
          <Check className="h-3.5 w-3.5 stroke-[3] opacity-0 transition-opacity duration-150 peer-checked:opacity-100" />
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-sm font-medium text-foreground leading-snug">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted text-pretty leading-normal">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
