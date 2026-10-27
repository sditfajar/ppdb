import { z } from "zod";
import { normalizeIdPhone } from "@/lib/phone";

/**
 * Opsi tingkat pendidikan orang tua
 * Sesuai PRD §8.2 & skema PostgreSQL enum education_level
 */
export const EDUCATION_LEVELS = [
  "sd_mi",
  "smp_mts",
  "sma_smk_ma",
  "d1_d3",
  "s1_s3",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const EDUCATION_OPTIONS: { value: EducationLevel; label: string }[] = [
  { value: "sd_mi", label: "SD/MI Sederajat" },
  { value: "smp_mts", label: "SMP/MTS Sederajat" },
  { value: "sma_smk_ma", label: "SMA/SMK/MA Sederajat" },
  { value: "d1_d3", label: "D1/D2/D3" },
  { value: "s1_s3", label: "S1/S2/S3" },
];

/**
 * Format MIME dan batas ukuran bukti bayar
 * Sesuai PRD §8.3
 */
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Menghitung usia berdasarkan tanggal lahir dan tanggal acuan
 */
export function calculateAge(birthDateStr: string, referenceDate: Date = new Date()): number {
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return 0;

  let age = referenceDate.getFullYear() - birth.getFullYear();
  const monthDiff = referenceDate.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Skema Objek Dasar Langkah 1 — Data Calon Siswa (PRD §8.2)
 */
export const baseStudentSchema = z.object({
  student_name: z
    .string()
    .trim()
    .min(3, { message: "Nama lengkap siswa wajib diisi (minimal 3 karakter)." })
    .max(100, { message: "Nama lengkap siswa maksimal 100 karakter." })
    .regex(/^[a-zA-Z\s.'-]+$/, {
      message: "Nama hanya boleh mengandung huruf, spasi, titik, tanda petik, atau tanda hubung.",
    }),

  student_nickname: z
    .string()
    .trim()
    .min(1, { message: "Nama panggilan siswa wajib diisi." })
    .max(30, { message: "Nama panggilan siswa maksimal 30 karakter." }),

  birth_place: z
    .string()
    .trim()
    .min(2, { message: "Tempat lahir wajib diisi (minimal 2 karakter)." })
    .max(60, { message: "Tempat lahir maksimal 60 karakter." }),

  birth_date: z
    .string()
    .min(1, { message: "Tanggal lahir wajib diisi." })
    .refine(
      (val) => {
        const d = new Date(val);
        if (isNaN(d.getTime())) return false;
        // Tidak boleh di masa depan
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return d <= today;
      },
      { message: "Tanggal lahir tidak boleh di masa depan." }
    )
    .refine(
      (val) => {
        const age = calculateAge(val);
        return age >= 4 && age <= 12;
      },
      { message: "Usia calon siswa harus antara 4 hingga 12 tahun." }
    ),

  gender: z.enum(["L", "P"], {
    message: "Pilih jenis kelamin siswa (Laki-laki / Perempuan).",
  }),

  siblings_count: z.coerce
    .number({
      message: "Jumlah saudara kandung harus berupa angka.",
    })
    .int({ message: "Jumlah saudara kandung harus berupa bilangan bulat." })
    .min(0, { message: "Jumlah saudara kandung tidak boleh negatif (minimal 0)." })
    .max(20, { message: "Jumlah saudara kandung maksimal 20." }),

  birth_order: z.coerce
    .number({
      message: "Anak ke- harus berupa angka.",
    })
    .int({ message: "Anak ke- harus berupa bilangan bulat." })
    .min(1, { message: "Anak ke- minimal 1." }),

  student_address: z
    .string()
    .trim()
    .min(10, { message: "Alamat lengkap siswa wajib diisi (minimal 10 karakter)." })
    .max(300, { message: "Alamat lengkap siswa maksimal 300 karakter." }),

  contact_phone: z
    .string()
    .trim()
    .min(1, { message: "Nomor telepon/HP wajib diisi." })
    .refine(
      (val) => {
        try {
          normalizeIdPhone(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          "Format nomor HP tidak valid. Gunakan format nomor Indonesia (contoh: 081234567890).",
      }
    ),

  hobby: z
    .string()
    .trim()
    .min(2, { message: "Hobi siswa wajib diisi (minimal 2 karakter)." })
    .max(100, { message: "Hobi siswa maksimal 100 karakter." }),

  achievements: z
    .string()
    .trim()
    .min(1, { message: "Prestasi wajib diisi. Ketik '-' jika belum ada." })
    .max(300, { message: "Prestasi siswa maksimal 300 karakter." }),

  medical_conditions: z
    .string()
    .trim()
    .min(1, { message: "Riwayat penyakit wajib diisi. Ketik '-' jika tidak ada." })
    .max(300, { message: "Riwayat penyakit maksimal 300 karakter." }),
});

/**
 * Validasi Langkah 1 — Data Calon Siswa (dengan relasi internal)
 */
export const studentSchema = baseStudentSchema.superRefine((data, ctx) => {
  // birth_order <= siblings_count + 1
  if (data.birth_order > data.siblings_count + 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["birth_order"],
      message: `Anak ke-${data.birth_order} tidak boleh melebihi jumlah saudara + 1 (maksimal ke-${data.siblings_count + 1}).`,
    });
  }
});

/**
 * Validasi Langkah 2 — Data Orang Tua (PRD §8.2)
 */
export const parentSchema = z.object({
  father_name: z
    .string()
    .trim()
    .min(3, { message: "Nama lengkap ayah wajib diisi (minimal 3 karakter)." })
    .max(100, { message: "Nama lengkap ayah maksimal 100 karakter." }),

  mother_name: z
    .string()
    .trim()
    .min(3, { message: "Nama lengkap ibu wajib diisi (minimal 3 karakter)." })
    .max(100, { message: "Nama lengkap ibu maksimal 100 karakter." }),

  father_education: z.enum(EDUCATION_LEVELS, {
    message: "Pilih pendidikan tertinggi ayah.",
  }),

  mother_education: z.enum(EDUCATION_LEVELS, {
    message: "Pilih pendidikan tertinggi ibu.",
  }),

  father_job: z
    .string()
    .trim()
    .min(2, { message: "Pekerjaan ayah wajib diisi (minimal 2 karakter)." })
    .max(80, { message: "Pekerjaan ayah maksimal 80 karakter." }),

  mother_job: z
    .string()
    .trim()
    .min(2, { message: "Pekerjaan ibu wajib diisi (minimal 2 karakter)." })
    .max(80, { message: "Pekerjaan ibu maksimal 80 karakter." }),

  parent_address: z
    .string()
    .trim()
    .min(10, { message: "Alamat orang tua wajib diisi (minimal 10 karakter)." })
    .max(300, { message: "Alamat orang tua maksimal 300 karakter." }),
});

/**
 * Validasi file bukti bayar sisi klien / metadata
 */
export const paymentProofFileSchema = z
  .custom<File | null | undefined>((val) => val instanceof Object, {
    message: "Foto bukti pembayaran formulir wajib diunggah.",
  })
  .refine((file) => file !== null && file !== undefined, {
    message: "Foto bukti pembayaran formulir wajib diunggah.",
  })
  .refine(
    (file) => {
      if (!file || typeof file.size !== "number") return false;
      return file.size <= MAX_FILE_SIZE;
    },
    {
      message: `Ukuran foto maksimal 5 MB. Coba ambil screenshot bukti transfer bila terlalu besar.`,
    }
  )
  .refine(
    (file) => {
      if (!file || typeof file.type !== "string") return false;
      return ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number]);
    },
    {
      message:
        "Format foto tidak didukung. Harap gunakan format JPG, PNG, atau WebP.",
    }
  );

/**
 * Validasi Langkah 3 — Pembayaran & Konfirmasi (PRD §8.2, §8.3)
 */
export const paymentSchema = z.object({
  consented: z.literal(true, {
    message:
      "Anda harus mencentang persetujuan kebenaran data dan pemrosesan untuk melanjutkan.",
  }),
  payment_proof_file: paymentProofFileSchema,
  honeypot: z.string().optional().refine((val) => !val || val === "", {
    message: "Spam detected.",
  }),
});

/**
 * Skema formulir registrasi gabungan (seluruh langkah)
 */
export const registrationSchema = baseStudentSchema
  .merge(parentSchema)
  .merge(paymentSchema)
  .superRefine((data, ctx) => {
    // Validasi lintas field: birth_order <= siblings_count + 1
    if (data.birth_order > data.siblings_count + 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birth_order"],
        message: `Anak ke-${data.birth_order} tidak boleh melebihi jumlah saudara + 1 (maksimal ke-${data.siblings_count + 1}).`,
      });
    }
  });

/**
 * Ekspor tipe infer Zod
 */
export type StudentFormData = z.infer<typeof studentSchema>;
export type ParentFormData = z.infer<typeof parentSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
