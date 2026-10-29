"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserCircle2, School, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme";
import { signOutAdmin } from "@/lib/actions/admin";

interface AdminHeaderProps {
  userEmail: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const [isLoggingOut, startLogout] = React.useTransition();

  const handleSignOut = () => {
    startLogout(async () => {
      await signOutAdmin();
    });
  };

  const isDashboardActive = pathname === "/admin" || pathname.startsWith("/admin/pendaftar");
  const isSettingsActive = pathname.startsWith("/admin/pengaturan");

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/90 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.08] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Identitas Sekolah & Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-control p-1 -m-1"
            aria-label="Kembali ke Dashboard Admin PPDB"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-control bg-accent/10 text-accent font-semibold shadow-xs">
              <School className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base leading-tight tracking-tight">
                SDIT Fajar
              </span>
              <span className="text-[11px] text-muted font-medium">
                Panel Admin PPDB
              </span>
            </div>
          </Link>

          {/* Tautan Navigasi Antar Halaman Admin */}
          <nav className="hidden sm:flex items-center gap-1" aria-label="Menu Admin">
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isDashboardActive
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/pengaturan"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isSettingsActive
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              }`}
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pengaturan</span>
            </Link>
          </nav>
        </div>

        {/* Informasi Akun & Tombol Keluar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Menu Mobile Singkat untuk Pengaturan */}
          <Link
            href="/admin/pengaturan"
            className={`sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-control transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isSettingsActive
                ? "bg-accent/15 text-accent"
                : "text-muted hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
            }`}
            aria-label="Buka Pengaturan PPDB"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] text-xs text-muted max-w-[220px]">
            <UserCircle2 className="w-4 h-4 shrink-0 text-foreground" aria-hidden="true" />
            <span className="truncate font-medium">{userEmail}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            loading={isLoggingOut}
            className="text-danger hover:bg-danger/10 focus-visible:ring-danger min-h-[40px] px-3 text-xs sm:text-sm font-medium"
            aria-label="Keluar dari akun admin"
          >
            <LogOut className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
