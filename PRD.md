# PRD — PPDB Online SDIT Fajar (Form Registrasi Online)

| | |
|---|---|
| **Versi** | 1.0 (Draft untuk review panitia) |
| **Tanggal** | 27 Oktober 2026 |
| **Pemilik produk** | Panitia PPDB SDIT Fajar |
| **Stack** | Next.js (App Router) · Supabase · Vercel · Tailwind CSS v4 |
| **Dokumen pendamping** | `Roadmap.md` (urutan kerja + prompt untuk agent) |

---

## 1. Ringkasan

Aplikasi web untuk **pendaftaran peserta didik baru (PPDB) SDIT Fajar** secara online. Calon wali murid mengisi formulir (data siswa, data orang tua) dan mengunggah bukti pembayaran formulir lewat ponsel. Panitia (satu role: **admin**) memeriksa data dan bukti bayar, lalu menandai pendaftaran sebagai **Terverifikasi** atau **Ditolak**.

Pengganti form berbasis spreadsheet/Google Form: data tersimpan terstruktur, bukti bayar tersimpan privat, dan proses verifikasi punya status yang jelas.

## 2. Masalah & Peluang

| Masalah | Dampak | Solusi di produk ini |
|---|---|---|
| Data tersebar dan tidak seragam (tulisan bebas) | Panitia sulit mencari dan merekap | Field terstruktur dengan validasi |
| Bukti bayar sulit dilacak per pendaftar | Verifikasi lambat, rawan salah | Bukti bayar terikat ke satu pendaftaran + preview langsung |
| Tidak ada status | Orang tua bertanya berulang via WhatsApp | Nomor registrasi + status verifikasi di sisi admin |
| Mayoritas pendaftar memakai ponsel | Form panjang melelahkan | UI **mobile-first**, wizard 3 langkah |

## 3. Tujuan & Metrik

**Tujuan produk**
1. Orang tua dapat mendaftar dari ponsel dalam < 7 menit tanpa bantuan.
2. Admin dapat memverifikasi satu pendaftar dalam < 1 menit.
3. Data anak dan bukti bayar tidak dapat diakses publik.

**Metrik (target, ditinjau setelah gelombang 1)**

| Metrik | Target |
|---|---|
| Tingkat selesai form (mulai → submit) | ≥ 70% |
| Lighthouse mobile — Performance / Accessibility / Best Practices | ≥ 90 / ≥ 95 / ≥ 95 |
| LCP halaman publik (4G) | < 2,5 dtk |
| Insiden kebocoran data | 0 |
| Waktu verifikasi rata-rata per pendaftar | < 1 menit |

## 4. Non-Goals (di luar MVP)

- Payment gateway / pembayaran online (bukti bayar diunggah manual).
- Akun/login untuk orang tua.
- Halaman cek status publik, notifikasi otomatis email/WhatsApp (masuk Backlog, lihat §6).
- Multi-role admin (hanya **satu role: admin**).
- Tes seleksi, penjadwalan, penentuan kelas, rapor.
- Aplikasi native.

## 5. Pengguna & Peran

| Peran | Akses | Catatan |
|---|---|---|
| **Calon wali murid** (publik) | Mengisi & mengirim form. Tanpa akun. | Perangkat utama: ponsel Android, jaringan tidak selalu stabil. |
| **Admin** (satu-satunya role) | Login email + kata sandi. Melihat, mencari, memverifikasi/menolak, ekspor. | Akun dibuat manual di Supabase Auth; **sign-up publik dimatikan**. |

### User stories

**Publik**
- P1. Sebagai orang tua, saya ingin melihat info gelombang pendaftaran dan kontak sekolah agar tahu pendaftaran sedang dibuka.
- P2. Sebagai orang tua, saya ingin mengisi data siswa dan orang tua bertahap agar tidak kewalahan di layar kecil.
- P3. Sebagai orang tua, saya ingin mengunggah foto bukti bayar, melihat previewnya, dan membukanya di tab baru untuk memastikan fotonya terbaca.
- P4. Sebagai orang tua, saya ingin mendapat **nomor registrasi** setelah submit, beserta tombol konfirmasi via WhatsApp ke panitia.
- P5. Sebagai orang tua, saya ingin isian saya tidak hilang jika tidak sengaja menutup halaman.

**Admin**
- A1. Sebagai admin, saya ingin login aman dan melihat daftar pendaftar terbaru beserta statusnya.
- A2. Sebagai admin, saya ingin mencari dan memfilter pendaftar (nama, nomor registrasi, status, gelombang).
- A3. Sebagai admin, saya ingin melihat detail data dan bukti bayar (buka di tab baru) lalu memverifikasi atau menolak dengan alasan.
- A4. Sebagai admin, saya ingin mengekspor data ke CSV untuk rekap.
- A5. Sebagai admin, saya ingin menghubungi orang tua lewat WhatsApp dengan satu ketukan.

## 6. Ruang Lingkup

| Prioritas | Fitur |
|---|---|
| **P0 — MVP** | Halaman info + form wizard 3 langkah · validasi client & server · upload bukti bayar (preview + buka tab baru) · nomor registrasi otomatis · halaman sukses + tombol WhatsApp · login admin · daftar + cari + filter · detail + verifikasi/tolak · ekspor CSV · anti-spam (Turnstile + honeypot) · RLS & storage privat |
| **P1** | Pengaturan (tahun ajaran, buka/tutup pendaftaran, info pembayaran) · tombol "Hubungi via WhatsApp" dengan template pesan · draft form tersimpan di perangkat · pembersihan file yatim (cron) · MFA admin · riwayat perubahan status (audit) |
| **Backlog** | Halaman cek status (nomor registrasi + no. HP) · email/WhatsApp otomatis · kartu bukti pendaftaran (PDF) · kompresi gambar di klien · retensi/anonimisasi data otomatis |

## 7. Alur Pengguna

**Calon wali**
```
Buka halaman → baca info & gelombang → Langkah 1 Data Siswa → Langkah 2 Data Orang Tua
→ Langkah 3 Pembayaran (info rekening, upload bukti + preview, persetujuan, ringkasan) → Kirim
→ Halaman sukses (nomor registrasi, ringkasan, tombol konfirmasi WhatsApp)
```

**Admin**
```
/admin/login → Daftar pendaftar (filter/cari) → Detail (data + bukti bayar)
→ Verifikasi  ──► status: Terverifikasi
→ Tolak (alasan wajib) ──► status: Ditolak
→ (opsional) Kembalikan ke Menunggu
```

## 8. Kebutuhan Fungsional

### 8.1 Halaman publik (`/`)

Konten dan data (sumber: informasi resmi sekolah, lihat Lampiran A):
- Judul: **Formulir Pendaftaran Siswa Baru SDIT Fajar — Tahun Pengajaran {tahun_ajaran}** (nilai dari pengaturan, bukan hard-coded).
- Salam pembuka dan catatan: pastikan data sesuai pendaftar (nama siswa, nama orang tua, dll).
- Kartu **gelombang** dengan penanda gelombang yang sedang aktif:
  - Gelombang 1: September – Februari
  - Gelombang 2: Maret – Juni
- Kartu **kontak**: WhatsApp 0877-3786-0657 (Ustadz M Fadil Riswandi), 0822-4962-7864 (Ustadzah Viny Virzana); Instagram @sdit_fajar; YouTube "SDIT Fajar Depok"; email sditfajar@gmail.com. Semua berupa tautan aktif (`wa.me`, `mailto:`, dll).
- Kartu **info pembayaran formulir** (nominal, bank, no. rekening, atas nama) dari pengaturan.
- Penutup: "Daftarkan segera, dan jadilah bagian dari keluarga kami. Terima kasih, Wassalamualaikum Wr.Wb".
- Jika pendaftaran **ditutup** (di luar gelombang atau dimatikan admin): form disembunyikan, tampil pesan penutupan + kontak.

### 8.2 Form pendaftaran (wizard 3 langkah)

Semua label dalam Bahasa Indonesia. Semua field **wajib** kecuali dinyatakan lain. Validasi dijalankan di klien (UX) **dan** server (otoritatif) dengan skema Zod yang sama.

#### Langkah 1 — Data Calon Siswa

| Label | Key | Input | Validasi |
|---|---|---|---|
| Nama Lengkap Siswa | `student_name` | text | 3–100 karakter, trim; huruf, spasi, `. ' -` |
| Nama Panggilan Siswa | `student_nickname` | text | 1–30 karakter |
| Tempat Lahir | `birth_place` | text | 2–60 karakter |
| Tanggal Lahir | `birth_date` | date | bukan tanggal masa depan; usia wajar 4–12 tahun |
| Jenis Kelamin | `gender` | radio: Laki-laki / Perempuan | wajib pilih (`L` / `P`) |
| Jumlah Saudara Kandung | `siblings_count` | pilihan **1, 2, 3, 4, 5, Lainnya**; "Lainnya" memunculkan input angka | bilangan bulat 0–20 |
| Anak Ke | `birth_order` | angka | bilangan bulat ≥ 1 dan ≤ `siblings_count + 1` |
| Alamat Lengkap | `student_address` | textarea | 10–300 karakter |
| No Telepon/HP yang bisa dihubungi | `contact_phone` | tel | format nomor Indonesia (`08…`, `+62…`, `62…`), dinormalisasi ke `62…` |
| Hobi Siswa | `hobby` | text | 2–100 karakter |
| Prestasi Siswa yang Pernah Diraih | `achievements` | textarea | wajib; ketik `-` jika tidak ada; maks 300 |
| Penyakit Berat yang Diderita | `medical_conditions` | textarea | wajib; ketik `-` jika tidak ada; maks 300 |

Catatan UX: "Tempat, Tanggal Lahir" dipecah menjadi dua field agar valid dan terstandar. Helper text "Tidak termasuk calon siswa" pada Jumlah Saudara Kandung. Prestasi & Penyakit punya tombol kecil "Tidak ada" yang mengisi `-`.

#### Langkah 2 — Data Orang Tua

| Label | Key | Input | Validasi |
|---|---|---|---|
| Nama Lengkap Orangtua (Ayah) | `father_name` | text | 3–100 karakter |
| Nama Lengkap Orangtua (Ibu) | `mother_name` | text | 3–100 karakter |
| Pendidikan Tertinggi (Ayah) | `father_education` | select | salah satu opsi pendidikan |
| Pendidikan Tertinggi (Ibu) | `mother_education` | select | salah satu opsi pendidikan |
| Pekerjaan Ayah | `father_job` | text | 2–80 karakter |
| Pekerjaan Ibu | `mother_job` | text | 2–80 karakter |
| Alamat Lengkap Orang Tua | `parent_address` | textarea | 10–300 karakter; kotak centang "Sama dengan alamat siswa" menyalin nilai |

Opsi pendidikan (nilai enum → label):
`sd_mi` → SD/MI Sederajat · `smp_mts` → SMP/MTS Sederajat · `sma_smk_ma` → SMA/SMK/MA Sederajat · `d1_d3` → D1/D2/D3 · `s1_s3` → S1/S2/S3

#### Langkah 3 — Pembayaran & Konfirmasi

1. Kartu info pembayaran (nominal, rekening) dari pengaturan.
2. **Upload Bukti Pembayaran Formulir** (spesifikasi di §8.3).
3. Ringkasan isian (read-only, tiap bagian punya tautan "Ubah" ke langkah terkait).
4. Kotak centang persetujuan (wajib): *"Saya menyatakan data yang diisi benar dan menyetujui data ini diproses oleh SDIT Fajar untuk keperluan PPDB."* Waktu persetujuan disimpan (`consented_at`).
5. Turnstile (anti-bot) + honeypot tersembunyi.
6. Tombol **Kirim Pendaftaran**.

#### Perilaku wizard
- Indikator langkah (1/3, 2/3, 3/3). Tombol "Lanjut"/"Kembali" **sticky di bawah layar** pada mobile (hormati safe-area).
- Validasi per langkah sebelum lanjut; error pertama otomatis difokuskan; ringkasan error di atas langkah.
- **Draft** disimpan di `localStorage` (kunci berversi) dan dipulihkan saat halaman dibuka lagi; **file tidak disimpan**. Draft dihapus setelah submit sukses.
- Peringatan `beforeunload` bila ada isian belum terkirim.
- Satu formulir = satu anak. Pendaftar lebih dari satu anak mengisi form lagi.

### 8.3 Upload bukti pembayaran

| Aspek | Spesifikasi |
|---|---|
| Format | JPG, PNG, WebP (`image/jpeg`, `image/png`, `image/webp`). |
| Ukuran | Maks **5 MB**. |
| Pemilihan | Tombol/dropzone "Pilih foto bukti pembayaran"; di ponsel membuka galeri/kamera. |
| **Preview** | Setelah file dipilih tampil **thumbnail** (rasio 4:3, `object-cover`) + nama file + ukuran + tombol **Ganti** dan **Hapus**. |
| **Buka di tab baru** | **Klik thumbnail membuka gambar penuh di tab baru** (`<a target="_blank" rel="noopener noreferrer">` ke object URL), lengkap dengan ikon "buka tab baru" dan `aria-label`. Object URL di-revoke saat file diganti/dihapus/unmount. |
| State | `idle` → `selected` → `uploading` (progress) → `uploaded` / `error` (dengan alasan jelas dan tombol coba lagi). |
| Validasi | Klien: tipe + ukuran (pesan error langsung). Server: tipe, ukuran, dan keberadaan objek di storage dicek ulang. |
| Transport | **Signed upload URL**: server membuat URL bertanda tangan, klien mengunggah **langsung ke Supabase Storage** (melewati batas body Vercel Function ±4,5 MB), lalu form mengirim path hasil unggah. |
| Penyimpanan | Bucket **privat** `payment-proofs`; nama objek acak (`proofs/{tahun}/{uuid}.{ext}`), bukan nama asli file. |
| Gambar HEIC | Tidak didukung; tampilkan saran "Gunakan format JPG/PNG atau screenshot". |

### 8.4 Submit & konfirmasi

- Server Action `createRegistration` memvalidasi skema, Turnstile, honeypot, status buka/tutup pendaftaran, keberadaan file bukti, dan duplikasi.
- Berhasil → redirect ke `/berhasil/[id]` (`id` = UUID acak, **bukan** nomor registrasi) yang menampilkan **Nomor Registrasi** (mis. `PPDB-2026-0007`), nama siswa, gelombang, status "Menunggu Verifikasi", dan tombol **Konfirmasi via WhatsApp** (pesan siap kirim berisi nomor registrasi dan nama siswa).
- Alasan memakai UUID: nomor registrasi berurutan sehingga mudah ditebak; URL berbasis nomor akan membuka nama siswa lain. Halaman ini `noindex`, tanpa cache, dan tidak menampilkan data pribadi selain nama siswa dan nomor registrasi.
- Error server ditampilkan dengan bahasa manusiawi; isian tidak hilang.

### 8.5 Admin

| Rute | Fungsi |
|---|---|
| `/admin/login` | Login email + kata sandi. Pesan error generik. Jika bukan admin → keluar paksa. |
| `/admin` | Kartu statistik (Total, Menunggu, Terverifikasi, Ditolak; per gelombang) + daftar pendaftar. Mobile: kartu; ≥ md: tabel. Pencarian (`q`: nama siswa, nama ortu, no. registrasi, no. HP), filter status/gelombang/tahun ajaran, urut terbaru, paginasi 20 per halaman, state dari URL (`searchParams`). |
| `/admin/pendaftar/[id]` | Detail lengkap per bagian (Siswa, Orang Tua, Pembayaran, Administrasi). **Bukti bayar** tampil sebagai gambar (signed URL berumur pendek) dan **klik membuka di tab baru**. Aksi: **Verifikasi**, **Tolak** (alasan wajib, min 5 karakter), **Kembalikan ke Menunggu**, catatan admin. Tombol WhatsApp ke orang tua. |
| `/admin/export` | Ekspor CSV sesuai filter aktif. UTF-8 dengan BOM (terbuka benar di Excel), header Bahasa Indonesia, **perlindungan CSV/formula injection**. |
| `/admin/pengaturan` (P1) | Tahun ajaran, saklar buka/tutup pendaftaran, info pembayaran. |

Setiap aksi admin: konfirmasi eksplisit untuk Verifikasi/Tolak, status loading pada tombol, dan toast hasil.

## 9. Aturan Bisnis

1. **Gelombang** ditentukan otomatis dari tanggal submit (zona waktu `Asia/Jakarta`): bulan 9–12 dan 1–2 → **Gelombang 1**; bulan 3–6 → **Gelombang 2**; bulan 7–8 → **tutup** (asumsi, lihat §17). Admin dapat menutup pendaftaran manual kapan saja (P1).
2. **Status**: `pending` (default) → `verified` | `rejected`. `rejected` wajib punya `rejection_reason`. Admin boleh mengembalikan ke `pending`.
3. **Nomor registrasi**: `PPDB-{tahun_awal}-{urut 4 digit}`, urut berulang per tahun ajaran, unik, aman terhadap submit bersamaan (concurrent).
4. **Duplikasi**: tidak boleh ada dua pendaftaran aktif (status ≠ `rejected`) dengan **nama siswa (case-insensitive, trim) + tanggal lahir + tahun ajaran** yang sama. Ditegakkan oleh indeks unik parsial di database. Pendaftar yang ditolak boleh mendaftar ulang.
5. **Tahun ajaran** dan penanda gelombang tidak di-hard-code; dibaca dari pengaturan/konfigurasi.
6. Hanya admin yang boleh mengubah status; setiap perubahan mencatat `reviewed_by` dan `reviewed_at`.

## 10. Kebutuhan Non-Fungsional

**Performa** — LCP < 2,5 dtk di 4G; halaman publik minim JS (komponen interaktif form saja yang client); font via `next/font`; tanpa gambar besar di atas lipatan; animasi hanya `transform`/`opacity`/`filter`.

**Keamanan**
- **RLS aktif di semua tabel, deny by default.** Tidak ada policy untuk `anon`; penulisan data publik hanya lewat Server Action dengan kunci server.
- Kunci **secret/service** hanya di server (`import "server-only"`), tidak pernah di bundel klien. Klien hanya memakai kunci publishable.
- Storage privat; akses admin lewat **signed URL berumur pendek** (≤ 5 menit); bucket membatasi MIME dan ukuran.
- Proteksi admin **berlapis**: `proxy.ts` (refresh sesi + redirect) **dan** pengecekan `requireAdmin()` di setiap Server Component/Action/Route Handler admin (proxy saja tidak cukup).
- Anti-spam: Cloudflare Turnstile, honeypot, rate limiting (Vercel WAF atau Upstash Ratelimit) pada `requestUploadUrl` dan `createRegistration`.
- Header keamanan (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`), `noindex` untuk `/admin`.
- Tidak ada PII di log. Sign-up Supabase Auth dimatikan.

**Privasi (UU No. 27/2022 tentang Pelindungan Data Pribadi)** — data anak dan data kesehatan bersifat sensitif: kumpulkan seperlunya, tampilkan hanya kepada admin, ada persetujuan eksplisit, kebijakan retensi ditetapkan sekolah (lihat §17).

**Aksesibilitas** — WCAG 2.2 AA: label terhubung ke input, error terbaca screen reader (`aria-describedby`, `aria-invalid`), fokus terlihat, navigasi keyboard penuh, kontras ≥ 4,5:1, target sentuh ≥ 44×44 px, hormati `prefers-reduced-motion`.

**Responsif** — Mobile-first (basis 360 px), diuji di 360/390/768/1024/1440. Input `font-size ≥ 16px` (mencegah auto-zoom iOS), `inputmode`/`autocomplete`/`enterkeyhint` yang tepat.

**Keandalan** — Server Action idempoten terhadap klik ganda (tombol disabled + guard server); error boundary + halaman error ramah; ekspor CSV sebagai cadangan manual.

**Dukungan browser** — dua versi mayor terakhir Chrome, Safari (iOS 16+), Firefox, Edge, Samsung Internet.

## 11. Model Data

Skema acuan (agent menuliskannya sebagai migration di `supabase/migrations/`).

```sql
create type registration_status as enum ('pending', 'verified', 'rejected');
create type education_level as enum ('sd_mi', 'smp_mts', 'sma_smk_ma', 'd1_d3', 's1_s3');

create table public.registrations (
  id                  uuid primary key default gen_random_uuid(),
  reg_number          text not null unique,
  academic_year       text not null,                       -- '2026/2027'
  wave                smallint not null check (wave in (1, 2)),
  status              registration_status not null default 'pending',

  -- Siswa
  student_name        text not null,
  student_nickname    text not null,
  birth_place         text not null,
  birth_date          date not null,
  gender              text not null check (gender in ('L', 'P')),
  siblings_count      smallint not null check (siblings_count between 0 and 20),
  birth_order         smallint not null check (birth_order between 1 and 21),
  student_address     text not null,
  contact_phone       text not null,                       -- '62812...'
  hobby               text not null,
  achievements        text not null default '-',
  medical_conditions  text not null default '-',

  -- Orang tua
  father_name         text not null,
  mother_name         text not null,
  father_education    education_level not null,
  mother_education    education_level not null,
  father_job          text not null,
  mother_job          text not null,
  parent_address      text not null,

  -- Pembayaran
  payment_proof_path  text not null,                       -- path di bucket privat
  payment_proof_mime  text not null,
  payment_proof_size  integer not null,

  -- Administrasi
  admin_note          text,
  rejection_reason    text,
  reviewed_by         uuid references auth.users (id),
  reviewed_at         timestamptz,
  consented_at        timestamptz not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint rejected_requires_reason
    check (status <> 'rejected' or coalesce(length(btrim(rejection_reason)), 0) >= 5)
);

-- Duplikasi: satu pendaftaran aktif per siswa per tahun ajaran
create unique index registrations_active_unique
  on public.registrations (academic_year, lower(btrim(student_name)), birth_date)
  where status <> 'rejected';

create index registrations_status_created_idx on public.registrations (status, created_at desc);
create index registrations_wave_idx on public.registrations (academic_year, wave);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table public.app_settings (             -- satu baris (singleton)
  id                  boolean primary key default true check (id),
  academic_year       text not null default '2026/2027',
  registration_open   boolean not null default true,
  payment_amount      integer,
  payment_bank        text,
  payment_account_no  text,
  payment_account_name text,
  updated_at          timestamptz not null default now()
);
```

**Fungsi & trigger**
- `public.is_admin()` — `security definer`, `stable`: `exists(select 1 from admins where user_id = auth.uid())`.
- Trigger `set_updated_at` pada `registrations` dan `app_settings`.
- Trigger/fungsi pembuat `reg_number` per tahun ajaran, aman concurrent (mis. `pg_advisory_xact_lock` + urut berikutnya).

**RLS**

| Tabel | anon | authenticated non-admin | admin |
|---|---|---|---|
| `registrations` | ❌ | ❌ | `select`, `update` (tanpa `delete` di MVP) |
| `admins` | ❌ | ❌ | `select` baris sendiri |
| `app_settings` | ❌ (dibaca server) | ❌ | `select`, `update` |
| `storage.objects` (`payment-proofs`) | ❌ | ❌ | `select` (untuk signed URL) |

`insert` ke `registrations` dilakukan **hanya oleh server** dengan kunci secret (melewati RLS) setelah semua validasi lolos.

**Storage** — bucket `payment-proofs`: `public = false`, `file_size_limit = 5MB`, `allowed_mime_types = image/jpeg, image/png, image/webp`.

## 12. Arsitektur & Stack

```
Browser (calon wali)
  1. requestUploadUrl (Server Action) ──► Next.js di Vercel ──► Supabase Storage: signed upload URL
  2. unggah file langsung ───────────────────────────────────► bucket privat `payment-proofs`
  3. createRegistration (Server Action) ─► Zod + Turnstile + cek file ─► Postgres (kunci secret)

Admin
  proxy.ts (refresh sesi, redirect) ─► Server Components (sesi admin + RLS) ─► Postgres / signed URL bukti bayar
```

**Stack**

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js terbaru (App Router, TypeScript, Server Actions). Di Next.js 16 file `middleware.ts` bernama **`proxy.ts`** |
| UI | React 19, **Tailwind CSS v4** (konfigurasi CSS-first), `motion` untuk animasi, `lucide-react` untuk ikon |
| Form | React Hook Form + Zod (skema dipakai ulang di klien dan server) |
| Backend | Supabase: Postgres, Auth (email + password), Storage |
| Klien Supabase | `@supabase/supabase-js` + `@supabase/ssr` (bukan `auth-helpers`, sudah deprecated) |
| Anti-spam | Cloudflare Turnstile |
| Hosting | Vercel (region fungsi Singapura `sin1`), Supabase region Singapore (`ap-southeast-1`) |
| Uji | Vitest (unit), Playwright + axe (E2E & a11y) |
| Dokumentasi library | **Context7** (MCP) — wajib dipakai agent, lihat `Roadmap.md` |

**Struktur direktori (acuan)**

```
src/
  app/
    layout.tsx · globals.css · not-found.tsx · error.tsx
    (public)/page.tsx                 # info + form wizard
    (public)/berhasil/[id]/page.tsx
    admin/login/page.tsx
    admin/(protected)/layout.tsx      # requireAdmin()
    admin/(protected)/page.tsx        # statistik + daftar
    admin/(protected)/pendaftar/[id]/page.tsx
    admin/(protected)/export/route.ts
  components/{ui,registration,admin}/
  lib/
    supabase/{client,server,proxy,admin}.ts
    validation/registration.ts
    actions/{registration,upload,admin}.ts
    {config,wave,phone,format,csv}.ts
  proxy.ts
supabase/migrations/*.sql
```

**Variabel lingkungan**

| Nama | Sisi | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | klien+server | URL projek |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | klien+server | kunci publishable (aman terekspos, bergantung RLS) |
| `SUPABASE_SECRET_KEY` | **server saja** | kunci secret; jangan pernah `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | klien / server | Cloudflare Turnstile |
| `NEXT_PUBLIC_SITE_URL` | keduanya | URL kanonik |
| `CRON_SECRET` | server | otorisasi cron pembersihan (P1) |

## 13. Desain UI/UX

### 13.1 Prinsip (mengacu pada [jakub.kr](https://jakub.kr/))

Rujukan utama: artikel *Details that make interfaces feel better* dan koleksi `/skills` (mis. `/better-ui`, `/better-typography`, `/better-colors`, `/better-accessibility`, `/better-layout`, `/better-writing`). Prinsip: antarmuka bagus adalah kumpulan detail kecil yang menumpuk. Gaya: **minimal, tenang, banyak ruang kosong, tipografi kuat, kedalaman lewat bayangan halus bukan garis tebal.**

| # | Detail | Penerapan di proyek ini |
|---|---|---|
| 1 | **Text wrapping** | `text-balance` pada judul/heading, `text-pretty` pada paragraf & deskripsi. |
| 2 | **Radius konsentris** | Radius luar = radius dalam + padding. Kontrol (input/tombol) `10px`; kartu dengan padding `12px` → radius `22px`. Hitung lewat variabel CSS, bukan angka acak. |
| 3 | **Animasi ikon kontekstual** | Ikon yang berganti (salin→centang, upload→sukses, buka→tutup) beranimasi `opacity` + `scale` + `blur` (± 300 ms, spring tanpa bounce). |
| 4 | **Teks tajam** | `antialiased` pada `<body>`. |
| 5 | **Angka tabular** | `tabular-nums` untuk nomor registrasi, statistik, tanggal, ukuran file, paginasi. |
| 6 | **Animasi dapat diinterupsi** | Interaksi (hover, buka/tutup, toggle, ganti langkah) memakai **CSS transition**; keyframe hanya untuk urutan sekali jalan (enter halaman). |
| 7 | **Split & stagger saat masuk** | Elemen masuk per bagian (judul → deskripsi → kartu → tombol), bukan satu blok. `translateY(8px)` + `blur(8px)` + `opacity`, durasi ± 800 ms, easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, jeda 80–100 ms antar bagian. |
| 8 | **Exit halus** | Animasi keluar lebih ringan dari masuk (mis. `opacity` + `blur` kecil + geser pendek). |
| 9 | **Alignment optis** | Tombol dengan ikon: padding sisi ikon sedikit lebih kecil; ikon bentuk asimetris dikoreksi di SVG. |
| 10 | **Bayangan, bukan border** | Tepi kartu/input memakai `box-shadow` berlapis tiga (lihat token); mode gelap memakai ring 1px putih transparan. |
| 11 | **Outline gambar** | Semua gambar (preview bukti bayar) memakai outline 1px hitam/putih 10% dengan `outline-offset: -1px`. |
| + | **Hit area & kontras** | Target sentuh ≥ 44 px, kontras ≥ 4,5:1, fokus jelas. |

### 13.2 Token (acuan `globals.css`, Tailwind v4)

Verifikasi sintaks `@theme` terbaru lewat Context7 sebelum dipakai.

```css
@import "tailwindcss";

:root {
  /* Warna dalam OKLCH. Tema terang/gelap mengikuti sistem (prefers-color-scheme). */
  --background: oklch(0.991 0 0);
  --foreground: oklch(0.173 0 0);
  --surface:    oklch(1 0 0);
  --muted:      oklch(0.52 0 0);
  --accent:     oklch(0.52 0.13 160);   /* hijau tenang; ganti sesuai identitas sekolah */
  --danger:     oklch(0.55 0.2 27);

  --radius-control: 10px;
  --card-padding: 12px;
  --radius-card: calc(var(--radius-control) + var(--card-padding)); /* konsentris = 22px */

  --shadow-border:
    0 0 0 1px rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06), 0 2px 4px 0 rgb(0 0 0 / 0.04);
  --shadow-border-hover:
    0 0 0 1px rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08), 0 2px 4px 0 rgb(0 0 0 / 0.06);
  --image-outline: rgb(0 0 0 / 0.1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.173 0 0);     /* ≈ #101010 */
    --foreground: oklch(0.96 0 0);
    --surface:    oklch(0.21 0 0);
    --muted:      oklch(0.7 0 0);
    --shadow-border:       0 0 0 1px rgb(255 255 255 / 0.08);
    --shadow-border-hover: 0 0 0 1px rgb(255 255 255 / 0.12);
    --image-outline: rgb(255 255 255 / 0.1);
  }
}

/* Animasi masuk bertahap (diadaptasi dari pola di artikel jakub.kr) */
@keyframes enter {
  from { transform: translateY(8px); filter: blur(8px); opacity: 0; }
}
.animate-enter {
  animation: enter 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: calc(var(--stagger, 0) * 100ms);
}
@media (prefers-reduced-motion: reduce) {
  .animate-enter { animation: none; }
}
```

- Font: **Geist Sans** (via `next/font`) sebagai default usulan; ganti bila sekolah punya identitas huruf. Catatan: sebagian font (mis. Inter) mengubah rupa angka saat `tabular-nums`.
- Skala tipografi mobile: body 16 px / 1.6, label 14 px medium, judul halaman 28–32 px `text-balance`, `tracking` sedikit rapat pada judul.
- Spasi berbasis kelipatan 4 px. Lebar konten form `max-w-xl` (≈ 576 px), terpusat; admin `max-w-6xl`.

### 13.3 Komponen kunci

`Button` (primary/secondary/ghost/danger, state loading) · `Field` (label, hint, error) · `TextInput` · `Textarea` · `Select` · `RadioChips` (jenis kelamin, jumlah saudara) · `Checkbox` · `Stepper` · `StickyActions` · `UploadProof` (§8.3) · `StatusBadge` · `Card` (radius konsentris, shadow-border) · `Toast` · `ConfirmDialog` · `EmptyState` · `Skeleton` · `Pagination`.

Setiap komponen punya state: default, hover, focus-visible, active, disabled, loading, error. Untuk komponen bernuansa banyak state (`UploadProof`, `StatusBadge`, kartu pendaftar) gunakan skill `/state-machine` dan `/break` untuk menguji semua kondisi (nama sangat panjang, teks kosong, error).

### 13.4 Pola mobile-first

- Basis 360 px; kolom tunggal; kartu penuh lebar dengan margin 16 px.
- Tombol aksi utama sticky di bawah (`padding-bottom: env(safe-area-inset-bottom)`).
- `select` memakai kontrol native (picker terbaik di ponsel).
- Admin: daftar berupa kartu di mobile, tabel mulai `md`; filter dalam panel yang dapat dibuka.
- `viewport-fit=cover`, `theme-color` mengikuti tema.

### 13.5 Microcopy (Bahasa Indonesia)

Gaya: hangat, jelas, sopan, tidak bertele-tele. Tombol berupa kata kerja ("Lanjut", "Kirim Pendaftaran", "Ganti Foto"). Pesan error menyebut **apa yang salah dan cara memperbaikinya**. Contoh:
- Wajib diisi → "Nama lengkap siswa belum diisi."
- File terlalu besar → "Ukuran foto 7,2 MB. Maksimal 5 MB. Coba ambil screenshot bukti transfer."
- Gagal kirim → "Pendaftaran belum terkirim. Isian Anda aman, coba lagi sebentar lagi."
- Empty state admin → "Belum ada pendaftar" + penjelasan singkat.

## 14. Kriteria Penerimaan (ringkas)

| ID | Skenario | Hasil yang diharapkan |
|---|---|---|
| AC-1 | Orang tua mengisi semua field valid + bukti bayar JPG 2 MB lalu kirim | Data tersimpan, nomor registrasi tampil, status `pending`. |
| AC-2 | Field wajib kosong saat "Lanjut" | Tidak berpindah langkah, error tampil, fokus ke field pertama yang error. |
| AC-3 | Pilih "Lainnya" pada Jumlah Saudara | Input angka muncul; nilai 0–20 diterima, di luar itu ditolak. |
| AC-4 | Pilih file PDF atau > 5 MB | Ditolak di klien dengan pesan jelas; server juga menolak jika dibypass. |
| AC-5 | Pilih gambar valid | Thumbnail tampil; klik membuka gambar penuh di tab baru. |
| AC-6 | Submit dua kali (klik ganda / dua tab) data yang sama | Hanya satu pendaftaran aktif; yang kedua mendapat pesan duplikasi. |
| AC-7 | Tutup tab di tengah pengisian lalu buka lagi | Isian terpulihkan (kecuali file). |
| AC-8 | Akses `/admin` tanpa login | Redirect ke `/admin/login`. |
| AC-9 | Pengguna Supabase non-admin / anon memanggil REST/Storage langsung | Ditolak (tidak ada data, tidak ada daftar file). |
| AC-10 | Admin menolak tanpa alasan | Ditolak validasi; dengan alasan ≥ 5 karakter → status `rejected`. |
| AC-11 | Admin klik bukti bayar | Terbuka di tab baru lewat signed URL berumur pendek. |
| AC-12 | Ekspor CSV | File terbuka benar di Excel (UTF-8 BOM); sel berawalan `= + - @` dinetralkan (kecuali nilai persis `-`). |
| AC-13 | Pendaftaran ditutup | Form tidak tampil; pesan penutupan + kontak tampil; server menolak submit. |
| AC-14 | Layar 360 px | Tidak ada scroll horizontal; semua target sentuh ≥ 44 px. |
| AC-15 | `prefers-reduced-motion` aktif | Animasi masuk dimatikan. |

## 15. Rencana Uji

- **Unit (Vitest):** skema Zod, normalisasi telepon, penentuan gelombang (batas bulan, zona waktu), sanitasi CSV, format nomor registrasi.
- **E2E (Playwright):** alur publik happy path & error pada viewport ponsel; login admin → verifikasi/tolak; ekspor CSV.
- **A11y:** `@axe-core/playwright` pada semua halaman utama; uji keyboard manual.
- **Keamanan:** uji akses langsung ke REST/Storage dengan kunci publishable (harus gagal), cek bundel klien bebas kunci secret, uji unggah tanpa token.
- **Performa:** Lighthouse mobile; uji throttling "Slow 4G".

## 16. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Spam / bot membanjiri form dan storage | Turnstile, honeypot, rate limit, batas MIME/ukuran bucket, cron pembersihan file yatim |
| Kebocoran data anak | RLS deny-by-default, storage privat, signed URL singkat, kunci secret hanya di server, review keamanan sebelum go-live |
| Upload besar gagal di jaringan lemah | Unggah langsung ke storage, progress + retry, pesan jelas; kompresi klien di Backlog |
| Batas body Vercel Function ±4,5 MB | Signed upload URL (file tidak melewati fungsi) |
| Lonjakan pendaftar saat awal gelombang | Beban ringan di Vercel/Supabase; uji beban kecil sebelum rilis |
| Supabase gratis dapat di-pause saat tidak aktif; ketentuan penggunaan komersial paket gratis Vercel | Pertimbangkan paket berbayar menjelang masa pendaftaran; periksa ketentuan layanan |
| Admin kehilangan akses | Dua akun admin cadangan (tetap satu role), prosedur reset di runbook |
| Data hilang | Ekspor CSV berkala; aktifkan backup Supabase sesuai paket |

## 17. Asumsi & Pertanyaan Terbuka

**Asumsi yang dipakai di dokumen ini (mohon dikonfirmasi):**

1. **Tahun ajaran:** judul formulir sumber menyebut `2024/2025`, sedangkan isi pengumuman menyebut `TP 2026/2027`. Dokumen ini memakai **2026/2027** dan menjadikannya **pengaturan yang dapat diubah**. Perlu dicek juga: gelombang 1 (Sep–Feb) yang berjalan pada Oktober 2026 biasanya untuk tahun ajaran berikutnya (2027/2028). Panitia menentukan nilai yang benar.
2. **Bulan Juli–Agustus** dianggap **tutup** (di luar kedua gelombang).
3. **Info pembayaran** (nominal formulir, bank, no. rekening, atas nama) **belum ada di sumber**; dibuat sebagai pengaturan dan perlu diisi sekolah.
4. **Jumlah Saudara Kandung** tidak termasuk calon siswa; opsi "Lainnya" mengizinkan 0 (anak tunggal) hingga 20. `Anak Ke` ≤ jumlah saudara + 1.
5. **Bukti bayar** hanya berupa gambar (JPG/PNG/WebP), maks 5 MB, satu file.
6. **Persetujuan data pribadi** ditambahkan (tidak ada di formulir asli) demi kepatuhan UU PDP.
7. **Warna aksen** hijau hanyalah usulan; logo dan identitas SDIT Fajar belum tersedia.

**Pertanyaan terbuka untuk sekolah:**
- Batas usia minimum/maksimum calon siswa (saat ini hanya validasi kewajaran 4–12 tahun)?
- Bagaimana bila salah satu orang tua telah wafat/tidak ada, atau data diisi wali? (saat ini kedua orang tua wajib diisi)
- Berapa lama data pendaftar yang ditolak/tidak lanjut disimpan sebelum dihapus/dianonimkan?
- Perlu notifikasi email/WhatsApp otomatis ke orang tua setelah verifikasi?
- Domain yang akan dipakai (mis. `ppdb.sditfajar.sch.id`)?
- Apakah panitia butuh cetak "bukti pendaftaran" (PDF) di MVP?

---

## Lampiran A — Konten Resmi Sekolah (sumber teks halaman publik)

> **FORMULIR PENDAFTARAN SISWA BARU SEKOLAH DASAR ISLAM TERPADU FAJAR — TAHUN PENGAJARAN: {tahun_ajaran}**
>
> Assalamualaikum wr.wb
> Sehubungan telah dibukanya Penerimaan Peserta Didik Baru (PPDB) TP {tahun_ajaran}. Bagi pendaftar, silakan mengisi link pendaftaran di bawah ini. Pastikan data yang Bapak/Ibu isi sesuai dengan pendaftar yaitu (Nama Siswa, Nama Ortu) dan yang lainnya.
>
> **CATATAN**
> - PENDAFTARAN GELOMBANG 1 : September – Februari
> - PENDAFTARAN GELOMBANG 2 : Maret – Juni
>
> **INFO SELANJUTNYA SILAHKAN HUBUNGI KONTAK DI BAWAH INI**
> - WhatsApp : 0877-3786-0657 (Ustadz M Fadil Riswandi) & 0822-4962-7864 (Ustadzah Viny Virzana)
>
> **Kunjungi Media Sosial Kami**
> - Instagram : @sdit_fajar
> - YouTube : SDIT Fajar Depok
> - Gmail : sditfajar@gmail.com
>
> DAFTARKAN SEGERA, DAN JADILAH BAGIAN DARI KELUARGA KAMI
> Terima kasih, Wassalamualaikum Wr.Wb

## Lampiran B — Pemetaan Field Formulir Asli → Kolom Database

| Field formulir asli | Kolom |
|---|---|
| Nama Lengkap Siswa | `student_name` |
| Nama Panggilan Siswa | `student_nickname` |
| Tempat, Tanggal Lahir | `birth_place`, `birth_date` |
| Jenis Kelamin | `gender` |
| Jumlah Saudara Kandung (1–5 / Lainnya) | `siblings_count` |
| Anak Ke | `birth_order` |
| Alamat Lengkap | `student_address` |
| No Telepon/HP yang bisa dihubungi | `contact_phone` |
| Hobi Siswa | `hobby` |
| Prestasi Siswa Yang Pernah Diraih | `achievements` |
| Penyakit Berat Yang Diderita | `medical_conditions` |
| Nama Lengkap Orangtua (Ayah / Ibu) | `father_name`, `mother_name` |
| Pendidikan Tertinggi (Ayah / Ibu) | `father_education`, `mother_education` |
| Pekerjaan Ayah / Ibu | `father_job`, `mother_job` |
| Alamat Lengkap Orang Tua | `parent_address` |
| Upload Bukti Pembayaran Formulir | `payment_proof_path`, `payment_proof_mime`, `payment_proof_size` |
