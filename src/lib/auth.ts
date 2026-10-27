import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Memastikan request dijalankan oleh pengguna yang terautentikasi DAN terdaftar
 * sebagai admin di tabel public.admins.
 *
 * Menggunakan klien sesi (@supabase/ssr dengan cookies) sehingga seluruh operasi
 * berikutnya mematuhi aturan Row Level Security (RLS) Supabase.
 *
 * Jika user tidak terotentikasi atau bukan admin:
 * - Sesi dikeluarkan (signOut) bila bukan admin.
 * - Otomatis diarahkan ke /admin/login.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Cek keberadaan di tabel public.admins melalui RLS
  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return { user, supabase };
}
