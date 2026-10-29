import { SCHOOL_CONFIG } from "@/lib/config";

/**
 * Utilitas penentuan gelombang pendaftaran SPMB SDIT Fajar
 * Sesuai PRD §8.1, §9 (Aturan 1), & §17 (Asumsi 2):
 * - Gelombang 1: September – Februari (Bulan 9, 10, 11, 12, 1, 2)
 * - Gelombang 2: Maret – Juni (Bulan 3, 4, 5, 6)
 * - Pendaftaran Ditutup: Juli – Agustus (Bulan 7, 8)
 *
 * Menggunakan zona waktu resmi sekolah: Asia/Jakarta (WIB, UTC+7)
 */

export type WaveNumber = 1 | 2 | null;

export interface RegistrationState {
  isOpen: boolean;
  wave: WaveNumber;
  academicYear: string;
}

/**
 * Mendapatkan nomor bulan (1-12) berdasarkan zona waktu Asia/Jakarta
 */
export function getJakartaMonth(date: Date = new Date()): number {
  // Gunakan Intl.DateTimeFormat untuk mengekstraksi bulan di zona waktu Asia/Jakarta
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    month: "numeric",
  });
  return parseInt(formatter.format(date), 10);
}

/**
 * Mengembalikan gelombang pendaftaran aktif berdasarkan tanggal submit/kunjungan:
 * - 1: Gelombang 1 (September - Februari)
 * - 2: Gelombang 2 (Maret - Juni)
 * - null: Pendaftaran Ditutup (Juli - Agustus)
 */
export function getActiveWave(date: Date = new Date()): WaveNumber {
  const month = getJakartaMonth(date);

  // Bulan 9, 10, 11, 12, 1, 2 -> Gelombang 1
  if (month >= 9 || month <= 2) {
    return 1;
  }

  // Bulan 3, 4, 5, 6 -> Gelombang 2
  if (month >= 3 && month <= 6) {
    return 2;
  }

  // Bulan 7, 8 -> Tutup
  return null;
}

/**
 * Memberikan status pendaftaran terkini (sementara stub untuk Fase 3, akan dihubungkan ke DB di Fase 4)
 */
export function getRegistrationState(date: Date = new Date()): RegistrationState {
  const wave = getActiveWave(date);
  return {
    isOpen: wave !== null,
    wave,
    academicYear: SCHOOL_CONFIG.defaultAcademicYear,
  };
}

/**
 * Memberikan label teks ramah untuk gelombang
 */
export function getWaveLabel(wave: WaveNumber): string {
  if (wave === 1) return "Gelombang 1 (Sep – Feb)";
  if (wave === 2) return "Gelombang 2 (Mar – Jun)";
  return "Pendaftaran Ditutup";
}
