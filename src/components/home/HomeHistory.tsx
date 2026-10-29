import {
  History,
  Building2,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

export function HomeHistory() {
  const stories = [
    {
      period: "Awal Mula",
      periodBg: "bg-[#DCE1FF]",
      periodText: "text-[#001551]",
      icon: Building2,
      iconColor: "text-[#1D4ED8]",
      title: "Peletakan Batu Pertama: Simbol Awal dan Harapan",
      desc: "Peletakan batu pertama menandai dimulainya pembangunan fisik sekolah. Momen ini menggambarkan optimisme serta harapan untuk mendidik sepuluh siswa pertama yang bergabung dalam SDIT Fajar. Ini adalah bukti nyata bahwa dengan kesungguhan hati dan doa, mimpi untuk menyediakan pendidikan berkualitas berbasis Islam dapat diwujudkan.",
    },
    {
      period: "Tahun 2012",
      periodBg: "bg-[#FFDBCA]",
      periodText: "text-[#783200]",
      icon: BadgeCheck,
      iconColor: "text-[#9D4300]",
      title: "Peresmian Berdirinya Sekolah (2012)",
      desc: "Sekolah Dasar Islam Terpadu Fajar (SDIT Fajar) resmi didirikan pada tahun 2012 dengan visi menghadirkan pendidikan berbasis Islam yang berkualitas. Berawal dari impian besar para pendiri untuk membentuk generasi muda yang berakhlak mulia, cerdas, dan bertakwa, sekolah ini memulai perjalanannya dengan komitmen yang kuat terhadap nilai-nilai Islam. Momen bersejarah tersebut diresmikan dengan tanda tangan oleh Wali Kota Depok bersama tokoh masyarakat dan para pendiri.",
    },
    {
      period: "Hingga Kini",
      periodBg: "bg-[#ECFDF5]",
      periodText: "text-[#047857]",
      icon: TrendingUp,
      iconColor: "text-[#047857]",
      title: "Mengukir Sejarah Bersama",
      desc: "Hingga saat ini, SDIT Fajar telah menjelma menjadi lembaga pendidikan yang dikenal luas berkat prestasi siswa-siswinya, baik di tingkat akademik maupun non-akademik. Visi untuk terus mencetak generasi penerus bangsa yang unggul dan berkarakter Islami masih menjadi fokus utama dalam setiap langkah dan program yang dijalankan oleh sekolah ini.",
    },
  ];

  return (
    <section className="bg-[#F2F3FF] py-14 sm:py-20 px-4 sm:px-6" id="sejarah">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm text-[#1D4ED8] text-xs sm:text-sm font-bold border border-slate-100">
            <History className="w-4 h-4 text-[#1D4ED8]" />
            PERJALANAN KAMI
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Sejarah SDIT Fajar Depok
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#434655] leading-relaxed">
            SDIT Fajar berdiri pada tahun 2012 sebagai wujud kepedulian terhadap pendidikan Islam
            yang berkarakter. Dengan semangat &ldquo;Mencetak Generasi Qurani, Cerdas, dan
            Berakhlak Mulia&rdquo;, sekolah ini terus berkembang menjadi lembaga pendidikan yang
            unggul dan dipercaya masyarakat.
          </p>
        </div>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-slate-200/70 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3.5 py-1 rounded-full ${s.periodBg} ${s.periodText} text-xs font-bold`}
                    >
                      {s.period}
                    </span>
                    <Icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#434655] leading-relaxed text-justify sm:text-left">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

