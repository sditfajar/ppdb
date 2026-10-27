import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ref,
  ...props
}: EmptyStateProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-card bg-surface shadow-border max-w-md mx-auto w-full",
        className
      )}
      {...props}
    >
      <div className="h-12 w-12 rounded-full bg-muted/10 text-muted flex items-center justify-center mb-4 shrink-0">
        {icon || <Inbox className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-semibold text-foreground text-balance">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-muted text-pretty max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
