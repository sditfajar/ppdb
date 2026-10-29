import Link from "next/link";
import { Megaphone, ArrowRight, MessageCircle } from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";

interface HomeCtaBannerProps {
  academicYear?: string;
}

export function HomeCtaBanner({
  academicYear = SCHOOL_CONFIG.defaultAcademicYear,
}: HomeCtaBannerProps) {
  const waUrl = SCHOOL_CONFIG.contacts.fadil.waLink;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#FAF8FF]" id="daftar-ppdb">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-[#1D4ED8] text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden text-center flex flex-col items-center space-y-6">
          {/* Background Organic Glows */}
          <div
            className="absolute -top-20 -left-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#FFDBCA]/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F97316] text-[#0F172A] text-xs sm:text-sm font-bold shadow-md">
            <Megaphone className="w-4 h-4" />
            TAHUN AJARAN {academicYear}
          </span>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold max-w-3xl leading-tight">
            Ayo Bergabung Bersama Keluarga Besar SDIT Fajar Depok!
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed">
            Penerimaan Peserta Didik Baru (PPDB) sedang berlangsung. Kuota kelas terbatas untuk
            menjamin rasio ideal guru dan perhatian menyeluruh untuk ananda.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-2 relative z-10 w-full sm:w-auto">
            <Link
              href="/spmb"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold bg-[#F97316] text-[#0F172A] shadow-[0_5px_0_#9d4300] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_#9d4300] transition-all w-full sm:w-auto min-h-[48px]"
            >
              <span>Daftar Sekarang (Online)</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold bg-white text-[#1D4ED8] shadow-md hover:bg-slate-50 transition-colors w-full sm:w-auto min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5 text-[#10B981]" />
              <span>Hubungi Hotline via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

