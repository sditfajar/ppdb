import {
  School,
  BookOpen,
  Sprout,
  Quote,
  Smile,
  BadgeCheck,
  Users,
} from "lucide-react";

export function HomeProfile() {
  return (
    <section className="bg-[#F2F3FF] py-14 sm:py-20 px-4 sm:px-6" id="profil-sekolah">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm text-[#1D4ED8] text-xs sm:text-sm font-bold border border-slate-100">
            <School className="w-4 h-4 text-[#1D4ED8]" />
            PROFIL SEKOLAH
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Tentang SDIT Fajar Depok
          </h2>
        </div>

        {/* Official Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Narrative Card & Motto */}
          <div className="lg:col-span-7 space-y-6 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200/70">
            <p className="text-sm sm:text-base lg:text-lg text-[#434655] leading-relaxed text-justify sm:text-left">
              SDIT (Sekolah Dasar Islam Terpadu) Fajar Depok adalah sebuah sekolah dasar yang
              menggabungkan kurikulum pendidikan nasional dengan pendidikan agama Islam. Sekolah ini
              menawarkan program pendidikan yang berfokus pada pengembangan akademik serta
              nilai-nilai keislaman. SDIT Fajar bertujuan untuk membentuk generasi yang tidak hanya
              cerdas secara intelektual tetapi juga berakhlak mulia dan berpegang teguh pada ajaran
              Islam. Sekolah ini memiliki berbagai kegiatan tambahan yang mendukung pembentukan
              karakter islami siswa, seperti hafalan Al-Qur&apos;an, shalat berjamaah, dan kegiatan
              keagamaan lainnya.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#DCE1FF] text-[#001551] text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-[#1D4ED8]" />
                Kurikulum Nasional Terpadu
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFDBCA] text-[#783200] text-xs font-semibold">
                <Sprout className="w-3.5 h-3.5 text-[#9D4300]" />
                Penguatan Karakter &amp; Adab
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-[#10B981]" />
                Hafalan Al-Qur&apos;an &amp; Ibadah Harian
              </span>
            </div>

            {/* Motto Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#F97316] via-[#9D4300] to-[#F97316] p-1 shadow-md mt-4">
              <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFEDD5] text-[#9D4300] flex items-center justify-center shrink-0 shadow-sm">
                  <Quote className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#FFEDD5] text-[#783200] text-[11px] font-bold uppercase tracking-wider">
                    MOTTO KAMI
                  </span>
                  <p className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-snug">
                    “Jiwa Pemimpin tumbuh dari lingkungan dan perkembangan interaksi sosial.”
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Photo & Highlight Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Featured Photo with Badges */}
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200/70 bg-[#DAE2FD]">
              <img
                src="/images/profile-classroom.jpg"
                alt="Siswa-siswi SDIT Fajar Depok ceria belajar di kelas"
                className="w-full h-64 sm:h-80 object-cover rounded-3xl"
              />
              {/* Badge 1 */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-[#0F172A] text-xs font-bold">
                <Smile className="w-4 h-4 text-[#F97316]" />
                Ramah &amp; Ceria
              </div>
              {/* Badge 2 */}
              <div className="absolute top-3 right-3 bg-[#1D4ED8] text-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-bold">
                <BadgeCheck className="w-4 h-4 text-[#F97316]" />
                Akreditasi &amp; Berakhlak
              </div>
              {/* Badge 3 */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm flex items-center justify-between text-[#0F172A] text-xs font-bold">
                <span>Pembelajaran Menyenangkan</span>
                <School className="w-4 h-4 text-[#10B981]" />
              </div>
            </div>

            {/* Two Value Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-[#1D4ED8] font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  Terpadu &amp; Islami
                </div>
                <p className="text-xs text-[#434655]">
                  Kombinasi kurikulum nasional dan nilai-nilai Islam.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-[#9D4300] font-bold text-sm">
                  <Users className="w-4 h-4" />
                  Karakter Pemimpin
                </div>
                <p className="text-xs text-[#434655]">
                  Interaksi sosial &amp; lingkungan positif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

