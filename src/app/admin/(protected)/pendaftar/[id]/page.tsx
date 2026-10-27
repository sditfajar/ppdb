import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  User,
  Users,
  CreditCard,
  FileText,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RegistrationDetailActions } from "@/components/admin";
import {
  formatDateIndo,
  formatPhoneDisplay,
  formatFileSize,
  formatEducationLevel,
} from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RegistrationDetailPage(props: PageProps) {
  const { id } = await props.params;
  const { supabase } = await requireAdmin();

  const { data: reg, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !reg) {
    notFound();
  }

  // Buat signed URL berumur <= 300 detik untuk bukti bayar
  const { data: signedData } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(reg.payment_proof_path, 300);

  const signedUrl = signedData?.signedUrl || "";

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-5xl mx-auto animate-enter">
      {/* Tombol Kembali & Header Ringkasan */}
      <div className="flex flex-col gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted hover:text-foreground transition-colors w-fit p-1 -m-1 rounded-control focus-visible:ring-2 focus-visible:ring-accent outline-none"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Kembali ke Daftar Pendaftar
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-accent tabular-nums bg-accent/10 px-2.5 py-0.5 rounded-full">
                {reg.reg_number}
              </span>
              <StatusBadge status={reg.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-balance break-words mt-1">
              {reg.student_name}
            </h1>
            <p className="text-xs text-muted">
              Pendaftaran Gelombang {reg.wave} · Tahun Ajaran {reg.academic_year} · Terdaftar pada{" "}
              {formatDateIndo(reg.created_at, { withTime: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Banner Peringatan jika Ditolak */}
      {reg.status === "rejected" && reg.rejection_reason && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-card bg-rose-500/10 text-rose-800 dark:text-rose-200 border border-rose-500/20"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1 text-xs sm:text-sm">
            <span className="font-semibold">Pendaftaran Ditolak</span>
            <p className="text-pretty">{reg.rejection_reason}</p>
          </div>
        </div>
      )}

      {/* Baris Aksi Detail (Verifikasi, Tolak, Kembalikan, WhatsApp, Catatan Admin) */}
      <RegistrationDetailActions
        id={reg.id}
        currentStatus={reg.status}
        currentAdminNote={reg.admin_note}
        rejectionReason={reg.rejection_reason}
        contactPhone={reg.contact_phone}
        studentName={reg.student_name}
        regNumber={reg.reg_number}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAGIAN 1: Data Calon Siswa */}
        <Card className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <User className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>Data Calon Siswa</span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 text-xs sm:text-sm">
            <div>
              <dt className="text-muted text-xs">Nama Lengkap</dt>
              <dd className="font-semibold text-foreground break-words mt-0.5">{reg.student_name}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Nama Panggilan</dt>
              <dd className="font-medium text-foreground mt-0.5">{reg.student_nickname || "-"}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Jenis Kelamin</dt>
              <dd className="font-medium text-foreground mt-0.5">
                {reg.gender === "L" ? "Laki-laki" : "Perempuan"}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Tempat, Tanggal Lahir</dt>
              <dd className="font-medium text-foreground mt-0.5">
                {reg.birth_place}, {formatDateIndo(reg.birth_date, { longMonth: true })}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Jumlah Saudara Kandung</dt>
              <dd className="font-medium text-foreground tabular-nums mt-0.5">
                {reg.siblings_count} orang
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Anak Ke-</dt>
              <dd className="font-medium text-foreground tabular-nums mt-0.5">
                {reg.birth_order}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted text-xs">Alamat Tempat Tinggal</dt>
              <dd className="font-medium text-foreground mt-0.5 text-pretty">
                {reg.student_address}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Hobi</dt>
              <dd className="font-medium text-foreground mt-0.5">{reg.hobby || "-"}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Prestasi yang Diraih</dt>
              <dd className="font-medium text-foreground mt-0.5">{reg.achievements || "-"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted text-xs">Riwayat Penyakit / Catatan Medis</dt>
              <dd className="font-medium text-foreground mt-0.5">{reg.medical_conditions || "-"}</dd>
            </div>
          </dl>
        </Card>

        {/* BAGIAN 2: Data Orang Tua / Wali */}
        <Card className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <Users className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>Data Orang Tua / Wali</span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 text-xs sm:text-sm">
            <div>
              <dt className="text-muted text-xs">Nama Lengkap Ayah</dt>
              <dd className="font-semibold text-foreground mt-0.5">{reg.father_name}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Pendidikan Ayah</dt>
              <dd className="font-medium text-foreground mt-0.5">
                {formatEducationLevel(reg.father_education)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted text-xs">Pekerjaan Ayah</dt>
              <dd className="font-medium text-foreground mt-0.5">{reg.father_job}</dd>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]" />

            <div>
              <dt className="text-muted text-xs">Nama Lengkap Ibu</dt>
              <dd className="font-semibold text-foreground mt-0.5">{reg.mother_name}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Pendidikan Ibu</dt>
              <dd className="font-medium text-foreground mt-0.5">
                {formatEducationLevel(reg.mother_education)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted text-xs">Pekerjaan Ibu</dt>
              <dd className="font-medium text-foreground mt-0.5">{reg.mother_job}</dd>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]" />

            <div className="sm:col-span-2">
              <dt className="text-muted text-xs">Nomor Kontak WhatsApp Aktif</dt>
              <dd className="font-semibold text-foreground tabular-nums mt-0.5">
                {formatPhoneDisplay(reg.contact_phone)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted text-xs">Alamat Lengkap Orang Tua</dt>
              <dd className="font-medium text-foreground mt-0.5 text-pretty">
                {reg.parent_address}
              </dd>
            </div>
          </dl>
        </Card>

        {/* BAGIAN 3: Bukti Pembayaran */}
        <Card className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <CreditCard className="w-4 h-4 text-accent" aria-hidden="true" />
              <span>Bukti Pembayaran Formulir</span>
            </div>
            {signedUrl && (
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                Buka tab baru
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {signedUrl ? (
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full aspect-4/3 rounded-control overflow-hidden bg-black/5 dark:bg-white/5 shadow-border hover:shadow-border-hover transition-shadow"
                aria-label="Klik untuk memperbesar bukti pembayaran di tab baru"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signedUrl}
                  alt={`Bukti transfer pendaftaran ${reg.student_name}`}
                  className="w-full h-full object-contain outline outline-1 outline-black/10 dark:outline-white/10 -outline-offset-1 group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 text-white text-[11px] font-medium backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  Buka tab baru
                </div>
              </a>
            ) : (
              <div className="p-8 text-center text-xs text-muted bg-black/[0.02] dark:bg-white/[0.02] rounded-control">
                Bukti pembayaran tidak tersedia atau URL kedaluwarsa.
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-muted block text-[11px]">Format File:</span>
                <span className="font-mono text-foreground font-medium uppercase">
                  {reg.payment_proof_mime.replace("image/", "")}
                </span>
              </div>
              <div>
                <span className="text-muted block text-[11px]">Ukuran:</span>
                <span className="text-foreground tabular-nums">
                  {formatFileSize(reg.payment_proof_size)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* BAGIAN 4: Administrasi & Audit Sistem */}
        <Card className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <FileText className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>Administrasi & Riwayat Sistem</span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-4 text-xs sm:text-sm">
            <div>
              <dt className="text-muted text-xs">Nomor Registrasi</dt>
              <dd className="font-mono font-bold text-foreground mt-0.5 tabular-nums">
                {reg.reg_number}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Tahun Ajaran</dt>
              <dd className="font-semibold text-foreground mt-0.5 tabular-nums">
                {reg.academic_year}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Gelombang Pendaftaran</dt>
              <dd className="font-medium text-foreground mt-0.5">Gelombang {reg.wave}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Persetujuan Pernyataan Ortu</dt>
              <dd className="font-medium text-foreground mt-0.5 tabular-nums">
                {formatDateIndo(reg.consented_at, { withTime: true })}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Waktu Pendaftaran Diterima</dt>
              <dd className="font-medium text-foreground mt-0.5 tabular-nums">
                {formatDateIndo(reg.created_at, { withTime: true })}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Terakhir Ditinjau</dt>
              <dd className="font-medium text-foreground mt-0.5 tabular-nums">
                {reg.reviewed_at
                  ? formatDateIndo(reg.reviewed_at, { withTime: true })
                  : "Belum ditinjau"}
              </dd>
            </div>
            {reg.reviewed_by && (
              <div className="sm:col-span-2">
                <dt className="text-muted text-xs">ID Peninjau (Admin)</dt>
                <dd className="font-mono text-xs text-muted truncate mt-0.5">
                  {reg.reviewed_by}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      </div>
    </div>
  );
}
