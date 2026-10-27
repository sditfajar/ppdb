import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveWave, type WaveNumber } from "@/lib/wave";
import { SCHOOL_CONFIG } from "@/lib/config";

export interface PaymentSettings {
  amount: number | null;
  bank: string | null;
  accountNo: string | null;
  accountName: string | null;
}

export interface AppRegistrationState {
  open: boolean;
  academicYear: string;
  wave: WaveNumber;
  payment: PaymentSettings;
}

/**
 * Membaca status pendaftaran aktif dari tabel app_settings (Supabase Admin)
 * dan menghitung ketersediaan pendaftaran serta gelombang aktif berdasarkan waktu server.
 */
export async function getRegistrationState(now: Date = new Date()): Promise<AppRegistrationState> {
  const wave = getActiveWave(now);

  try {
    const supabase = createAdminClient();
    const { data: settings, error } = await supabase
      .from("app_settings")
      .select("academic_year, registration_open, payment_amount, payment_bank, payment_account_no, payment_account_name")
      .eq("id", true)
      .maybeSingle();

    if (error || !settings) {
      console.warn("[REGISTRATION_STATE] Gagal membaca app_settings dari DB, menggunakan konfigurasi cadangan:", error?.message);
      return {
        open: wave !== null,
        academicYear: SCHOOL_CONFIG.defaultAcademicYear,
        wave,
        payment: {
          amount: 250000,
          bank: "Bank Syariah Indonesia (BSI)",
          accountNo: "712-345-6789",
          accountName: "SDIT Fajar PPDB",
        },
      };
    }

    const open = Boolean(settings.registration_open && wave !== null);

    return {
      open,
      academicYear: settings.academic_year || SCHOOL_CONFIG.defaultAcademicYear,
      wave,
      payment: {
        amount: settings.payment_amount ?? 250000,
        bank: settings.payment_bank ?? "Bank Syariah Indonesia (BSI)",
        accountNo: settings.payment_account_no ?? "712-345-6789",
        accountName: settings.payment_account_name ?? "SDIT Fajar PPDB",
      },
    };
  } catch (err) {
    console.error("[REGISTRATION_STATE] Kesalahan sistem saat membaca state:", err);
    return {
      open: wave !== null,
      academicYear: SCHOOL_CONFIG.defaultAcademicYear,
      wave,
      payment: {
        amount: 250000,
        bank: "Bank Syariah Indonesia (BSI)",
        accountNo: "712-345-6789",
        accountName: "SDIT Fajar PPDB",
      },
    };
  }
}
