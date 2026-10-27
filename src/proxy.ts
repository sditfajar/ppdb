import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 Proxy
 * Menjalankan sinkronisasi sesi Supabase sebelum render rute.
 * Catatan: Logika otorisasi admin sengaja belum diletakkan di sini (Fase 5).
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Jalankan proxy pada semua path KECUALI:
     * - _next/static (file statis bundel)
     * - _next/image (optimasi gambar)
     * - favicon.ico (icon)
     * - File statis berekstensi (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
