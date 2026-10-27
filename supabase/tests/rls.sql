-- supabase/tests/rls.sql
-- Pengujian Row Level Security (RLS) & Access Control PPDB Online SDIT Fajar (pgTAP)
-- Dapat dijalankan via `supabase test db` saat Docker/Supabase lokal aktif

begin;
select plan(10);

-- ============================================================
-- 1. Pengujian Akses Role ANON (Harus Ditolak / Kosong)
-- ============================================================

set local role anon;

-- anon tidak bisa membaca tabel registrations (0 rows returned)
select is_empty(
  'select * from public.registrations',
  'anon tidak boleh dapat membaca data registrations'
);

-- anon tidak bisa melakukan insert ke registrations
select throws_ok(
  $$insert into public.registrations (
    student_name, student_nickname, birth_place, birth_date, gender,
    siblings_count, birth_order, student_address, contact_phone, hobby,
    father_name, mother_name, father_education, mother_education,
    father_job, mother_job, parent_address, payment_proof_path,
    payment_proof_mime, payment_proof_size, consented_at, wave, academic_year
  ) values (
    'Siswa Anon', 'Anon', 'Jakarta', '2019-01-01', 'L',
    0, 1, 'Jl. Anon', '081234567890', 'Membaca',
    'Ayah Anon', 'Ibu Anon', 's1_s3', 's1_s3',
    'Swasta', 'Swasta', 'Jl. Anon', 'proof.jpg',
    'image/jpeg', 1024, now(), 1, '2026/2027'
  )$$,
  '42501',
  null,
  'anon dilarang melakukan insert ke registrations'
);

-- anon tidak bisa membaca tabel admins
select is_empty(
  'select * from public.admins',
  'anon tidak boleh dapat membaca tabel admins'
);

-- anon tidak bisa membaca tabel app_settings
select is_empty(
  'select * from public.app_settings',
  'anon tidak boleh dapat membaca tabel app_settings'
);

-- anon tidak bisa membaca objek storage payment-proofs
select is_empty(
  $$select * from storage.objects where bucket_id = 'payment-proofs'$$,
  'anon tidak boleh dapat membaca atau me-list storage payment-proofs'
);

-- ============================================================
-- 2. Pengujian Akses Role AUTHENTICATED NON-ADMIN
-- ============================================================

-- Simulasikan user authenticated biasa (bukan admin)
set local role authenticated;
set local "request.jwt.claim.sub" to '00000000-0000-0000-0000-000000000001';

-- Non-admin tidak boleh melihat data registrations
select is_empty(
  'select * from public.registrations',
  'authenticated non-admin tidak boleh melihat data registrations'
);

-- Non-admin tidak boleh membaca tabel app_settings
select is_empty(
  'select * from public.app_settings',
  'authenticated non-admin tidak boleh membaca app_settings'
);

-- ============================================================
-- 3. Pengujian Akses Role ADMIN
-- ============================================================

-- Reset ke postgres role untuk mendaftarkan admin uji
reset role;
insert into auth.users (id, email)
values ('a0000000-0000-0000-0000-000000000001', 'admin@sditfajar.sch.id')
on conflict (id) do nothing;

insert into public.admins (user_id)
values ('a0000000-0000-0000-0000-000000000001')
on conflict (user_id) do nothing;

-- Masukkan 1 data pendaftaran uji (via service role / superuser)
insert into public.registrations (
  id, reg_number, student_name, student_nickname, birth_place, birth_date, gender,
  siblings_count, birth_order, student_address, contact_phone, hobby,
  father_name, mother_name, father_education, mother_education,
  father_job, mother_job, parent_address, payment_proof_path,
  payment_proof_mime, payment_proof_size, consented_at, wave, academic_year
) values (
  'b0000000-0000-0000-0000-000000000001', 'PPDB-2026-9999', 'Uji Admin', 'Uji', 'Jakarta', '2019-05-10', 'L',
  0, 1, 'Jl. Uji', '081299999999', 'Robotik',
  'Ayah Uji', 'Ibu Uji', 's1_s3', 's1_s3',
  'Insinyur', 'Guru', 'Jl. Uji', 'proof.jpg',
  'image/jpeg', 2048, now(), 1, '2026/2027'
) on conflict (id) do nothing;

-- Beralih sebagai role authenticated admin
set local role authenticated;
set local "request.jwt.claim.sub" to 'a0000000-0000-0000-0000-000000000001';

-- Admin dapat melihat data registrations
select results_eq(
  'select count(*)::integer from public.registrations where id = ''b0000000-0000-0000-0000-000000000001''',
  ARRAY[1],
  'admin dapat membaca data registrations'
);

-- Admin dapat membaca baris dirinya sendiri di public.admins
select results_eq(
  'select count(*)::integer from public.admins where user_id = ''a0000000-0000-0000-0000-000000000001''',
  ARRAY[1],
  'admin dapat melihat baris dirinya sendiri di public.admins'
);

-- Admin dapat memperbarui status pendaftaran
select lives_ok(
  $$update public.registrations set admin_note = 'Catatan Admin' where id = 'b0000000-0000-0000-0000-000000000001'$$,
  'admin diizinkan melakukan update pada registrations'
);

select * from finish();
rollback;
