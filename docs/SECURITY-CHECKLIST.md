# Laporan Audit Keamanan Sistem (Security Checklist)
## PPDB Online SDIT Fajar

Dokumen audit ini merangkum pengujian dan verifikasi kontrol keamanan sistem sesuai spesifikasi PRD §10 dan Roadmap Fase 7 & 8.

---

## 1. Matriks Hasil Audit Keamanan

| # | Item Kontrol Keamanan | Metode Verifikasi | Status | Hasil & Analisis |
|---|---|---|:---:|---|
| **a** | **Akses REST & Storage Langsung oleh Anonim Ditolak** | Pengujian PostgREST & Supabase SDK menggunakan Publishable Key | **LULUS** | RLS pada tabel `registrations`, `admins`, dan `app_settings` aktif tanpa policy untuk role `anon`. Query `SELECT`, `INSERT`, `UPDATE`, `DELETE` langsung menghasilkan respons kosong atau permission denied. Anonim juga tidak memiliki hak akses `list()` maupun `download()` ke bucket `payment-proofs`. |
| **b** | **Unggah Berkas ke Bucket Tanpa Token Ditolak** | Pengujian HTTP upload langsung ke Supabase Storage tanpa upload token | **LULUS** | Bucket `payment-proofs` bersifat privat. Upload berkas dari browser wajib menggunakan token satu kali pakai yang dihasilkan dari `createSignedUploadUrl` di Server Action. Percobaan upload tanpa token ditolak dengan status HTTP 403 / 401. |
| **c** | **Isolasi Kunci Secret (Tidak Ada Bocor ke Bundel Klien)** | Analisis build AST Next.js & pemeriksaan variabel bundel JS | **LULUS** | `SUPABASE_SECRET_KEY` diisolasi di lingkungan server menggunakan direktif `import "server-only"`. Variabel ini tidak pernah berawalan `NEXT_PUBLIC_` dan tidak ditemukan dalam bundel `.next/static`. |
| **d** | **Proteksi Ganda Server Action & Rute Admin** | Pemanggilan Server Action admin tanpa sesi admin & pengujian proxy | **LULUS** | Semua Server Action admin (`verifyRegistration`, `rejectRegistration`, `revertToPending`, `updateSettings`, dll.) memanggil `requireAdmin()` yang memverifikasi keberadaan user di tabel `admins`. Proxy `src/proxy.ts` juga mengarahkan akses tak terautentikasi ke `/admin/login`. |
| **e** | **Pembatasan Masa Berlaku Signed URL Bukti Bayar** | Inspeksi parameter masa berlaku signed URL pada detail pendaftar | **LULUS** | Gambar bukti bayar hanya disajikan lewat signed URL berumur 300 detik (5 menit). Tautan kedaluwarsa secara otomatis dan tidak dapat disebarluaskan secara publik. |
| **f** | **Eliminasi Data Pribadi (PII) dari Log Server** | Audit pemanggilan `console.*` di seluruh direktori `src/` | **LULUS** | Semua error database dan sistem telah disanitasi: hanya mencatat error code dan pesan generik. Objek baris basis data yang memuat nama calon siswa, tanggal lahir, atau nomor telepon orang tua tidak dicetak ke stdout/stderr. |
| **g** | **Penerapan Header Keamanan HTTP & CSP Ketat** | Pemeriksaan header respons di `next.config.ts` | **LULUS** | Header aktif: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, dan `Strict-Transport-Security`. CSP membatasi skrip hanya ke origin dan Cloudflare Turnstile, serta membatasi connect-src ke Supabase dan Turnstile. |
| **h** | **Pencegahan Injeksi Formula CSV (Formula Injection)** | Unit test `tests/unit/csv.test.ts` & audit modul `src/lib/csv.ts` | **LULUS** | Sel berawalan karakter berbahaya (`=`, `+`, `-`, `@`, `\t`, `\r`) otomatis dinetralkan dengan awalan tanda petik tunggal (`'`), kecuali nilai tunggal persis `"-"`. Berkas diekspor dengan UTF-8 BOM untuk kompatibilitas Excel yang aman. |
| **i** | **Sanitasi Pencarian Admin dari Injeksi Filter PostgREST** | Unit test `tests/unit/admin-sanitize.test.ts` & audit `src/lib/sanitize.ts` | **LULUS** | Input kata kunci pencarian admin (`q`) disanitasi dari karakter khusus seperti koma, kurung buka/tutup, tanda persen, dan kutip sebelum dimasukkan ke dalam filter `or()` / `ilike()` PostgREST. |

---

## 2. Kesimpulan Keamanan

Sistem PPDB Online SDIT Fajar telah memenuhi seluruh kriteria keamanan tingkat lanjut (defense-in-depth) yang disyaratkan dalam dokumen PRD dan siap untuk tahap peluncuran produksi.
