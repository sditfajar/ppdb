import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Klien Supabase untuk Server Components, Server Actions, dan Route Handlers
 * Menggunakan cookies sesi pengguna dan publishable key (tetap mematuhi RLS).
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component; refresh session di proxy.ts
          // akan menangani pembaruan cookie ke browser.
        }
      },
    },
  });
}
