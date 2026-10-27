import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ref?: React.Ref<HTMLElement>;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ref,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Hasilkan nomor halaman yang ramah tampilan (maks 5 tombol)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      ref={ref}
      aria-label="Navigasi halaman"
      className={cn("flex items-center justify-between gap-2 w-full", className)}
      {...props}
    >
      <button
        type="button"
        disabled={!canGoPrev}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          "inline-flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-3 text-sm font-medium rounded-control shadow-border bg-surface transition-all duration-150 cursor-pointer select-none",
          "hover:shadow-border-hover focus-visible:ring-2 focus-visible:ring-accent",
          !canGoPrev && "opacity-40 cursor-not-allowed hover:shadow-border"
        )}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      {/* Ringkasan halaman untuk layar sangat kecil (< sm) */}
      <div className="flex sm:hidden items-center text-sm tabular-nums text-muted font-medium">
        Halaman {currentPage} dari {totalPages}
      </div>

      {/* Tombol nomor halaman untuk layar sm ke atas */}
      <div className="hidden sm:flex items-center gap-1.5">
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-muted"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-sm font-medium tabular-nums rounded-control transition-all duration-150 cursor-pointer select-none",
                "focus-visible:ring-2 focus-visible:ring-accent",
                isCurrent
                  ? "bg-accent text-white font-semibold shadow-sm dark:text-white"
                  : "bg-surface text-foreground shadow-border hover:shadow-border-hover"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!canGoNext}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          "inline-flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-3 text-sm font-medium rounded-control shadow-border bg-surface transition-all duration-150 cursor-pointer select-none",
          "hover:shadow-border-hover focus-visible:ring-2 focus-visible:ring-accent",
          !canGoNext && "opacity-40 cursor-not-allowed hover:shadow-border"
        )}
        aria-label="Halaman berikutnya"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
