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
  const activeStep = steps.find((s) => s.number === currentStep) || steps[0];
  const progressPercent =
    steps.length > 1
      ? ((Math.max(1, currentStep) - 1) / (steps.length - 1)) * 100
      : 100;

  return (
    <div
      ref={ref}
      aria-label="Progres langkah formulir pendaftaran"
      className={cn("w-full py-2", className)}
      {...props}
    >
      {/* Mobile progress indicator info */}
      <div className="flex items-center justify-between text-xs mb-2 sm:hidden text-slate-600 font-medium">
        <span>
          Langkah {currentStep} dari {steps.length}:{" "}
          <strong className="text-slate-900">{activeStep.shortTitle || activeStep.title}</strong>
        </span>
        <span className="font-semibold text-[#1D4ED8]">{Math.round(progressPercent)}%</span>
      </div>

      {/* Bar progres visual garis atas */}
      <div className="relative mb-3.5">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
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
                "flex items-center gap-2.5 text-left select-none transition-colors",
                isClickable && "cursor-pointer group hover:opacity-85"
              )}
              onClick={() => isClickable && onStepClick(step.number)}
            >
              {/* Lingkaran nomor / centang */}
              <div
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold tabular-nums transition-all duration-200",
                  isCompleted
                    ? "bg-[#10B981] text-white shadow-xs"
                    : isCurrent
                    ? "bg-[#1D4ED8] text-white shadow-sm ring-4 ring-[#1D4ED8]/15"
                    : "bg-white border border-slate-200 text-slate-600"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                ) : (
                  step.number
                )}
              </div>

              {/* Judul langkah */}
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider hidden sm:block">
                  Langkah {step.number}
                </span>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold transition-colors leading-tight",
                    isCurrent
                      ? "text-[#0F172A]"
                      : isCompleted
                      ? "text-slate-700"
                      : "text-slate-600",
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
