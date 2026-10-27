"use client";

import * as React from "react";
import { CheckCircle2, XCircle, RotateCcw, MessageCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import {
  verifyRegistration,
  rejectRegistration,
  revertToPending,
  saveAdminNote,
} from "@/lib/actions/admin";
import { RegistrationStatus } from "@/components/ui/StatusBadge";

interface RegistrationDetailActionsProps {
  id: string;
  currentStatus: RegistrationStatus;
  currentAdminNote: string | null;
  contactPhone: string;
  studentName: string;
  regNumber: string;
}

export function RegistrationDetailActions({
  id,
  currentStatus,
  currentAdminNote,
  contactPhone,
  studentName,
  regNumber,
}: RegistrationDetailActionsProps) {
  const { toast } = useToast();

  // State dialog konfirmasi
  const [showVerifyDialog, setShowVerifyDialog] = React.useState(false);
  const [showRevertDialog, setShowRevertDialog] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);

  // State alasan penolakan
  const [rejectReason, setRejectReason] = React.useState("");
  const [rejectError, setRejectError] = React.useState<string | null>(null);

  // State catatan admin
  const [note, setNote] = React.useState(currentAdminNote || "");
  const [isNoteDirty, setIsNoteDirty] = React.useState(false);

  // State loading transisi aksi
  const [isPending, startTransition] = React.useTransition();
  const [isSavingNote, startNoteTransition] = React.useTransition();

  // 1. Aksi Verifikasi
  const handleVerify = () => {
    startTransition(async () => {
      const res = await verifyRegistration(id);
      setShowVerifyDialog(false);

      if (res.success) {
        toast({
          type: "success",
          title: "Berhasil diverifikasi",
          message: res.message || "Status pendaftaran telah diperbarui.",
        });
      } else {
        toast({
          type: "error",
          title: "Gagal memverifikasi",
          message: res.error || "Terjadi kesalahan saat memverifikasi.",
        });
      }
    });
  };

  // 2. Aksi Tolak
  const handleReject = () => {
    const trimmed = rejectReason.trim();
    if (trimmed.length < 5) {
      setRejectError("Alasan penolakan minimal 5 karakter.");
      return;
    }

    setRejectError(null);
    startTransition(async () => {
      const res = await rejectRegistration(id, trimmed);
      if (res.success) {
        setShowRejectModal(false);
        setRejectReason("");
        toast({
          type: "success",
          title: "Pendaftaran ditolak",
          message: res.message || "Pendaftar berhasil ditolak.",
        });
      } else {
        toast({
          type: "error",
          title: "Gagal menolak",
          message: res.error || "Terjadi kesalahan sistem.",
        });
      }
    });
  };

  // 3. Aksi Kembalikan ke Menunggu
  const handleRevert = () => {
    startTransition(async () => {
      const res = await revertToPending(id);
      setShowRevertDialog(false);

      if (res.success) {
        toast({
          type: "success",
          title: "Status dipulihkan",
          message: res.message || "Status dikembalikan ke Menunggu Verifikasi.",
        });
      } else {
        toast({
          type: "error",
          title: "Gagal mengubah status",
          message: res.error || "Terjadi kesalahan sistem.",
        });
      }
    });
  };

  // 4. Aksi Simpan Catatan Admin
  const handleSaveNote = () => {
    startNoteTransition(async () => {
      const res = await saveAdminNote(id, note);
      if (res.success) {
        setIsNoteDirty(false);
        toast({
          type: "success",
          title: "Catatan disimpan",
          message: res.message || "Catatan internal berhasil diperbarui.",
        });
      } else {
        toast({
          type: "error",
          title: "Gagal menyimpan",
          message: res.error || "Gagal menyimpan catatan.",
        });
      }
    });
  };

  // 5. Tautan WhatsApp Orang Tua
  const cleanPhone = contactPhone.replace(/\D/g, "");
  const waNumber = cleanPhone.startsWith("0")
    ? "62" + cleanPhone.slice(1)
    : cleanPhone;

  const waMessage = encodeURIComponent(
    `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\n` +
      `Bapak/Ibu wali dari calon siswa ananda *${studentName}* (No. Registrasi: *${regNumber}*),\n` +
      `Kami dari Panitia PPDB SDIT Fajar ingin mengonfirmasi terkait pendaftaran ananda.`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Baris Tombol Aksi Status & Hubungi */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-card bg-surface shadow-border">
        <div className="flex flex-wrap items-center gap-2.5">
          {currentStatus !== "verified" && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowVerifyDialog(true)}
              disabled={isPending}
              className="min-h-[44px] px-4 font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Verifikasi Pendaftaran
            </Button>
          )}

          {currentStatus !== "rejected" && (
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                setRejectError(null);
                setShowRejectModal(true);
              }}
              disabled={isPending}
              className="min-h-[44px] px-4 font-semibold"
            >
              <XCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              Tolak Pendaftaran
            </Button>
          )}

          {currentStatus !== "pending" && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowRevertDialog(true)}
              disabled={isPending}
              className="min-h-[44px] px-4 font-semibold text-muted hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Kembalikan ke Menunggu
            </Button>
          )}
        </div>

        {/* Tombol Hubungi WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-control text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors select-none"
          aria-label={`Kirim pesan WhatsApp ke nomor orang tua ${studentName}`}
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          Hubungi via WhatsApp
        </a>
      </div>

      {/* Catatan Internal Admin */}
      <div className="flex flex-col gap-3 p-4 rounded-card bg-surface shadow-border">
        <div className="flex items-center justify-between">
          <label
            htmlFor="admin-note"
            className="text-sm font-semibold text-foreground"
          >
            Catatan Internal Admin
          </label>
          <span className="text-xs text-muted">
            Hanya dapat dibaca oleh administrator
          </span>
        </div>

        <Textarea
          id="admin-note"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setIsNoteDirty(true);
          }}
          placeholder="Tulis catatan verifikasi berkas, tindak lanjut, atau pesan khusus panitia di sini..."
          rows={3}
          maxLength={1000}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted tabular-nums">
            {note.length}/1000 karakter
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSaveNote}
            loading={isSavingNote}
            disabled={!isNoteDirty && note === (currentAdminNote || "")}
            className="min-h-[38px] px-3.5"
          >
            <Save className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Simpan Catatan
          </Button>
        </div>
      </div>

      {/* Dialog Konfirmasi Verifikasi */}
      <ConfirmDialog
        open={showVerifyDialog}
        onClose={() => setShowVerifyDialog(false)}
        onConfirm={handleVerify}
        title="Verifikasi Pendaftaran Siswa?"
        description={`Pastikan bukti pembayaran dan data ananda ${studentName} sudah benar dan sesuai ketentuan. Status akan berubah menjadi Terverifikasi.`}
        confirmLabel="Ya, Verifikasi"
        cancelLabel="Batal"
        variant="primary"
        loading={isPending}
      />

      {/* Dialog Konfirmasi Kembalikan ke Menunggu */}
      <ConfirmDialog
        open={showRevertDialog}
        onClose={() => setShowRevertDialog(false)}
        onConfirm={handleRevert}
        title="Kembalikan ke Status Menunggu?"
        description={`Pendaftaran ananda ${studentName} akan dikembalikan ke status Menunggu Verifikasi. Alasan penolakan (jika ada) akan dihapus.`}
        confirmLabel="Kembalikan"
        cancelLabel="Batal"
        variant="primary"
        loading={isPending}
      />

      {/* Modal Dialog Tolak Pendaftaran (dengan input alasan) */}
      {showRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-enter"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-dialog-title"
        >
          <div className="w-full max-w-md p-5 bg-surface text-foreground rounded-card shadow-2xl shadow-border flex flex-col gap-4">
            <div>
              <h3
                id="reject-dialog-title"
                className="text-lg font-semibold text-foreground text-balance"
              >
                Tolak Pendaftaran Calon Siswa
              </h3>
              <p className="text-xs text-muted mt-1 text-pretty">
                Tuliskan alasan penolakan secara jelas dan sopan (minimal 5 karakter). Alasan ini akan tercatat dalam sistem.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="rejection-reason"
                className="text-xs font-semibold text-foreground"
              >
                Alasan Penolakan <span className="text-danger">*</span>
              </label>
              <Textarea
                id="rejection-reason"
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (rejectError) setRejectError(null);
                }}
                placeholder="Contoh: Bukti transfer tidak jelas/terpotong, mohon kirim ulang via WhatsApp panitia."
                rows={3}
                aria-invalid={Boolean(rejectError)}
                autoFocus
              />
              {rejectError && (
                <p className="text-xs text-danger font-medium">{rejectError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  if (!isPending) setShowRejectModal(false);
                }}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={isPending}
              >
                Tolak Pendaftaran
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
