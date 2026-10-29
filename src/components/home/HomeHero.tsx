import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Sprout,
  Trophy,
  Users,
  Award,
} from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";

interface HomeHeroProps {
  academicYear?: string;
}

export function HomeHero({ academicYear = SCHOOL_CONFIG.defaultAcademicYear }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#DCE1FF]/30 via-[#FAF8FF] to-[#FAF8FF] pt-28 sm:pt-36 lg:pt-40 pb-12 lg:pb-20 px-4 sm:px-6">
      {/* Ambient Organic Glows */}
      <div
        className="absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#FFDBCA]/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#DCE1FF]/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
          {/* Floating Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#1D4ED8] text-xs sm:text-sm font-bold">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
            <span>Penerimaan Murid Baru T.A. {academicYear} Dibuka</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] text-balance">
            Membentuk Generasi{" "}
            <span className="text-[#1D4ED8] relative inline-block whitespace-nowrap">
              Qur&apos;ani
              <svg
                className="absolute -bottom-2.5 left-0 w-full text-[#F97316] h-3.5"
                preserveAspectRatio="none"
                viewBox="0 0 100 12"
                aria-hidden="true"
              >
                <path
                  d="M0,7 Q50,0 100,7"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </span>{" "}
            yang Cerdas, Mandiri &amp; Berakhlak Mulia
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-[#434655] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Sekolah Dasar Islam Terpadu ramah anak di Kota Depok yang memadukan kurikulum nasional
            dan nilai-nilai Islami dalam suasana belajar yang menyenangkan, aman, dan eksploratif.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-1 sm:pt-2">
            <Link
              href="/spmb"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold bg-[#F97316] text-[#0F172A] shadow-[0_5px_0_#9d4300] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#9d4300] transition-all min-h-[48px]"
            >
              <span>Daftar SPMB Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#profil-sekolah"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold bg-white text-[#1D4ED8] shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors min-h-[48px]"
            >
              <span>Profil Sekolah</span>
            </a>
          </div>

          {/* Trust Badges Pill Row */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#0F172A] text-xs font-semibold">
              <BadgeCheck className="w-4 h-4 text-[#F97316]" />
              Akreditasi A Unggul
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#0F172A] text-xs font-semibold">
              <BookOpen className="w-4 h-4 text-[#10B981]" />
              Tahfidz Metode Mutqin
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#0F172A] text-xs font-semibold">
              <Sprout className="w-4 h-4 text-[#1D4ED8]" />
              Pendidikan Karakter Adab
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[#0F172A] text-xs font-semibold">
              <Trophy className="w-4 h-4 text-[#F97316]" />
              50+ Prestasi Kota &amp; Provinsi
            </span>
          </div>
        </div>

        {/* Right Column: Visual Graphic & Floating Stickers */}
        <div className="lg:col-span-5 relative mt-6 lg:mt-0">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Backing Organic Blob Container */}
            <div className="rounded-3xl bg-[#DAE2FD]/80 p-3 sm:p-4 shadow-xl relative overflow-hidden border border-[#C4C5D7]/40">
              <img
                src="/images/hero-students.jpg"
                alt="Siswa-siswi ceria SDIT Fajar Depok belajar dengan bahagia di sekolah"
                className="rounded-2xl w-full h-[320px] sm:h-[400px] object-cover"
                loading="eager"
              />

              {/* Floating Sticker 1: Hafalan */}
              <div className="absolute top-6 -left-2 sm:-left-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-none">
                    98%
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium text-[#434655]">
                    Hafal Target Juz 30
                  </p>
                </div>
              </div>

              {/* Floating Sticker 2: Rasio Guru */}
              <div className="absolute bottom-10 -right-2 sm:-right-3 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFEDD5] text-[#9D4300] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-none">
                    1:15
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium text-[#434655]">
                    Rasio Ideal Guru : Siswa
                  </p>
                </div>
              </div>

              {/* Floating Sticker 3: Alumni */}
              <div className="absolute -bottom-2 left-6 sm:left-10 bg-[#1D4ED8] text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md flex items-center gap-1.5 sm:gap-2">
                <Award className="w-4 h-4 text-[#F97316]" />
                <span className="text-xs sm:text-sm font-bold">500+ Alumni Berprestasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

