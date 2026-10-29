-- supabase/seed.sql
-- Seed data konfigurasi awal SPMB SDIT Fajar

insert into public.app_settings (
  id,
  academic_year,
  registration_open,
  payment_amount,
  payment_bank,
  payment_account_no,
  payment_account_name
)
values (
  true,
  '2026/2027',
  true,
  null,
  null,
  null,
  null
)
on conflict (id) do update set
  academic_year = excluded.academic_year,
  registration_open = excluded.registration_open;
