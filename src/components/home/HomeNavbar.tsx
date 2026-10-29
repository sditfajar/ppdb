"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Menu, X, ArrowRight, School } from "lucide-react";
import { SCHOOL_CONFIG } from "@/lib/config";

interface HomeNavbarProps {
  academicYear?: string;
}

export function HomeNavbar({ academicYear = SCHOOL_CONFIG.defaultAcademicYear }: HomeNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const waNumber = SCHOOL_CONFIG.contacts.fadil.display;
  const waUrl = SCHOOL_CONFIG.contacts.fadil.waLink;

  const navLinks = [
    { label: "Beranda", href: "#" },
    { label: "Profil", href: "#profil-sekolah" },
    { label: "Program", href: "#program-unggulan" },
    { label: "Kurikulum", href: "#kurikulum" },
    { label: "Ekstrakurikuler", href: "#ekstrakurikuler" },
    { label: "Sejarah", href: "#sejarah" },
  ];

  const renderBannerSegment = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center gap-6 sm:gap-8 px-4 shrink-0 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span className="bg-[#F97316] text-[#0F172A] px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-sm">
          PPDB {academicYear}
        </span>
        <span className="text-white/95 text-xs font-semibold">
          Penerimaan Peserta Didik Baru Telah Dibuka! Kuota Terbatas.
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs font-medium text-white/90">
        <a
          href={`tel:${SCHOOL_CONFIG.contacts.fadil.phone}`}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#F97316]" aria-hidden="true" />
          <span>{waNumber}</span>
        </a>
        <span className="text-white/30">•</span>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white transition-colors underline decoration-white/40 hover:decoration-white"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" aria-hidden="true" />
          <span>WhatsApp: {waNumber}</span>
        </a>
      </div>

      <span className="text-white/40 font-bold select-none">•</span>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md backdrop-saturate-150 border-b border-slate-200/50 shadow-[0_4px_20px_rgba(15,23,42,0.07)]"
          : "bg-white/95 border-b border-slate-100 shadow-none"
      }`}
    >
      {/* Top Announcement Bar: Single-line Continuous Sliding Loop (Marquee) */}
      <div
        className={`bg-[#1D4ED8] text-white overflow-hidden flex items-center relative border-b border-blue-600/40 select-none transition-all duration-300 ease-in-out ${
          isScrolled ? "h-0 opacity-0 border-b-transparent pointer-events-none" : "h-8 sm:h-9 opacity-100"
        }`}
        aria-label="Pengumuman PPDB"
      >
        <div className="animate-marquee flex items-center">
          {renderBannerSegment("banner-1")}
          {renderBannerSegment("banner-2")}
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ease-in-out ${
          isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}
      >
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <div
            className={`relative rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-all duration-300 ${
              isScrolled ? "w-8 h-8 sm:w-10 sm:h-10" : "w-9 h-9 sm:w-11 sm:h-11"
            }`}
          >
            <Image
              src="/logo.png"
              alt="Logo SDIT Fajar Depok"
              width={44}
              height={44}
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-extrabold text-[#1D4ED8] leading-tight tracking-tight transition-all duration-300 ${
                isScrolled ? "text-sm sm:text-lg" : "text-base sm:text-xl"
              }`}
            >
              SDIT FAJAR
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-tight">
              Kota Depok
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (>= 1025px) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F2F3FF]/70 p-1.5 rounded-full border border-[#DAE2FD]/60">
          {navLinks.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                idx === 0
                  ? "bg-[#1D4ED8] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#1D4ED8] hover:bg-white/80"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons (Desktop) & Hamburger Toggle (Mobile/Tablet) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold bg-[#F2F3FF] text-[#0F172A] hover:bg-[#E2E7FF] transition-colors min-h-[44px]"
          >
            Kontak Kami
          </a>

          <Link
            href="/spmb"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#F97316] text-[#0F172A] shadow-[0_2.5px_0_#9d4300] sm:shadow-[0_4px_0_#9d4300] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_1px_0_#9d4300] sm:active:shadow-[0_2px_0_#9d4300] transition-all min-h-[36px] sm:min-h-[42px] shrink-0 whitespace-nowrap"
          >
            <span>
              <span className="inline sm:hidden">Daftar SPMB</span>
              <span className="hidden sm:inline">Daftar SPMB Online</span>
            </span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </Link>

          {/* Hamburger Menu Toggle (Mobile & Tablet: <= 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F2F3FF] text-slate-700 hover:text-[#1D4ED8] hover:bg-[#E2E7FF] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-colors shrink-0"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ${
            isScrolled ? "top-[56px] sm:top-[64px]" : "top-[96px] sm:top-[116px]"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white rounded-b-3xl shadow-2xl p-6 border-b border-slate-200 max-h-[85vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                Menu Utama
              </span>
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-slate-800 hover:bg-[#F2F3FF] hover:text-[#1D4ED8] transition-colors min-h-[44px]"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/spmb"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold bg-[#F97316] text-[#0F172A] shadow-[0_4px_0_#9d4300] active:translate-y-0.5 text-sm min-h-[44px]"
              >
                <span>Daftar SPMB Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold bg-[#F2F3FF] text-[#0F172A] hover:bg-[#E2E7FF] text-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4 text-[#10B981]" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

