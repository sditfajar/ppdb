import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import { sanitizePostgrestSearch } from "@/lib/sanitize";
import {
  AdminStatsCards,
  AdminStats,
  AdminFilterBar,
  RegistrationTable,
  RegistrationListItem,
} from "@/components/admin";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminDashboardPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const rawQ = typeof searchParams.q === "string" ? searchParams.q : "";
  const statusParam =
    typeof searchParams.status === "string" ? searchParams.status : "all";
  const waveParam =
    typeof searchParams.wave === "string" ? searchParams.wave : "all";
  const pageParam =
    typeof searchParams.page === "string"
      ? parseInt(searchParams.page, 10)
      : 1;
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const pageSize = 20;

  const { supabase } = await requireAdmin();

  // 1. Ambil data statistik dengan kueri count paralel
  const [
    totalRes,
    pendingRes,
    verifiedRes,
    rejectedRes,
    wave1Res,
    wave2Res,
  ] = await Promise.all([
    supabase.from("registrations").select("*", { count: "exact", head: true }),
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "verified"),
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected"),
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("wave", 1),
    supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("wave", 2),
  ]);

  const stats: AdminStats = {
    total: totalRes.count || 0,
    pending: pendingRes.count || 0,
    verified: verifiedRes.count || 0,
    rejected: rejectedRes.count || 0,
    wave1: wave1Res.count || 0,
    wave2: wave2Res.count || 0,
  };

  // 2. Kueri data pendaftar terfilter
  let query = supabase.from("registrations").select(
    "id, reg_number, student_name, student_nickname, gender, wave, contact_phone, status, created_at",
    { count: "exact" }
  );

  if (
    statusParam === "pending" ||
    statusParam === "verified" ||
    statusParam === "rejected"
  ) {
    query = query.eq("status", statusParam);
  }

  if (waveParam === "1" || waveParam === "2") {
    query = query.eq("wave", parseInt(waveParam, 10));
  }

  const sanitizedQ = sanitizePostgrestSearch(rawQ);
  if (sanitizedQ) {
    query = query.or(
      `student_name.ilike.%${sanitizedQ}%,father_name.ilike.%${sanitizedQ}%,mother_name.ilike.%${sanitizedQ}%,reg_number.ilike.%${sanitizedQ}%,contact_phone.ilike.%${sanitizedQ}%`
    );
  }

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: rows, count: filteredCount, error: fetchError } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const items: RegistrationListItem[] = (rows || []).map((r) => ({
    id: r.id,
    reg_number: r.reg_number,
    student_name: r.student_name,
    student_nickname: r.student_nickname,
    gender: r.gender as "L" | "P",
    wave: r.wave,
    contact_phone: r.contact_phone,
    status: r.status,
    created_at: r.created_at,
  }));

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full animate-enter">
      {/* Judul & Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-balance">
            Dashboard Penerimaan Siswa Baru
          </h1>
          <p className="text-xs sm:text-sm text-muted text-pretty">
            Kelola, pantau, dan verifikasi berkas pendaftaran calon siswa SDIT Fajar.
          </p>
        </div>
      </div>

      {/* Kartu Statistik */}
      <AdminStatsCards stats={stats} />

      {/* Baris Filter & Pencarian */}
      <AdminFilterBar />

      {/* Error State */}
      {fetchError && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-card bg-rose-500/10 text-rose-800 dark:text-rose-200 text-sm border border-rose-500/20"
        >
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>
            Terjadi kendala saat memuat data pendaftar. Silakan segarkan peramban Anda.
          </span>
        </div>
      )}

      {/* Tabel & Daftar Pendaftar */}
      {!fetchError && (
        <RegistrationTable
          items={items}
          totalCount={filteredCount || 0}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
