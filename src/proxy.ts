import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 Proxy
 * Menjalankan sinkronisasi sesi Supabase dan proteksi rute admin lapis 1.
 * Catatan: Ini BUKAN satu-satunya lapisan (requireAdmin tetap wajib di server components/actions).
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Proteksi lapis 1: redirect /admin/* (kecuali /admin/login) ke /admin/login bila tidak ada sesi
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Salin cookies sesi hasil refresh agar tidak hilang
      response.cookies.getAll().forEach((c) => {
        redirectResponse.cookies.set(c.name, c.value, c);
      });
      return redirectResponse;
    }
  }

  // Jika user sudah memiliki sesi dan membuka /admin/login, arahkan ke /admin
  if (pathname === "/admin/login" && user) {
    const adminUrl = new URL("/admin", request.url);
    const redirectResponse = NextResponse.redirect(adminUrl);
    response.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, c);
    });
    return redirectResponse;
  }

  return response;
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
