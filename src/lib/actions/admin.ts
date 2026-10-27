"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import {
  adminLoginSchema,
  rejectRegistrationSchema,
  adminNoteSchema,
  settingsSchema,
  type SettingsInput,
} from "@/lib/validation/admin";

export type AdminActionState = {
  success?: boolean;
  message?: string;
  error?: string;
};

/**
 * Server Action untuk login administrator.
 *
 * Menerapkan pesan error generik agar tidak membocorkan keberadaan email.
 * Jika pengguna terdaftar di Supabase Auth tetapi bukan admin, sesi segera
 * dikeluarkan dan tetap menghasilkan pesan error generik.
 */
export async function signInAdmin(
  _prevState: AdminActionState | undefined,
  formData: FormData
): Promise<AdminActionState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const parsed = adminLoginSchema.safeParse({
    email: typeof rawEmail === "string" ? rawEmail : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Email atau kata sandi salah.",
    };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

  if (authError || !authData.user) {
    return {
      success: false,
      error: "Email atau kata sandi salah.",
    };
  }

  // Verifikasi keanggotaan admin di tabel public.admins melalui RLS
  const { data: adminRow, error: adminCheckError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (adminCheckError || !adminRow) {
    // Pengguna auth valid tetapi bukan admin sekolah; keluarkan paksa
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Email atau kata sandi salah.",
    };
  }

  redirect("/admin");
}

/**
 * Server Action untuk logout administrator.
 */
export async function signOutAdmin(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Memverifikasi pendaftaran calon siswa.
 * Memerlukan otorisasi admin dan mencatat reviewed_by serta reviewed_at.
 */
export async function verifyRegistration(
  id: string
): Promise<AdminActionState> {
  const { user, supabase } = await requireAdmin();

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "verified",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Gagal memverifikasi pendaftaran: " + error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/pendaftar/${id}`);

  return {
    success: true,
    message: "Pendaftaran berhasil diverifikasi.",
  };
}

/**
 * Menolak pendaftaran calon siswa dengan alasan tertulis (minimal 5 karakter).
 */
export async function rejectRegistration(
  id: string,
  reason: string
): Promise<AdminActionState> {
  const { user, supabase } = await requireAdmin();

  const parsed = rejectRegistrationSchema.safeParse({ reason });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Alasan penolakan minimal 5 karakter.",
    };
  }

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "rejected",
      rejection_reason: parsed.data.reason,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Gagal menolak pendaftaran: " + error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/pendaftar/${id}`);

  return {
    success: true,
    message: "Pendaftaran berhasil ditolak.",
  };
}

/**
 * Mengembalikan status pendaftaran ke Menunggu Verifikasi (pending).
 */
export async function revertToPending(
  id: string
): Promise<AdminActionState> {
  const { user, supabase } = await requireAdmin();

  const { error } = await supabase
    .from("registrations")
    .update({
      status: "pending",
      rejection_reason: null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Gagal mengembalikan status: " + error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/pendaftar/${id}`);

  return {
    success: true,
    message: "Status pendaftaran dikembalikan ke Menunggu Verifikasi.",
  };
}

/**
 * Menyimpan catatan internal admin untuk pendaftaran tertentu.
 */
export async function saveAdminNote(
  id: string,
  note: string
): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();

  const parsed = adminNoteSchema.safeParse({ note });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Format catatan tidak valid.",
    };
  }

  const { error } = await supabase
    .from("registrations")
    .update({
      admin_note: parsed.data.note || null,
    })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Gagal menyimpan catatan: " + error.message,
    };
  }

  revalidatePath(`/admin/pendaftar/${id}`);

  return {
    success: true,
    message: "Catatan admin berhasil disimpan.",
  };
}

/**
 * Memperbarui pengaturan sistem PPDB (tahun ajaran, buka/tutup pendaftaran, info pembayaran).
 * Dijalankan dengan sesi admin sehingga RLS 'Admins can update app settings' berlaku.
 * Menggunakan revalidatePath agar langsung memengaruhi halaman publik dan admin.
 */
export async function updateSettings(
  input: SettingsInput
): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Format data pengaturan tidak valid.",
    };
  }

  const { error } = await supabase
    .from("app_settings")
    .update({
      academic_year: parsed.data.academic_year,
      registration_open: parsed.data.registration_open,
      payment_amount: parsed.data.payment_amount,
      payment_bank: parsed.data.payment_bank,
      payment_account_no: parsed.data.payment_account_no,
      payment_account_name: parsed.data.payment_account_name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) {
    return {
      success: false,
      error: "Gagal menyimpan pengaturan: " + error.message,
    };
  }

  // Revalidasi halaman publik (info dan wizard) serta seluruh halaman admin
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/pengaturan");

  return {
    success: true,
    message: "Pengaturan PPDB berhasil disimpan.",
  };
}
