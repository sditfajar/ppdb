# Buku Panduan Operasional & Teknis (Runbook)
## PPDB Online SDIT Fajar

Buku panduan ini disusun sebagai pedoman operasional bagi **Panitia PPDB** (non-teknis) dan **Tim Pengelola Teknis/IT** dalam mengelola, memantau, dan merawat sistem formulir pendaftaran PPDB Online SDIT Fajar.

---

## DAFTAR ISI
1. [Prinsip & Arsitektur Akses Admin](#1-prinsip--arsitektur-akses-admin)
2. [Panduan Operasional Panitia PPDB (Harian)](#2-panduan-operasional-panitia-ppdb-harian)
   - [2.1 Cara Masuk (Login) ke Dasbor Admin](#21-cara-masuk-login-ke-dasbor-admin)
   - [2.2 Membuka & Menutup Pendaftaran](#22-membuka--menutup-pendaftaran)
   - [2.3 Mengubah Tahun Ajaran & Info Rekening Pembayaran](#23-mengubah-tahun-ajaran--info-rekening-pembayaran)
   - [2.4 Memeriksa & Memverifikasi Pendaftar](#24-memeriksa--memverifikasi-pendaftar)
   - [2.5 Menolak Pendaftaran (Wajib Alasan)](#25-menolak-pendaftaran-wajib-alasan)
   - [2.6 Menghubungi Orang Tua via WhatsApp](#26-menghubungi-orang-tua-via-whatsapp)
   - [2.7 SOP Pencadangan Data Berkala (Ekspor CSV)](#27-sop-pencadangan-data-berkala-ekspor-csv)
3. [Panduan Teknis & Keamanan (Tim IT)](#3-panduan-teknis--keamanan-tim-it)
   - [3.1 Reset Kata Sandi Admin](#31-reset-kata-sandi-admin)
   - [3.2 Menambah Akun Admin Baru / Cadangan](#32-menambah-akun-admin-baru--cadangan)
   - [3.3 Rotasi Kunci API (Supabase & Turnstile)](#33-rotasi-kunci-api-supabase--turnstile)
   - [3.4 Penanganan Lonjakan Spam / Serangan Formulir](#34-penanganan-lonjakan-spam--serangan-formulir)
   - [3.5 Pembersihan Berkas Otomatis (Cron Job)](#35-pembersihan-berkas-otomatis-cron-job)
   - [3.6 Kebijakan Content-Security-Policy (CSP)](#36-kebijakan-content-security-policy-csp)
   - [3.7 Kebijakan Retensi & Penghapusan Data Pribadi](#37-kebijakan-retensi--penghapusan-data-pribadi)

---

## 1. Prinsip & Arsitektur Akses Admin

- **Satu Role Tunggal:** Sistem ini sengaja dirancang sederhana dengan **SATU role admin**. Seluruh admin yang terdaftar memiliki hak akses yang sama (melihat data, verifikasi, tolak, ekspor CSV, dan mengubah pengaturan).
- **Proteksi Berlapis (Defense in Depth):**
  1. *Lapis 1 (Edge Proxy):* File `src/proxy.ts` mencegat setiap kunjungan ke `/admin/*` dan mengarahkan pengguna tanpa sesi ke `/admin/login`.
  2. *Lapis 2 (Server Component & Actions):* Fungsi `requireAdmin()` memverifikasi identitas pengguna terhadap tabel basis data `admins`. Pengguna yang terdaftar di Supabase Auth namun tidak terdaftar di tabel `admins` akan ditolak secara otomatis.
  3. *Lapis 3 (Postgres Row Level Security):* Tabel `registrations` dan bucket storage `payment-proofs` memiliki kebijakan RLS ketat; anonim publik tidak memiliki akses `SELECT`, `UPDATE`, atau `DELETE`.

---

## 2. Panduan Operasional Panitia PPDB (Harian)

### 2.1 Cara Masuk (Login) ke Dasbor Admin
1. Buka peramban (browser) di komputer atau ponsel, lalu akses alamat:
   ```
   https://ppdb.sditfajar.sch.id/admin/login
   ```
2. Masukkan **Alamat Email** dan **Kata Sandi** admin yang telah diberikan tim IT.
3. Klik tombol **Masuk ke Dasbor**.
4. Jika berhasil, Anda akan dialihkan ke halaman utama admin (`/admin`) yang menampilkan ringkasan statistik dan daftar pendaftar terbaru.
5. Bila selesai bertugas di komputer bersama, selalu klik tombol **Keluar** di pojok kanan atas dasbor.

### 2.2 Membuka & Menutup Pendaftaran
Jika kuota pendaftaran telah penuh atau periode pendaftaran belum dibuka:
1. Masuk ke dasbor admin, lalu klik menu **Pengaturan** di bilah navigasi atas (atau kunjungi `/admin/pengaturan`).
2. Cari bagian **Status Pendaftaran**.
3. Alihkan tombol saklar (toggle switch) ke posisi **Tutup Pendaftaran** (tidak aktif).
4. Klik **Simpan Pengaturan**.
5. **Dampak Langsung:**
   - Halaman depan publik (`/`) seketika menampilkan pengumuman bahwa pendaftaran ditutup beserta kontak resmi panitia.
   - Formulir pendaftaran tidak akan ditampilkan ke calon pendaftar.
   - Server Action akan menolak setiap percobaan pengiriman formulir baru demi integritas data.

### 2.3 Mengubah Tahun Ajaran & Info Rekening Pembayaran
1. Masuk ke menu **Pengaturan** (`/admin/pengaturan`).
2. Perbarui kolom yang diperlukan:
   - **Tahun Ajaran:** Contoh `2026/2027` (otomatis dipakai sebagai filter arsip dan penomoran registrasi).
   - **Nominal Biaya Pendaftaran:** Masukkan angka tanpa titik (contoh: `250000`). Sistem otomatis memformat menjadi `Rp 250.000`.
   - **Nama Bank Tujuan:** Contoh `Bank Syariah Indonesia (BSI)`.
   - **Nomor Rekening:** Contoh `7123456789`.
   - **Atas Nama Pemilik Rekening:** Contoh `Yayasan Fajar Depok`.
3. Klik **Simpan Pengaturan**.
4. Informasi pembayaran pada Langkah 3 formulir publik akan langsung terbarui secara otomatis.

### 2.4 Memeriksa & Memverifikasi Pendaftar
1. Pada daftar pendaftar di `/admin`, klik salah satu kartu/baris pendaftar untuk membuka halaman detail (`/admin/pendaftar/[id]`).
2. Periksa kelengkapan data:
   - **Data Calon Siswa:** Nama lengkap, tempat/tanggal lahir, jenis kelamin, alamat, hobi, dan riwayat kesehatan.
   - **Data Orang Tua / Wali:** Nama ayah dan ibu, pekerjaan, pendidikan, serta nomor WhatsApp kontak.
   - **Bukti Pembayaran Formulir:** Klik tombol atau pratinjau bukti bayar. Gambar bukti bayar akan terbuka di **tab baru** melalui tautan aman berumur singkat (5 menit). Cocokkan mutasi rekening panitia dengan foto bukti transfer.
3. Jika bukti pembayaran dan data telah sesuai, klik tombol **Verifikasi Pendaftaran**.
4. Kotak konfirmasi akan muncul. Klik **Ya, Verifikasi**.
5. Status pendaftar berubah menjadi <span style="color: green; font-weight: bold;">Terverifikasi</span>. Nama admin yang memverifikasi beserta waktu verifikasi tercatat otomatis di sistem.

### 2.5 Menolak Pendaftaran (Wajib Alasan)
Jika bukti transfer tidak valid, data ganda, atau foto tidak terbaca:
1. Pada halaman detail pendaftar, klik tombol **Tolak Pendaftaran**.
2. Masukkan **Alasan Penolakan** secara jelas dan santun (minimal 5 karakter), misalnya:
   *Contoh:* *"Foto bukti transfer buram dan nominal tidak terlihat. Mohon kirimkan ulang tangkapan layar bukti transfer melalui WhatsApp panitia."*
3. Klik **Tolak Pendaftaran**. Status akan berubah menjadi <span style="color: red; font-weight: bold;">Ditolak</span>.
4. *(Catatan: Apabila terjadi kekeliruan, admin dapat mengembalikan status ke "Menunggu Verifikasi" dengan mengklik tombol "Kembalikan ke Menunggu").*

### 2.6 Menghubungi Orang Tua via WhatsApp
Pada halaman detail pendaftar, terdapat tombol pintas **Hubungi via WhatsApp**:
- Tombol ini otomatis membuka aplikasi WhatsApp dengan nomor kontak orang tua yang terdaftar (diawali kode negara `62`).
- Pesan telah terisi otomatis sesuai status pendaftar:
  - **Jika Terverifikasi:** Berisi ucapan selamat, nomor registrasi siswa, dan arahan jadwal tes/observasi berikutnya.
  - **Jika Ditolak:** Berisi penjelasan alasan penolakan dan panduan konfirmasi ulang ke panitia.

### 2.7 SOP Pencadangan Data Berkala (Ekspor CSV)
Untuk menjaga keamanan data dari risiko kendala infrastruktur cloud, panitia **WAJIB** melakukan pencadangan data secara rutin:
1. **Jadwal Ekspor:**
   - **Harian (Pukul 17:00 WIB)** saat periode gelombang pendaftaran sedang aktif.
   - **Mingguan (Setiap hari Jumat)** saat periode pendaftaran normal.
2. **Cara Mengunduh:**
   - Di halaman `/admin`, sesuaikan filter bila perlu (atau biarkan default untuk mengunduh semua pendaftar).
   - Klik tombol **Ekspor CSV** di kanan atas tabel.
   - Berkas akan terunduh dengan format nama: `ppdb-[tahun_ajaran]-[tanggal].csv`.
3. **Membuka File di Microsoft Excel Tanpa Rusak:**
   - Berkas CSV sistem ini dibuat dengan standar encoding **UTF-8 with BOM**, sehingga karakter aksen nama Indonesia (seperti tanda petik, koma) dan nomor telepon (awalan `+62` atau `08`) tetap utuh tanpa menjadi notasi ilmiah.
   - Cara aman membuka di Excel: Buka Excel -> Menu **Data** -> **From Text/CSV** -> Pilih file yang baru diunduh -> Pastikan *File Origin* adalah `65001: Unicode (UTF-8)` -> Klik **Load**.
   - Simpan berkas hasil cadangan ke folder penyimpanan aman (Google Drive Panitia / Flashdisk terenkripsi).

---

## 3. Panduan Teknis & Keamanan (Tim IT)

### 3.1 Reset Kata Sandi Admin
Jika panitia lupa kata sandi admin:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) -> Masuk ke proyek produksi PPDB.
2. Buka menu **Authentication** -> **Users**.
3. Cari alamat email admin yang bersangkutan.
4. Klik tombol titik tiga (`...`) di kanan baris pengguna -> Pilih **Send Password Reset** (email reset akan dikirimkan ke admin), ATAU pilih **Edit User** -> Masukkan kata sandi baru secara langsung.
5. Informasikan kata sandi baru ke panitia melalui saluran komunikasi yang aman (bukan di grup publik).

### 3.2 Menambah Akun Admin Baru / Cadangan
Sistem PPDB SDIT Fajar memerlukan minimal **2 akun admin** (1 admin utama dan 1 admin cadangan) untuk mencegah terkunci dari sistem:
1. Buka Supabase Dashboard -> **Authentication** -> **Users** -> Klik **Add user** -> **Create user**.
2. Masukkan alamat email admin baru dan kata sandi yang kuat (minimal 12 karakter kombinasi huruf besar, kecil, angka, dan simbol).
3. Salin nilai **User UID** dari user yang baru dibuat.
4. Buka menu **SQL Editor** di Supabase Dashboard, lalu jalankan perintah:
   ```sql
   INSERT INTO public.admins (id, email, full_name)
   VALUES (
     '<USER_UID_DARI_LANGKAH_3>',
     'admin2@sditfajar.sch.id',
     'Ustadz Cadangan PPDB'
   );
   ```
5. Uji coba masuk dengan akun baru tersebut di `https://ppdb.sditfajar.sch.id/admin/login`.

### 3.3 Rotasi Kunci API (Supabase & Turnstile)
Jika terjadi insiden keamanan atau kecurigaan kebocoran kunci:
1. **Cloudflare Turnstile:**
   - Buat widget baru di dashboard Cloudflare Turnstile.
   - Dapatkan `Site Key` dan `Secret Key` baru.
   - Di dashboard Vercel -> **Settings** -> **Environment Variables**, perbarui `NEXT_PUBLIC_TURNSTILE_SITE_KEY` dan `TURNSTILE_SECRET_KEY`.
   - Lakukan redeploy produksi.
2. **Supabase API Keys:**
   - Buka Supabase Dashboard -> **Project Settings** -> **API Keys**.
   - Generate kunci baru untuk Publishable/Secret Key.
   - Perbarui variabel `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dan `SUPABASE_SECRET_KEY` di Vercel.
   - Lakukan redeploy produksi.
   - *Penting:* Jangan pernah menghapus kunci lama di Supabase sebelum kunci baru terpasang di Vercel dan berhasil diuji.

### 3.4 Penanganan Lonjakan Spam / Serangan Formulir
Sistem telah dilengkapi proteksi multi-lapis terhadap spam:
1. **Honeypot:** Kolom jebakan tersembunyi yang otomatis menolak bot formulir.
2. **Cloudflare Turnstile:** Verifikasi pengunjung tanpa CAPTCHA yang menyulitkan manusia.
3. **Penyelidikan Insiden Spam:**
   - Jika terdeteksi ribuan pengiriman palsu: Buka dashboard Cloudflare Turnstile -> Ubah mode widget dari *Managed* menjadi *Interactive Challenge* untuk memperketat tantangan bot.
   - Periksa log di Vercel Functions untuk melihat IP penyerang. Bila perlu, pasang IP Access Rule / WAF di Cloudflare untuk memblokir rentang IP penyerang.

### 3.5 Pembersihan Berkas Otomatis (Cron Job)
- Setiap hari pada pukul `00:00 WIB` (pukul 17:00 UTC), Vercel Cron memanggil endpoint:
  ```
  POST /api/cron/cleanup-orphans
  Headers: { Authorization: "Bearer <CRON_SECRET>" }
  ```
- Endpoint ini memindai berkas di bucket storage `payment-proofs` yang berumur > 24 jam dan TIDAK tercatat di kolom `payment_proof_path` tabel `registrations` (misalnya karena pendaftar batal mengirim formulir setelah mengunggah foto).
- Berkas yatim tersebut akan dihapus secara otomatis untuk menghemat kuota penyimpanan storage. Log cron tidak pernah mencatat identitas nama siswa atau orang tua.

### 3.6 Kebijakan Content-Security-Policy (CSP)
Sistem menerapkan CSP ketat di `next.config.ts`:
- **`default-src 'self'`**: Semua resource hanya dimuat dari origin sendiri secara default.
- **`script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com`**: Mengizinkan skrip bundel Next.js dan skrip widget Cloudflare Turnstile.
- **`style-src 'self' 'unsafe-inline'`**: Mengizinkan stylesheet Tailwind v4 dan inline CSS runtime.
- **`img-src 'self' blob: data: https://*.supabase.co`**: Mengizinkan pratinjau bukti bayar lokal (`blob:`), SVG inline (`data:`), dan signed URL gambar Supabase Storage.
- **`connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com`**: Koneksi API/Storage Supabase dan validasi token Turnstile.
- **`frame-src 'self' https://challenges.cloudflare.com`**: Frame widget Turnstile.
- **`frame-ancestors 'none'`**: Mencegah seluruh halaman ditanam dalam iframe situs lain (anti clickjacking).
- **`base-uri 'self'` & `form-action 'self'`**: Mencegah injeksi base URL dan pengiriman formulir ke server pihak ketiga.

### 3.7 Kebijakan Retensi & Penghapusan Data Pribadi
Sesuai kepatuhan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022) dan PRD §17:
1. **Data Pendaftar Terverifikasi / Diterima:**
   - Disimpan selama 1 (satu) tahun ajaran aktif untuk keperluan arsip administrasi madrasah/sekolah.
   - Setelah siswa resmi terdaftar di buku induk sekolah (DAPODIK/EMIS), data formulir online dapat diarsipkan secara luring dan dihapus dari basis data web.
2. **Data Pendaftar Ditolak / Mengundurkan Diri:**
   - Disimpan selama **3 (tiga) bulan** pasca pengumuman hasil seleksi gelombang untuk mengakomodasi masa sanggah atau konfirmasi orang tua.
   - *(Catatan Sekolah: Kebijakan pasti mengenai jadwal penghapusan berkas bukti bayar pendaftar ditolak dapat disesuaikan kembali berdasarkan rapat pleno panitia PPDB).*
3. **Prosedur Penghapusan Aman:**
   - Dilakukan oleh teknisi basis data dengan menghapus baris tabel `registrations` dan objek terkait di bucket `payment-proofs`.
