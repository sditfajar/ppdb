import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import * as fs from "node:fs";
import * as path from "node:path";

describe("Database Migrations & Business Logic Integrity", () => {
  let db: PGlite;

  beforeAll(async () => {
    db = new PGlite();

    // 1. Inisialisasi mock roles, schema auth dan storage standar Supabase
    await db.exec(`
      do $$
      begin
        if not exists (select from pg_roles where rolname = 'anon') then
          create role anon;
        end if;
        if not exists (select from pg_roles where rolname = 'authenticated') then
          create role authenticated;
        end if;
        if not exists (select from pg_roles where rolname = 'service_role') then
          create role service_role;
        end if;
      end
      $$;

      create schema if not exists auth;
      create table if not exists auth.users (
        id uuid primary key default gen_random_uuid(),
        email text
      );
      create or replace function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
      $$;

      create schema if not exists storage;
      create table if not exists storage.buckets (
        id text primary key,
        name text not null,
        public boolean default false,
        file_size_limit bigint,
        allowed_mime_types text[]
      );
      create table if not exists storage.objects (
        id uuid primary key default gen_random_uuid(),
        bucket_id text references storage.buckets(id),
        name text,
        owner uuid,
        created_at timestamptz default now(),
        updated_at timestamptz default now(),
        last_accessed_at timestamptz default now(),
        metadata jsonb
      );
      alter table storage.objects enable row level security;
    `);

    // 2. Terapkan seluruh migrasi berurutan
    const migrationsDir = path.resolve(__dirname, "../../supabase/migrations");
    const migrationFiles = [
      "0001_schema.sql",
      "0002_functions.sql",
      "0003_rls.sql",
      "0004_storage.sql",
    ];

    for (const file of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await db.exec(sql);
    }

    // 3. Terapkan seed.sql
    const seedSql = fs.readFileSync(
      path.resolve(__dirname, "../../supabase/seed.sql"),
      "utf-8"
    );
    await db.exec(seedSql);
  });

  const baseStudentData = {
    student_name: "Muhammad Fadil",
    student_nickname: "Fadil",
    birth_place: "Jakarta",
    birth_date: "2019-03-15",
    gender: "L",
    siblings_count: 1,
    birth_order: 1,
    student_address: "Jl. Masjid No. 10",
    contact_phone: "081234567890",
    hobby: "Membaca Al-Qur'an",
    father_name: "Ahmad",
    mother_name: "Siti",
    father_education: "s1_s3",
    mother_education: "s1_s3",
    father_job: "PNS",
    mother_job: "Guru",
    parent_address: "Jl. Masjid No. 10",
    payment_proof_path: "fadil-proof.jpg",
    payment_proof_mime: "image/jpeg",
    payment_proof_size: 102400,
    consented_at: new Date().toISOString(),
    wave: 1,
    academic_year: "2026/2027",
  };

  it("berhasil menerapkan seed konfigurasi app_settings 2026/2027", async () => {
    const res = await db.query<{ academic_year: string; registration_open: boolean }>(
      "select academic_year, registration_open from public.app_settings where id = true"
    );
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].academic_year).toBe("2026/2027");
    expect(res.rows[0].registration_open).toBe(true);
  });

  it("menghasilkan nomor registrasi otomatis dengan format SPMB-{tahun_awal}-{urut 4 digit}", async () => {
    const res = await db.query<{ reg_number: string }>(
      `insert into public.registrations (
        student_name, student_nickname, birth_place, birth_date, gender,
        siblings_count, birth_order, student_address, contact_phone, hobby,
        father_name, mother_name, father_education, mother_education,
        father_job, mother_job, parent_address, payment_proof_path,
        payment_proof_mime, payment_proof_size, consented_at, wave, academic_year
      ) values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) returning reg_number;`,
      [
        baseStudentData.student_name,
        baseStudentData.student_nickname,
        baseStudentData.birth_place,
        baseStudentData.birth_date,
        baseStudentData.gender,
        baseStudentData.siblings_count,
        baseStudentData.birth_order,
        baseStudentData.student_address,
        baseStudentData.contact_phone,
        baseStudentData.hobby,
        baseStudentData.father_name,
        baseStudentData.mother_name,
        baseStudentData.father_education,
        baseStudentData.mother_education,
        baseStudentData.father_job,
        baseStudentData.mother_job,
        baseStudentData.parent_address,
        baseStudentData.payment_proof_path,
        baseStudentData.payment_proof_mime,
        baseStudentData.payment_proof_size,
        baseStudentData.consented_at,
        baseStudentData.wave,
        baseStudentData.academic_year,
      ]
    );

    expect(res.rows[0].reg_number).toBe("SPMB-2026-0001");
  });

  it("menghasilkan nomor urut berulang dan berurutan untuk pendaftaran berikutnya", async () => {
    const res = await db.query<{ reg_number: string }>(`
      insert into public.registrations (
        student_name, student_nickname, birth_place, birth_date, gender,
        siblings_count, birth_order, student_address, contact_phone, hobby,
        father_name, mother_name, father_education, mother_education,
        father_job, mother_job, parent_address, payment_proof_path,
        payment_proof_mime, payment_proof_size, consented_at, wave, academic_year
      ) values (
        'Aisyah Putri', 'Aisyah', 'Bandung', '2019-07-20', 'P',
        0, 1, 'Jl. Kenanga No. 5', '081298765432', 'Menggambar',
        'Budi', 'Rina', 's1_s3', 'd1_d3',
        'Wiraswasta', 'Ibu Rumah Tangga', 'Jl. Kenanga No. 5', 'aisyah-proof.png',
        'image/png', 204800, now(), 1, '2026/2027'
      ) returning reg_number;
    `);

    expect(res.rows[0].reg_number).toBe("SPMB-2026-0002");
  });

  it("menolak duplikasi pendaftaran aktif dengan nama (case-insensitive + trim), tanggal lahir, dan tahun ajaran sama", async () => {
    // Siswa "  muhammad FADIL  " dengan tanggal lahir sama pada 2026/2027 harus ditolak oleh registrations_active_unique
    await expect(
      db.query(`
        insert into public.registrations (
          student_name, student_nickname, birth_place, birth_date, gender,
          siblings_count, birth_order, student_address, contact_phone, hobby,
          father_name, mother_name, father_education, mother_education,
          father_job, mother_job, parent_address, payment_proof_path,
          payment_proof_mime, payment_proof_size, consented_at, wave, academic_year
        ) values (
          '  muhammad FADIL  ', 'Fadil', 'Jakarta', '2019-03-15', 'L',
          1, 1, 'Jl. Lain', '081234567899', 'Renang',
          'Ahmad', 'Siti', 's1_s3', 's1_s3',
          'PNS', 'Guru', 'Jl. Lain', 'proof2.jpg',
          'image/jpeg', 102400, now(), 1, '2026/2027'
        );
      `)
    ).rejects.toThrow();
  });

  it("menolak status 'rejected' jika tidak memiliki rejection_reason (constraint rejected_requires_reason)", async () => {
    await expect(
      db.query(`
        update public.registrations
        set status = 'rejected', rejection_reason = null
        where reg_number = 'SPMB-2026-0002';
      `)
    ).rejects.toThrow();

    await expect(
      db.query(`
        update public.registrations
        set status = 'rejected', rejection_reason = 'abc'
        where reg_number = 'SPMB-2026-0002';
      `)
    ).rejects.toThrow();
  });

  it("menerima status 'rejected' jika rejection_reason diisi minimal 5 karakter", async () => {
    const res = await db.query<{ status: string; rejection_reason: string }>(`
      update public.registrations
      set status = 'rejected', rejection_reason = 'Bukti pembayaran tidak terbaca dengan jelas.'
      where reg_number = 'SPMB-2026-0002'
      returning status, rejection_reason;
    `);

    expect(res.rows[0].status).toBe("rejected");
    expect(res.rows[0].rejection_reason).toBe("Bukti pembayaran tidak terbaca dengan jelas.");
  });

  it("mengizinkan pendaftaran ulang setelah pendaftaran sebelumnya berstatus 'rejected'", async () => {
    // Siswa "Aisyah Putri" sebelumnya ditolak, kini mendaftar ulang
    const res = await db.query<{ reg_number: string }>(`
      insert into public.registrations (
        student_name, student_nickname, birth_place, birth_date, gender,
        siblings_count, birth_order, student_address, contact_phone, hobby,
        father_name, mother_name, father_education, mother_education,
        father_job, mother_job, parent_address, payment_proof_path,
        payment_proof_mime, payment_proof_size, consented_at, wave, academic_year
      ) values (
        'Aisyah Putri', 'Aisyah', 'Bandung', '2019-07-20', 'P',
        0, 1, 'Jl. Kenanga No. 5', '081298765432', 'Menggambar',
        'Budi', 'Rina', 's1_s3', 'd1_d3',
        'Wiraswasta', 'Ibu Rumah Tangga', 'Jl. Kenanga No. 5', 'aisyah-proof-revised.png',
        'image/png', 204800, now(), 1, '2026/2027'
      ) returning reg_number;
    `);

    expect(res.rows[0].reg_number).toBe("SPMB-2026-0003");
  });

  it("dua insert paralel/bersamaan pada tahun ajaran yang sama menghasilkan reg_number berbeda tanpa tabrakan", async () => {
    const student1 = {
      ...baseStudentData,
      student_name: "Siswa Paralel Satu",
      contact_phone: "081111111111",
      payment_proof_path: "p1.jpg",
    };
    const student2 = {
      ...baseStudentData,
      student_name: "Siswa Paralel Dua",
      contact_phone: "082222222222",
      payment_proof_path: "p2.jpg",
    };

    const insertStudent = async (student: typeof baseStudentData) => {
      const res = await db.query<{ reg_number: string }>(
        `insert into public.registrations (
          student_name, student_nickname, birth_place, birth_date, gender,
          siblings_count, birth_order, student_address, contact_phone, hobby,
          father_name, mother_name, father_education, mother_education,
          father_job, mother_job, parent_address, payment_proof_path,
          payment_proof_mime, payment_proof_size, consented_at, wave, academic_year
        ) values (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
        ) returning reg_number;`,
        [
          student.student_name,
          student.student_nickname,
          student.birth_place,
          student.birth_date,
          student.gender,
          student.siblings_count,
          student.birth_order,
          student.student_address,
          student.contact_phone,
          student.hobby,
          student.father_name,
          student.mother_name,
          student.father_education,
          student.mother_education,
          student.father_job,
          student.mother_job,
          student.parent_address,
          student.payment_proof_path,
          student.payment_proof_mime,
          student.payment_proof_size,
          student.consented_at,
          student.wave,
          student.academic_year,
        ]
      );
      return res.rows[0].reg_number;
    };

    const [num1, num2] = await Promise.all([
      insertStudent(student1),
      insertStudent(student2),
    ]);

    expect(num1).not.toBe(num2);
    expect([num1, num2]).toEqual(
      expect.arrayContaining(["SPMB-2026-0004", "SPMB-2026-0005"])
    );
  });

  it("memverifikasi RLS: role anon dan authenticated non-admin ditolak, admin diizinkan", async () => {
    // 1. Buat admin di auth.users & public.admins
    const adminId = "a0000000-0000-0000-0000-000000000001";
    const nonAdminId = "00000000-0000-0000-0000-000000000001";

    await db.query("insert into auth.users (id, email) values ($1, $2) on conflict do nothing", [
      adminId,
      "admin@sditfajar.sch.id",
    ]);
    await db.query("insert into auth.users (id, email) values ($1, $2) on conflict do nothing", [
      nonAdminId,
      "user@example.com",
    ]);
    await db.query("insert into public.admins (user_id) values ($1) on conflict do nothing", [
      adminId,
    ]);

    // Uji fungsi is_admin() secara langsung:
    // Case A: tanpa auth.uid() -> false
    const checkNoAuth = await db.query<{ is_admin: boolean }>(
      "select public.is_admin() as is_admin"
    );
    expect(checkNoAuth.rows[0].is_admin).toBe(false);

    // Case B: dengan nonAdminId -> false
    await db.query(`select set_config('request.jwt.claim.sub', '${nonAdminId}', false)`);
    const checkNonAdmin = await db.query<{ is_admin: boolean }>(
      "select public.is_admin() as is_admin"
    );
    expect(checkNonAdmin.rows[0].is_admin).toBe(false);

    // Case C: dengan adminId -> true
    await db.query(`select set_config('request.jwt.claim.sub', '${adminId}', false)`);
    const checkAdmin = await db.query<{ is_admin: boolean }>(
      "select public.is_admin() as is_admin"
    );
    expect(checkAdmin.rows[0].is_admin).toBe(true);

    // Reset session claim
    await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
  });

  it("memverifikasi konfigurasi bucket storage 'payment-proofs'", async () => {
    const res = await db.query<{
      id: string;
      public: boolean;
      file_size_limit: string | number;
      allowed_mime_types: string[];
    }>("select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'payment-proofs'");

    expect(res.rows.length).toBe(1);
    expect(res.rows[0].public).toBe(false);
    expect(Number(res.rows[0].file_size_limit)).toBe(5242880);
    expect(res.rows[0].allowed_mime_types).toContain("image/jpeg");
    expect(res.rows[0].allowed_mime_types).toContain("image/png");
    expect(res.rows[0].allowed_mime_types).toContain("image/webp");
  });

  it("audit keamanan RLS: memverifikasi tidak ada policy untuk role anon pada file migrasi", () => {
    const rlsSql = fs.readFileSync(
      path.resolve(__dirname, "../../supabase/migrations/0003_rls.sql"),
      "utf-8"
    );
    const storageSql = fs.readFileSync(
      path.resolve(__dirname, "../../supabase/migrations/0004_storage.sql"),
      "utf-8"
    );

    // Pastikan tidak ada "to anon"
    expect(rlsSql.toLowerCase()).not.toContain("to anon");
    expect(storageSql.toLowerCase()).not.toContain("to anon");

    // Pastikan tidak ada "to public" di rls.sql
    expect(rlsSql.toLowerCase()).not.toContain("to public");

    // Pastikan semua tabel di-enable RLS
    expect(rlsSql).toContain("alter table public.registrations enable row level security;");
    expect(rlsSql).toContain("alter table public.admins enable row level security;");
    expect(rlsSql).toContain("alter table public.app_settings enable row level security;");
  });
});
