import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sanitizePostgrestSearch } from "@/lib/sanitize";
import { generateRegistrationsCsv, RegistrationRow } from "@/lib/csv";
import { generateRegistrationsExcel } from "@/lib/excel";
import { generateRegistrationsPdf } from "@/lib/pdf";

export const dynamic = "force-dynamic";

/**
 * Route Handler: GET /admin/export
 * 
 * Mengunduh rekap pendaftar dalam format Excel (.xlsx), PDF (.pdf), atau CSV.
 * Mematuhi filter aktif: status, wave, year, q, dan parameter format.
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
  const formatParam = searchParams.get("format")?.toLowerCase() || "csv";

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

  // 4. Tentukan penamaan file: SPMB-{tahun}-{tanggal}.{ext}
  const todayJakarta = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date()); // format YYYY-MM-DD

  let yearSlug = "2026-2027";
  if (yearParam && yearParam !== "all") {
    yearSlug = yearParam.replace("/", "-");
  } else if (registrations.length > 0 && registrations[0]?.academic_year) {
    yearSlug = registrations[0].academic_year.replace("/", "-");
  }

  // 5. Ekspor berdasarkan format yang diminta
  if (formatParam === "xlsx" || formatParam === "excel") {
    const excelBuffer = await generateRegistrationsExcel(registrations);
    const filename = `SPMB-${yearSlug}-${todayJakarta}.xlsx`;

    return new Response(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  if (formatParam === "pdf") {
    const filterParts: string[] = [];
    if (statusParam !== "all") filterParts.push(`Status: ${statusParam}`);
    if (waveParam !== "all") filterParts.push(`Gelombang: ${waveParam}`);
    if (rawQ) filterParts.push(`Cari: "${rawQ}"`);

    const pdfBytes = await generateRegistrationsPdf(registrations, {
      academicYear: yearParam !== "all" ? yearParam : undefined,
      filterSummary: filterParts.join(", "),
    });
    const filename = `SPMB-${yearSlug}-${todayJakarta}.pdf`;

    return new Response(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  // Default: CSV aman ber-BOM UTF-8
  const csvContent = generateRegistrationsCsv(registrations);
  const filename = `SPMB-${yearSlug}-${todayJakarta}.csv`;

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
