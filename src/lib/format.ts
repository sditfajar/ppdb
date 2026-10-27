/**
 * Utilitas pemformatan data tampilan (Tanggal, Telepon, Nominal, Pendidikan, dsb.)
 * Mengikuti konvensi Bahasa Indonesia yang ramah dan rapi.
 */

/**
 * Format tanggal ISO atau YYYY-MM-DD ke format Indonesia (misal: "12 Okt 2026" atau "12 Oktober 2026").
 */
export function formatDateIndo(
  dateInput: string | Date | null | undefined,
  options?: { longMonth?: boolean; withTime?: boolean }
): string {
  if (!dateInput) return "-";

  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: options?.longMonth ? "long" : "short",
      year: "numeric",
      ...(options?.withTime
        ? { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }
        : {}),
    }).format(d);
  } catch {
    return "-";
  }
}

/**
 * Format nomor telepon standar '628xxx' ke format tampilan bersegmen '08xx-xxxx-xxxx'.
 */
export function formatPhoneDisplay(raw: string | null | undefined): string {
  if (!raw) return "-";

  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    digits = "0" + digits.slice(2);
  }

  // Segmentasi 4-4-4
  if (digits.length >= 10 && digits.length <= 13) {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 8);
    const p3 = digits.slice(8);
    return `${p1}-${p2}-${p3}`;
  }

  return digits;
}

/**
 * Format nominal rupiah (misal 250000 -> "Rp 250.000").
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ukuran file byte ke representasi manusiawi (KB / MB).
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "0 B";
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Label Bahasa Indonesia untuk enum tingkat pendidikan orang tua.
 */
export function formatEducationLevel(level: string | null | undefined): string {
  switch (level) {
    case "sd_mi":
      return "SD/MI Sederajat";
    case "smp_mts":
      return "SMP/MTS Sederajat";
    case "sma_smk_ma":
      return "SMA/SMK/MA Sederajat";
    case "d1_d3":
      return "D1 / D2 / D3";
    case "s1_s3":
      return "S1 / S2 / S3";
    default:
      return level || "-";
  }
}
