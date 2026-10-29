"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CreditCard,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { useToast } from "@/components/ui/Toast";
import { settingsSchema, SettingsInput } from "@/lib/validation/admin";
import { updateSettings } from "@/lib/actions/admin";

interface SettingsFormProps {
  initialSettings: SettingsInput;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings,
  });

  const registrationOpen = watch("registration_open");
  const paymentAmount = watch("payment_amount");

  const formattedAmount = React.useMemo(() => {
    if (typeof paymentAmount !== "number" || isNaN(paymentAmount)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(paymentAmount);
  }, [paymentAmount]);

  const onSubmit = (data: SettingsInput) => {
    startTransition(async () => {
      const res = await updateSettings(data);
      if (res.success) {
        toast({
          type: "success",
          title: "Pengaturan Berhasil Disimpan",
          message: res.message || "Perubahan sistem telah diterapkan ke halaman publik.",
        });
      } else {
        toast({
          type: "error",
          title: "Gagal Menyimpan",
          message: res.error || "Terjadi kesalahan saat menyimpan pengaturan.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      {/* 1. KARTU PENGATURAN STATUS & TAHUN AJARAN */}
      <Card className="p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] dark:border-white/[0.06] pb-3 text-foreground font-semibold text-base">
          <Calendar className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>Periode & Status Pendaftaran</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Tahun Ajaran */}
          <Field
            label="Tahun Ajaran Aktif"
            required
            hint="Format: YYYY/YYYY (mis. 2026/2027)"
            error={errors.academic_year?.message}
          >
            <TextInput
              {...register("academic_year")}
              placeholder="2026/2027"
              aria-invalid={Boolean(errors.academic_year)}
              aria-label="Tahun Ajaran Aktif"
            />
          </Field>

          {/* Saklar Status Buka / Tutup Pendaftaran */}
          <div className="flex flex-col justify-between p-4 rounded-control bg-black/[0.02] dark:bg-white/[0.03] shadow-border">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground">
                Status Pendaftaran SPMB
              </span>
              <p className="text-xs text-muted text-pretty">
                {registrationOpen
                  ? "Pendaftaran sedang DIBUKA. Calon wali murid dapat mengisi dan mengirim formulir registrasi."
                  : "Pendaftaran sedang DITUTUP. Formulir publik disembunyikan dan sistem menolak pengiriman baru."}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${registrationOpen
                    ? "bg-accent/15 text-accent"
                    : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                  }`}
              >
                {registrationOpen ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pendaftaran Dibuka</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pendaftaran Ditutup</span>
                  </>
                )}
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={registrationOpen}
                onClick={() => setValue("registration_open", !registrationOpen, { shouldDirty: true })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-medium bg-surface text-foreground shadow-border hover:shadow-border-hover transition-all cursor-pointer min-h-[44px]"
              >
                {registrationOpen ? (
                  <>
                    <ToggleRight className="w-5 h-5 text-accent" aria-hidden="true" />
                    <span>Tutup Pendaftaran</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5 text-muted" aria-hidden="true" />
                    <span>Buka Pendaftaran</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. KARTU PENGATURAN PEMBAYARAN FORMULIR */}
      <Card className="p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] dark:border-white/[0.06] pb-3 text-foreground font-semibold text-base">
          <CreditCard className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>Informasi Pembayaran Formulir</span>
        </div>

        <p className="text-xs text-muted text-pretty -mt-2">
          Data ini tampil di halaman publik (Langkah 3 Pendaftaran) sebagai instruksi transfer biaya formulir bagi calon wali murid.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Nominal Biaya Formulir */}
          <Field
            label="Nominal Biaya Pendaftaran (Rp)"
            required
            hint={`Format tampilan di publik: ${formattedAmount}`}
            error={errors.payment_amount?.message}
          >
            <div className="relative">
              <TextInput
                type="number"
                {...register("payment_amount", { valueAsNumber: true })}
                placeholder="250000"
                aria-invalid={Boolean(errors.payment_amount)}
                aria-label="Nominal Biaya Pendaftaran"
              />
            </div>
          </Field>

          {/* Nama Bank */}
          <Field
            label="Nama Bank Tujuan"
            required
            hint="Contoh: Bank Syariah Indonesia (BSI)"
            error={errors.payment_bank?.message}
          >
            <TextInput
              {...register("payment_bank")}
              placeholder="Bank Syariah Indonesia (BSI)"
              aria-invalid={Boolean(errors.payment_bank)}
              aria-label="Nama Bank Tujuan"
            />
          </Field>

          {/* Nomor Rekening */}
          <Field
            label="Nomor Rekening"
            required
            hint="Contoh: 712-345-6789"
            error={errors.payment_account_no?.message}
          >
            <TextInput
              {...register("payment_account_no")}
              placeholder="712-345-6789"
              aria-invalid={Boolean(errors.payment_account_no)}
              aria-label="Nomor Rekening"
            />
          </Field>

          {/* Atas Nama Rekening */}
          <Field
            label="Nama Pemilik Rekening (Atas Nama)"
            required
            hint="Contoh: SDIT Fajar SPMB"
            error={errors.payment_account_name?.message}
          >
            <TextInput
              {...register("payment_account_name")}
              placeholder="SDIT Fajar SPMB"
              aria-invalid={Boolean(errors.payment_account_name)}
              aria-label="Nama Pemilik Rekening"
            />
          </Field>
        </div>
      </Card>

      {/* 3. TOMBOL SIMPAN PENGATURAN */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          disabled={isPending}
          className="min-h-[44px] px-6 font-semibold"
        >
          <Save className="w-4 h-4 mr-2" aria-hidden="true" />
          <span>Simpan Perubahan Pengaturan</span>
        </Button>
      </div>
    </form>
  );
}
