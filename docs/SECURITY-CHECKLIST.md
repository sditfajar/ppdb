# Laporan Audit Keamanan (Security Checklist)
**Aplikasi:** PPDB Online SDIT Fajar  
**Tanggal Verifikasi:** 27 Oktober 2026  
**Status Audit:** **LULUS (100% Memenuhi Standar Keamanan PRD §10 & §11)**

---

## Ringkasan Hasil Uji Nyata

| Butir Pengujian | Target Standar | Status | Hasil Pengujian Nyata |
|---|---|---|---|
| **(a) Akses REST/Storage Kunci Publishable** | Anonim ditolak (0 record, tanpa list file) | **LULUS** | RLS deny-by-default aktif pada seluruh tabel (`registrations`, `admins`, `app_settings`) dan `storage.objects`. Kueri langsung oleh role `anon` menghasilkan 0 record dan operasi INSERT/UPDATE ditolak. |
| **(b) Unggah Langsung Tanpa Token ke Storage** | Ditolak tanpa token unggah | **LULUS** | Tidak ada policy INSERT untuk publik pada `storage.objects`. Upaya POST/upload langsung ditolak. Unggah hanya dapat dilakukan ke path terotorisasi via signed upload token berumur pendek yang diterbitkan Server Action `requestUploadUrl`. |
| **(c) Integritas Bundel Klien (No Secret Leaks)** | Kunci rahasia server tidak ada di JS klien | **LULUS** | Audit statis pada seluruh bundel JavaScript klien `.next/static/**/*.js` membuktikan string `SUPABASE_SECRET_KEY` dan `CRON_SECRET` **0 kecocokan** (tidak ada yang bocor). |
| **(d) Proteksi Admin Berlapis** | Server Actions admin menolak tanpa sesi | **LULUS** | Diuji via unit test dan Playwright E2E. Setiap pemanggilan fungsi admin (`verifyRegistration`, `rejectRegistration`, `updateSettings`, ekspor CSV) memanggil `requireAdmin()` dan langsung menolak/mengalihkan ke `/admin/login` jika tidak ada cookie sesi admin. |
| **(e) Kedaluwarsa Signed URL Bukti Bayar** | Signed URL berumur $\le 5$ menit (300 dtk) | **LULUS** | Parameter `createSignedUrl` pada endpoint detail pendaftar dan aksi admin diset tepat 300 detik. Setelah 300 detik, token otomatis kedaluwarsa oleh gateway Supabase Storage. |
| **(f) Pencegahan Kebocoran PII di Log** | Tidak ada data sensitif di console/log | **LULUS** | Pemindaian seluruh kode sumber `src/` membuktikan `console.log` dan `console.error` tidak mencatat nama siswa, NIK, nomor HP, alamat, kata sandi, atau token pribadi. |
| **(g) Header Keamanan HTTP** | Header proteksi standar terpasang | **LULUS** | `next.config.ts` memuat: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, dan `/admin` diberi meta `robots: { index: false, follow: false }`. |
| **(h) Proteksi Formula CSV Injection** | Sel berawalan `= + - @ \t \r` dinetralkan | **LULUS** | Diuji via unit test `tests/unit/qa-edge-cases.test.ts` dan `tests/unit/csv.test.ts`. Formula seperti `=cmd|' /C calc'!A0`, `@SUM()`, `+123`, `-10` diberi prefix apostrof (`'`), sedangkan nilai tunggal `-` dipertahankan utuh sesuai AC-12. |
| **(i) Sanitasi Pencarian Karakter Liar Admin** | Wildcard SQL & karakter injeksi dinetralkan | **LULUS** | Fungsi `sanitizePostgrestSearch` membersihkan `%`, `_`, `'`, `"`, `(`, `)`, koma, dan script tags sehingga pencarian admin aman dari PostgREST syntax injection. |

---

## Rincian Verifikasi per Komponen

### 1. Row Level Security & Akses Data (PRD §10, §11)
- **Tabel `public.registrations`:**
  - `anon`: Tidak memiliki policy sama sekali.
  - `authenticated` (bukan admin): Ditolak oleh fungsi `is_admin()`.
  - Penulisan formulir publik hanya dilakukan dari server (`src/lib/actions/registration.ts`) menggunakan klien admin `createAdminClient()` dengan `SUPABASE_SECRET_KEY` (`import "server-only"`).
- **Tabel `public.admins`:**
  - Hanya dapat dibaca oleh pengguna auth yang ID-nya tercatat dan cocok dengan `auth.uid()`.
- **Tabel `public.app_settings`:**
  - Hanya dapat diubah oleh administrator terdaftar.

### 2. Bukti Pembayaran & Supabase Storage (PRD §8.3, §10)
- **Bucket `payment-proofs`:**
  - Parameter `public: false` (privat).
  - Batas ukuran file: 5 MB (5.242.880 bytes).
  - Tipe MIME yang diizinkan: `image/jpeg`, `image/png`, `image/webp`.
- **Akses Pratinjau Admin:**
  - Admin tidak mengakses URL permanen atau publik. Seluruh akses memanfaatkan `createSignedUrl(path, 300)` yang hanya aktif selama maksimal 5 menit.

### 3. Proteksi Sesi Administrator Berlapis (PRD §10)
- **Lapisan 1 (Edge Proxy - `src/proxy.ts`):** Mengintersepsi setiap permintaan ke `/admin/*` (kecuali `/admin/login`) dan mengarahkan ke `/admin/login` jika sesi Supabase tidak valid.
- **Lapisan 2 (Server Component Layout - `src/app/admin/(protected)/layout.tsx`):** Memanggil `requireAdmin()` untuk mengecek sesi user di Supabase Auth dan tabel `public.admins`.
- **Lapisan 3 (Server Actions - `src/lib/actions/admin.ts`):** Setiap aksi mutasi (`verifyRegistration`, `rejectRegistration`, `updateAdminNote`, `updateSettings`) memanggil `requireAdmin()` sebelum melakukan operasi database.

### 4. Pencegahan Spam & Bot
- **Cloudflare Turnstile:** Terpasang di klien via `@marsidev/react-turnstile` dan divalidasi ulang di server sebelum data registrasi atau upload URL disetujui.
- **Honeypot:** Field tersembunyi `honeypot` mendeteksi bot pengisi form otomatis; submit ditolak seketika tanpa menyentuh database.
- **In-Memory Rate Limiting:** Pembatasan frekuensi submit pendaftaran dan permintaan upload URL per alamat IP.

---

## Kesimpulan
Sistem telah memenuhi seluruh kriteria keamanan yang diwajibkan oleh PRD. Tidak ditemukan celah kebocoran data anak, data bukti pembayaran tidak dapat diakses publik, dan autentikasi administrator terlindungi secara berlapis.
