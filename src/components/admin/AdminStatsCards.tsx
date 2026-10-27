import * as React from "react";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface AdminStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  wave1: number;
  wave2: number;
}

interface AdminStatsCardsProps {
  stats: AdminStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      label: "Total Pendaftar",
      value: stats.total,
      sublabel: `Gel. 1: ${stats.wave1} · Gel. 2: ${stats.wave2}`,
      icon: Users,
      iconColor: "text-foreground/80 bg-foreground/5",
    },
    {
      label: "Menunggu Verifikasi",
      value: stats.pending,
      sublabel: "Perlu ditinjau",
      icon: Clock,
      iconColor: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
    },
    {
      label: "Terverifikasi",
      value: stats.verified,
      sublabel: "Berkas & pembayaran valid",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      label: "Ditolak",
      value: stats.rejected,
      sublabel: "Diberi alasan penolakan",
      icon: XCircle,
      iconColor: "text-rose-600 bg-rose-500/10 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className="p-4 sm:p-5 flex flex-col justify-between gap-3 transition-shadow duration-200"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted">
                {card.label}
              </span>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-control shrink-0 ${card.iconColor}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                {card.value}
              </div>
              <p className="text-[11px] sm:text-xs text-muted mt-0.5 truncate">
                {card.sublabel}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
