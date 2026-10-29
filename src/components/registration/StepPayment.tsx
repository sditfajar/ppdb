"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useFormContext, Controller } from "react-hook-form";
import { CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { CopyButton } from "@/components/ui/CopyButton";
import { UploadProof } from "@/components/registration/UploadProof";
import { ReviewSummary } from "@/components/registration/ReviewSummary";
import type { RegistrationFormData } from "@/lib/validation/registration";
import type { PaymentSettings } from "@/lib/actions/registration-state";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((m) => m.Turnstile),
  {
    ssr: false,
    loading: () => (
      <div className="h-[65px] flex items-center justify-center text-xs text-muted">
        Memuat verifikasi keamanan...
      </div>
    ),
  }
);

export interface StepPaymentProps {
  onEditStep: (stepNumber: number) => void;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  paymentSettings?: PaymentSettings;
  onTurnstileSuccess: (token: string) => void;
  onTurnstileExpire: () => void;
  onTurnstileError: () => void;
  turnstileError?: string | null;
  uploadProgressText?: string | null;
}

/**
 * Format nominal Rupiah
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function StepPayment({
  onEditStep,
  file,
  onFileSelect,
  paymentSettings,
  onTurnstileSuccess,
  onTurnstileExpire,
  onTurnstileError,
  turnstileError,
  uploadProgressText,
}: StepPaymentProps) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const currentValues = getValues();

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

  const bankName = paymentSettings?.bank || "Bank Syariah Indonesia (BSI)";
  const accountNo = paymentSettings?.accountNo || "712-345-6789";
  const accountName = paymentSettings?.accountName || "SDIT Fajar SPMB";
  const amount = paymentSettings?.amount ?? 250000;

  return (
    <div className="space-y-6 text-left">
      {/* 1. Kartu Rekening Pembayaran */}
      <div className="rounded-card bg-surface shadow-border p-4 sm:p-5 transition-all">
        <div className="flex items-center gap-2 mb-3 text-accent">
          <CreditCard className="h-5 w-5" />
          <h4 className="text-sm font-semibold text-foreground">
            Instruksi Pembayaran Biaya Formulir
          </h4>
        </div>
        <p className="text-xs text-muted mb-3 text-pretty">
          Silakan lakukan transfer biaya pendaftaran formulir ke nomor rekening resmi SDIT Fajar berikut:
        </p>

        <div className="bg-muted/5 rounded-control p-3.5 space-y-2 border border-muted/15 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted">Bank Tujuan:</span>
            <span className="font-semibold text-foreground">{bankName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Nomor Rekening:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-foreground tabular-nums text-sm">
                {accountNo}
              </span>
              <CopyButton text={accountNo} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Atas Nama:</span>
            <span className="font-medium text-foreground">{accountName}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-muted/15">
            <span className="text-muted">Nominal Biaya:</span>
            <span className="font-bold text-accent tabular-nums text-sm">
              {formatRupiah(amount)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Upload Bukti Bayar */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center justify-between">
          <span>
            Unggah Foto Bukti Transfer <span className="text-danger">*</span>
          </span>
        </label>
        <UploadProof
          file={file}
          onFileSelect={onFileSelect}
          error={errors.payment_proof_file?.message as string | undefined}
        />

        {/* Indikator Progres Indeterminate */}
        {uploadProgressText && (
          <div className="flex items-center gap-2 text-xs text-accent bg-accent/5 p-2.5 rounded-control border border-accent/20 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
            <span className="font-medium">{uploadProgressText}</span>
          </div>
        )}
      </div>

      {/* 3. Ringkasan Isian */}
      <div className="space-y-2 pt-2">
        <h4 className="text-sm font-semibold text-foreground">
          Periksa Kembali Data Anda
        </h4>
        <p className="text-xs text-muted text-pretty">
          Pastikan semua informasi sudah benar sebelum mengirimkan pendaftaran.
        </p>
        <ReviewSummary data={currentValues} onEditStep={onEditStep} />
      </div>

      {/* 4. Pernyataan Persetujuan & PDP */}
      <div className="rounded-card bg-surface shadow-border p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-accent">
          <ShieldCheck className="h-5 w-5" />
          <h4 className="text-sm font-semibold text-foreground">
            Pernyataan Kebenaran Data & Privasi
          </h4>
        </div>

        <Controller
          name="consented"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="consent-checkbox"
              checked={field.value === true}
              onChange={(e) => field.onChange(e.target.checked ? true : false)}
              error={!!errors.consented}
              label={
                <span className="text-xs font-medium text-foreground leading-relaxed">
                  Saya menyatakan data yang diisi benar dan menyetujui data ini diproses oleh
                  SDIT Fajar untuk keperluan SPMB.
                </span>
              }
              description="Data yang Anda berikan dilindungi sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi dan hanya digunakan untuk keperluan seleksi SPMB SDIT Fajar."
            />
          )}
        />

        {errors.consented && (
          <p role="alert" className="text-xs font-medium text-danger mt-1">
            {errors.consented.message}
          </p>
        )}
      </div>

      {/* 5. Honeypot tersembunyi (Anti-Bot) */}
      <input
        type="text"
        {...register("honeypot")}
        tabIndex={-1}
        autoComplete="off"
        className="sr-only opacity-0 h-0 w-0 absolute pointer-events-none"
        aria-hidden="true"
      />

      {/* 6. Cloudflare Turnstile Widget */}
      <div className="space-y-2">
        <div className="flex justify-center my-2">
          <Turnstile
            siteKey={siteKey}
            onSuccess={onTurnstileSuccess}
            onExpire={onTurnstileExpire}
            onError={onTurnstileError}
            options={{
              theme: "auto",
              size: "normal",
            }}
          />
        </div>

        {turnstileError && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-danger text-center">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{turnstileError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
