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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.05)] transition-shadow">
      {/* Top Announcement Bar */}
      <div className="bg-[#1D4ED8] text-white py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
            <span className="bg-[#F97316] text-[#0F172A] px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-sm">
              PPDB {academicYear}
            </span>
            <span className="text-white/95">
              Penerimaan Peserta Didik Baru Telah Dibuka! Kuota Terbatas.
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/90 shrink-0">
            <a
              href={`tel:${SCHOOL_CONFIG.contacts.fadil.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{waNumber}</span>
            </a>
            <span className="text-white/40">|</span>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp: {waNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-18 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 flex items-center justify-center">
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
            <span className="font-extrabold text-[#1D4ED8] text-lg sm:text-xl leading-tight tracking-tight">
              SDIT FAJAR
            </span>
            <span className="text-xs font-semibold text-slate-500 leading-tight">
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
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#F97316] text-[#0F172A] shadow-[0_4px_0_#9d4300] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_2px_0_#9d4300] transition-all min-h-[44px]"
          >
            <span>Daftar SPMB Online</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </Link>

          {/* Hamburger Menu Toggle (Mobile & Tablet: <= 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#F2F3FF] text-slate-700 hover:text-[#1D4ED8] hover:bg-[#E2E7FF] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-colors shrink-0"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[110px] sm:top-[120px] bg-black/40 backdrop-blur-sm z-40 transition-opacity"
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

