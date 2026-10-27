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
