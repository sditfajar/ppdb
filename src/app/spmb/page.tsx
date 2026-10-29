import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Mail,
  CreditCard,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Home,
  ExternalLink,
} from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { getRegistrationState } from "@/lib/actions/registration-state";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";

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
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* 0. Bilah Navigasi Atas (Kembali ke Beranda) */}
      <nav className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-muted/15 shadow-xs">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted hover:text-foreground transition-colors group p-1.5 -ml-1.5 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-85 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-control p-1"
            aria-label="Beranda SDIT Fajar"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Beranda</span>
          </Link>
        </div>
      </nav>

      {/* 1. Header Informasi & Salam (PRD §8.1 & Lampiran A) */}
      <header className="relative pt-10 pb-8 px-4 text-center max-w-xl mx-auto">
        <div
          className="animate-enter inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>SPMB Online {SCHOOL_CONFIG.name}</span>
        </div>

        <h1
          className="animate-enter text-2xl sm:text-3xl font-bold tracking-tight text-balance leading-snug text-foreground mb-4"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          Formulir Pendaftaran Siswa Baru {SCHOOL_CONFIG.name}
          <span className="block text-accent font-semibold text-xl sm:text-2xl mt-1">
            Tahun Pengajaran {academicYear}
          </span>
        </h1>

        <div
          className="animate-enter rounded-card bg-surface shadow-border p-4 sm:p-5 text-left space-y-2 mb-6"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          <p className="text-sm font-semibold text-foreground">
            Assalamualaikum Wr. Wb.
          </p>
          <p className="text-xs sm:text-sm text-muted text-pretty leading-relaxed">
            Sehubungan telah dibukanya Sistem Penerimaan Murid Baru (SPMB) TP {academicYear}, silakan
            mengisi formulir pendaftaran di bawah ini secara bertahap.
          </p>
          <div className="pt-2 border-t border-muted/15">
            <p className="text-xs font-medium text-foreground">
              ⚠️ Catatan Penting:
            </p>
            <p className="text-xs text-muted text-pretty mt-0.5">
              Pastikan data yang Bapak/Ibu isi sesuai dengan identitas resmi pendaftar (Nama Siswa,
              Nama Orang Tua, Tanggal Lahir, dan dokumen lainnya).
            </p>
          </div>
        </div>

        {/* 2. Kartu Jadwal Gelombang */}
        <div
          className="animate-enter grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6"
          style={{ "--stagger": 4 } as React.CSSProperties}
        >
          {/* Gelombang 1 */}
          <Card
            className={`relative p-4 transition-all ${wave === 1 ? "ring-2 ring-accent bg-accent/5" : "opacity-90"
              }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                <span>Gelombang 1</span>
              </div>
              {wave === 1 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-muted">September – Februari</p>
          </Card>

          {/* Gelombang 2 */}
          <Card
            className={`relative p-4 transition-all ${wave === 2 ? "ring-2 ring-accent bg-accent/5" : "opacity-90"
              }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                <span>Gelombang 2</span>
              </div>
              {wave === 2 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Aktif
                </span>
              ) : (
                <span className="text-[11px] font-medium text-muted">Maret – Juni</span>
              )}
            </div>
            <p className="text-xs text-muted">Maret – Juni</p>
          </Card>
        </div>

        {/* 3. Kartu Info Pembayaran Singkat */}
        <div
          className="animate-enter rounded-card bg-surface shadow-border p-4 text-left mb-6 space-y-2.5"
          style={{ "--stagger": 5 } as React.CSSProperties}
        >
          <div className="flex items-center gap-2 mb-1 text-accent">
            <CreditCard className="h-4 w-4" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Biaya Formulir Pendaftaran
            </h3>
          </div>
          <div className="flex items-center justify-between text-xs gap-2">
            <span
              className="text-muted truncate"
              title={`Transfer ${payment?.bank || bankLabel} a.n ${accountName}`}
            >
              Transfer {bankLabel} a.n {accountName}:
            </span>
            <span className="font-bold text-accent tabular-nums text-sm shrink-0">
              {formatCurrency(payment?.amount ?? 250000)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-muted/15">
            <span className="text-muted">Nomor Rekening:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-foreground text-sm">
              <span>{accountNo}</span>
              <CopyButton text={accountNo} />
            </div>
          </div>
        </div>

        {/* 4. Kartu Kontak Resmi Sekolah */}
        <div
          className="animate-enter rounded-card bg-surface shadow-border p-4 text-left mb-8"
          style={{ "--stagger": 6 } as React.CSSProperties}
        >
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Butuh Bantuan? Hubungi WhatsApp Panitia SPMB
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href={SCHOOL_CONFIG.contacts.fadil.waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-control bg-muted/5 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <WhatsAppIcon className="h-3.5 w-3.5 text-accent shrink-0" />
                <div className="truncate">
                  <span className="font-medium block truncate">{SCHOOL_CONFIG.contacts.fadil.name}</span>
                  <span className="text-muted text-[11px] tabular-nums group-hover:text-accent/80 transition-colors">
                    {SCHOOL_CONFIG.contacts.fadil.display}
                  </span>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted/60 group-hover:text-accent shrink-0 transition-colors ml-1" aria-hidden="true" />
            </a>

            <a
              href={SCHOOL_CONFIG.contacts.viny.waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-control bg-muted/5 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <WhatsAppIcon className="h-3.5 w-3.5 text-accent shrink-0" />
                <div className="truncate">
                  <span className="font-medium block truncate">{SCHOOL_CONFIG.contacts.viny.name}</span>
                  <span className="text-muted text-[11px] tabular-nums group-hover:text-accent/80 transition-colors">
                    {SCHOOL_CONFIG.contacts.viny.display}
                  </span>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted/60 group-hover:text-accent shrink-0 transition-colors ml-1" aria-hidden="true" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-muted/15 text-xs text-muted">
            <a
              href={SCHOOL_CONFIG.contacts.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors group"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              <span>Instagram</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </a>
            <span>•</span>
            <a
              href={SCHOOL_CONFIG.contacts.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors group"
            >
              <YoutubeIcon className="h-3.5 w-3.5" />
              <span>YouTube</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </a>
            <span>•</span>
            <a
              href={SCHOOL_CONFIG.contacts.email.mailto}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </header>

      {/* 5. Konten Utama: Formulir Wizard atau Banner Pendaftaran Ditutup */}
      <main className="px-4 max-w-xl mx-auto">
        {!isOpen ? (
          <div className="rounded-card bg-surface shadow-border p-6 text-center space-y-4 animate-enter">
            <div className="h-12 w-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Pendaftaran Saat Ini Sedang Ditutup
            </h2>
            <p className="text-xs sm:text-sm text-muted text-pretty max-w-md mx-auto">
              Sistem Penerimaan Murid Baru dibuka pada bulan September – Juni. Saat ini masa
              pendaftaran telah berakhir atau sedang dipersiapkan untuk gelombang berikutnya.
            </p>
            <p className="text-xs text-muted">
              Untuk informasi lebih lanjut, silakan hubungi kontak panitia di atas.
            </p>
          </div>
        ) : (
          <div
            className="animate-enter"
            style={{ "--stagger": 7 } as React.CSSProperties}
          >
            <RegistrationWizard paymentSettings={payment} />
          </div>
        )}

        {/* 6. Penutup (PRD Lampiran A) */}
        <footer className="mt-12 text-center text-xs text-muted text-pretty space-y-2">
          <div className="pb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-control p-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Kembali ke Halaman Beranda</span>
            </Link>
          </div>
          <p className="font-medium text-foreground">
            Daftarkan segera, dan jadilah bagian dari keluarga kami.
          </p>
          <p>Terima kasih, Wassalamualaikum Wr. Wb.</p>
          <p className="text-[11px] text-muted pt-4">
            © {new Date().getFullYear()} {SCHOOL_CONFIG.fullName}. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
