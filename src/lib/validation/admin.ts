import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const rejectRegistrationSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Alasan penolakan minimal 5 karakter."),
});

export type RejectRegistrationInput = z.infer<typeof rejectRegistrationSchema>;

export const adminNoteSchema = z.object({
  note: z.string().trim().max(1000, "Catatan maksimal 1000 karakter."),
});

export type AdminNoteInput = z.infer<typeof adminNoteSchema>;

export const settingsSchema = z.object({
  academic_year: z
    .string()
    .trim()
    .regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran harus YYYY/YYYY (contoh: 2026/2027)."),
  registration_open: z.boolean(),
  payment_amount: z
    .number({ message: "Nominal pembayaran harus berupa angka." })
    .int({ message: "Nominal harus berupa bilangan bulat." })
    .min(0, "Nominal tidak boleh negatif."),
  payment_bank: z
    .string()
    .trim()
    .min(2, "Nama bank minimal 2 karakter.")
    .max(100, "Nama bank maksimal 100 karakter."),
  payment_account_no: z
    .string()
    .trim()
    .min(4, "Nomor rekening minimal 4 karakter.")
    .max(50, "Nomor rekening maksimal 50 karakter."),
  payment_account_name: z
    .string()
    .trim()
    .min(2, "Nama pemilik rekening minimal 2 karakter.")
    .max(100, "Nama pemilik rekening maksimal 100 karakter."),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
