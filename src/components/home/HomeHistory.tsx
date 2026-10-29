import {
  History,
  Building2,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

export function HomeHistory() {
  const stories = [
    {
      image: "/sejarah/1.jpg",
      period: "Awal Mula",
      periodBg: "bg-[#DCE1FF]",
      periodText: "text-[#001551]",
      icon: Building2,
      iconColor: "text-[#1D4ED8]",
      title: "Peletakan Batu Pertama: Simbol Awal dan Harapan",
      desc: "Peletakan batu pertama menandai dimulainya pembangunan fisik sekolah. Momen ini menggambarkan optimisme serta harapan untuk mendidik sepuluh siswa pertama yang bergabung dalam SDIT Fajar. Ini adalah bukti nyata bahwa dengan kesungguhan hati dan doa, mimpi untuk menyediakan pendidikan berkualitas berbasis Islam dapat diwujudkan.",
    },
    {
      image: "/sejarah/2.jpg",
      period: "Tahun 2012",
      periodBg: "bg-[#FFDBCA]",
      periodText: "text-[#783200]",
      icon: BadgeCheck,
      iconColor: "text-[#9D4300]",
      title: "Peresmian Berdirinya Sekolah (2012)",
      desc: "Sekolah Dasar Islam Terpadu Fajar (SDIT Fajar) resmi didirikan pada tahun 2012 dengan visi menghadirkan pendidikan berbasis Islam yang berkualitas. Berawal dari impian besar para pendiri untuk membentuk generasi muda yang berakhlak mulia, cerdas, dan bertakwa, sekolah ini memulai perjalanannya dengan komitmen yang kuat terhadap nilai-nilai Islam. Momen bersejarah tersebut diresmikan dengan tanda tangan oleh Wali Kota Depok bersama tokoh masyarakat dan para pendiri.",
    },
    {
      image: "/sejarah/3.jpg",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {stories.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/70 flex flex-col h-full"
              >
                {/* Header Image with Fixed Aspect Ratio & Zoom on Hover */}
                <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-100">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Period Tag Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full ${s.periodBg} ${s.periodText} text-xs font-bold shadow-sm backdrop-blur-md border border-white/40`}
                    >
                      {s.period}
                    </span>
                  </div>

                  {/* Floating Icon Pill */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-white/90 backdrop-blur-md shadow-sm border border-white/60 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#434655] leading-relaxed text-justify sm:text-left">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

