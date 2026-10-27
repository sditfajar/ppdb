-- 0004_storage.sql
-- Konfigurasi Supabase Storage: Bucket privat 'payment-proofs' (PRD §10, §11)

-- 1. Buat bucket 'payment-proofs' (privat, batas 5MB, format gambar web)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880, -- 5 MB (5 * 1024 * 1024 bytes)
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Storage RLS Policy pada storage.objects
-- Role anon: TIDAK DIBERIKAN POLICY (upload hanya lewat signed URL yang dibuat server)
-- Authenticated admin: Hanya SELECT (untuk generate signed download URL)

create policy "Admins can view payment proofs"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (select public.is_admin())
  );
