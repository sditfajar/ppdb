"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getRegistrationState } from "@/lib/actions/registration-state";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { normalizeIdPhone } from "@/lib/phone";
import {
  serverRegistrationSchema,
  type ServerRegistrationInput,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/validation/registration";

export interface CreateRegistrationResult {
  success: boolean;
  id?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Server Action: createRegistration
 * 
 * Melakukan verifikasi keamanan berlapis dan menyimpan data pendaftar baru:
 * (a) Validasi ulang skema server (Zod)
 * (b) Pengecekan honeypot anti-spam
 * (c) Verifikasi token Cloudflare Turnstile ke endpoint siteverify
 * (d) Pengecekan status pendaftaran buka dari DB
 * (e) Menghitung academic_year dan wave secara otoritatif di server
 * (f) Memverifikasi keberadaan dan keabsahan objek bukti bayar di Supabase Storage
 * (g) Normalisasi nomor telepon ke format standar '628xxx'
 * (h) Insert data via klien admin (melewati RLS) dengan consented_at
 * (i) Menangani kode error 23505 (unique violation) menjadi pesan ramah tanpa kebocoran PII
 * (j) Mengembalikan id pendaftaran untuk dialihkan ke /berhasil/[id]
 */
export async function createRegistration(
  payload: ServerRegistrationInput
): Promise<CreateRegistrationResult> {
  // 1. Cek Honeypot (Anti-Bot awal)
  if (payload.honeypot && payload.honeypot.trim() !== "") {
    return {
      success: false,
      message: "Permintaan pendaftaran tidak dapat diproses (indikasi bot).",
    };
  }

  // 2. Validasi input dengan Zod Schema di server
  const parsed = serverRegistrationSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const fieldName = issue.path.join(".");
      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = issue.message;
      }
    }
    return {
      success: false,
      message: "Terdapat data formulir yang belum sesuai ketentuan.",
      fieldErrors,
    };
  }

  const validData = parsed.data;

  // 3. Rate limiting per IP untuk submit
  const clientIp = await getClientIp();
  const rateLimit = checkRateLimit("submit", clientIp);
  if (!rateLimit.success) {
    const minutesLeft = Math.ceil(rateLimit.resetMs / (60 * 1000));
    return {
      success: false,
      message: `Terlalu banyak permintaan pendaftaran dari perangkat Anda. Silakan coba lagi dalam ${minutesLeft} menit.`,
    };
  }

  // 4. Verifikasi Cloudflare Turnstile
  const turnstileResult = await verifyTurnstileToken(validData.turnstile_token, clientIp);
  if (!turnstileResult.success) {
    return {
      success: false,
      message: "Verifikasi keamanan Turnstile gagal atau kedaluwarsa. Silakan ulangi centang verifikasi.",
    };
  }

  // 5. Cek status buka pendaftaran & hitung academic_year dan wave di server
  const regState = await getRegistrationState();
  if (!regState.open || regState.wave === null) {
    return {
      success: false,
      message: "Pendaftaran calon siswa baru saat ini sedang ditutup.",
    };
  }

  const serverAcademicYear = regState.academicYear;
  const serverWave = regState.wave;
  const startYear = serverAcademicYear.split("/")[0] || new Date().getFullYear().toString();

  // 6. Verifikasi path dan keberadaan file di Supabase Storage
  const expectedPrefix = `proofs/${startYear}/`;
  if (!validData.payment_proof_path.startsWith(expectedPrefix)) {
    return {
      success: false,
      message: "Lokasi file bukti transfer tidak sah atau tidak sesuai tahun ajaran aktif.",
    };
  }

  const supabaseAdmin = createAdminClient();

  try {
    // Cek keberadaan objek di bucket payment-proofs
    const { data: fileExists, error: existsError } = await supabaseAdmin.storage
      .from("payment-proofs")
      .exists(validData.payment_proof_path);

    if (existsError || !fileExists) {
      return {
        success: false,
        message: "Foto bukti pembayaran tidak ditemukan di penyimpanan server. Silakan pilih dan unggah ulang foto bukti transfer.",
      };
    }

    // Ambil metadata objek untuk verifikasi ukuran dan MIME
    const { data: fileInfo, error: infoError } = await supabaseAdmin.storage
      .from("payment-proofs")
      .info(validData.payment_proof_path);

    if (infoError || !fileInfo) {
      return {
        success: false,
        message: "Gagal memverifikasi keabsahan berkas bukti pembayaran di server. Silakan coba lagi.",
      };
    }

    // Verifikasi ukuran berkas di storage
    const actualSize = typeof fileInfo.size === "number" ? fileInfo.size : validData.payment_proof_size;
    if (actualSize > MAX_FILE_SIZE) {
      return {
        success: false,
        message: "Ukuran berkas bukti transfer melebihi batas maksimal 5 MB.",
      };
    }

    // Verifikasi MIME type
    const actualMime = (fileInfo.contentType || validData.payment_proof_mime).toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(actualMime as (typeof ALLOWED_FILE_TYPES)[number])) {
      return {
        success: false,
        message: "Format berkas bukti transfer tidak didukung.",
      };
    }

    // 7. Normalisasi nomor telepon
    const normalizedPhone = normalizeIdPhone(validData.contact_phone);

    // 8. Simpan ke database via Supabase Admin (Bypass RLS)
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("registrations")
      .insert({
        academic_year: serverAcademicYear,
        wave: serverWave,
        status: "pending",

        // Data Siswa
        student_name: validData.student_name.trim(),
        student_nickname: validData.student_nickname.trim(),
        birth_place: validData.birth_place.trim(),
        birth_date: validData.birth_date,
        gender: validData.gender,
        siblings_count: validData.siblings_count,
        birth_order: validData.birth_order,
        student_address: validData.student_address.trim(),
        contact_phone: normalizedPhone,
        hobby: validData.hobby.trim(),
        achievements: validData.achievements?.trim() || "-",
        medical_conditions: validData.medical_conditions?.trim() || "-",

        // Data Orang Tua
        father_name: validData.father_name.trim(),
        mother_name: validData.mother_name.trim(),
        father_education: validData.father_education,
        mother_education: validData.mother_education,
        father_job: validData.father_job.trim(),
        mother_job: validData.mother_job.trim(),
        parent_address: validData.parent_address.trim(),

        // Pembayaran
        payment_proof_path: validData.payment_proof_path,
        payment_proof_mime: actualMime,
        payment_proof_size: actualSize,

        // Persetujuan
        consented_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      // 9. Tangani kode error Postgres 23505 (unique_violation)
      if (insertError.code === "23505") {
        return {
          success: false,
          message:
            "Calon siswa dengan nama dan tanggal lahir ini sudah terdaftar pada tahun ajaran aktif. Silakan hubungi panitia SPMB jika Anda membutuhkan bantuan.",
        };
      }

      console.error(
        "[REGISTRATION_ACTION] Gagal menyimpan pendaftaran ke DB:",
        insertError.code,
        insertError.message
      );
      return {
        success: false,
        message: "Terjadi kendala saat menyimpan pendaftaran ke database. Isian Anda aman, silakan coba lagi beberapa saat lagi.",
      };
    }

    // 10. Berhasil -> kembalikan ID UUID
    return {
      success: true,
      id: inserted.id,
    };
  } catch (err) {
    console.error(
      "[REGISTRATION_ACTION] Kesalahan tak terduga:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat memproses formulir pendaftaran.",
    };
  }
}
