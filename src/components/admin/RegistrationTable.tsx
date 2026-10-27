"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowRight, UserCheck } from "lucide-react";
import { StatusBadge, RegistrationStatus } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { formatDateIndo, formatPhoneDisplay } from "@/lib/format";

export interface RegistrationListItem {
  id: string;
  reg_number: string;
  student_name: string;
  student_nickname: string;
  gender: "L" | "P";
  wave: number;
  contact_phone: string;
  status: RegistrationStatus;
  created_at: string;
}

interface RegistrationTableProps {
  items: RegistrationListItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function RegistrationTable({
  items,
  totalCount,
  currentPage,
  pageSize,
}: RegistrationTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<UserCheck className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />}
        title="Belum ada pendaftar"
        description="Tidak ditemukan data pendaftaran yang sesuai dengan kriteria filter atau pencarian Anda."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Tampilan Desktop (>= md) : Tabel */}
      <div className="hidden md:block w-full overflow-x-auto rounded-card shadow-border bg-surface">
        <table className="w-full text-left text-sm text-foreground border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs font-semibold text-muted select-none">
              <th className="py-3.5 px-4">No. Registrasi</th>
              <th className="py-3.5 px-4">Nama Siswa</th>
              <th className="py-3.5 px-3">Gelombang</th>
              <th className="py-3.5 px-4">No. Kontak</th>
              <th className="py-3.5 px-4">Tanggal Daftar</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-medium text-xs tabular-nums text-muted">
                  {item.reg_number}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-foreground text-pretty">
                    {item.student_name}
                  </div>
                  <div className="text-xs text-muted">
                    ({item.gender === "L" ? "Laki-laki" : "Perempuan"}
                    {item.student_nickname ? ` · "${item.student_nickname}"` : ""})
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black/[0.04] dark:bg-white/[0.06] text-foreground">
                    Gel. {item.wave}
                  </span>
                </td>
                <td className="py-3.5 px-4 tabular-nums text-xs font-medium text-muted">
                  {formatPhoneDisplay(item.contact_phone)}
                </td>
                <td className="py-3.5 px-4 tabular-nums text-xs text-muted">
                  {formatDateIndo(item.created_at, { withTime: true })}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/admin/pendaftar/${item.id}`}
                    className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-control text-accent hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    aria-label={`Lihat detail pendaftaran ${item.student_name}`}
                  >
                    Detail
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tampilan Mobile (< md) : Kartu Bertumpuk */}
      <div className="flex md:hidden flex-col gap-3 w-full">
        {items.map((item) => (
          <Card key={item.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] dark:border-white/[0.06] pb-2.5">
              <span className="font-mono text-xs font-semibold tabular-nums text-muted">
                {item.reg_number}
              </span>
              <StatusBadge status={item.status} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="font-semibold text-base text-foreground leading-snug">
                {item.student_name}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>{item.gender === "L" ? "Laki-laki" : "Perempuan"}</span>
                <span>•</span>
                <span>Gelombang {item.wave}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
              <div>
                <span className="text-muted block text-[11px]">No. Kontak:</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatPhoneDisplay(item.contact_phone)}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Tanggal Daftar:</span>
                <span className="text-foreground tabular-nums">
                  {formatDateIndo(item.created_at)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/admin/pendaftar/${item.id}`}
                className="w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-control text-xs font-semibold bg-accent/10 text-accent hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                aria-label={`Buka detail data ${item.student_name}`}
              >
                Lihat Detail Lengkap
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Paginasi & Keterangan Total */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <p className="text-xs text-muted tabular-nums">
          Menampilkan {items.length} dari {totalCount} pendaftar
          {totalPages > 1 ? ` (Halaman ${currentPage} dari ${totalPages})` : ""}
        </p>

        {totalPages > 1 && (
          <div className="w-full sm:w-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
