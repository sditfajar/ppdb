import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Klien Supabase Admin (Bypass RLS)
 * 
 * PERINGATAN KEAMANAN:
 * - Klien ini menggunakan kunci secret (SUPABASE_SECRET_KEY).
 * - Modul ini dijaga oleh `import "server-only"` dan TIDAK PERNAH boleh di-import di klien.
 * - Digunakan HANYA oleh Server Actions internal untuk:
 *   1. createRegistration (insert data pendaftar baru setelah lolos validasi)
 *   2. requestUploadUrl (membuat signed upload URL bucket privat)
 *   3. Operasi pembersihan cron dan query publik terbatas di halaman sukses.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "[SECURITY] NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SECRET_KEY belum dikonfigurasi."
    );
  }

  return createSupabaseClient<Database>(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
