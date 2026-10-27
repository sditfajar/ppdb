# Panduan Pendaftaran Admin PPDB Online SDIT Fajar

Sesuai aturan keamanan di [PRD.md §10](file:///C:/Users/muhaz/Downloads/ppdb/PRD.md), sistem menggunakan **SATU role admin** untuk verifikasi pendaftaran. Pendaftaran publik pada Supabase Auth dimatikan (`signups disabled`), dan akun admin didaftarkan secara manual oleh pengelola sistem.

---

## Langkah 1: Buat Akun Pengguna di Supabase Auth

Ada dua cara untuk membuat akun pengguna admin di Supabase Auth:

### Opsi A: Lewat Supabase Dashboard (Direkomendasikan)
1. Buka dashboard proyek Supabase Anda.
2. Navigasi ke menu **Authentication** -> **Users**.
3. Klik tombol **Add User** -> **Create User**.
4. Masukkan email admin (contoh: `admin.ppdb@sditfajar.sch.id`) dan password yang kuat.
5. Centang **Auto Confirm User?** agar user langsung aktif tanpa perlu konfirmasi email.
6. Salin **User UID** (UUID) dari tabel pengguna.

### Opsi B: Lewat SQL Editor di Dashboard Supabase
```sql
-- Buat user baru langsung di auth.users (ganti email dan password_hash yang sesuai)
-- Paling praktis menggunakan Dashboard Opsi A di atas.
```

---

## Langkah 2: Berikan Role Admin (Insert ke `public.admins`)

Jalankan perintah SQL berikut di **Supabase Dashboard -> SQL Editor**:

```sql
-- Ganti '<USER_UUID_DARI_AUTH_USERS>' dengan UUID asli dari langkah 1
insert into public.admins (user_id)
values ('<USER_UUID_DARI_AUTH_USERS>')
on conflict (user_id) do nothing;
```

### Verifikasi Hak Akses Admin
Untuk memastikan role admin sudah aktif:

```sql
select 
  u.id as user_id, 
  u.email, 
  a.user_id is not null as is_admin
from auth.users u
left join public.admins a on a.user_id = u.id
where u.id = '<USER_UUID_DARI_AUTH_USERS>';
```

> [!CAUTION]
> **JANGAN PERNAH** meng-hardcode UID atau credential admin di dalam berkas kode sumber atau repositori Git. Kunci keamanan sistem bergantung pada pemisahan antara `auth.users` dan tabel otorisasi `public.admins`.
