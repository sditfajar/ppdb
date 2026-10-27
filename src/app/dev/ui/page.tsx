"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import {
  Copy,
  Check,
  Send,
  Trash2,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  AlertTriangle,
  Info,
  CheckCircle,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import {
  Button,
  Field,
  TextInput,
  Textarea,
  Select,
  RadioChips,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatusBadge,
  EmptyState,
  Skeleton,
  ConfirmDialog,
  Pagination,
  Stepper,
  IconSwap,
  ToastProvider,
  useToast,
} from "@/components/ui";

export default function DevUIPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <ToastProvider>
      <DevUIShowcase />
    </ToastProvider>
  );
}

function DevUIShowcase() {
  const { toast } = useToast();

  // Mode tema: system, light, dark
  const [themeMode, setThemeMode] = React.useState<"system" | "light" | "dark">("system");

  // State interaktif form
  const [gender, setGender] = React.useState("L");
  const [siblings, setSiblings] = React.useState("2");
  const [agree, setAgree] = React.useState(false);

  // State Stepper & Pagination
  const [currentStep, setCurrentStep] = React.useState(2);
  const [currentPage, setCurrentPage] = React.useState(1);

  // State IconSwap
  const [copied, setCopied] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // State ConfirmDialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogLoading, setDialogLoading] = React.useState(false);
  const [dialogVariant, setDialogVariant] = React.useState<"primary" | "danger">("primary");

  const handleCopy = () => {
    setCopied(true);
    toast({
      type: "success",
      title: "Tersalin",
      message: "Nomor registrasi berhasil disalin ke papan klip.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const openVerifyDialog = () => {
    setDialogVariant("primary");
    setDialogOpen(true);
  };

  const openRejectDialog = () => {
    setDialogVariant("danger");
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    setDialogLoading(true);
    setTimeout(() => {
      setDialogLoading(false);
      setDialogOpen(false);
      toast({
        type: dialogVariant === "danger" ? "error" : "success",
        title: dialogVariant === "danger" ? "Pendaftaran Ditolak" : "Pendaftaran Terverifikasi",
        message:
          dialogVariant === "danger"
            ? "Status pendaftaran telah diubah menjadi ditolak."
            : "Data calon siswa telah berhasil diverifikasi.",
      });
    }, 1000);
  };

  return (
    <div
      data-theme={themeMode !== "system" ? themeMode : undefined}
      className={themeMode === "dark" ? "dark" : themeMode === "light" ? "light" : ""}
    >
      <div className="min-h-screen bg-background text-foreground antialiased transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto space-y-12">
          {/* Header & Theme Switcher */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted/20 pb-6 animate-enter" style={{ ["--stagger" as string]: 0 }}>
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-accent/15 text-accent">
                  Fase 2
                </span>
                <span className="text-xs text-muted">Dev Only (404 di Produksi)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                Design System & Komponen UI
              </h1>
              <p className="text-sm text-muted text-pretty mt-1">
                PPDB Online SDIT Fajar · Standar jakub.kr · Basis mobile 360px
              </p>
            </div>

            {/* Kontrol Tema */}
            <div className="inline-flex p-1 rounded-control bg-surface shadow-border self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setThemeMode("system")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition-all cursor-pointer ${
                  themeMode === "system"
                    ? "bg-accent text-white shadow-sm dark:text-white"
                    : "text-muted hover:text-foreground"
                }`}
                aria-label="Tema sistem"
              >
                <Laptop className="h-3.5 w-3.5" />
                <span>Sistem</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition-all cursor-pointer ${
                  themeMode === "light"
                    ? "bg-accent text-white shadow-sm dark:text-white"
                    : "text-muted hover:text-foreground"
                }`}
                aria-label="Tema terang"
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Terang</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] transition-all cursor-pointer ${
                  themeMode === "dark"
                    ? "bg-accent text-white shadow-sm dark:text-white"
                    : "text-muted hover:text-foreground"
                }`}
                aria-label="Tema gelap"
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Gelap</span>
              </button>
            </div>
          </header>

          {/* Seksi 1: Prinsip Radius Konsentris & Bayangan Berlapis */}
          <section className="space-y-4 animate-enter" style={{ ["--stagger" as string]: 1 }}>
            <div>
              <h2 className="text-xl font-semibold text-foreground text-balance">
                1. Radius Konsentris & Bayangan Berlapis (jakub.kr)
              </h2>
              <p className="text-sm text-muted text-pretty">
                Radius luar card = radius kontrol (10px) + padding (12px) = <strong>22px</strong>. Menggunakan bayangan bertingkat <code>--shadow-border</code> alih-alih border kaku.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card dengan Kontrol di Dalamnya</CardTitle>
                  <CardDescription>
                    Perhatikan kelengkungan sudut Card yang melingkupi Button dan Input secara harmonis dan presisi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TextInput placeholder="Input di dalam kartu..." />
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="primary" className="flex-1">
                    Aksi Utama
                  </Button>
                  <Button variant="secondary">Batal</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Outline Gambar 1px 10%</CardTitle>
                  <CardDescription>
                    Sesuai PRD §13.1 #11: Outline 1px dengan offset -1px menjaga batas foto bukti bayar tetap bersih pada latar terang maupun gelap.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video w-full rounded-control overflow-hidden bg-muted/20 image-outline flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-xs font-mono text-muted mb-1">class: image-outline</p>
                      <p className="text-sm font-medium text-foreground">Placeholder Foto Bukti Pembayaran</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Seksi 2: Tombol & State Interaksi */}
          <section className="space-y-4 animate-enter" style={{ ["--stagger" as string]: 2 }}>
            <div>
              <h2 className="text-xl font-semibold text-foreground text-balance">
                2. Tombol (Button) & Alignment Optis
              </h2>
              <p className="text-sm text-muted text-pretty">
                Target sentuh ≥ 44px (ukuran md & lg). Padding sisi ikon disedot secara optis agar seimbang.
              </p>
            </div>

            <Card>
              <CardContent className="space-y-6 pt-3">
                {/* Varian */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Varian Warna
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary (Accent)</Button>
                    <Button variant="secondary">Secondary (Surface)</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                {/* State Interaksi */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    State Interaksi
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" loading>
                      Menyimpan...
                    </Button>
                    <Button variant="secondary" loading>
                      Memuat...
                    </Button>
                    <Button variant="primary" disabled>
                      Dinonaktifkan
                    </Button>
                    <Button variant="secondary" disabled>
                      Dinonaktifkan
                    </Button>
                  </div>
                </div>

                {/* Ikon dengan Optical Alignment */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Optical Alignment (Ikon Kiri / Kanan)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" iconLeft={<Send className="h-4 w-4" />}>
                      Kirim Pendaftaran
                    </Button>
                    <Button variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                      Lanjutkan
                    </Button>
                    <Button variant="danger" iconLeft={<Trash2 className="h-4 w-4" />}>
                      Hapus
                    </Button>
                  </div>
                </div>

                {/* Ukuran */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Ukuran (sm / md / lg)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" variant="secondary">
                      Kecil (sm - 36px)
                    </Button>
                    <Button size="md" variant="secondary">
                      Standar (md - 44px)
                    </Button>
                    <Button size="lg" variant="secondary">
                      Besar (lg - 48px)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seksi 3: Form Controls & Field */}
          <section className="space-y-4 animate-enter" style={{ ["--stagger" as string]: 3 }}>
            <div>
              <h2 className="text-xl font-semibold text-foreground text-balance">
                3. Input & Field (Aksesibilitas Lengkap)
              </h2>
              <p className="text-sm text-muted text-pretty">
                Tinggi input 48px di mobile (≥ 44px), font-size ≥ 16px (mencegah zoom iOS), label terhubung dengan aria-describedby & aria-invalid.
              </p>
            </div>

            <Card>
              <CardContent className="space-y-5 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Nama Lengkap Siswa"
                    required
                    hint="Sesuai akta kelahiran calon peserta didik."
                  >
                    <TextInput placeholder="Contoh: Muhammad Fajar Pratama" />
                  </Field>

                  <Field
                    label="Nomor Telepon / WhatsApp"
                    required
                    error="Format nomor HP tidak valid. Gunakan awalan 08 atau 62."
                  >
                    <TextInput defaultValue="12345" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Pendidikan Terakhir Ayah" required>
                    <Select
                      placeholder="Pilih jenjang pendidikan"
                      options={[
                        { value: "sd_mi", label: "SD/MI Sederajat" },
                        { value: "smp_mts", label: "SMP/MTS Sederajat" },
                        { value: "sma_smk_ma", label: "SMA/SMK/MA Sederajat" },
                        { value: "d1_d3", label: "D1/D2/D3" },
                        { value: "s1_s3", label: "S1/S2/S3" },
                      ]}
                    />
                  </Field>

                  <Field label="Status Input Terkunci" hint="Field ini dalam mode disabled.">
                    <TextInput value="Nilai yang tidak dapat diubah" disabled />
                  </Field>
                </div>

                <Field
                  label="Alamat Lengkap Siswa"
                  required
                  hint="Cantumkan jalan, RT/RW, kelurahan, dan kecamatan."
                >
                  <Textarea placeholder="Tulis alamat tempat tinggal saat ini..." />
                </Field>

                {/* Radio Chips */}
                <Field label="Jenis Kelamin Calon Siswa" required>
                  <RadioChips
                    name="gender"
                    value={gender}
                    onChange={setGender}
                    options={[
                      { value: "L", label: "Laki-laki" },
                      { value: "P", label: "Perempuan" },
                    ]}
                  />
                </Field>

                <Field
                  label="Jumlah Saudara Kandung"
                  hint="Tidak termasuk calon siswa yang didaftarkan."
                  required
                >
                  <RadioChips
                    name="siblings"
                    value={siblings}
                    onChange={setSiblings}
                    options={[
                      { value: "0", label: "0" },
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                      { value: "other", label: "Lainnya" },
                    ]}
                  />
                </Field>

                {/* Checkbox */}
                <div className="pt-2 border-t border-muted/15 space-y-2">
                  <Checkbox
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    label="Pernyataan Kebenaran Data"
                    description="Saya menyatakan data yang diisi adalah benar dan menyetujui pemrosesan data untuk keperluan PPDB SDIT Fajar."
                  />

                  <Checkbox
                    error
                    label="Contoh Checkbox dengan State Error"
                    description="Persetujuan ini wajib dicentang sebelum melanjutkan pendaftaran."
                  />

                  <Checkbox
                    disabled
                    checked
                    label="Persetujuan Terkunci (Disabled)"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seksi 4: Komponen Status, Stepper, & Paginasi */}
          <section className="space-y-4 animate-enter" style={{ ["--stagger" as string]: 4 }}>
            <div>
              <h2 className="text-xl font-semibold text-foreground text-balance">
                4. Status, Stepper, & Paginasi
              </h2>
              <p className="text-sm text-muted text-pretty">
                Format angka tabular (<code>tabular-nums</code>) untuk nomor langkah, tanggal, dan hitungan data.
              </p>
            </div>

            <Card>
              <CardContent className="space-y-6 pt-3">
                {/* Status Badges */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Status Pendaftaran (OKLCH)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status="pending" count={14} />
                    <StatusBadge status="verified" count={42} />
                    <StatusBadge status="rejected" count={3} />
                  </div>
                </div>

                {/* Stepper Wizard */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                      Stepper Wizard Pendaftaran (Interaktif)
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      Langkah {currentStep} dari 3
                    </span>
                  </div>
                  <Stepper
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                    steps={[
                      { number: 1, title: "Data Calon Siswa", shortTitle: "Siswa" },
                      { number: 2, title: "Data Orang Tua", shortTitle: "Orang Tua" },
                      { number: 3, title: "Pembayaran & Berkas", shortTitle: "Bayar" },
                    ]}
                  />
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={currentStep <= 1}
                      onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    >
                      Langkah Sebelumnya
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={currentStep >= 3}
                      onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
                    >
                      Langkah Berikutnya
                    </Button>
                  </div>
                </div>

                {/* Paginasi */}
                <div className="space-y-2 pt-2 border-t border-muted/15">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Paginasi Tabel Admin (Interaktif)
                  </span>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={8}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seksi 5: Animasi Ikonik (IconSwap) & Motion */}
          <section className="space-y-4 animate-enter" style={{ ["--stagger" as string]: 5 }}>
            <div>
              <h2 className="text-xl font-semibold text-foreground text-balance">
                5. Animasi Kontekstual (IconSwap) & Feedback Interaktif
              </h2>
              <p className="text-sm text-muted text-pretty">
                Animasi ikon menggunakan <code>motion/react</code> (spring ~300ms, bounce 0, opacity + scale 0.25→1 + blur 4px→0).
              </p>
            </div>

            <Card>
              <CardContent className="space-y-6 pt-3">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Salin Nomor Registrasi */}
                  <div className="p-3 rounded-control bg-surface shadow-border flex items-center gap-3">
                    <div className="text-sm font-mono tabular-nums font-semibold">
                      PPDB-2026-0042
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleCopy}
                      className="gap-2"
                      aria-label="Salin nomor registrasi"
                    >
                      <IconSwap
                        swapKey={copied ? "check" : "copy"}
                        icon={
                          copied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )
                        }
                      />
                      <span>{copied ? "Tersalin" : "Salin"}</span>
                    </Button>
                  </div>

                  {/* Toggle Visibilitas Kata Sandi */}
                  <div className="p-3 rounded-control bg-surface shadow-border flex items-center gap-3">
                    <span className="text-sm text-muted">Toggle Ikon:</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      className="gap-2"
                    >
                      <IconSwap
                        swapKey={showPassword ? "eye" : "eye-off"}
                        icon={
                          showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted" />
                          )
                        }
                      />
                      <span>{showPassword ? "Sembunyikan" : "Tampilkan"}</span>
                    </Button>
                  </div>
                </div>

                {/* Notifikasi Toast Trigger */}
                <div className="space-y-2 pt-2 border-t border-muted/15">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Sistem Notifikasi Toast (aria-live polite)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      iconLeft={<CheckCircle className="h-4 w-4 text-emerald-600" />}
                      onClick={() =>
                        toast({
                          type: "success",
                          title: "Berhasil",
                          message: "Pendaftaran formulir Anda berhasil disimpan ke sistem.",
                        })
                      }
                    >
                      Toast Sukses
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      iconLeft={<AlertTriangle className="h-4 w-4 text-danger" />}
                      onClick={() =>
                        toast({
                          type: "error",
                          title: "Gagal Mengunggah",
                          message: "Ukuran berkas melebihi batas 5 MB. Coba kompres atau screenshot.",
                        })
                      }
                    >
                      Toast Error
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      iconLeft={<Info className="h-4 w-4 text-accent" />}
                      onClick={() =>
                        toast({
                          type: "info",
                          title: "Informasi Gelombang",
                          message: "Gelombang 1 pendaftaran saat ini sedang dibuka.",
                        })
                      }
                    >
                      Toast Info
                    </Button>
                  </div>
                </div>

                {/* Modal Dialog Trigger */}
                <div className="space-y-2 pt-2 border-t border-muted/15">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Dialog Konfirmasi Native HTML5 (&lt;dialog&gt;)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" onClick={openVerifyDialog}>
                      Buka Dialog Verifikasi
                    </Button>
                    <Button variant="danger" onClick={openRejectDialog}>
                      Buka Dialog Tolak
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seksi 6: Status Kosong (EmptyState) & Skeleton Loader */}
          <section className="space-y-4 animate-enter" style={{ ["--stagger" as string]: 6 }}>
            <div>
              <h2 className="text-xl font-semibold text-foreground text-balance">
                6. EmptyState & Skeleton Loader
              </h2>
              <p className="text-sm text-muted text-pretty">
                Tampilan state memuat data dan kondisi kosong yang ramah serta informatif.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EmptyState
                icon={<User className="h-6 w-6 stroke-[1.5]" />}
                title="Belum Ada Pendaftar Baru"
                description="Data calon siswa yang mendaftar pada gelombang ini akan muncul di sini."
                action={
                  <Button size="sm" variant="secondary">
                    Perbarui Data
                  </Button>
                }
              />

              <Card className="space-y-4">
                <CardHeader>
                  <CardTitle>Skeleton Placeholder</CardTitle>
                  <CardDescription>
                    Animasi pulse dinonaktifkan otomatis bila pengguna mengaktifkan prefers-reduced-motion.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        {/* Dialog Konfirmasi Native */}
        <ConfirmDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirmAction}
          loading={dialogLoading}
          variant={dialogVariant}
          title={
            dialogVariant === "danger"
              ? "Tolak Pendaftaran Ini?"
              : "Verifikasi Pendaftaran Calon Siswa?"
          }
          description={
            dialogVariant === "danger"
              ? "Pastikan alasan penolakan sudah jelas agar orang tua dapat melengkapi data yang kurang."
              : "Setelah diverifikasi, nomor registrasi akan berstatus sah dan siap untuk tahap berikutnya."
          }
          confirmLabel={dialogVariant === "danger" ? "Ya, Tolak" : "Ya, Verifikasi"}
        />
      </div>
    </div>
  );
}
