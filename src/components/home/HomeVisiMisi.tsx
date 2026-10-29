import { Flag } from "lucide-react";

export function HomeVisiMisi() {
  const missions = [
    {
      num: 1,
      title: "Ketaatan Beribadah",
      desc: "Menanam keimanan dan ketaqwaan kepada peserta didik dalam taat beribadah.",
      badgeBg: "bg-[#DCE1FF]",
      badgeText: "text-[#1D4ED8]",
    },
    {
      num: 2,
      title: "Cerdas & Berakhlak Mulia",
      desc: "Membentuk peserta didik yang cerdas, kreatif, inovatif dan berakhlak mulia.",
      badgeBg: "bg-[#FFDBCA]",
      badgeText: "text-[#9D4300]",
    },
    {
      num: 3,
      title: "Optimalisasi Bakat Siswa",
      desc: "Mengoptimalkan proses pembelajaran dengan bimbingan dalam mengembangkan bakat yang dimiliki peserta didik.",
      badgeBg: "bg-[#ECFDF5]",
      badgeText: "text-[#047857]",
    },
    {
      num: 4,
      title: "Peningkatan Prestasi",
      desc: "Meningkatkan prestasi akademik dan non akademik.",
      badgeBg: "bg-[#E2E7FF]",
      badgeText: "text-[#1D4ED8]",
    },
    {
      num: 5,
      title: "Suasana Kekeluargaan",
      desc: "Mewujudkan suasana kekeluargaan antar warga sekolah.",
      badgeBg: "bg-[#FFDBCA]",
      badgeText: "text-[#9D4300]",
    },
    {
      num: 6,
      title: "Peduli Lingkungan Hidup",
      desc: "Mewujudkan budaya peduli lingkungan hidup.",
      badgeBg: "bg-[#ECFDF5]",
      badgeText: "text-[#047857]",
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#FAF8FF]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Big Featured Visi Card */}
        <div className="relative bg-[#1D4ED8] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl overflow-hidden">
          <div
            className="absolute -right-10 -bottom-10 w-64 sm:w-72 h-64 sm:h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div className="max-w-4xl relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              <Flag className="w-3.5 h-3.5 text-[#FFDBCA]" />
              VISI SDIT FAJAR
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug">
              “Terwujudnya peserta didik yang beriman dan bertaqwa, terampil serta cinta terhadap
              lingkungan.”
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl">
              Visi sekolah menjadi arah panduan bagi pendidik, orang tua, dan seluruh civitas sekolah
              dalam membentuk pribadi santri yang tangguh, berbudi luhur, serta peduli semesta.
            </p>
          </div>
        </div>

        {/* 6 Misi Cards Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[#1D4ED8] font-bold text-xs uppercase tracking-wider">
                Pilar Langkah Nyata
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                6 Poin Misi SDIT Fajar
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#434655]">
              Dijalankan secara komprehensif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {missions.map((m) => (
              <div
                key={m.num}
                className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/70 flex flex-col gap-3.5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${m.badgeBg} ${m.badgeText} text-base sm:text-lg font-extrabold flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {m.num}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                    {m.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

