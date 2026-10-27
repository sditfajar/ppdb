# PPDB Online SDIT Fajar

Aplikasi web penerimaan peserta didik baru (PPDB) online untuk SDIT Fajar dengan formulir registrasi wizard (mobile-first) dan satu role admin untuk verifikasi.

## Prasyarat

- Node.js ≥ 20
- pnpm ≥ 10
- Supabase Project (Postgres, Auth, Storage)

## Variabel Lingkungan

Salin `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Isi variabel lingkungan:
- `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Publishable API key Supabase.
- `SUPABASE_SECRET_KEY`: Secret/Service role API key (hanya di server, jangan pernah `NEXT_PUBLIC_`).
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Site key Cloudflare Turnstile.
- `TURNSTILE_SECRET_KEY`: Secret key Cloudflare Turnstile.
- `NEXT_PUBLIC_SITE_URL`: URL aplikasi (mis. `http://localhost:3000`).
- `CRON_SECRET`: Kunci otorisasi endpoint cron.

## Cara Menjalankan

1. Pasang dependensi:
   ```bash
   pnpm install
   ```

2. Jalankan server pengembangan:
   ```bash
   pnpm dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

3. Menjalankan pengujian & pemeriksaan kode:
   ```bash
   pnpm lint        # ESLint
   pnpm typecheck   # TypeScript check
   pnpm test        # Vitest
   pnpm build       # Production build
   ```

## Pengujian Endpoint Cron Pembersihan File Yatim (Lokal)

Endpoint cron `/api/cron/cleanup-orphans` membersihkan berkas di bucket `payment-proofs` yang berusia > 24 jam dan tidak dirujuk oleh tabel pendaftaran.

1. **Uji akses dengan otorisasi valid (200 OK):**
   ```bash
   curl -i -H "Authorization: Bearer development-cron-secret-change-in-production" http://localhost:3000/api/cron/cleanup-orphans
   ```

2. **Uji penolakan akses tanpa secret (401 Unauthorized):**
   ```bash
   curl -i http://localhost:3000/api/cron/cleanup-orphans
   ```

3. **Uji penolakan dengan token yang salah (401 Unauthorized):**
   ```bash
   curl -i -H "Authorization: Bearer token-salah" http://localhost:3000/api/cron/cleanup-orphans
   ```

## Struktur Proyek

- `src/app/`: App Router Next.js (halaman publik & admin)
- `src/components/`: Komponen antarmuka (UI primitives, registration, admin)
- `src/lib/`: Utilitas (klien Supabase, validasi, konfigurasi, helpers)
- `src/proxy.ts`: Next.js 16 Proxy untuk sinkronisasi sesi Auth
- `supabase/`: Migrasi SQL, skema RLS, dan pengujian database
