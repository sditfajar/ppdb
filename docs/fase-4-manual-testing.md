# Panduan Verifikasi Manual — Fase 4: Submit & Upload (Backend Publik)

Dokumen ini berisi panduan skenario pengujian manual untuk memvalidasi kriteria penerimaan (**AC-1, AC-4, AC-6, AC-13**) pada PPDB Online SDIT Fajar.

---

## 1. Persiapan Lingkungan

Pastikan database lokal atau projek dev Supabase berjalan, serta variabel lingkungan terisi di `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jalankan server aplikasi:
```bash
pnpm dev
```

---

## 2. Skenario Pengujian

### Skenario 1 (AC-1): Alur Sukses Pendaftaran (Happy Path)
1. Buka `http://localhost:3000` pada peramban mobile (basis 360 px) atau browser desktop dengan DevTools device emulation.
2. **Langkah 1 (Siswa):**
   - Nama lengkap: `Muhammad Rayyan Al-Fatih`
   - Panggilan: `Rayyan`
   - Tempat lahir: `Depok`
   - Tanggal lahir: Pilih tanggal dengan usia 6 atau 7 tahun (misal: `2019-03-10`).
   - Jenis kelamin: `Laki-laki`.
   - Jumlah saudara: `1`, Anak ke: `1`.
   - Alamat siswa: `Jl. Margonda Raya No. 45, Beji, Depok`.
   - Nomor WhatsApp: `081298765432`.
   - Hobi: `Membaca Al-Qur'an dan Mewarnai`.
   - Prestasi & Riwayat Medis: Biarkan default `-` atau isi.
   - Klik **Lanjut**.
3. **Langkah 2 (Orang Tua):**
   - Nama Ayah: `Ahmad Riswandi`.
   - Nama Ibu: `Siti Nurhaliza`.
   - Pendidikan Ayah & Ibu: Pilih dari dropdown (misal `S1/S2/S3`).
   - Pekerjaan Ayah & Ibu: `Karyawan Swasta` & `Ibu Rumah Tangga`.
   - Alamat Ortu: Centang "Sama dengan alamat tempat tinggal siswa".
   - Klik **Lanjut**.
4. **Langkah 3 (Pembayaran & Konfirmasi):**
   - Periksa kartu instruksi rekening pembayaran (Bank Syariah Indonesia).
   - Unggah foto bukti transfer (format JPG/PNG, ukuran < 5 MB).
   - Periksa pratinjau thumbnail (klik thumbnail untuk memverifikasi membuka tab baru).
   - Centang kotak pernyataan persetujuan kebenaran data & PDP.
   - Selesaikan widget Cloudflare Turnstile (akan tercentang otomatis dengan dummy key).
   - Klik **Kirim Pendaftaran**.
5. **Ekspektasi:**
   - Tombol berubah menjadi loading ("Kirim Pendaftaran" dengan spinner disabled).
   - Tampil indikator progres: *"Mengunggah foto bukti transfer..."* lalu *"Memverifikasi dan menyimpan data pendaftaran Anda..."*.
   - Browser diarahkan ke `/berhasil/[id]`.
   - Menampilkan nomor registrasi (format: `PPDB-2026-XXXX`), nama siswa, gelombang pendaftaran, dan status *"Menunggu Verifikasi"*.
   - Klik tombol **"Konfirmasi via WhatsApp"**: membuka WhatsApp dengan format pesan otomatis terisi nomor registrasi dan nama pendaftar.
   - Buka kembali `http://localhost:3000`: draf lokal telah terhapus bersih.

---

### Skenario 2 (AC-6): Pencegahan Duplikasi Aktif (Postgres 23505)
1. Buka kembali halaman `http://localhost:3000`.
2. Isi formulir dengan data siswa yang **persis sama** dengan Skenario 1:
   - Nama Siswa: `Muhammad Rayyan Al-Fatih` (uji variasi spasi atau huruf besar/kecil: `muhammad rayyan al-fatih`).
   - Tanggal Lahir: Sama persis (`2019-03-10`).
3. Lanjutkan hingga Langkah 3, unggah foto bukti transfer baru, selesaikan Turnstile, dan tekan **Kirim Pendaftaran**.
4. **Ekspektasi:**
   - Server Action menolak penyimpanan berdasarkan indeks unik parsial `registrations_active_unique` (error kode `23505`).
   - Muncul pesan ramah Bahasa Indonesia:
     *"Calon siswa dengan nama dan tanggal lahir ini sudah terdaftar pada tahun ajaran aktif. Silakan hubungi panitia PPDB jika Anda membutuhkan bantuan."*
   - Formulir tidak terhapus dan file tidak diunggah ulang bila pengguna ingin memperbaiki nama/tanggal lahir.

---

### Skenario 3 (AC-4 & Keamanan): Validasi Server Bukti Bayar & Anti-Bypass
1. Coba manipulasi pengiriman data dengan memanggil Server Action `createRegistration`:
   - Menggunakan path bukti fiktif (misal: `proofs/2026/fake-file.jpg`).
   - Menggunakan path di luar prefix (misal: `avatars/hacker.jpg`).
   - Tanpa token Turnstile valid.
2. **Ekspektasi:**
   - Server Action menolak dengan pesan jelas:
     - *"Foto bukti pembayaran tidak ditemukan di penyimpanan server..."*
     - *"Verifikasi keamanan Turnstile gagal atau kedaluwarsa..."*

---

### Skenario 4 (AC-13): Penutupan Pendaftaran
1. Di database Supabase, ubah baris `app_settings` menjadi `registration_open = false`:
   ```sql
   update public.app_settings set registration_open = false where id = true;
   ```
2. Buka `http://localhost:3000`.
3. **Ekspektasi:**
   - Halaman utama menampilkan banner informasi: *"Pendaftaran Saat Ini Sedang Ditutup"*.
   - Wizard formulir pendaftaran disembunyikan sama sekali.
   - Bila ada yang mencoba memanggil Server Action `requestUploadUrl` atau `createRegistration` secara langsung, server menolak dengan pesan penutupan resmi.
