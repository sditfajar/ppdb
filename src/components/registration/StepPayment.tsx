"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CreditCard, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { UploadProof } from "@/components/registration/UploadProof";
import { ReviewSummary } from "@/components/registration/ReviewSummary";
import type { RegistrationFormData } from "@/lib/validation/registration";

export interface StepPaymentProps {
  onEditStep: (stepNumber: number) => void;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export function StepPayment({
  onEditStep,
  file,
  onFileSelect,
}: StepPaymentProps) {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const currentValues = getValues();

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
            <span className="font-semibold text-foreground">Bank Syariah Indonesia (BSI)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Nomor Rekening:</span>
            <span className="font-mono font-bold text-foreground tabular-nums text-sm">
              712-345-6789
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted">Atas Nama:</span>
            <span className="font-medium text-foreground">SDIT Fajar PPDB</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-muted/15">
            <span className="text-muted">Nominal Biaya:</span>
            <span className="font-bold text-accent tabular-nums text-sm">Rp 250.000</span>
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
                  SDIT Fajar untuk keperluan PPDB.
                </span>
              }
              description="Data yang Anda berikan dilindungi sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi dan hanya digunakan untuk keperluan seleksi PPDB SDIT Fajar."
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

      {/* 6. Placeholder Cloudflare Turnstile (akan dihubungkan di Fase 4) */}
      <div className="rounded-control bg-muted/5 border border-dashed border-muted/20 p-3 text-center text-xs text-muted">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Perlindungan Keamanan Cloudflare Turnstile Aktif
        </span>
      </div>
    </div>
  );
}
