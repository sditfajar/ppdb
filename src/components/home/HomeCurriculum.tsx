import {
  Layers,
  BookOpen,
  School,
  Brain,
  CheckCircle2,
} from "lucide-react";

export function HomeCurriculum() {
  const pillars = [
    {
      num: "Pilar 1",
      title: "Pendidikan Al-Qur'an",
      desc: "Siswa-siswi SDIT Fajar menghafal minimal 1 Juz Al-Qur'an (Juz 30) dengan metode \"Tilawati\".",
      icon: BookOpen,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#047857]",
      tagColor: "text-[#047857]",
      badgeText: "Target Mutqin Juz 30",
    },
    {
      num: "Pilar 2",
      title: "Kurikulum Merdeka",
      desc: "SDIT Fajar menerapkan Kurikulum Merdeka yang mengembangkan Projek Penguatan Profil Pelajar Pancasila.",
      icon: School,
      iconBg: "bg-[#DCE1FF]",
      iconColor: "text-[#1D4ED8]",
      tagColor: "text-[#1D4ED8]",
      badgeText: "Kurikulum Merdeka & P5",
    },
    {
      num: "Pilar 3",
      title: "Pendidikan Karakter",
      desc: "Pembelajaran berbasis karakter berdasarkan 6 Karakter Profil Pelajar Pancasila (Beriman, Bertaqwa kepada Tuhan YME dan Berakhlak Mulia, Berkebhinekaan Global, Gotong Royong, Mandiri, Kreatif, dan Bernalar Kritis).",
      icon: Brain,
      iconBg: "bg-[#FFDBCA]",
      iconColor: "text-[#9D4300]",
      tagColor: "text-[#9D4300]",
      badgeText: "6 Dimensi Karakter Pancasila",
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#FAF8FF]" id="kurikulum">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E2E7FF] shadow-sm text-[#1D4ED8] text-xs sm:text-sm font-bold border border-[#DAE2FD]">
            <Layers className="w-4 h-4 text-[#1D4ED8]" />
            KONSEP PEMBELAJARAN
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            3 Pilar Utama Kurikulum SDIT Fajar
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#434655] leading-relaxed">
            Penyelarasan seimbang antara kompetensi keagamaan Al-Qur&apos;an, kurikulum nasional terkini,
            dan fondasi karakter peserta didik.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-slate-200/70 space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  {/* Header: Icon di kiri, Nomor & Judul di kanan */}
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${p.iconBg} ${p.iconColor} flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="space-y-0.5">
                      <span className={`text-xs font-bold uppercase tracking-wider ${p.tagColor}`}>
                        {p.num}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <span className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold ${p.tagColor}`}>
                    <CheckCircle2 className="w-4 h-4" />
                    {p.badgeText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

