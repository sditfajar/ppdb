import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { SCHOOL_CONFIG } from "@/lib/config";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { SettingsInput } from "@/lib/validation/admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();

  // Ambil pengaturan aktif dari database
  const { data: settings } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  const initialSettings: SettingsInput = {
    academic_year: settings?.academic_year || SCHOOL_CONFIG.defaultAcademicYear,
    registration_open: settings?.registration_open ?? true,
    payment_amount: settings?.payment_amount ?? 250000,
    payment_bank: settings?.payment_bank || "Bank Syariah Indonesia (BSI)",
    payment_account_no: settings?.payment_account_no || "712-345-6789",
    payment_account_name: settings?.payment_account_name || "SDIT Fajar SPMB",
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-4xl mx-auto animate-enter">
      {/* Tombol Navigasi Kembali & Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted hover:text-foreground transition-colors w-fit p-1 -m-1 rounded-control focus-visible:ring-2 focus-visible:ring-accent outline-none"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="flex items-center justify-between gap-4 pt-2 border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 text-accent text-xs font-semibold">
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Konfigurasi SPMB</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-balance">
              Pengaturan Sistem SPMB
            </h1>
            <p className="text-xs sm:text-sm text-muted text-pretty">
              Atur tahun ajaran aktif, status buka/tutup pendaftaran, dan informasi transfer formulir.
            </p>
          </div>
        </div>
      </div>

      {/* Formulir Pengaturan */}
      <SettingsForm initialSettings={initialSettings} />
    </div>
  );
}
