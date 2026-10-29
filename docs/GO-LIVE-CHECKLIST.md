# Checklist Rilis Produksi (Go-Live Checklist)
## SPMB SDIT Fajar

Dokumen ini berisi daftar verifikasi pra-rilis produksi yang wajib dipenuhi dan ditandatangani oleh Tim Pengembang, Tim IT, dan Ketua Panitia SPMB sebelum sistem dibuka secara resmi kepada calon pendaftar.

---

## 1. Tabel Checklist Utama

| # | Item Verifikasi | Kategori | Status | PIC / Verifikator | Tanggal | Catatan & Panduan Eksekusi |
|---|---|---|:---:|---|---|---|
| **1** | **Environment Variables Production Terisi**<br>Semua variabel produksi terpasang di Vercel; pastikan `SUPABASE_SECRET_KEY` berstatus server-only dan **TIDAK ADA** di prefix `NEXT_PUBLIC_*`. | Keamanan | [ ] | Tim IT / DevOps | | Periksa tab *Settings -> Environment Variables* di dashboard Vercel. Pastikan tidak ada kebocoran kunci secret ke publik. |
| **2** | **Migrasi Basis Data Berjalan Penuh**<br>Seluruh migration SQL dijalankan di database Supabase produksi; RLS aktif pada tabel `registrations`, `admins`, dan `app_settings` tanpa policy untuk peran `anon`. | Basis Data | [ ] | DBA / Tim IT | | Jalankan skrip migrasi `supabase/migrations/*.sql`. Pastikan RLS aktif dan anon ditolak untuk query `SELECT/INSERT/UPDATE` langsung. |
| **3** | **Sign-up Supabase Auth Dinonaktifkan & Akun Admin Dibuat**<br>Fitur pendaftaran akun umum (Self Sign-up) di Supabase Auth dinonaktifkan. Minimal 2 akun admin (utama + cadangan) dibuat dan dicatat di tabel `public.admins`. | Autentikasi | [ ] | Tim IT | | Matikan *Enable email signups* di Supabase Dashboard -> Auth -> Providers -> Email. Insert UUID admin ke tabel `admins`. |
| **4** | **Bucket Storage `payment-proofs` Privat & Terkonfigurasi**<br>Bucket dibuat dengan status **Private**; batas ukuran unggahan maksimal 5 MB; MIME type diizinkan hanya `image/jpeg`, `image/png`, dan `image/webp`. | Penyimpanan | [ ] | Tim IT | | Cek konfigurasi bucket di Supabase Storage. Pastikan tidak ada public access policy. |
| **5** | **Konfigurasi Awal `app_settings` Terisi**<br>Tahun ajaran aktif, status buka/tutup pendaftaran, nominal biaya formulir, serta informasi rekening bank tujuan pembayaran telah dikonfigurasi sesuai ketetapan sekolah. | Konfigurasi | [ ] | Panitia SPMB | | Buka `/admin/pengaturan` dan simpan konfigurasi pendaftaran resmi. |
| **6** | **Cloudflare Turnstile Menggunakan Kunci Produksi**<br>Mengganti dummy key Turnstile dengan *Site Key* dan *Secret Key* produksi resmi dari domain sekolah. | Anti-Spam | [ ] | Tim IT | | Daftarkan domain di dashboard Cloudflare Turnstile; perbarui variabel di Vercel. |
| **7** | **Domain Kustom + Sertifikat SSL/HTTPS Aktif**<br>Domain resmi (mis. `SPMB.sditfajar.sch.id`) terhubung ke Vercel dengan SSL aktif; *Auth Site URL* di Supabase disesuaikan dengan domain produksi. | Jaringan | [ ] | Tim IT | | Konfigurasi DNS CNAME di Vercel dan perbarui *Site URL* di Supabase Authentication URL Configuration. |
| **8** | **Smoke Test Produksi dari Ponsel Nyata**<br>Uji coba alur menyeluruh (end-to-end) dari smartphone melalui jaringan seluler (4G/5G): Mengisi formulir -> Unggah bukti transfer -> Notifikasi sukses -> Admin login -> Verifikasi bukti bayar -> Ekspor CSV. | Pengujian | [ ] | Panitia & QA | | Gunakan data uji bertanda "[TEST]". Pastikan form responsif di layar kecil dan foto terunggah lancar. |
| **9** | **Audit Keamanan `docs/SECURITY-CHECKLIST.md` Lulus 100%**<br>Seluruh 9 parameter uji keamanan terbukti lulus tanpa temuan celah kritis. | Keamanan | [ ] | Security Reviewer | | Verifikasi dokumen `docs/SECURITY-CHECKLIST.md`. |
| **10** | **Kesiapan Infrastruktur & Kapasitas Layanan**<br>Pertimbangkan upgrade paket berbayar (Supabase Pro agar proyek tidak ter-pause otomatis dan memiliki backup harian; ketentuan batas fungsi Vercel) menjelang pembukaan gelombang. | Infrastruktur | [ ] | Manajemen Sekolah | | Pastikan basis data tidak mengalami auto-pause selama periode pendaftaran berjalan. |
| **11** | **Sosialisasi SOP & Panduan Operasional Panitia**<br>Panitia SPMB telah membaca dan memahami `docs/RUNBOOK.md`, memahami tata cara verifikasi, dan menyepakati jadwal rutin ekspor data CSV sebagai cadangan. | Operasional | [ ] | Ketua Panitia | | Briefing teknis singkat kepada panitia yang bertugas. |
| **12** | **Pembersihan Data Uji Sebelum Buka Resmi**<br>Menghapus seluruh record uji pendaftaran dan berkas bukti bayar uji coba dari basis data dan storage produksi sebelum pendaftaran dibuka untuk publik. | Integritas | [ ] | DBA / Tim IT | | Hapus data uji agar nomor registrasi dimulai secara rapi dari awal. |

---

## 2. Lembar Pengesahan Rilis

Setelah seluruh butir checklist di atas berstatus **[x] Lulus**:

- **Perwakilan Pengembang / IT:**  
  Nama: _______________________  
  Tanda Tangan: ________________  
  Tanggal: _____________________  

- **Ketua Panitia SPMB SDIT Fajar:**  
  Nama: _______________________  
  Tanda Tangan: ________________  
  Tanggal: _____________________  
