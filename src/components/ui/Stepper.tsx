import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  number: number;
  title: string;
  shortTitle?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  ref?: React.Ref<HTMLDivElement>;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
  ref,
  ...props
}: StepperProps) {
  return (
    <div
      ref={ref}
      aria-label="Progres langkah formulir"
      className={cn("w-full py-2", className)}
      {...props}
    >
      {/* Bar progres visual garis atas */}
      <div className="relative mb-3">
        <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{
              width: `${((Math.max(1, currentStep) - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Daftar langkah */}
      <ol className="flex items-center justify-between w-full">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = onStepClick && isCompleted;

          return (
            <li
              key={step.number}
              className={cn(
                "flex items-center gap-2 text-left select-none",
                isClickable && "cursor-pointer"
              )}
              onClick={() => isClickable && onStepClick(step.number)}
            >
              {/* Lingkaran nomor / centang */}
              <div
                className={cn(
                  "h-8 w-8 min-w-[32px] rounded-full flex items-center justify-center text-xs font-semibold tabular-nums transition-all duration-200",
                  isCompleted
                    ? "bg-accent text-white dark:text-white"
                    : isCurrent
                    ? "bg-accent text-white shadow-sm ring-4 ring-accent/20 dark:text-white"
                    : "bg-surface shadow-border text-muted"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                ) : (
                  step.number
                )}
              </div>

              {/* Judul langkah (disembunyikan pada layar sangat sempit jika tidak aktif) */}
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-muted uppercase tracking-wider hidden sm:block">
                  Langkah {step.number}
                </span>
                <span
                  className={cn(
                    "text-xs md:text-sm font-medium transition-colors leading-tight",
                    isCurrent
                      ? "text-foreground font-semibold"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted",
                    !isCurrent && "hidden md:inline"
                  )}
                >
                  <span className="sm:hidden">{step.shortTitle || step.title}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
