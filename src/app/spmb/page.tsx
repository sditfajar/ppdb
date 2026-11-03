import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  CreditCard,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Home,
  ExternalLink,
  MessageCircle,
  FileCheck2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { getRegistrationState } from "@/lib/actions/registration-state";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { HomeFooter, HomeFloatingWa } from "@/components/home";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9l-5.05.9" />
      <path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: `Pendaftaran Siswa Baru — ${SCHOOL_CONFIG.name}`,
  description: `Formulir online Sistem Penerimaan Murid Baru (SPMB) ${SCHOOL_CONFIG.fullName} Tahun Ajaran ${SCHOOL_CONFIG.defaultAcademicYear}.`,
  alternates: {
    canonical: "/spmb",
  },
  openGraph: {
    url: "/spmb",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function SpmbPage() {
  const regState = await getRegistrationState();
  const { open: isOpen, wave, academicYear, payment } = regState;
  const bankLabel = payment?.bank
    ? payment.bank.includes("(")
      ? payment.bank.replace(/^.*\((.*)\).*$/, "$1")
      : payment.bank
    : "BSI";
  const accountName = payment?.accountName || "SDIT Fajar SPMB";
  const accountNo = payment?.accountNo || "712-345-6789";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FF] text-[#0F172A] font-[family-name:var(--font-plus-jakarta)] selection:bg-[#FFDBCA] selection:text-[#783200]">
      {/* Ambient Organic Glows khas Beranda */}
      <div
        className="fixed -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#FFDBCA]/40 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed top-1/2 -left-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#DCE1FF]/50 blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* 0. Bilah Navigasi Atas (Sticky & Responsive) */}
      <nav className="sticky top-0 z-40 w-full bg-[#FAF8FF]/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-xl p-1"
            aria-label="Kembali ke Beranda SDIT Fajar"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="Logo SDIT Fajar Depok"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base text-[#0F172A] tracking-tight group-hover:text-[#1D4ED8] transition-colors leading-tight">
                {SCHOOL_CONFIG.name}
              </span>
              <span className="text-[11px] text-slate-600 font-medium hidden sm:inline leading-tight">
                Penerimaan Murid Baru
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Badge
              variant="outline"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-white border-slate-200 text-slate-700 font-semibold text-xs rounded-full shadow-2xs"
            >
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>T.A. {academicYear}</span>
            </Badge>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full gap-2 border-slate-200 bg-white/80 hover:bg-white text-slate-700 hover:text-[#1D4ED8] text-xs sm:text-sm font-semibold shadow-2xs transition-all"
            >
              <Link href="/" aria-label="Kembali ke Beranda">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Kembali ke Beranda</span>
                <span className="sm:hidden">Beranda</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Konten Utama: 12-Column Grid Responsif */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Utama / Hero SPMB */}
        <header className="mb-8 sm:mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-2xs border border-slate-200/80 text-[#1D4ED8] text-xs sm:text-sm font-bold mb-3.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
            <span>SPMB Online {SCHOOL_CONFIG.name} • T.A. {academicYear}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F172A] text-balance leading-tight mb-3">
            Formulir Pendaftaran Siswa Baru {SCHOOL_CONFIG.name}
            <span className="block text-[#1D4ED8] font-bold text-xl sm:text-2xl lg:text-3xl mt-1">
              Tahun Pengajaran {academicYear}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl text-pretty leading-relaxed">
            Assalamualaikum Wr. Wb. Selamat datang di portal resmi Sistem Penerimaan Murid Baru (SPMB).
            Silakan lengkapi formulir pendaftaran di bawah ini secara bertahap dengan data yang valid dan sesuai dokumen resmi.
          </p>
        </header>

        {/* 12-Grid Responsif: Sidebar Info & Form Wizard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri / Sidebar Informasi (Sticky di Desktop) */}
          <aside className="lg:col-span-4 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* 1. Kartu Jadwal Gelombang */}
            <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-row items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-[#0F172A]">
                    Jadwal Gelombang Pendaftaran
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3">
                {/* Gelombang 1 */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    wave === 1
                      ? "border-[#1D4ED8] bg-blue-50/60 ring-2 ring-[#1D4ED8]/10"
                      : "border-slate-200/80 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                      Gelombang 1
                    </span>
                    {wave === 1 && (
                      <Badge className="bg-[#047857] hover:bg-[#065f46] text-white text-[11px] font-bold px-2 py-0.5 rounded-full gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Aktif
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">September – Februari</p>
                </div>

                {/* Gelombang 2 */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    wave === 2
                      ? "border-[#1D4ED8] bg-blue-50/60 ring-2 ring-[#1D4ED8]/10"
                      : "border-slate-200/80 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                      Gelombang 2
                    </span>
                    {wave === 2 ? (
                      <Badge className="bg-[#047857] hover:bg-[#065f46] text-white text-[11px] font-bold px-2 py-0.5 rounded-full gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Aktif
                      </Badge>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-600">Maret – Juni</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">Maret – Juni</p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Kartu Info Biaya & Rekening Transfer */}
            <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-row items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-[#0F172A]">
                    Biaya Formulir Pendaftaran
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span
                    className="text-slate-600 truncate"
                    title={`Transfer ${payment?.bank || bankLabel} a.n ${accountName}`}
                  >
                    Transfer {bankLabel} a.n {accountName}:
                  </span>
                  <span className="font-extrabold text-[#1D4ED8] tabular-nums text-base shrink-0">
                    {formatCurrency(payment?.amount ?? 250000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">Nomor Rekening:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-[#0F172A] text-sm">
                    <span>{accountNo}</span>
                    <CopyButton text={accountNo} />
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 pt-1 leading-normal">
                  💡 Bukti transfer pembayaran diunggah pada Langkah 3 formulir pendaftaran.
                </p>
              </CardContent>
            </Card>

            {/* 3. Kartu Bantuan Panitia WhatsApp */}
            <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-row items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-[#0F172A]">
                    Butuh Bantuan? Hubungi WhatsApp Panitia SPMB
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-3 text-xs">
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href={SCHOOL_CONFIG.contacts.fadil.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/80 hover:text-[#047857] border border-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <WhatsAppIcon className="h-4 w-4 text-[#10B981] shrink-0" />
                      <div className="truncate">
                        <span className="font-bold block truncate">{SCHOOL_CONFIG.contacts.fadil.name}</span>
                        <span className="text-slate-600 text-[11px] tabular-nums group-hover:text-[#047857]">
                          {SCHOOL_CONFIG.contacts.fadil.display}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#047857] shrink-0 transition-colors" aria-hidden="true" />
                  </a>

                  <a
                    href={SCHOOL_CONFIG.contacts.viny.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/80 hover:text-[#047857] border border-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <WhatsAppIcon className="h-4 w-4 text-[#10B981] shrink-0" />
                      <div className="truncate">
                        <span className="font-bold block truncate">{SCHOOL_CONFIG.contacts.viny.name}</span>
                        <span className="text-slate-600 text-[11px] tabular-nums group-hover:text-[#047857]">
                          {SCHOOL_CONFIG.contacts.viny.display}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#047857] shrink-0 transition-colors" aria-hidden="true" />
                  </a>
                </div>

                <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <a
                    href={SCHOOL_CONFIG.contacts.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#1D4ED8] transition-colors"
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                    <span>Instagram</span>
                  </a>
                  <span>•</span>
                  <a
                    href={SCHOOL_CONFIG.contacts.youtube.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#1D4ED8] transition-colors"
                  >
                    <YoutubeIcon className="h-3.5 w-3.5" />
                    <span>YouTube</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* 4. Kartu Panduan Dokumen */}
            <Card className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-2.5 border-b border-slate-100 flex flex-row items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-[#1D4ED8]" />
                <CardTitle className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Dokumen yang Disiapkan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 text-xs space-y-2 text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Akta Kelahiran Siswa (tempat & tanggal lahir)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Kartu Keluarga (KK) orang tua / wali</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Foto bukti transfer biaya pendaftaran</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Kolom Kanan / Konten Utama: Wizard Pendaftaran */}
          <section className="lg:col-span-8 xl:col-span-8">
            {!isOpen ? (
              <Card className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-8 sm:p-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  Pendaftaran Saat Ini Sedang Ditutup
                </h2>
                <p className="text-sm text-slate-600 text-pretty max-w-md mx-auto leading-relaxed">
                  Sistem Penerimaan Murid Baru dibuka pada bulan September – Juni. Saat ini masa
                  pendaftaran telah berakhir atau sedang dipersiapkan untuk gelombang berikutnya.
                </p>
                <p className="text-xs text-slate-600 pt-2">
                  Untuk informasi lebih lanjut, silakan hubungi kontak panitia pada panel informasi.
                </p>
              </Card>
            ) : (
              <Card className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden p-4 sm:p-7 md:p-8">
                <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                      Pengisian Formulir Pendaftaran
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Silakan isi data secara berurutan mulai dari Data Siswa, Orang Tua, hingga Pembayaran.
                    </p>
                  </div>
                  <Badge variant="outline" className="self-start sm:self-auto bg-blue-50/70 text-[#1D4ED8] border-blue-200 font-bold text-xs px-2.5 py-1">
                    Langkah Aktif
                  </Badge>
                </div>

                <RegistrationWizard paymentSettings={payment} />
              </Card>
            )}
          </section>
        </div>
      </main>

      {/* Footer Resmi Sekolah */}
      <HomeFooter />

      {/* Floating WhatsApp Button */}
      <HomeFloatingWa />
    </div>
  );
}
