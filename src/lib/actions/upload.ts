"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getRegistrationState } from "@/lib/actions/registration-state";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/validation/registration";

export interface RequestUploadUrlInput {
  mime: string;
  size: number;
}

export interface RequestUploadUrlResult {
  success: boolean;
  message?: string;
  data?: {
    path: string;
    token: string;
    signedUrl?: string;
  };
}

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Server Action: requestUploadUrl
 * 
 * 1. Validasi tipe MIME dan batas ukuran file (maks 5 MB).
 * 2. Memastikan pendaftaran sedang berstatus BUKA.
 * 3. Menerapkan rate limit per alamat IP.
 * 4. Membuat path acak "proofs/{tahun}/{uuid}.{ext}".
 * 5. Memanggil createSignedUploadUrl pada bucket privat 'payment-proofs'.
 */
export async function requestUploadUrl(
  input: RequestUploadUrlInput
): Promise<RequestUploadUrlResult> {
  const { mime, size } = input;

  // 1. Validasi tipe MIME
  if (!ALLOWED_FILE_TYPES.includes(mime as (typeof ALLOWED_FILE_TYPES)[number])) {
    return {
      success: false,
      message: "Format foto tidak didukung. Harap gunakan format JPG, PNG, atau WebP.",
    };
  }

  // 2. Validasi batas ukuran
  if (typeof size !== "number" || size <= 0 || size > MAX_FILE_SIZE) {
    const sizeMb = (size / (1024 * 1024)).toFixed(1).replace(".", ",");
    return {
      success: false,
      message: `Ukuran foto ${sizeMb} MB melebihi batas maksimal 5 MB. Coba ambil screenshot bukti transfer Anda.`,
    };
  }

  // 3. Cek status buka pendaftaran
  const regState = await getRegistrationState();
  if (!regState.open) {
    return {
      success: false,
      message: "Pendaftaran calon siswa baru saat ini sedang ditutup. Tidak dapat mengunggah bukti pembayaran.",
    };
  }

  // 4. Rate limiting per IP
  const clientIp = await getClientIp();
  const rateLimit = checkRateLimit("upload", clientIp);
  if (!rateLimit.success) {
    const minutesLeft = Math.ceil(rateLimit.resetMs / (60 * 1000));
    return {
      success: false,
      message: `Terlalu banyak permintaan unggah dalam waktu singkat. Silakan coba lagi dalam ${minutesLeft} menit.`,
    };
  }

  // 5. Generate path acak: "proofs/{tahun_awal}/{uuid}.{ext}"
  const startYear = regState.academicYear.split("/")[0] || new Date().getFullYear().toString();
  const ext = MIME_TO_EXT[mime] || "jpg";
  const randomUuid = crypto.randomUUID();
  const storagePath = `proofs/${startYear}/${randomUuid}.${ext}`;

  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.storage
      .from("payment-proofs")
      .createSignedUploadUrl(storagePath);

    if (error || !data) {
      console.error("[STORAGE_UPLOAD] Gagal membuat signed upload url:", error?.message, error);
      return {
        success: false,
        message: "Layanan penyimpanan sementara tidak dapat dihubungi. Silakan coba beberapa saat lagi.",
      };
    }

    return {
      success: true,
      data: {
        path: data.path,
        token: data.token,
        signedUrl: data.signedUrl,
      },
    };
  } catch (err) {
    console.error("[STORAGE_UPLOAD] Kesalahan tak terduga:", err);
    return {
      success: false,
      message: "Terjadi kesalahan pada sistem saat mempersiapkan penyimpanan bukti bayar.",
    };
  }
}
