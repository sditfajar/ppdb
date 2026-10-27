import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerEnv } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * Route Handler: GET /api/cron/cleanup-orphans
 * 
 * Cron Job harian untuk membersihkan berkas bukti bayar yatim (orphaned files):
 * 1. Otorisasi ketat: hanya menerima header Authorization "Bearer ${CRON_SECRET}".
 * 2. Memindai bucket privat 'payment-proofs' pada folder 'proofs/'.
 * 3. Menyeleksi berkas yang berumur > 24 jam.
 * 4. Memastikan berkas TIDAK dirujuk oleh registrations.payment_proof_path.
 * 5. Membatasi jumlah penghapusan maksimal 50 berkas per eksekusi.
 * 6. Mencatat metrik eksekusi ke console log tanpa data pribadi (PII-free).
 */
export async function GET(request: NextRequest) {
  // 1. Verifikasi Authorization Bearer Token
  const authHeader = request.headers.get("authorization");
  let serverEnv;
  try {
    serverEnv = getServerEnv();
  } catch (err) {
    console.error("[CRON_CLEANUP] Konfigurasi server tidak valid:", err);
    return new Response(JSON.stringify({ error: "Server Configuration Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const expectedAuth = `Bearer ${serverEnv.CRON_SECRET}`;
  if (!authHeader || authHeader !== expectedAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createAdminClient();
  const candidatePaths: string[] = [];
  const nowMs = Date.now();
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

  try {
    // 2. Telusuri direktori proofs di bucket payment-proofs
    const { data: rootItems, error: rootError } = await supabaseAdmin.storage
      .from("payment-proofs")
      .list("proofs", { limit: 100 });

    if (rootError) {
      console.error("[CRON_CLEANUP] Gagal membaca direktori proofs:", rootError.message);
      return new Response(
        JSON.stringify({ error: "Storage read error: " + rootError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Kumpulkan file dari subfolder (misal proofs/2026/...) dan direct file
    for (const item of rootItems || []) {
      if (item.id === null || !item.metadata) {
        // Ini adalah subfolder (misal: "2026")
        const folderName = item.name;
        const { data: subFiles } = await supabaseAdmin.storage
          .from("payment-proofs")
          .list(`proofs/${folderName}`, {
            limit: 200,
            sortBy: { column: "created_at", order: "asc" },
          });

        for (const file of subFiles || []) {
          if (file.id !== null) {
            const createdAtMs = file.created_at ? new Date(file.created_at).getTime() : nowMs;
            if (nowMs - createdAtMs > TWENTY_FOUR_HOURS_MS) {
              candidatePaths.push(`proofs/${folderName}/${file.name}`);
            }
          }
        }
      } else {
        // File langsung di folder proofs/
        const createdAtMs = item.created_at ? new Date(item.created_at).getTime() : nowMs;
        if (nowMs - createdAtMs > TWENTY_FOUR_HOURS_MS) {
          candidatePaths.push(`proofs/${item.name}`);
        }
      }
    }

    // 4. Periksa referensi ke tabel registrations
    let orphanPaths: string[] = [];
    if (candidatePaths.length > 0) {
      const { data: matchedRows, error: dbError } = await supabaseAdmin
        .from("registrations")
        .select("payment_proof_path")
        .in("payment_proof_path", candidatePaths);

      if (dbError) {
        console.error("[CRON_CLEANUP] Gagal query registrations:", dbError.message);
        return new Response(
          JSON.stringify({ error: "Database query error: " + dbError.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const referencedSet = new Set((matchedRows || []).map((r) => r.payment_proof_path));
      orphanPaths = candidatePaths.filter((path) => !referencedSet.has(path));
    }

    // 5. Batasi jumlah berkas yang dihapus per eksekusi (kuota maks 50)
    const MAX_DELETE_PER_RUN = 50;
    const toDelete = orphanPaths.slice(0, MAX_DELETE_PER_RUN);
    let deletedCount = 0;

    if (toDelete.length > 0) {
      const { error: removeError } = await supabaseAdmin.storage
        .from("payment-proofs")
        .remove(toDelete);

      if (removeError) {
        console.error("[CRON_CLEANUP] Gagal menghapus berkas dari storage:", removeError.message);
      } else {
        deletedCount = toDelete.length;
      }
    }

    // 6. Log aman tanpa data pribadi
    console.log(
      `[CRON_CLEANUP] Selesai. Total dipindai: ${candidatePaths.length}, Terdeteksi yatim: ${orphanPaths.length}, Dihapus: ${deletedCount}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        scanned: candidatePaths.length,
        orphansFound: orphanPaths.length,
        deleted: deletedCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[CRON_CLEANUP] Terjadi kesalahan tak terduga:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan internal server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
