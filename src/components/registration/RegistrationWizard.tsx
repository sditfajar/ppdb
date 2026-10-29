"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Stepper, type StepItem } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { StepStudent } from "@/components/registration/StepStudent";
import { StepParent } from "@/components/registration/StepParent";
import { StepPayment } from "@/components/registration/StepPayment";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/validation/registration";
import { createClient } from "@/lib/supabase/client";
import { requestUploadUrl } from "@/lib/actions/upload";
import { createRegistration } from "@/lib/actions/registration";
import type { PaymentSettings } from "@/lib/actions/registration-state";

const DRAFT_STORAGE_KEY = "SPMB:draft:v1";

const STEPS: StepItem[] = [
  { number: 1, title: "Data Calon Siswa", shortTitle: "Siswa" },
  { number: 2, title: "Data Orang Tua", shortTitle: "Orang Tua" },
  { number: 3, title: "Pembayaran & Konfirmasi", shortTitle: "Bayar" },
];

const STEP_1_FIELDS: (keyof RegistrationFormData)[] = [
  "student_name",
  "student_nickname",
  "birth_place",
  "birth_date",
  "gender",
  "siblings_count",
  "birth_order",
  "student_address",
  "contact_phone",
  "hobby",
  "achievements",
  "medical_conditions",
];

const STEP_2_FIELDS: (keyof RegistrationFormData)[] = [
  "father_name",
  "mother_name",
  "father_education",
  "mother_education",
  "father_job",
  "mother_job",
  "parent_address",
];

interface UploadedProofCache {
  fileSignature: string;
  path: string;
  mime: string;
  size: number;
}

export interface RegistrationWizardProps {
  paymentSettings?: PaymentSettings;
}

export function RegistrationWizard({ paymentSettings }: RegistrationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [paymentFile, setPaymentFile] = React.useState<File | null>(null);
  const [uploadedProof, setUploadedProof] = React.useState<UploadedProofCache | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [turnstileError, setTurnstileError] = React.useState<string | null>(null);
  const [uploadProgressText, setUploadProgressText] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [stepErrorSummary, setStepErrorSummary] = React.useState<string | null>(null);

  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as unknown as Resolver<RegistrationFormData>,
    mode: "onTouched",
    defaultValues: {
      student_name: "",
      student_nickname: "",
      birth_place: "",
      birth_date: "",
      gender: undefined,
      siblings_count: 1,
      birth_order: 1,
      student_address: "",
      contact_phone: "",
      hobby: "",
      achievements: "-",
      medical_conditions: "-",
      father_name: "",
      mother_name: "",
      father_education: undefined,
      mother_education: undefined,
      father_job: "",
      mother_job: "",
      parent_address: "",
      consented: false as unknown as true,
      honeypot: "",
    },
  });

  const {
    trigger,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { isDirty },
  } = methods;

  // 1. Memulihkan draf dari localStorage saat pertama kali dimuat
  React.useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          // Isi kembali kolom form kecuali objek file
          Object.entries(parsed).forEach(([key, val]) => {
            if (key !== "payment_proof_file" && key !== "honeypot" && val !== undefined) {
              setValue(key as keyof RegistrationFormData, val as never, {
                shouldValidate: false,
                shouldDirty: false,
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("[SPMB] Gagal memulihkan draf form:", e);
    }
  }, [setValue]);

  // 2. Auto-save draf formulir ke localStorage (tanpa file) via subscription
  React.useEffect(() => {
    const subscription = watch((formValues) => {
      if (!isDirty || isSubmitting) return;

      const dataToSave: Record<string, unknown> = { ...formValues };
      delete dataToSave.payment_proof_file;
      delete dataToSave.honeypot;

      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (e) {
        console.warn("[SPMB] Penyimpanan draf penuh:", e);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isDirty, isSubmitting]);

  // 3. Peringatan browser saat tab ingin ditutup bila ada perubahan belum tersimpan
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  // Callback pemilihan berkas bukti bayar
  const handleFileSelect = (file: File | null) => {
    setPaymentFile(file);
    // Jika file diganti, batalkan cache uploaded proof sebelumnya
    if (!file || (uploadedProof && uploadedProof.fileSignature !== `${file.name}-${file.size}-${file.lastModified}`)) {
      setUploadedProof(null);
    }
    setValue("payment_proof_file", file as unknown as File, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Navigasi langkah berikutnya dengan validasi per langkah
  const handleNextStep = async () => {
    setStepErrorSummary(null);

    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(STEP_1_FIELDS, { shouldFocus: true });
    } else if (currentStep === 2) {
      isValid = await trigger(STEP_2_FIELDS, { shouldFocus: true });
    }

    if (!isValid) {
      setStepErrorSummary(
        "Terdapat beberapa kolom yang belum diisi dengan benar. Silakan periksa tanda merah di bawah."
      );
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setStepErrorSummary(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleEditStep = (stepNumber: number) => {
    setStepErrorSummary(null);
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Callback Turnstile
  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setTurnstileError(null);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
    setTurnstileError("Sesi verifikasi Turnstile kedaluwarsa. Silakan centang kembali.");
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    setTurnstileError("Gagal memuat verifikasi Cloudflare. Silakan periksa koneksi internet Anda.");
  };

  // Pengiriman Formulir Registrasi Lengkap (Fase 4 Backend Publik)
  const onFormSubmit: SubmitHandler<RegistrationFormData> = async (formData) => {
    if (isSubmitting) return;

    // Pastikan foto bukti transfer dipilih
    if (!paymentFile) {
      setStepErrorSummary("Foto bukti pembayaran formulir wajib diunggah.");
      await trigger("payment_proof_file", { shouldFocus: true });
      return;
    }

    // Pastikan Turnstile token tersedia
    if (!turnstileToken) {
      setTurnstileError("Verifikasi keamanan Cloudflare Turnstile wajib dilengkapi.");
      setStepErrorSummary("Silakan lengkapi verifikasi keamanan (Turnstile) sebelum mengirimkan pendaftaran.");
      window.scrollTo({ top: 400, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setStepErrorSummary(null);

    try {
      const fileSignature = `${paymentFile.name}-${paymentFile.size}-${paymentFile.lastModified}`;
      let targetProofPath = uploadedProof?.fileSignature === fileSignature ? uploadedProof.path : null;
      let targetProofMime = uploadedProof?.fileSignature === fileSignature ? uploadedProof.mime : paymentFile.type;
      let targetProofSize = uploadedProof?.fileSignature === fileSignature ? uploadedProof.size : paymentFile.size;

      // 1. Unggah bukti bayar langsung ke Supabase Storage (bila belum terunggah)
      if (!targetProofPath) {
        setUploadProgressText("Mempersiapkan sesi penyimpanan bukti transfer...");

        const uploadUrlRes = await requestUploadUrl({
          mime: paymentFile.type,
          size: paymentFile.size,
        });

        if (!uploadUrlRes.success || !uploadUrlRes.data) {
          setStepErrorSummary(
            uploadUrlRes.message || "Gagal memulai sesi pengunggahan bukti bayar. Silakan coba lagi."
          );
          setIsSubmitting(false);
          setUploadProgressText(null);
          return;
        }

        setUploadProgressText("Mengunggah foto bukti transfer ke penyimpanan aman...");

        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .uploadToSignedUrl(uploadUrlRes.data.path, uploadUrlRes.data.token, paymentFile);

        if (uploadError) {
          console.error("[UPLOAD_TO_SIGNED_URL] Gagal mengunggah file:", uploadError);
          setStepErrorSummary("Gagal mengunggah foto bukti bayar. Periksa koneksi internet Anda dan coba lagi.");
          setIsSubmitting(false);
          setUploadProgressText(null);
          return;
        }

        targetProofPath = uploadUrlRes.data.path;
        targetProofMime = paymentFile.type;
        targetProofSize = paymentFile.size;

        // Simpan cache agar percobaan submit berikutnya tidak perlu upload ulang
        setUploadedProof({
          fileSignature,
          path: targetProofPath,
          mime: targetProofMime,
          size: targetProofSize,
        });
      }

      // 2. Kirim Server Action createRegistration
      setUploadProgressText("Memverifikasi dan menyimpan data pendaftaran Anda...");

      const registrationResult = await createRegistration({
        student_name: formData.student_name,
        student_nickname: formData.student_nickname,
        birth_place: formData.birth_place,
        birth_date: formData.birth_date,
        gender: formData.gender,
        siblings_count: Number(formData.siblings_count),
        birth_order: Number(formData.birth_order),
        student_address: formData.student_address,
        contact_phone: formData.contact_phone,
        hobby: formData.hobby,
        achievements: formData.achievements || "-",
        medical_conditions: formData.medical_conditions || "-",

        father_name: formData.father_name,
        mother_name: formData.mother_name,
        father_education: formData.father_education,
        mother_education: formData.mother_education,
        father_job: formData.father_job,
        mother_job: formData.mother_job,
        parent_address: formData.parent_address,

        payment_proof_path: targetProofPath,
        payment_proof_mime: targetProofMime as "image/jpeg" | "image/png" | "image/webp",
        payment_proof_size: targetProofSize,

        consented: true,
        honeypot: formData.honeypot || "",
        turnstile_token: turnstileToken,
      });

      if (!registrationResult.success || !registrationResult.id) {
        if (registrationResult.fieldErrors) {
          Object.entries(registrationResult.fieldErrors).forEach(([field, msg]) => {
            setError(field as keyof RegistrationFormData, { message: msg });
          });
        }
        setStepErrorSummary(
          registrationResult.message || "Pendaftaran belum dapat disimpan. Silakan periksa kembali isian Anda."
        );
        window.scrollTo({ top: 140, behavior: "smooth" });
        setIsSubmitting(false);
        setUploadProgressText(null);
        return;
      }

      // 3. Sukses: Bersihkan draf dan redirect ke /berhasil/[id]
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      router.push(`/berhasil/${registrationResult.id}`);
    } catch (err) {
      console.error("[FORM_SUBMIT] Terjadi kendala submit:", err);
      setStepErrorSummary(
        "Terjadi gangguan pada sambungan jaringan saat mengirimkan pendaftaran. Isian Anda tetap aman, silakan coba kirim ulang."
      );
      setIsSubmitting(false);
      setUploadProgressText(null);
      window.scrollTo({ top: 140, behavior: "smooth" });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
        className="relative flex flex-col w-full max-w-xl mx-auto"
      >
        {/* Indikator Progres Langkah */}
        <div className="mb-6 px-1">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) {
                handleEditStep(step);
              }
            }}
          />
        </div>

        {/* Ringkasan Pesan Error jika Ada Masalah */}
        {stepErrorSummary && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-control bg-danger/10 border border-danger/30 text-danger text-xs font-medium flex items-start gap-2.5 text-left animate-enter"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{stepErrorSummary}</span>
          </div>
        )}

        {/* Konten Langkah Aktif */}
        <div className="min-h-[420px] transition-opacity duration-200">
          {currentStep === 1 && <StepStudent />}
          {currentStep === 2 && <StepParent />}
          {currentStep === 3 && (
            <StepPayment
              onEditStep={handleEditStep}
              file={paymentFile}
              onFileSelect={handleFileSelect}
              paymentSettings={paymentSettings}
              onTurnstileSuccess={handleTurnstileSuccess}
              onTurnstileExpire={handleTurnstileExpire}
              onTurnstileError={handleTurnstileError}
              turnstileError={turnstileError}
              uploadProgressText={uploadProgressText}
            />
          )}
        </div>

        {/* Tombol Aksi Sticky / Floating di Bawah Layar */}
        <div
          className={cn(
            "sticky bottom-0 sm:bottom-4 z-30 mt-8",
            "-mx-4 sm:mx-0 px-4 py-3 sm:p-4",
            "bg-surface/95 backdrop-blur-md",
            "border-t sm:border border-muted/20",
            "shadow-[0_-4px_16px_rgba(0,0,0,0.05)] sm:shadow-lg sm:rounded-card",
            "pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-4",
            "transition-all duration-200"
          )}
        >
          <div className="flex items-center gap-3 max-w-xl mx-auto w-full">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                iconLeft={<ArrowLeft className="h-4 w-4" />}
                aria-label="Kembali ke form sebelumnya"
                className="flex-1 sm:flex-initial sm:min-w-[170px] h-11 text-sm sm:text-base font-medium"
              >
                <span className="hidden sm:inline">Kembali ke Form Sebelumnya</span>
                <span className="sm:hidden">Sebelumnya</span>
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                iconRight={<ArrowRight className="h-4 w-4" />}
                aria-label={
                  currentStep === 1
                    ? "Lanjut ke data orang tua"
                    : "Lanjut ke form pembayaran dan konfirmasi"
                }
                className={cn(
                  "h-11 text-sm sm:text-base font-semibold shadow-sm",
                  currentStep === 1
                    ? "w-full sm:w-auto sm:min-w-[200px] sm:ml-auto"
                    : "flex-1 sm:flex-initial sm:min-w-[170px] sm:ml-auto"
                )}
              >
                <span className="hidden sm:inline">
                  {currentStep === 1
                    ? "Lanjut ke Data Orang Tua"
                    : "Lanjut ke Pembayaran"}
                </span>
                <span className="sm:hidden">
                  {currentStep === 1 ? "Lanjut ke Data Orang Tua" : "Lanjut"}
                </span>
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
                iconRight={!isSubmitting ? <Send className="h-4 w-4" /> : undefined}
                aria-label="Kirim formulir pendaftaran SPMB"
                className="flex-1 sm:flex-initial sm:min-w-[190px] sm:ml-auto h-11 text-sm sm:text-base font-semibold shadow-sm"
              >
                Kirim Pendaftaran
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
