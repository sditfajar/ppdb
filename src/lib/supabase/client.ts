import { createBrowserClient } from "@supabase/ssr";

/**
 * Klien Supabase untuk Browser (Client Components)
 * Hanya memakai publishable key, bergantung penuh pada RLS.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createBrowserClient(url, publishableKey);
}
