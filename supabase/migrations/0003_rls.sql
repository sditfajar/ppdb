-- 0003_rls.sql
-- Konfigurasi Row Level Security (RLS) PPDB SDIT Fajar (PRD §11)
-- PRINSIP: Deny by default. TANPA policy untuk anon.

-- 1. Enable RLS pada semua tabel
alter table public.registrations enable row level security;
alter table public.admins enable row level security;
alter table public.app_settings enable row level security;

-- 2. Policies untuk public.registrations
-- Anon: TIDAK DIBERIKAN AKSES (Deny by default)
-- Authenticated non-admin: Ditolak oleh is_admin()
-- Admin: Hanya SELECT dan UPDATE (tanpa DELETE di MVP)

drop policy if exists "Admins can view all registrations" on public.registrations;
create policy "Admins can view all registrations"
  on public.registrations
  for select
  to authenticated
  using ( (select public.is_admin()) );

drop policy if exists "Admins can update registrations" on public.registrations;
create policy "Admins can update registrations"
  on public.registrations
  for update
  to authenticated
  using ( (select public.is_admin()) )
  with check ( (select public.is_admin()) );

-- 3. Policies untuk public.admins
-- Admin hanya dapat melihat baris dirinya sendiri

drop policy if exists "Admins can view own record" on public.admins;
create policy "Admins can view own record"
  on public.admins
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and (select public.is_admin())
  );

-- 4. Policies untuk public.app_settings
-- Anon: TIDAK ADA AKSES (dibaca server-side via server actions/components dengan kunci server)
-- Admin: SELECT dan UPDATE

drop policy if exists "Admins can view app settings" on public.app_settings;
create policy "Admins can view app settings"
  on public.app_settings
  for select
  to authenticated
  using ( (select public.is_admin()) );

drop policy if exists "Admins can update app settings" on public.app_settings;
create policy "Admins can update app settings"
  on public.app_settings
  for update
  to authenticated
  using ( (select public.is_admin()) )
  with check ( (select public.is_admin()) );
