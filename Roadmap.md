# Roadmap — SPMB SDIT Fajar

Rencana kerja bertahap untuk membangun aplikasi di `PRD.md`. Setiap fase memuat **tujuan, tugas, prompt untuk agent (AI coding agent), dan kriteria selesai**. Semua prompt **wajib memakai Context7** agar kode mengikuti dokumentasi terbaru, bukan ingatan model.

## Cara Memakai

1. Selesaikan **Prasyarat** (manual, dikerjakan manusia).
2. Simpan **Prompt 0** sebagai `AGENTS.md` (atau `CLAUDE.md`) di root repo, dan tempel juga di awal sesi pertama.
3. **Satu fase = satu sesi agent = satu branch/PR.** Tempel prompt fase tersebut. Jangan melompati fase.
4. Setelah agent melapor, lakukan **Verifikasi manual** fase itu, merge, lalu lanjut.
5. Bila keputusan berubah, perbarui `PRD.md` terlebih dahulu, baru minta agent mengikuti.

## Ringkasan Fase

| Fase | Judul | Output utama | Estimasi* |
|---|---|---|---|
| 0 | Bootstrap & fondasi | Repo Next.js + Tailwind v4 + klien Supabase + `proxy.ts` + env | 0,5 hari |
| 1 | Database & keamanan | Migration, RLS, bucket privat, tipe TypeScript | 1 hari |
| 2 | Design system | Token gaya jakub.kr, komponen UI, motion, halaman `/dev/ui` | 1 hari |
| 3 | Halaman publik & wizard | Info sekolah, form 3 langkah, validasi, draft, `UploadProof` (UI) | 1,5 hari |
| 4 | Submit & upload (backend) | Signed upload URL, Server Actions, Turnstile, halaman sukses | 1,5 hari |
| 5 | Admin inti | Login, daftar + filter, detail, verifikasi/tolak | 1,5 hari |
| 6 | Ekspor, pengaturan, cron | CSV aman, pengaturan, WhatsApp, pembersihan file yatim | 1 hari |
| 7 | QA & polish | Skill `/better-*`, E2E, a11y, keamanan, performa | 1,5 hari |
| 8 | Deploy & go-live | Vercel, CSP final, runbook, smoke test | 0,5 hari |

\* Estimasi kerja efektif dengan bantuan agent, belum termasuk menunggu data/keputusan dari sekolah.

---

## Prasyarat (manual)

### A. Pasang Context7 (MCP) di agent Anda

Context7 menyediakan dua tool: `resolve-library-id` (nama library → ID, mis. `/vercel/next.js`) dan `query-docs` (ambil dokumentasi versi terbaru berdasarkan ID + pertanyaan).

Konfigurasi umum (server remote; API key opsional tetapi disarankan untuk batas lebih tinggi, dari context7.com/dashboard):

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": { "CONTEXT7_API_KEY": "ISI_API_KEY_ANDA" }
    }
  }
}
```

Alternatif lokal: jalankan `npx -y @upstash/context7-mcp` sebagai server MCP stdio. Cara pemasangan per aplikasi (Claude Code, Cursor, dll.) terus diperbarui; ikuti README resmi Context7.

**Tes:** minta agent *"use context7 — tampilkan cara membuat proxy.ts di Next.js 16"*. Jika agent memanggil `resolve-library-id` lalu `query-docs`, Context7 berfungsi.

Tips: tambahkan aturan di `AGENTS.md` agar Context7 dipakai otomatis (sudah ada di Prompt 0).

### B. Supabase
- [ ] Buat projek baru, region **Singapore (ap-southeast-1)**.
- [ ] Authentication → pengaturan Email: **matikan sign-up pengguna baru** (hanya admin yang dibuat manual).
- [ ] Authentication → Users → buat **user admin** (email + kata sandi kuat, tandai sudah terkonfirmasi). Catat `User UID`.
- [ ] Catat `Project URL`, **publishable key**, dan **secret key** (jangan dibagikan di chat/commit).
- [ ] Pasang Supabase CLI (`supabase login`, `supabase link`). Docker diperlukan bila memakai `supabase start` lokal.

### C. Vercel & GitHub
- [ ] Repo GitHub kosong; akun Vercel terhubung ke GitHub.

### D. Cloudflare Turnstile
- [ ] Buat widget (mode Managed), catat Site Key & Secret Key. Untuk dev/test gunakan *dummy keys* resmi Cloudflare Turnstile.

### E. Skill gaya jakub.kr (untuk Fase 2 & 7)
```bash
npx skills add jakubkrehel/skills
npx skills add jakubkrehel/make-interfaces-feel-better
```
Setelah terpasang, agent dapat menjalankan `/better-ui`, `/better-typography`, `/better-colors`, `/better-accessibility`, `/better-layout`, `/better-writing`, `/interface-review`, `/state-machine`, `/break`.

### F. Bahan dari sekolah
- [ ] Tahun ajaran yang benar (lihat PRD §17 butir 1).
- [ ] Info pembayaran formulir: nominal, bank, no. rekening, atas nama.
- [ ] Logo/identitas visual (opsional), domain, jawaban pertanyaan terbuka PRD §17.

---

## Prompt 0 — Konteks Global

> Simpan sebagai `AGENTS.md` / `CLAUDE.md` dan tempel di awal setiap sesi.

````text
PERAN
Kamu adalah senior full-stack engineer sekaligus design engineer. Kamu membangun "SPMB SDIT Fajar": form registrasi online penerimaan peserta didik baru dengan SATU role admin untuk verifikasi.

SUMBER KEBENARAN
- PRD.md = apa yang dibangun (fitur, field, validasi, data, keamanan, desain).
- Roadmap.md = urutan kerja per fase.
- Jika konflik, PRD.md menang. Untuk hal kecil yang ambigu: ambil asumsi paling aman, catat di laporan bagian "Asumsi", lanjutkan. Berhenti dan bertanya hanya jika menyangkut keamanan/data atau mengubah lingkup.

STACK
Next.js (App Router, TypeScript), Supabase (Postgres, Auth, Storage), Vercel, Tailwind CSS v4, React Hook Form + Zod, motion, lucide-react. Package manager: pnpm.

ATURAN CONTEXT7 (WAJIB)
1. Sebelum menulis kode yang memanggil API library/framework apa pun (Next.js, React, Supabase JS dan @supabase/ssr, Tailwind, Zod, React Hook Form, Motion, Cloudflare Turnstile, Vitest, Playwright, dst.), gunakan Context7: panggil `resolve-library-id`, lalu `query-docs` dengan pertanyaan spesifik (atau tulis "use context7" pada kueri). Bila ID sudah pasti, langsung pakai: /vercel/next.js dan /supabase/supabase. Untuk library lain, resolve dulu.
2. Jangan mengandalkan ingatan untuk API yang cepat berubah. Verifikasi lewat Context7, khususnya: proxy.ts vs middleware.ts (Next.js 16); cookies()/headers()/params/searchParams yang async; Server Actions dan useActionState; pola @supabase/ssr (createBrowserClient, createServerClient, updateSession); nama kunci Supabase (publishable/secret, bukan anon/service_role lama); Storage createSignedUploadUrl / uploadToSignedUrl / createSignedUrl; sintaks Tailwind v4 (@import "tailwindcss", @theme); API Motion.
3. Pin versi paket yang terpasang dan sebutkan di laporan.
4. Jika Context7 tidak tersedia atau tidak menemukan library: katakan terus terang, gunakan dokumentasi resmi (web fetch). Jangan menebak.
5. Di akhir setiap fase, laporkan daftar "Context7 lookups" (library, topik, keputusan yang dipengaruhi).

ATURAN DESAIN (ringkasan PRD §13)
- Mobile-first (basis 360px), Tailwind v4. Gaya jakub.kr: minimal, lega, tipografi kuat.
- text-balance pada judul, text-pretty pada paragraf; `antialiased`; `tabular-nums` untuk angka.
- Radius konsentris (radius luar = radius dalam + padding). Bayangan berlapis alih-alih border. Outline 1px 10% pada gambar.
- Interaksi = CSS transition (dapat diinterupsi). Keyframe hanya untuk animasi masuk bertahap (translateY 8px + blur 8px + opacity, ~800ms, stagger 80-100ms). Exit lebih halus daripada enter. Animasi ikon kontekstual (opacity + scale + blur) memakai motion.
- Hormati prefers-reduced-motion. Target sentuh >= 44px. Input font-size >= 16px. Kontras WCAG AA.
- Semua teks UI Bahasa Indonesia, hangat dan jelas.

ATURAN KEAMANAN (tidak boleh dilanggar)
- RLS aktif di semua tabel dan TANPA policy untuk anon. Penulisan data publik hanya lewat Server Action dengan kunci secret.
- SUPABASE_SECRET_KEY hanya di server (`import "server-only"`), tidak pernah di bundel klien dan tidak pernah berawalan NEXT_PUBLIC_.
- Bucket bukti bayar privat. Akses admin hanya lewat signed URL berumur pendek.
- Proteksi admin berlapis: proxy.ts DAN requireAdmin() di setiap Server Component/Action/Route Handler admin.
- Validasi ulang di server dengan skema Zod yang sama. Jangan percaya data klien.
- Tidak ada PII di log. Tidak ada secret di repo (.env.local di .gitignore; sediakan .env.example).
- Jangan menjalankan migration atau perintah destruktif ke database produksi tanpa konfirmasi manusia.

ATURAN KODE
- TypeScript strict, tanpa `any`. Server Component secara default; "use client" hanya untuk yang interaktif.
- Struktur folder sesuai PRD §12. File kebab-case, komponen PascalCase.
- Commit kecil, Conventional Commits. Satu fase = satu branch/PR.
- Jangan menambah dependensi besar tanpa alasan; sebutkan alasannya di laporan.
- Jangan mengerjakan fase berikutnya.

DEFINISI SELESAI (tiap fase)
- `pnpm lint`, `pnpm typecheck`, `pnpm build` lulus.
- Diuji manual di viewport 360px dan >= 1024px.
- Seluruh butir "Selesai bila" pada fase terpenuhi.
- Laporan akhir berisi: ringkasan perubahan, file penting, Context7 lookups, asumsi, hal belum selesai, dan langkah verifikasi manual untuk manusia.
````

---

## Fase 0 — Bootstrap & Fondasi

**Tujuan:** repo siap dikembangkan: tooling, klien Supabase, `proxy.ts`, validasi env.

**Tugas**
- [ ] Next.js + TypeScript + App Router + `src/` + Tailwind v4 + ESLint
- [ ] Dependensi inti terpasang, script `dev/build/lint/typecheck/test`
- [ ] `lib/supabase/{client,server,proxy,admin}.ts` dan `src/proxy.ts`
- [ ] `lib/config.ts` (konstanta sekolah + env tervalidasi)
- [ ] Layout dasar (`lang="id"`, font, `antialiased`, viewport)
- [ ] Header keamanan dasar, `.env.example`, README

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 0 — Bootstrap & fondasi
Baca: PRD.md §10, §12, §13.2.

Context7 (wajib), minimal:
- /vercel/next.js: create-next-app dan opsinya, App Router dengan src/, next/font, file proxy.ts (Next.js 16) dan fungsi `proxy`, headers() di next.config, `server-only`.
- Tailwind CSS v4: instalasi untuk Next.js (konfigurasi CSS-first).
- /supabase/supabase: panduan "Creating a Supabase client for SSR" untuk Next.js (createBrowserClient, createServerClient, updateSession di proxy), nama env kunci publishable.
- Vitest: setup dasar untuk proyek Next.js + TypeScript.

Tugas:
1. Buat projek Next.js (TypeScript, App Router, src/, alias "@/*", ESLint, Tailwind v4) memakai pnpm.
2. Pasang: @supabase/supabase-js, @supabase/ssr, zod, react-hook-form, @hookform/resolvers, motion, lucide-react, clsx, tailwind-merge, server-only. Dev: vitest (+ pendukung sesuai Context7).
3. Script package.json: dev, build, start, lint, typecheck (tsc --noEmit), test.
4. Buat lib/supabase/client.ts (browser), server.ts (server, cookies async), proxy.ts (updateSession: refresh sesi dan set cookie sesuai docs terbaru), admin.ts (klien kunci secret, `import "server-only"`, tanpa persist session/auto refresh).
5. Buat src/proxy.ts yang memanggil updateSession; matcher mengecualikan _next/static, _next/image, favicon, dan berkas statis. JANGAN menaruh logika otorisasi admin di sini dulu (Fase 5).
6. lib/config.ts: konstanta sekolah (nama, kontak WhatsApp, Instagram, YouTube, email; lihat PRD Lampiran A) dan fungsi env tervalidasi dengan Zod (gagal cepat bila env wajib hilang; pisahkan env server dan env publik).
7. .env.example sesuai tabel env PRD §12; pastikan .env* masuk .gitignore.
8. app/layout.tsx: lang="id", font Geist via next/font, kelas `antialiased`, metadata dasar, viewport (viewport-fit=cover, themeColor terang/gelap). Halaman placeholder `/` bertuliskan nama sekolah.
9. next.config: header keamanan dasar (X-Content-Type-Options, Referrer-Policy, frame-ancestors/X-Frame-Options). CSP penuh ditunda ke Fase 8, tinggalkan TODO.
10. README singkat: prasyarat, cara menjalankan, daftar env.
11. (Opsional) GitHub Actions: lint + typecheck + build.

Batasan: belum ada UI form, belum ada migration, belum ada logika admin.

Selesai bila:
- pnpm dev menampilkan halaman placeholder; lint/typecheck/build lulus.
- Menjalankan app tanpa env wajib gagal dengan pesan jelas.
- Tidak ada kunci secret yang dapat dijangkau modul klien (admin.ts hanya bisa di-import server).
````

**Verifikasi manual:** `pnpm dev` jalan; buka `/` di 360 px; cek `.env.local` tidak ter-commit.

---

## Fase 1 — Database & Keamanan

**Tujuan:** skema, RLS, dan storage sesuai PRD §11, terbukti aman lewat tes.

**Tugas**
- [ ] Migration: tipe, tabel `registrations`/`admins`/`app_settings`, constraint, indeks (termasuk indeks unik parsial duplikasi)
- [ ] Fungsi `is_admin()`, trigger `updated_at`, pembuat `reg_number` aman concurrent
- [ ] RLS (deny by default) + policy admin
- [ ] Bucket `payment-proofs` privat (batas ukuran/MIME) + policy select admin
- [ ] Seed `app_settings`; instruksi mendaftarkan user admin
- [ ] Generate tipe TypeScript
- [ ] Skrip uji RLS

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 1 — Database & keamanan
Baca: PRD.md §9, §10 (Keamanan), §11 (seluruhnya).

Context7 (wajib), minimal:
- /supabase/supabase: migrations dengan Supabase CLI, Row Level Security (policy, `to authenticated`, perf tip `(select auth.uid())`), fungsi `security definer` yang aman (set search_path), membuat bucket dan policy storage lewat SQL, `supabase gen types typescript`.
- Postgres: indeks unik parsial pada ekspresi, advisory lock untuk penomoran.

Tugas:
1. `supabase init` (jika belum). Buat migration berurutan di supabase/migrations/:
   - 0001_schema.sql: enum, tabel registrations, admins, app_settings, constraint, indeks sesuai PRD §11 (termasuk constraint rejected_requires_reason dan indeks unik parsial untuk duplikasi aktif).
   - 0002_functions.sql: is_admin() (security definer, stable, search_path aman), set_updated_at(), dan generator reg_number format "SPMB-{tahun_awal}-{urut 4 digit}" yang berulang per academic_year dan AMAN terhadap insert bersamaan (mis. pg_advisory_xact_lock). Pasang sebagai trigger BEFORE INSERT bila reg_number kosong.
   - 0003_rls.sql: ENABLE (dan FORCE bila sesuai) RLS pada semua tabel. Tanpa policy untuk anon. Policy untuk admin saja sesuai tabel RLS PRD §11 (registrations: select+update; admins: select baris sendiri; app_settings: select+update). Tanpa delete di MVP.
   - 0004_storage.sql: bucket "payment-proofs" (public=false, file_size_limit 5MB, allowed_mime_types image/jpeg, image/png, image/webp) dan policy select pada storage.objects untuk admin saja.
2. Seed: satu baris app_settings dengan academic_year "2026/2027", registration_open true (nilai payment_* dibiarkan kosong). Dokumentasikan perintah SQL untuk mendaftarkan user admin (insert ke public.admins memakai UID) di README/docs, JANGAN meng-hardcode UID.
3. Generate tipe: simpan ke src/lib/supabase/database.types.ts dan pasang sebagai generic pada semua klien Supabase.
4. Buat supabase/tests/rls.sql (atau pgTAP) dan docs singkat yang memverifikasi: anon tidak bisa select/insert/update registrations; authenticated non-admin ditolak; admin bisa select/update; anon tidak bisa list/baca objek bucket.
5. Uji: dua insert paralel pada tahun ajaran yang sama menghasilkan reg_number berbeda; insert duplikat aktif (nama+tgl lahir+tahun) ditolak; status rejected tanpa alasan ditolak; setelah rejected, pendaftaran ulang boleh.

Batasan: jalankan hanya pada database lokal (supabase start) atau projek dev. Untuk remote/produksi, siapkan perintah dan minta manusia mengeksekusi.

Selesai bila:
- Semua migration ter-apply tanpa error pada DB lokal; tipe TS ter-generate dan dipakai.
- Seluruh pengujian pada langkah 4-5 lulus dan dilampirkan hasilnya di laporan.
- Tidak ada policy yang memberi akses ke role anon.
````

**Verifikasi manual:** jalankan migration di projek dev; coba `select` dari REST API memakai publishable key → harus kosong/ditolak; masukkan UID admin ke tabel `admins`.

---

## Fase 2 — Design System (gaya jakub.kr)

**Tujuan:** token dan komponen UI yang konsisten, siap dipakai halaman publik & admin.

**Tugas**
- [ ] Token warna OKLCH, radius konsentris, bayangan berlapis, outline gambar (PRD §13.2)
- [ ] Utilitas animasi masuk bertahap + `prefers-reduced-motion`
- [ ] Komponen PRD §13.3 dengan semua state
- [ ] `IconSwap` (animasi ikon kontekstual)
- [ ] Halaman showcase `/dev/ui` (hanya non-produksi)

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 2 — Design system
Baca: PRD.md §13 (seluruhnya) dan §10 (Aksesibilitas, Responsif).
Referensi gaya: https://jakub.kr/writing/details-that-make-interfaces-feel-better dan https://jakub.kr/skills (buka via web fetch bila perlu). Jika skill /better-ui, /better-typography, /better-accessibility, /state-machine terpasang, gunakan.

Context7 (wajib), minimal:
- Tailwind CSS v4: @theme / @theme inline, variabel CSS, dark mode via prefers-color-scheme, @utility, @custom-variant, utilitas text-balance/text-pretty/tabular-nums/antialiased.
- Motion (library "motion"): AnimatePresence (mode "popLayout"), transisi spring bounce 0, `initial={false}`.
- React 19: ref sebagai prop, atribut form dan aksesibilitas.

Tugas:
1. src/app/globals.css: implementasikan token PRD §13.2 (warna OKLCH terang/gelap, --radius-control, --card-padding, --radius-card = control + padding, --shadow-border dan hover dan versi gelap, --image-outline), petakan ke tema Tailwind v4. Tambah keyframe `enter` + kelas .animate-enter dengan --stagger, dan matikan saat prefers-reduced-motion.
2. Helper cn() (clsx + tailwind-merge).
3. Komponen di src/components/ui/ (server-safe bila memungkinkan): Button (primary/secondary/ghost/danger, loading, ikon dengan alignment optis: padding sisi ikon lebih kecil), Field (label, hint, error terhubung via aria-describedby/aria-invalid), TextInput, Textarea, Select (native), RadioChips, Checkbox, Card (radius konsentris + shadow-border dengan transition box-shadow), StatusBadge (pending/verified/rejected), EmptyState, Skeleton, Toast (implementasi minimal atau library kecil, jelaskan pilihan), ConfirmDialog (gunakan elemen <dialog> native dengan showModal bila memadai), Pagination, Stepper (indikator langkah).
4. IconSwap (client): pertukaran ikon dengan opacity + scale (0.25 -> 1) + blur (4px -> 0), spring ~300ms bounce 0.
5. Semua kontrol: tinggi >= 44px (input 48px di mobile), font-size >= 16px, state hover/focus-visible/active/disabled/loading/error. Interaksi memakai CSS transition, bukan keyframe.
6. Halaman /dev/ui yang menampilkan semua komponen dan state (terang dan gelap), HANYA aktif di non-produksi (notFound() di produksi).
7. Terapkan prinsip: text-balance di heading, text-pretty di paragraf, tabular-nums di angka, antialiased di body, gambar dengan outline 1px.

Batasan: jangan membangun form/admin di fase ini. Jangan memasang library komponen besar (mis. suite UI penuh) tanpa alasan kuat.

Selesai bila:
- /dev/ui menampilkan semua komponen dan state di 360px dan desktop, terang dan gelap, tanpa scroll horizontal.
- Radius konsentris terlihat benar pada Card berisi kontrol; bayangan menggantikan border.
- Navigasi keyboard + fokus terlihat berfungsi; reduced-motion mematikan animasi masuk.
- axe (manual/ekstensi) tidak menemukan pelanggaran serius pada /dev/ui.
````

**Verifikasi manual:** buka `/dev/ui` di ponsel sungguhan dan desktop; ganti tema sistem terang/gelap; tab-keyboard melewati semua kontrol.

---

## Fase 3 — Halaman Publik & Wizard Form

**Tujuan:** halaman info + form 3 langkah lengkap di sisi klien (validasi, draft, preview bukti bayar). Submit belum terhubung ke backend.

**Tugas**
- [ ] Skema Zod per langkah (dipakai ulang di server pada Fase 4)
- [ ] Util `phone.ts` dan `wave.ts` + unit test
- [ ] Halaman info (gelombang, kontak, info pembayaran) dengan animasi bertahap
- [ ] Wizard 3 langkah, sticky actions, ringkasan, persetujuan
- [ ] `UploadProof`: preview thumbnail, klik buka tab baru
- [ ] Draft `localStorage`

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 3 — Halaman publik & wizard form
Baca: PRD.md §8.1, §8.2, §8.3, §9 (aturan 1, 4, 5), §13.4, §13.5, §14 (AC-2, AC-3, AC-4, AC-5, AC-7, AC-14, AC-15), Lampiran A dan B.

Context7 (wajib), minimal:
- React Hook Form: useForm, FormProvider, zodResolver, trigger() per langkah, shouldFocusError, setFocus.
- Zod (versi terpasang): z.object, z.enum, z.coerce, transform, superRefine, pesan error kustom.
- Next.js: batas Server vs Client Component, next/font, metadata.
- Motion bila dipakai untuk transisi langkah (prioritaskan CSS transition).

Tugas:
1. src/lib/validation/registration.ts: studentSchema, parentSchema, paymentSchema (consent + file meta), dan registrationSchema gabungan. Pesan error Bahasa Indonesia sesuai PRD §13.5. Aturan field persis PRD §8.2 (termasuk: siblings_count dari pilihan 1-5 atau "Lainnya" 0-20; birth_order <= siblings_count + 1; tanggal lahir tidak di masa depan dan usia 4-12 tahun; achievements/medical_conditions wajib dengan "-" bila kosong; opsi pendidikan enum). Ekspor tipe hasil infer.
2. src/lib/phone.ts: normalizeIdPhone (08.., +62.., 62.. -> "62.."), formatIdPhone (tampilan 08..), dengan unit test Vitest.
3. src/lib/wave.ts: getActiveWave(date) memakai zona waktu Asia/Jakarta -> 1 | 2 | null (bulan 9-12,1-2 = 1; 3-6 = 2; 7-8 = null) dengan unit test batas bulan dan pergantian zona waktu.
4. Halaman `/`: bagian info sesuai PRD §8.1 (judul dengan tahun ajaran dari config sementara, salam, kartu gelombang dengan penanda gelombang aktif, kartu kontak berupa tautan wa.me/mailto/instagram/youtube, kartu info pembayaran placeholder, penutup). Animasi masuk bertahap per bagian (.animate-enter + --stagger). Varian "pendaftaran ditutup" lewat fungsi getRegistrationState() sementara (stub).
5. Komponen src/components/registration/: RegistrationWizard (client), StepStudent, StepParent, StepPayment, ReviewSummary, UploadProof.
   - Wizard 3 langkah dengan Stepper, validasi per langkah (trigger), fokus ke error pertama, ringkasan error, tombol Lanjut/Kembali sticky di bawah pada mobile (hormati safe-area).
   - Input memakai inputMode/autoComplete/enterKeyHint yang tepat; RadioChips untuk gender dan jumlah saudara ("Lainnya" memunculkan input angka); select native untuk pendidikan; kotak centang "Sama dengan alamat siswa"; tombol "Tidak ada" untuk prestasi dan penyakit.
   - UploadProof sesuai PRD §8.3: pilih file (jpg/png/webp, maks 5MB, pesan error jelas), TAMPIL THUMBNAIL PREVIEW (rasio 4:3, outline gambar), nama dan ukuran file, tombol Ganti dan Hapus, dan KLIK THUMBNAIL MEMBUKA GAMBAR PENUH DI TAB BARU (<a target="_blank" rel="noopener noreferrer"> ke object URL) dengan ikon dan aria-label. Revoke object URL saat ganti/hapus/unmount. Ikon status memakai IconSwap.
   - ReviewSummary read-only dengan tautan "Ubah" ke langkah terkait; kotak centang persetujuan wajib; honeypot tersembunyi dan placeholder untuk Turnstile (dihubungkan di Fase 4).
6. Draft: simpan nilai form ke localStorage dengan kunci berversi "SPMB:draft:v1" (debounce, TANPA file), pulihkan saat load, hapus setelah sukses; peringatan beforeunload bila ada perubahan belum terkirim.
7. onSubmit sementara: panggil fungsi `submitRegistration(values, file)` berupa stub yang menunda 800ms lalu resolve (akan diganti Fase 4). Tangani state loading dan cegah klik ganda.

Batasan: belum ada pemanggilan Supabase/Server Action. Jangan menyimpan data pribadi di mana pun selain localStorage draft.

Selesai bila:
- Seluruh alur 3 langkah bisa dilalui di 360px tanpa scroll horizontal; AC-2, AC-3, AC-4 (sisi klien), AC-5, AC-7, AC-14, AC-15 terpenuhi.
- Unit test phone.ts dan wave.ts serta skema Zod (kasus valid dan invalid utama) lulus.
- Thumbnail bukti bayar terbuka di tab baru saat diklik.
````

**Verifikasi manual:** isi form di ponsel; tutup tab lalu buka lagi (draft pulih); pilih gambar → klik thumbnail → gambar terbuka di tab baru.

---

## Fase 4 — Submit & Upload (Backend Publik)

**Tujuan:** pendaftaran benar-benar tersimpan, aman dari spam, bukti bayar tersimpan privat.

**Tugas**
- [ ] `getRegistrationState()` nyata (dari `app_settings` + gelombang)
- [ ] Server Action `requestUploadUrl` (signed upload URL)
- [ ] Unggah langsung ke Storage dari klien
- [ ] Server Action `createRegistration` (Zod + Turnstile + honeypot + cek file + insert)
- [ ] Penanganan duplikasi, error ramah
- [ ] Halaman sukses `/berhasil/[id]`

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 4 — Submit & upload (backend publik)
Baca: PRD.md §8.3, §8.4, §9, §10 (Keamanan), §11, §14 (AC-1, AC-4, AC-6, AC-13).

Context7 (wajib), minimal:
- /vercel/next.js: Server Actions (validasi, return state, redirect, useActionState), batas body Server Action dan mengapa file besar tidak boleh lewat Server Action, headers().
- /supabase/supabase: Storage createSignedUploadUrl, uploadToSignedUrl, cek keberadaan/metadata objek (list/info), insert dan kode error Postgres 23505 (unique violation).
- Cloudflare Turnstile: widget klien dan verifikasi server (siteverify).
- Rate limiting: pilih salah satu (Upstash Ratelimit atau Vercel WAF rate limit) dan jelaskan pilihan.

Tugas:
1. src/lib/actions/registration-state.ts: getRegistrationState() membaca app_settings (klien admin, server) dan menghitung { open, academicYear, wave, payment } memakai getActiveWave. Pasang pada halaman `/` menggantikan stub Fase 3 (tutup => form disembunyikan).
2. Server Action requestUploadUrl({ mime, size }): validasi tipe/ukuran, cek registrasi buka, rate limit per IP, buat path acak "proofs/{tahun}/{uuid}.{ext}", panggil createSignedUploadUrl memakai klien admin, kembalikan { path, token }.
3. Klien: ganti stub submitRegistration. Urutan: requestUploadUrl -> unggah langsung ke bucket via uploadToSignedUrl (browser client) -> panggil createRegistration dengan path hasil unggah. Tampilkan progress; bila API tidak menyediakan progress, gunakan state indeterminate yang jujur (verifikasi via Context7). Simpan path yang sudah terunggah agar retry tidak mengunggah ulang.
4. Server Action createRegistration(payload): (a) validasi ulang dengan registrationSchema, (b) cek honeypot, (c) verifikasi token Turnstile, (d) cek registrasi buka, (e) hitung academic_year dan wave DI SERVER (abaikan nilai klien), (f) verifikasi objek bukti ada di storage dengan MIME/ukuran sesuai batas dan path berada di prefix yang valid, (g) normalisasi telepon, (h) insert via klien admin dengan consented_at, (i) tangani 23505 menjadi pesan duplikasi yang ramah tanpa membocorkan data pendaftar lain, (j) kembalikan { id } atau galat per-field. Jangan menghapus file saat gagal agar bisa dicoba ulang.
5. Cegah klik ganda: tombol disabled + useTransition/useActionState; server mengandalkan indeks unik sebagai pengaman akhir.
6. Halaman `/berhasil/[id]`: ambil data minimal (reg_number, student_name, wave, status) via klien admin berdasarkan UUID; hanya tampil nama siswa dan nomor registrasi; `noindex`, tanpa cache; notFound() bila id tidak valid. Tombol "Konfirmasi via WhatsApp" ke kontak sekolah dengan pesan siap kirim berisi nomor registrasi dan nama siswa. Hapus draft localStorage setelah sukses.
7. Integrasikan widget Turnstile di langkah 3 (site key dari env), tampilkan error ramah bila gagal.
8. Tulis unit test untuk bagian murni (pembuatan path, mapping error) dan dokumentasikan skenario uji manual.

Batasan: kunci secret hanya di server. Jangan pernah mengirim file lewat Server Action/Route Handler. Jangan membuat endpoint publik yang membaca data pendaftar selain /berhasil/[id] minimal.

Selesai bila:
- AC-1, AC-4 (server), AC-6, AC-13 terpenuhi; pendaftaran muncul di tabel dan file ada di bucket privat.
- Memanggil createRegistration tanpa token Turnstile valid, dengan path fiktif, atau dengan MIME salah akan ditolak.
- `grep` pada .next/static tidak menemukan SUPABASE_SECRET_KEY atau nilainya.
- Dua submit identik hanya menghasilkan satu pendaftaran aktif.
````

**Verifikasi manual:** kirim satu pendaftaran dari ponsel (jaringan seluler); cek baris di Supabase dan objek di bucket (tidak bisa dibuka tanpa signed URL); coba kirim ulang data sama → ditolak dengan pesan ramah.

---

## Fase 5 — Admin Inti

**Tujuan:** admin dapat login, melihat, mencari, dan memverifikasi/menolak pendaftar.

**Tugas**
- [ ] `requireAdmin()` + `proxy.ts` melindungi `/admin/*`
- [ ] Login/logout
- [ ] Daftar: statistik, cari, filter, paginasi (kartu di mobile, tabel di `md+`)
- [ ] Detail + bukti bayar (signed URL, buka tab baru)
- [ ] Aksi verifikasi / tolak / kembalikan / catatan

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 5 — Admin inti
Baca: PRD.md §5, §8.5, §9 (aturan 2, 6), §10 (Keamanan), §14 (AC-8 sampai AC-11).

Context7 (wajib), minimal:
- /supabase/supabase dan @supabase/ssr: signInWithPassword/signOut di Server Action, perbedaan getClaims() vs getUser() dan kapan memakainya, createSignedUrl, filter PostgREST (ilike, or, range, count).
- /vercel/next.js: searchParams/params sebagai Promise, redirect/notFound, revalidatePath, rendering dinamis untuk halaman berbasis cookies, route group.

Tugas:
1. src/lib/auth.ts: requireAdmin() — ambil user terverifikasi dari klien server, cek keberadaan di tabel admins (melalui RLS), redirect ke /admin/login bila gagal; kembalikan { user, supabase }. Dipakai di layout, page, Server Action, dan Route Handler admin.
2. src/proxy.ts: selain refresh sesi, redirect /admin/* (kecuali /admin/login) ke /admin/login bila tidak ada sesi. Ingat: ini BUKAN satu-satunya lapisan (requireAdmin tetap wajib).
3. /admin/login: form email + kata sandi, Server Action signInWithPassword, pesan error generik ("Email atau kata sandi salah"), bila user login tapi bukan admin -> signOut + pesan yang sama; bila sudah admin -> redirect ke /admin. Tombol Keluar di header admin.
4. /admin/(protected)/layout.tsx: requireAdmin(), header (nama sekolah, email admin, Keluar), container max-w-6xl, metadata noindex. Tambah robots.ts yang melarang /admin.
5. /admin: kartu statistik (Total, Menunggu, Terverifikasi, Ditolak; per gelombang) dan daftar pendaftar. Filter via URL (q, status, wave, year, page), 20 per halaman, urut terbaru. Pencarian q mencakup student_name, father_name, mother_name, reg_number, contact_phone. PENTING: sanitasi/escape q sebelum dipakai di filter or()/ilike PostgREST (koma, kurung, wildcard) agar tidak terjadi injeksi filter. Mobile: kartu; >= md: tabel. State kosong, loading (Skeleton), dan error.
6. /admin/pendaftar/[id]: tampilkan seluruh data dikelompokkan (Siswa, Orang Tua, Pembayaran, Administrasi), format tanggal Indonesia, telepon diformat. Bukti bayar: buat signed URL berumur <= 300 detik, tampilkan gambar (outline 1px) dan KLIK MEMBUKA DI TAB BARU. Tombol WhatsApp ke nomor kontak (wa.me).
7. Server Actions (semua memanggil requireAdmin dan memakai klien SESI admin sehingga RLS berlaku): verifyRegistration(id), rejectRegistration(id, reason >= 5 karakter), revertToPending(id), saveAdminNote(id, note). Set reviewed_by/reviewed_at, revalidatePath, kembalikan hasil untuk toast. ConfirmDialog untuk Verifikasi dan Tolak; tombol menampilkan state loading; cegah aksi ganda.
8. Pastikan semua halaman admin dirender dinamis (tanpa cache publik) dan tidak membocorkan data pada respons error.

Batasan: satu role saja; jangan membuat manajemen pengguna. Jangan memakai kunci secret pada kode admin kecuali benar-benar diperlukan (utamakan klien sesi + RLS).

Selesai bila:
- AC-8, AC-9, AC-10, AC-11 terpenuhi.
- User Supabase non-admin tidak dapat melihat data meski login; memanggil Server Action admin tanpa sesi admin gagal.
- Pencarian dengan karakter khusus (koma, kurung, %, ') tidak merusak query.
- Daftar dan detail nyaman dipakai di 360px dan desktop; navigasi keyboard berfungsi.
````

**Verifikasi manual:** login dengan akun admin; coba buka `/admin` di jendela privat (harus redirect); login dengan user non-admin (jika dibuat) → tidak melihat data; verifikasi dan tolak satu pendaftar.

---

## Fase 6 — Ekspor, Pengaturan & Cron

**Tujuan:** rekap data, kontrol buka/tutup pendaftaran, dan kebersihan storage.

**Tugas**
- [ ] Ekspor CSV aman (BOM, header Indonesia, anti formula injection)
- [ ] Halaman pengaturan (tahun ajaran, buka/tutup, info pembayaran)
- [ ] Template pesan WhatsApp di detail admin
- [ ] Cron pembersihan file yatim

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 6 — Ekspor, pengaturan, cron
Baca: PRD.md §8.5, §9, §14 (AC-12, AC-13), §6 (P1).

Context7 (wajib), minimal:
- /vercel/next.js: Route Handlers (Response, header Content-Disposition), rendering dinamis.
- Vercel Cron Jobs: konfigurasi di vercel.json dan otorisasi memakai CRON_SECRET (header Authorization Bearer).
- /supabase/supabase: Storage list/remove dari server.

Tugas:
1. /admin/export (Route Handler): requireAdmin(); ikuti filter aktif (status, wave, year, q); CSV UTF-8 dengan BOM; header kolom Bahasa Indonesia; tanggal format YYYY-MM-DD; telepon sebagai teks; nama file "SPMB-{tahun}-{tanggal}.csv". NETRALKAN formula injection: sel berawalan = + - @ (tab/CR) diberi awalan apostrof, KECUALI nilai persis "-". Escape koma/kutip/baris baru dengan benar. Tombol "Ekspor CSV" di /admin. Unit test src/lib/csv.ts untuk kasus tepi.
2. /admin/pengaturan: form (Zod) untuk academic_year, registration_open, payment_amount/bank/account_no/account_name; update lewat klien sesi admin (RLS). Perubahan langsung memengaruhi halaman publik (revalidate). Tautkan dari header admin.
3. Detail admin: tombol "Hubungi via WhatsApp" dengan template pesan berbeda untuk status terverifikasi dan ditolak (isi alasan penolakan), diencode dengan benar.
4. Cron /api/cron/cleanup-orphans: hanya menerima Authorization "Bearer ${CRON_SECRET}" (selain itu 401). Hapus objek di bucket payment-proofs yang berumur > 24 jam dan path-nya TIDAK dirujuk registrations.payment_proof_path. Batasi jumlah per eksekusi dan catat jumlah (tanpa PII). Tambahkan jadwal harian di vercel.json.
5. Perbarui .env.example dan README (CRON_SECRET, cara tes cron lokal).

Selesai bila:
- AC-12 dan AC-13 terpenuhi; CSV terbuka benar di Excel (karakter Indonesia utuh) dan unit test csv lulus.
- Mematikan registration_open membuat form publik tertutup dan Server Action menolak submit.
- Endpoint cron mengembalikan 401 tanpa secret dan tidak menghapus file yang masih dirujuk.
````

**Verifikasi manual:** ekspor lalu buka di Excel/Google Sheets; tutup pendaftaran dari pengaturan dan cek halaman publik; panggil cron dengan dan tanpa secret.

---

## Fase 7 — QA & Polish

**Tujuan:** kualitas rasa (feel), aksesibilitas, keamanan, dan performa terbukti.

**Tugas**
- [ ] Review UI memakai skill jakub.kr
- [ ] Uji kondisi ekstrem komponen (`/break`, `/state-machine`)
- [ ] E2E Playwright (ponsel + desktop) + axe
- [ ] Unit test lengkap
- [ ] Audit keamanan (checklist) dan performa (Lighthouse)

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 7 — QA & polish
Baca: PRD.md §3 (Metrik), §10, §13, §14 (seluruh AC), §15.

Skill (bila terpasang dari jakubkrehel/skills): jalankan /better-ui, /better-typography, /better-colors, /better-accessibility, /better-layout, /better-writing, lalu /interface-review pada halaman publik (info, tiap langkah wizard, halaman sukses) dan admin (login, daftar, detail). Gunakan /state-machine dan /break pada UploadProof, StatusBadge, dan kartu/baris pendaftar (nama sangat panjang, teks kosong, error, loading). Terapkan temuan yang relevan; catat temuan yang sengaja diabaikan beserta alasannya.

Context7 (wajib), minimal: Playwright (projects dan devices, webServer, fixture, penyimpanan state auth), @axe-core/playwright, Vitest.

Tugas:
1. Terapkan perbaikan dari review skill. Pastikan: text-balance/pretty, radius konsentris, bayangan alih-alih border, tabular-nums, hit area >= 44px, kontras AA, copy konsisten dan manusiawi (PRD §13.5).
2. Playwright dengan project Pixel 7, iPhone 14, dan Desktop Chrome. Skenario: (a) alur publik happy path termasuk upload, preview, dan buka tab baru; (b) validasi dan error tiap langkah; (c) pendaftaran ditutup; (d) admin login -> filter/cari -> detail -> verifikasi dan tolak; (e) ekspor CSV. Gunakan Turnstile dummy keys dan data uji terpisah. Tambahkan pemeriksaan axe pada semua halaman utama (tidak boleh ada pelanggaran serious/critical).
3. Lengkapi unit test (skema, phone, wave, csv, util lain) hingga kasus tepi utama tercakup.
4. Audit keamanan -> tulis docs/SECURITY-CHECKLIST.md berisi hasil nyata: (a) REST/Storage dengan publishable key: anon tidak bisa select/insert/update registrations dan tidak bisa list/baca bucket; (b) unggah ke bucket tanpa token ditolak; (c) bundel klien tidak memuat kunci secret; (d) Server Action admin menolak tanpa sesi admin; (e) signed URL kedaluwarsa dalam <= 5 menit; (f) tidak ada PII di log; (g) header keamanan hadir; (h) uji CSV injection; (i) uji pencarian admin dengan karakter khusus.
5. Performa: Lighthouse mobile pada halaman publik; targetkan metrik PRD §3. Analisis bundel; pindahkan kode non-esensial keluar dari JS awal (mis. dynamic import untuk Turnstile/komponen berat). Pastikan font tidak memblokir render dan tidak ada layout shift.
6. Perbaiki semua temuan. Laporkan skor sebelum/sesudah.

Selesai bila:
- Semua AC-1..AC-15 lulus (otomatis bila memungkinkan, sisanya terdokumentasi manual).
- axe: 0 pelanggaran serious/critical; Lighthouse mobile memenuhi target PRD §3 (atau jelaskan penyimpangan).
- docs/SECURITY-CHECKLIST.md terisi dan semua butir lulus.
````

**Verifikasi manual:** uji di minimal satu iPhone dan satu Android sungguhan (jaringan seluler), mode terang dan gelap, ukuran font besar di pengaturan sistem.

---

## Fase 8 — Deploy & Go-Live

**Tujuan:** rilis produksi yang aman dan dapat dioperasikan panitia.

**Tugas (agent)**
- [ ] `vercel.json` (region `sin1`, cron), CSP final, `robots`/`sitemap`/OG/favicon
- [ ] `docs/RUNBOOK.md`

**Tugas (manusia)**
- [ ] Impor repo ke Vercel, isi env Production/Preview
- [ ] Jalankan migration ke Supabase produksi
- [ ] Buat akun admin + isi `admins`; isi `app_settings` (tahun ajaran, info pembayaran)
- [ ] Hubungkan domain; uji produksi dari ponsel

**Prompt agent**

````text
[Tempel Prompt 0 lebih dulu]

FASE 8 — Deploy & go-live (sisi kode dan dokumentasi)
Baca: PRD.md §10, §12, §16, §17.

Context7 (wajib), minimal:
- /vercel/next.js: Content-Security-Policy (header/nonce) untuk Next.js, metadata API (robots, sitemap, opengraph-image, icons), konfigurasi produksi.
- Vercel: vercel.json (regions, crons), environment variables per lingkungan.
- /supabase/supabase: checklist go-to-production, konfigurasi URL Auth, rekomendasi keamanan.

Tugas:
1. vercel.json: regions ["sin1"] (verifikasi nilai region lewat dokumentasi), cron pembersihan dari Fase 6.
2. CSP final di next.config/proxy: izinkan hanya sumber yang dibutuhkan (self, domain Supabase untuk koneksi dan storage, Cloudflare Turnstile untuk script/frame, font via next/font), tambahkan frame-ancestors 'none', base-uri, form-action. Uji bahwa Turnstile, upload ke storage, dan gambar bukti bayar (blob:/signed URL) tetap berfungsi; jelaskan kebijakan di docs.
3. metadata: title/description Bahasa Indonesia, Open Graph + gambar OG sederhana, favicon, theme-color, robots.ts (izinkan "/" dan larang /admin), sitemap.ts (hanya "/").
4. docs/RUNBOOK.md (Bahasa Indonesia, untuk panitia dan teknisi): cara login admin; menutup/membuka pendaftaran; mengubah tahun ajaran dan info pembayaran; ekspor CSV berkala sebagai cadangan; reset kata sandi admin; menambah admin cadangan; rotasi kunci Supabase/Turnstile; apa yang dilakukan bila ada lonjakan spam; kebijakan retensi/penghapusan data (isi sesuai keputusan sekolah, tandai bila belum diputuskan).
5. docs/GO-LIVE-CHECKLIST.md berisi checklist di bawah ini beserta kolom status.
6. Pastikan tidak ada console.log berisi PII, tidak ada rute /dev/* di produksi, dan `pnpm build` produksi bersih.

Selesai bila:
- Build produksi lulus; header CSP aktif tanpa memblokir fungsi inti (diuji di preview deployment).
- Dokumen RUNBOOK dan GO-LIVE-CHECKLIST lengkap dan dapat diikuti non-teknisi.
````

**Checklist Go-Live**

| # | Item | Status |
|---|---|---|
| 1 | Env Production terisi; `SUPABASE_SECRET_KEY` tidak ada di env `NEXT_PUBLIC_*` | ☐ |
| 2 | Migration dijalankan di Supabase produksi; RLS aktif di semua tabel | ☐ |
| 3 | Sign-up Supabase Auth mati; akun admin (+ cadangan) dibuat dan terdaftar di `admins` | ☐ |
| 4 | Bucket `payment-proofs` privat; batas 5 MB dan MIME benar | ☐ |
| 5 | `app_settings` diisi (tahun ajaran, info pembayaran) | ☐ |
| 6 | Turnstile memakai key produksi (bukan dummy) | ☐ |
| 7 | Domain + HTTPS; Auth Site URL di Supabase sesuai domain | ☐ |
| 8 | Smoke test produksi dari ponsel nyata: daftar → admin verifikasi → ekspor CSV | ☐ |
| 9 | `docs/SECURITY-CHECKLIST.md` semua lulus | ☐ |
| 10 | Pertimbangkan paket berbayar (Supabase tidak ter-pause; backup; ketentuan Vercel) menjelang gelombang | ☐ |
| 11 | Panitia membaca `RUNBOOK.md`; ada jadwal ekspor CSV berkala | ☐ |
| 12 | Hapus data uji dari produksi sebelum membuka pendaftaran | ☐ |

---

## Backlog Pasca-MVP

| Item | Catatan |
|---|---|
| Halaman cek status | Nomor registrasi + no. HP; rate limit ketat; tanpa membocorkan data lain |
| Notifikasi otomatis | Email (mis. Resend) dan/atau WhatsApp saat status berubah |
| Kartu bukti pendaftaran (PDF) | Dapat diunduh dari halaman sukses |
| Kompresi gambar di klien | Mengurangi ukuran unggahan di jaringan lambat; dukung HEIC |
| MFA admin (TOTP) | Menambah keamanan akun admin |
| Riwayat perubahan status (audit) | Tabel `registration_events` |
| Retensi data otomatis | Hapus/anonimkan sesuai kebijakan sekolah |
| Dukungan wali/yatim | Sesuai jawaban pertanyaan terbuka PRD §17 |

---

## Prompt Utilitas

**Debug / perbaikan bug**

````text
[Tempel Prompt 0 lebih dulu]
Ada bug: {deskripsi, langkah reproduksi, hasil aktual vs harapan, pesan error/log tanpa PII}.
Langkah: (1) reproduksi dan temukan akar masalah, jangan menambal gejala; (2) gunakan Context7 untuk memastikan perilaku API yang relevan (sebutkan library/topik); (3) tulis tes yang gagal terlebih dahulu bila memungkinkan; (4) perbaiki seminimal mungkin; (5) jalankan lint, typecheck, test, build; (6) laporkan akar masalah, perbaikan, dan risiko regresi.
````

**Review keamanan sebelum merge**

````text
[Tempel Prompt 0 lebih dulu]
Lakukan review keamanan pada diff branch ini terhadap PRD.md §10 dan "ATURAN KEAMANAN" Prompt 0. Periksa: kebocoran kunci secret ke klien, tabel/policy RLS baru, akses storage, pengecekan requireAdmin di setiap jalur admin, validasi server, input yang masuk ke filter/CSV/HTML, PII di log, dependensi baru. Gunakan Context7 untuk memverifikasi praktik terbaru Supabase/Next.js yang relevan. Keluarkan temuan berurutan berdasarkan tingkat keparahan dengan lokasi file:baris dan saran perbaikan.
````

**Menambah fitur dari Backlog**

````text
[Tempel Prompt 0 lebih dulu]
Tambahkan fitur: {nama fitur dari Backlog}. Mulai dengan memperbarui PRD.md (ruang lingkup, aturan bisnis, kriteria penerimaan), tunjukkan perubahan PRD, lalu implementasikan mengikuti arsitektur dan gaya yang ada. Wajib Context7 untuk setiap API baru. Sertakan tes dan perbarui RUNBOOK bila memengaruhi operasional.
````
