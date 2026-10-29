import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";
import { getRegistrationState } from "@/lib/actions/registration-state";
import { HomeScrollLock } from "@/components/home/HomeScrollLock";

export const metadata: Metadata = {
  title: `Beranda — ${SCHOOL_CONFIG.name}`,
  description: `Sistem Penerimaan Murid Baru (SPMB) ${SCHOOL_CONFIG.fullName}. Pendaftaran online siswa baru Tahun Ajaran ${SCHOOL_CONFIG.defaultAcademicYear}.`,
};

export default async function HomePage() {
  const regState = await getRegistrationState();
  const academicYear = regState.academicYear || SCHOOL_CONFIG.defaultAcademicYear;

  const waMessage = encodeURIComponent(
    `Assalamualaikum Admin PPDB ${SCHOOL_CONFIG.name}, saya ingin konsultasi terkait Sistem Penerimaan Murid Baru (SPMB).`
  );
  const waUrl = `https://wa.me/6287737860657?text=${waMessage}`;

  return (
    <main className="home-viewport relative w-full h-[100vh] h-[100dvh] overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 select-none box-border">
      <HomeScrollLock />

      {/* Background ambient halus tanpa overflow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-[min(70vw,480px)] h-[min(70vw,480px)] rounded-full bg-accent/8 blur-3xl opacity-75 dark:opacity-40" />
      </div>

      {/* Hero Section tunggal */}
      <section className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-3 sm:gap-5 landscape-compact px-2">
        {/* Badge Sekolah */}
        <div
          className="hero-badge animate-enter inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-semibold mb-1"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>SPMB Online {SCHOOL_CONFIG.name}</span>
        </div>

        {/* Judul Hero */}
        <h1
          className="hero-title animate-enter font-bold tracking-tight text-foreground text-balance leading-tight text-[clamp(1.5rem,4.5vw,3rem)]"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          Sistem Penerimaan Murid Baru
          <span className="block text-accent mt-1 text-[clamp(1.2rem,3.5vw,2.25rem)]">
            Tahun Ajaran {academicYear}
          </span>
        </h1>

        {/* Deskripsi Singkat */}
        <p
          className="hero-subtitle animate-enter text-muted text-pretty max-w-lg mx-auto text-[clamp(0.85rem,2vw,1.1rem)] leading-relaxed"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          Membina generasi Qur&apos;ani yang cerdas, berkarakter, dan berakhlak mulia bersama {SCHOOL_CONFIG.fullName}.
        </p>

        {/* Tombol Aksi: Daftar SPMB & Konsultasi WhatsApp */}
        <div
          className="animate-enter pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full"
          style={{ "--stagger": 4 } as React.CSSProperties}
        >
          <Link
            href="/spmb"
            className="hero-cta-btn inline-flex items-center justify-center font-semibold bg-accent text-white rounded-control shadow-sm hover:opacity-95 active:scale-[0.98] transition-all h-11 sm:h-13 px-6 sm:px-8 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-accent outline-none w-full sm:w-auto"
          >
            Daftar SPMB
          </Link>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-secondary-btn inline-flex items-center justify-center font-semibold border-2 border-accent text-accent bg-transparent rounded-control hover:bg-accent/10 active:scale-[0.98] transition-all h-11 sm:h-13 px-5 sm:px-7 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-accent outline-none w-full sm:w-auto"
          >
            Konsultasi WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
