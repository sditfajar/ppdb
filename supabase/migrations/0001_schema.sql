-- 0001_schema.sql
-- Skema database SPMB SDIT Fajar (PRD §11)

-- 1. Enum Types (Idempoten: dicek terlebih dahulu di katalog pg_type)
do $$
begin
  if not exists (
    select 1 from pg_type t 
    join pg_namespace n on n.oid = t.typnamespace 
    where t.typname = 'registration_status' and n.nspname = 'public'
  ) then
    create type public.registration_status as enum ('pending', 'verified', 'rejected');
  end if;

  if not exists (
    select 1 from pg_type t 
    join pg_namespace n on n.oid = t.typnamespace 
    where t.typname = 'education_level' and n.nspname = 'public'
  ) then
    create type public.education_level as enum ('sd_mi', 'smp_mts', 'sma_smk_ma', 'd1_d3', 's1_s3');
  end if;
end
$$;

-- 2. Tabel Registrations
create table if not exists public.registrations (
  id                  uuid primary key default gen_random_uuid(),
  reg_number          text not null unique,
  academic_year       text not null,                       -- contoh: '2026/2027'
  wave                smallint not null check (wave in (1, 2)),
  status              public.registration_status not null default 'pending',

  -- Siswa
  student_name        text not null,
  student_nickname    text not null,
  birth_place         text not null,
  birth_date          date not null,
  gender              text not null check (gender in ('L', 'P')),
  siblings_count      smallint not null check (siblings_count between 0 and 20),
  birth_order         smallint not null check (birth_order between 1 and 21),
  student_address     text not null,
  contact_phone       text not null,                       -- format: '62812...' atau '0812...'
  hobby               text not null,
  achievements        text not null default '-',
  medical_conditions  text not null default '-',

  -- Orang tua
  father_name         text not null,
  mother_name         text not null,
  father_education    public.education_level not null,
  mother_education    public.education_level not null,
  father_job          text not null,
  mother_job          text not null,
  parent_address      text not null,

  -- Pembayaran
  payment_proof_path  text not null,                       -- path di bucket privat payment-proofs
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

  -- Constraint: status rejected wajib memiliki alasan penolakan minimal 5 karakter
  constraint rejected_requires_reason
    check (status <> 'rejected' or coalesce(length(btrim(rejection_reason)), 0) >= 5)
);

-- Indeks unik parsial: satu pendaftaran aktif per siswa (nama + tanggal lahir) per tahun ajaran
-- Mengizinkan siswa yang berstatus 'rejected' untuk mendaftar ulang
create unique index if not exists registrations_active_unique
  on public.registrations (academic_year, lower(btrim(student_name)), birth_date)
  where status <> 'rejected';

-- Indeks performa query filter admin
create index if not exists registrations_status_created_idx
  on public.registrations (status, created_at desc);

create index if not exists registrations_wave_idx
  on public.registrations (academic_year, wave);

-- 3. Tabel Admins (Role Tunggal)
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- 4. Tabel App Settings (Singleton)
create table if not exists public.app_settings (
  id                  boolean primary key default true check (id),
  academic_year       text not null default '2026/2027',
  registration_open   boolean not null default true,
  payment_amount      integer,
  payment_bank        text,
  payment_account_no  text,
  payment_account_name text,
  updated_at          timestamptz not null default now()
);
