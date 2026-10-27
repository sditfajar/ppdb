"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentWave = searchParams.get("wave") || "all";

  const [searchVal, setSearchVal] = React.useState(currentQ);
  const [prevQ, setPrevQ] = React.useState(currentQ);

  // Sinkronkan state saat searchParams di URL berubah (mis. reset filter)
  if (prevQ !== currentQ) {
    setPrevQ(currentQ);
    setSearchVal(currentQ);
  }

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    // Selalu kembali ke halaman 1 saat filter berubah
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchVal.trim() });
  };

  const handleClearSearch = () => {
    setSearchVal("");
    updateFilters({ q: "" });
  };

  const hasActiveFilters = Boolean(
    currentQ || (currentStatus && currentStatus !== "all") || (currentWave && currentWave !== "all")
  );

  const handleResetAll = () => {
    setSearchVal("");
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-3 w-full bg-surface p-3.5 sm:p-4 rounded-card shadow-border">
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
        {/* Kolom Pencarian */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Cari nama siswa, orang tua, no. reg, atau HP..."
            className="w-full min-h-[44px] pl-10 pr-9 text-sm text-foreground bg-transparent rounded-control shadow-border focus:shadow-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-shadow placeholder:text-muted/70"
            aria-label="Cari pendaftar"
          />
          {searchVal && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground cursor-pointer"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="md"
          className="w-full sm:w-auto shrink-0 min-h-[44px] px-5"
        >
          Cari
        </Button>
      </form>

      {/* Baris Filter Status & Gelombang */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-black/[0.05] dark:border-white/[0.05]">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted mr-1">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Filter:</span>
          </div>

          {/* Filter Status */}
          <select
            value={currentStatus}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="min-h-[38px] px-2.5 py-1 text-xs text-foreground bg-surface rounded-control shadow-border focus-visible:ring-2 focus-visible:ring-accent cursor-pointer outline-none"
            aria-label="Filter berdasarkan status pendaftaran"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="verified">Terverifikasi</option>
            <option value="rejected">Ditolak</option>
          </select>

          {/* Filter Gelombang */}
          <select
            value={currentWave}
            onChange={(e) => updateFilters({ wave: e.target.value })}
            className="min-h-[38px] px-2.5 py-1 text-xs text-foreground bg-surface rounded-control shadow-border focus-visible:ring-2 focus-visible:ring-accent cursor-pointer outline-none"
            aria-label="Filter berdasarkan gelombang"
          >
            <option value="all">Semua Gelombang</option>
            <option value="1">Gelombang 1</option>
            <option value="2">Gelombang 2</option>
          </select>
        </div>

        {/* Reset Filter */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="text-xs text-muted hover:text-foreground h-9 px-2.5"
          >
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}
