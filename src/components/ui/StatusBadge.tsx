import * as React from "react";
import { cn } from "@/lib/utils";

export type RegistrationStatus = "pending" | "verified" | "rejected";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: RegistrationStatus;
  count?: number;
  label?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

const statusConfig: Record<
  RegistrationStatus,
  { defaultLabel: string; dotClass: string; badgeClass: string }
> = {
  pending: {
    defaultLabel: "Menunggu Verifikasi",
    dotClass: "bg-amber-500",
    badgeClass:
      "bg-amber-50 text-amber-800 shadow-[0_0_0_1px_rgba(245,158,11,0.2)] dark:bg-amber-950/40 dark:text-amber-300 dark:shadow-[0_0_0_1px_rgba(245,158,11,0.3)]",
  },
  verified: {
    defaultLabel: "Terverifikasi",
    dotClass: "bg-emerald-500",
    badgeClass:
      "bg-emerald-50 text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,0.2)] dark:bg-emerald-950/40 dark:text-emerald-300 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.3)]",
  },
  rejected: {
    defaultLabel: "Ditolak",
    dotClass: "bg-rose-500",
    badgeClass:
      "bg-rose-50 text-rose-800 shadow-[0_0_0_1px_rgba(244,63,94,0.2)] dark:bg-rose-950/40 dark:text-rose-300 dark:shadow-[0_0_0_1px_rgba(244,63,94,0.3)]",
  },
};

export function StatusBadge({
  status,
  count,
  label,
  className,
  ref,
  ...props
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full select-none",
        config.badgeClass,
        className
      )}
      {...props}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClass)}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
      {count !== undefined && (
        <span className="ml-0.5 tabular-nums font-semibold opacity-90">
          ({count})
        </span>
      )}
    </span>
  );
}
