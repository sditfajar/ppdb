import {
  Trophy,
  Tent,
  Target,
  Shield,
  BookOpen,
  Award,
} from "lucide-react";

export function HomeExtracurricular() {
  const activities = [
    {
      title: "Pramuka",
      desc: "Membangun Karakter dan Kepemimpinan Siswa.",
      tag: "Kepanduan Siswa",
      icon: Tent,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#047857]",
      tagColor: "text-[#047857]",
    },
    {
      title: "Memanah",
      desc: "Meningkatkan Fokus dan Disiplin Anak.",
      tag: "Olahraga Sunnah",
      icon: Target,
      iconBg: "bg-[#FFDBCA]",
      iconColor: "text-[#9D4300]",
      tagColor: "text-[#9D4300]",
    },
    {
      title: "Taekwondo",
      desc: "Seni Bela Diri untuk Kesehatan dan Kepercayaan Diri.",
      tag: "Seni Bela Diri",
      icon: Shield,
      iconBg: "bg-[#DCE1FF]",
      iconColor: "text-[#1D4ED8]",
      tagColor: "text-[#1D4ED8]",
    },
    {
      title: "Tahfidz Al-Qur'an",
      desc: "Menghafal dan Memahami Kitab Suci.",
      tag: "Kalamullah",
      icon: BookOpen,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-[#047857]",
      tagColor: "text-[#047857]",
    },
    {
      title: "Futsal",
      desc: "Olahraga Tim untuk Kerjasama dan Kesehatan.",
      tag: "Olahraga Beregu",
      icon: Trophy,
      iconBg: "bg-[#FFDBCA]",
      iconColor: "text-[#9D4300]",
      tagColor: "text-[#9D4300]",
    },
  ];

  return (
    <section className="bg-[#EAEDFF] py-14 sm:py-20 px-4 sm:px-6" id="ekstrakurikuler">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm text-[#9D4300] text-xs sm:text-sm font-bold border border-slate-100">
            <Award className="w-4 h-4 text-[#F97316]" />
            PENGEMBANGAN DIRI
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Ekstrakurikuler SDIT Fajar Depok
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#434655] leading-relaxed">
            Kegiatan ekstrakurikuler di SDIT Fajar dirancang untuk mengembangkan minat, bakat, dan
            potensi siswa di luar pembelajaran kelas. Melalui berbagai aktivitas pilihan, siswa
            belajar kerja sama, disiplin, dan kemandirian dalam suasana yang bernilai Islami.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {activities.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-slate-200/70"
              >
                <div className="space-y-3">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${a.iconBg} ${a.iconColor} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                    {a.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">
                    {a.desc}
                  </p>
                </div>
                <span className={`text-xs font-bold pt-4 ${a.tagColor}`}>
                  {a.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

