import { Database } from "@/lib/supabase/database.types";
import { formatEducationLevel } from "@/lib/format";

export type RegistrationRow = Database["public"]["Tables"]["registrations"]["Row"];

/**
 * Karakter yang dapat memicu formula injection di spreadsheet (Excel, Google Sheets, LibreOffice Calc).
 */
const FORMULA_INJECTION_CHARS = ["=", "+", "-", "@", "\t", "\r"];

/**
 * Menetralisir potensi Formula/CSV Injection:
 * - Sel yang berawalan =, +, -, @, \t, atau \r diberi awalan apostrof (')
 * - PENGECUALIAN: Nilai string persis "-" (tanda hubung tunggal) tidak diberi apostrof (PRD §8.5, §14 AC-12)
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const str = String(value);

  // Jika persis "-", biarkan tanpa diubah
  if (str === "-") {
    return "-";
  }

  // Jika berawalan karakter formula berbahaya, beri prefix apostrof (')
  if (FORMULA_INJECTION_CHARS.some((char) => str.startsWith(char))) {
    return `'${str}`;
  }

  return str;
}

/**
 * Meng-escape sel CSV sesuai standar RFC 4180:
 * Jika sel mengandung koma (,), tanda kutip dua ("), atau karakter baris baru (\n, \r),
 * bungkus seluruh teks dengan tanda kutip dua dan gandakan tanda kutip di dalamnya ("").
 */
export function escapeCsvValue(val: string): string {
  if (val.includes('"') || val.includes(",") || val.includes("\n") || val.includes("\r")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

/**
 * Header kolom dalam Bahasa Indonesia yang lengkap dan informatif (PRD §8.5 & §11).
 */
export const CSV_HEADERS = [
  "No. Registrasi",
  "Tanggal Daftar",
  "Status",
  "Gelombang",
  "Tahun Ajaran",
  "Nama Siswa",
  "Nama Panggilan",
  "Jenis Kelamin",
  "Tempat Lahir",
  "Tanggal Lahir",
  "Jumlah Saudara",
  "Anak Ke",
  "Alamat Siswa",
  "No. HP / WhatsApp",
  "Hobi",
  "Prestasi",
  "Riwayat Penyakit",
  "Nama Ayah",
  "Pendidikan Ayah",
  "Pekerjaan Ayah",
  "Nama Ibu",
  "Pendidikan Ibu",
  "Pekerjaan Ibu",
  "Alamat Orang Tua",
  "Alasan Penolakan",
  "Catatan Admin",
];

function formatStatus(status: RegistrationRow["status"]): string {
  switch (status) {
    case "verified":
      return "Terverifikasi";
    case "rejected":
      return "Ditolak";
    case "pending":
    default:
      return "Menunggu Verifikasi";
  }
}

function formatDateOnly(isoStringOrDate: string): string {
  if (!isoStringOrDate) return "-";
  // Ambil hanya bagian YYYY-MM-DD
  const datePart = isoStringOrDate.split("T")[0];
  return datePart || isoStringOrDate;
}

/**
 * Mengonversi satu baris pendaftaran menjadi array nilai sel yang telah dinetralisir.
 */
export function serializeRegistrationToCsvRow(reg: RegistrationRow): string[] {
  // Format no telepon dengan awalan apostrof agar Excel memperlakukannya sebagai teks
  // dan tidak menghapus leading 0 atau mengubahnya ke notasi ilmiah (6.28E+11)
  const phoneText = sanitizeCsvCell(reg.contact_phone ? `'${reg.contact_phone}` : "-");

  return [
    sanitizeCsvCell(reg.reg_number),
    sanitizeCsvCell(formatDateOnly(reg.created_at)),
    sanitizeCsvCell(formatStatus(reg.status)),
    sanitizeCsvCell(String(reg.wave)),
    sanitizeCsvCell(reg.academic_year),
    sanitizeCsvCell(reg.student_name),
    sanitizeCsvCell(reg.student_nickname || "-"),
    sanitizeCsvCell(reg.gender === "L" ? "Laki-laki" : "Perempuan"),
    sanitizeCsvCell(reg.birth_place),
    sanitizeCsvCell(formatDateOnly(reg.birth_date)),
    sanitizeCsvCell(String(reg.siblings_count)),
    sanitizeCsvCell(String(reg.birth_order)),
    sanitizeCsvCell(reg.student_address),
    phoneText,
    sanitizeCsvCell(reg.hobby),
    sanitizeCsvCell(reg.achievements || "-"),
    sanitizeCsvCell(reg.medical_conditions || "-"),
    sanitizeCsvCell(reg.father_name),
    sanitizeCsvCell(formatEducationLevel(reg.father_education)),
    sanitizeCsvCell(reg.father_job),
    sanitizeCsvCell(reg.mother_name),
    sanitizeCsvCell(formatEducationLevel(reg.mother_education)),
    sanitizeCsvCell(reg.mother_job),
    sanitizeCsvCell(reg.parent_address),
    sanitizeCsvCell(reg.rejection_reason || "-"),
    sanitizeCsvCell(reg.admin_note || "-"),
  ];
}

/**
 * Menghasilkan string CSV ber-BOM UTF-8 dari kumpulan baris pendaftaran.
 * BOM (\uFEFF) memastikan Microsoft Excel langsung membuka dokumen dengan encoding UTF-8
 * sehingga karakter khusus dan huruf Bahasa Indonesia tidak korup.
 */
export function generateRegistrationsCsv(registrations: RegistrationRow[]): string {
  const UTF8_BOM = "\uFEFF";

  const headerLine = CSV_HEADERS.map((h) => escapeCsvValue(sanitizeCsvCell(h))).join(",");

  const dataLines = registrations.map((reg) => {
    const row = serializeRegistrationToCsvRow(reg);
    return row.map((val) => escapeCsvValue(val)).join(",");
  });

  return UTF8_BOM + [headerLine, ...dataLines].join("\r\n");
}
