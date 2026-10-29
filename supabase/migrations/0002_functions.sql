-- 0002_functions.sql
-- Fungsi utilitas, trigger updated_at, dan generator nomor registrasi aman concurrent

-- 1. Helper function is_admin()
-- Security definer, stable, search_path aman (set search_path = '')
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins
    where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 2. Trigger updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
  before update on public.registrations
  for each row
  execute function public.set_updated_at();

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row
  execute function public.set_updated_at();

-- 3. Generator Nomor Registrasi Concurrency-Safe
-- Format: SPMB-{tahun_awal}-{urut 4 digit} (contoh: SPMB-2026-0001)
-- Menggunakan pg_advisory_xact_lock berbasis hash academic_year untuk mencegah race condition
create or replace function public.generate_registration_number()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_start_year text;
  v_lock_key bigint;
  v_next_seq integer;
begin
  -- Jika sudah diisi secara eksplisit, lewati generasi otomatis
  if new.reg_number is not null and btrim(new.reg_number) <> '' then
    return new;
  end if;

  -- Ambil tahun awal dari academic_year (misal: '2026/2027' -> '2026')
  v_start_year := split_part(new.academic_year, '/', 1);
  if v_start_year is null or btrim(v_start_year) = '' then
    v_start_year := to_char(now() at time zone 'Asia/Jakarta', 'YYYY');
  end if;

  -- Kunci advisory tingkat transaksi berbasis hash academic_year
  -- Mengunci secara eksklusif dalam transaksi saat ini hingga commit / rollback
  v_lock_key := ('x' || substr(md5('SPMB_reg_lock_' || new.academic_year), 1, 15))::bit(64)::bigint;
  perform pg_advisory_xact_lock(v_lock_key);

  -- Cari sequence tertinggi untuk tahun ajaran yang bersangkutan
  select coalesce(
    max(
      substring(reg_number from 'SPMB-[0-9]+-([0-9]{4})$')::integer
    ), 0
  ) + 1
  into v_next_seq
  from public.registrations
  where academic_year = new.academic_year;

  -- Format nomor registrasi: SPMB-{tahun_awal}-{4 digit urut}
  new.reg_number := 'SPMB-' || v_start_year || '-' || lpad(v_next_seq::text, 4, '0');

  return new;
end;
$$;

drop trigger if exists registrations_generate_reg_number on public.registrations;
create trigger registrations_generate_reg_number
  before insert on public.registrations
  for each row
  when (new.reg_number is null or new.reg_number = '')
  execute function public.generate_registration_number();
