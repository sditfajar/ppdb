import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { CheckCircle2, MessageCircle, Home, AlertCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SCHOOL_CONFIG } from "@/lib/config";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ThemeToggle } from "@/components/theme";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Pendaftaran Berhasil — ${SCHOOL_CONFIG.name}`,
  description: `Konfirmasi pendaftaran calon siswa baru ${SCHOOL_CONFIG.fullName}.`,
  robots: {
    index: false,
    follow: false,
  },
};

interface BerhasilPageProps {
  params: Promise<{ id: string }>;
}

export default async function BerhasilPage({ params }: BerhasilPageProps) {
  const { id } = await params;

  // 1. Validasi UUID format
  const uuidParsed = z.string().uuid().safeParse(id);
  if (!uuidParsed.success) {
    notFound();
  }

  // 2. Ambil data minimal pendaftar via Supabase Admin
  const supabase = createAdminClient();
  const { data: registration, error } = await supabase
    .from("registrations")
    .select("id, reg_number, student_name, wave, status")
    .eq("id", id)
    .maybeSingle();

  if (error || !registration) {
    notFound();
  }

  // 3. Siapkan pesan WhatsApp konfirmasi
  const waContact = SCHOOL_CONFIG.contacts.fadil;
  const waMessage = `Assalamu'alaikum Warahmatullahi Wabarakatuh, Panitia SPMB SDIT Fajar. Saya telah melakukan pendaftaran online atas nama *${registration.student_name}* dengan Nomor Registrasi: *${registration.reg_number}*. Mohon informasi verifikasinya. Terima kasih.`;
  const waUrl = `${waContact.waLink}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="relative min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-12 sm:py-20">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-xl mx-auto space-y-6 animate-enter">
        {/* Kartu Konfirmasi */}
        <div className="rounded-card bg-surface shadow-border p-6 sm:p-8 text-center space-y-6">
          {/* Ikon Berhasil */}
          <div className="h-16 w-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto transition-transform">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
              Pendaftaran Berhasil Dikirim!
            </h1>
            <p className="text-sm text-muted text-pretty max-w-md mx-auto">
              Alhamdulillah, formulir pendaftaran calon siswa baru {SCHOOL_CONFIG.name} telah kami terima dan masuk ke dalam antrean verifikasi panitia.
            </p>
          </div>

          {/* Kotak Nomor Registrasi */}
          <div className="bg-muted/5 rounded-control p-5 border border-muted/20 space-y-3 text-left">
            <div>
              <span className="text-xs font-medium text-muted block uppercase tracking-wider">
                Nomor Registrasi
              </span>
              <span className="font-mono font-bold text-2xl sm:text-3xl text-accent tabular-nums tracking-wide block mt-0.5">
                {registration.reg_number}
              </span>
            </div>

            <div className="pt-3 border-t border-muted/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-muted block">Nama Calon Siswa:</span>
                <span className="font-semibold text-foreground block">
                  {registration.student_name}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted block">Gelombang Pendaftaran:</span>
                <span className="font-medium text-foreground block">
                  Gelombang {registration.wave}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-muted">Status Formulir:</span>
              <StatusBadge status={registration.status} />
            </div>
          </div>

          {/* Pengingat Simpan */}
          <div className="flex items-start gap-2.5 text-left bg-accent/5 rounded-control p-3.5 border border-accent/15 text-xs text-muted">
            <AlertCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="text-pretty">
              Harap simpan atau ambil tangkapan layar (screenshot) nomor registrasi di atas sebagai tanda bukti pendaftaran Anda.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="space-y-3 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3 px-4 text-base font-semibold shadow-sm flex items-center justify-center gap-2 rounded-control bg-[#25D366] text-white hover:bg-[#20bd5a] active:bg-[#1ca850] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 outline-none transition-all cursor-pointer select-none"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Konfirmasi via WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full min-h-[44px] py-2.5 px-4 text-sm font-medium shadow-border flex items-center justify-center gap-2 rounded-control bg-surface text-foreground hover:shadow-border-hover active:bg-black/5 dark:active:bg-white/5 transition-all cursor-pointer select-none"
            >
              <Home className="h-4 w-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>

        {/* Footer Kecil */}
        <p className="text-center text-xs text-muted">
          Sistem Penerimaan Murid Baru (SPMB) {SCHOOL_CONFIG.fullName}
        </p>
      </div>
    </main>
  );
}
