import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sanitizePostgrestSearch } from "@/lib/sanitize";
import { generateRegistrationsCsv, RegistrationRow } from "@/lib/csv";

export const dynamic = "force-dynamic";

/**
 * Route Handler: GET /admin/export
 * 
 * Mengunduh rekap pendaftar dalam format CSV aman ber-BOM UTF-8.
 * Mematuhi filter aktif: status, wave, year, q.
 * Memerlukan otorisasi admin (requireAdmin) dan menerapkan RLS.
 */
export async function GET(request: NextRequest) {
  // 1. Otorisasi admin
  const { supabase } = await requireAdmin();

  // 2. Baca parameter query URL
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get("q") || "";
  const statusParam = searchParams.get("status") || "all";
  const waveParam = searchParams.get("wave") || "all";
  const yearParam = searchParams.get("year") || "all";

  // 3. Bangun kueri PostgREST
  let query = supabase.from("registrations").select("*");

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

  if (yearParam && yearParam !== "all") {
    query = query.eq("academic_year", yearParam);
  }

  const sanitizedQ = sanitizePostgrestSearch(rawQ);
  if (sanitizedQ) {
    query = query.or(
      `student_name.ilike.%${sanitizedQ}%,father_name.ilike.%${sanitizedQ}%,mother_name.ilike.%${sanitizedQ}%,reg_number.ilike.%${sanitizedQ}%,contact_phone.ilike.%${sanitizedQ}%`
    );
  }

  const { data: rows, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return new Response("Terjadi kesalahan saat mengekspor data pendaftar.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const registrations = (rows || []) as RegistrationRow[];

  // 4. Hasilkan string CSV aman
  const csvContent = generateRegistrationsCsv(registrations);

  // 5. Tentukan nama file: ppdb-{tahun}-{tanggal}.csv (PRD §8.5 & §14 AC-12)
  const todayJakarta = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date()); // format YYYY-MM-DD

  // Ambil tahun ajaran dari filter, dari baris pertama, atau fallback
  let yearSlug = "2026-2027";
  if (yearParam && yearParam !== "all") {
    yearSlug = yearParam.replace("/", "-");
  } else if (registrations.length > 0 && registrations[0]?.academic_year) {
    yearSlug = registrations[0].academic_year.replace("/", "-");
  }

  const filename = `ppdb-${yearSlug}-${todayJakarta}.csv`;

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
