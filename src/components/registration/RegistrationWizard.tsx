"use client";

import * as React from "react";
import { useForm, FormProvider, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Stepper, type StepItem } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { StepStudent } from "@/components/registration/StepStudent";
import { StepParent } from "@/components/registration/StepParent";
import { StepPayment } from "@/components/registration/StepPayment";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/validation/registration";

const DRAFT_STORAGE_KEY = "ppdb:draft:v1";

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

export function RegistrationWizard() {
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [paymentFile, setPaymentFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = React.useState<boolean>(false);
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
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  // 1. Memulihkan draf dari localStorage saat pertama kali dimuat
  React.useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        // Pastikan file tidak ikut diparsing
        delete parsed.payment_proof_file;
        reset(parsed);
      }
    } catch {
      // Abaikan jika localStorage tidak dapat diakses
    }
  }, [reset]);

  // 2. Auto-save draf formulir ke localStorage (tanpa file) via subscription
  React.useEffect(() => {
    const subscription = watch((formValues) => {
      if (!isDirty || isSubmittedSuccess) return;

      const dataToSave: Record<string, unknown> = { ...formValues };
      // JANGAN pernah simpan file bukti bayar ke localStorage
      delete dataToSave.payment_proof_file;

      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(dataToSave));
      } catch {
        // Kuota penyimpanan mungkin penuh
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isDirty, isSubmittedSuccess]);

  // 3. Peringatan beforeunload bila ada isian yang belum dikirim
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmittedSuccess) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmittedSuccess]);

  // Sinkronisasi paymentFile ke react-hook-form value
  const handleFileSelect = (file: File | null) => {
    setPaymentFile(file);
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
      // Gulir ke atas formulir agar pengguna melihat error
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

  // onSubmit sementara: panggil stub submitRegistration dengan delay 800ms
  const onFormSubmit: SubmitHandler<RegistrationFormData> = async () => {
    if (isSubmitting) return;

    // Pastikan file bukti bayar sudah dipilih
    if (!paymentFile) {
      setStepErrorSummary("Foto bukti pembayaran formulir wajib diunggah.");
      await trigger("payment_proof_file", { shouldFocus: true });
      return;
    }

    setIsSubmitting(true);
    setStepErrorSummary(null);

    try {
      // Stub simulasi submit
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Hapus draf setelah sukses
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setIsSubmittedSuccess(true);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch {
      setStepErrorSummary(
        "Terjadi kendala saat mengirimkan pendaftaran. Isian Anda aman, silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilan Sukses (Simulasi Fase 3 — akan dialihkan ke /berhasil/[id] di Fase 4)
  if (isSubmittedSuccess) {
    return (
      <div className="rounded-card bg-surface shadow-border p-6 sm:p-8 text-center max-w-xl mx-auto space-y-4 animate-enter">
        <div className="h-14 w-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground text-balance">
          Pendaftaran Berhasil Dikirim (Simulasi Fase 3)
        </h3>
        <p className="text-sm text-muted text-pretty">
          Terima kasih telah melengkapi formulir PPDB SDIT Fajar. Pada Fase 4, data ini akan
          langsung disimpan ke Supabase dan dialihkan ke halaman resmi nomor registrasi.
        </p>
        <div className="pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setIsSubmittedSuccess(false);
              setCurrentStep(1);
              reset();
              setPaymentFile(null);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Isi Formulir Baru
          </Button>
        </div>
      </div>
    );
  }

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
            />
          )}
        </div>

        {/* Tombol Aksi Sticky di Bawah Layar untuk Mobile */}
        <div className="sticky bottom-0 z-30 mt-8 -mx-4 sm:mx-0 px-4 py-3 bg-surface/95 backdrop-blur-md shadow-border sm:rounded-card border-t sm:border border-muted/15 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-all">
          <div className="flex items-center justify-between gap-3 max-w-xl mx-auto">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="min-w-[100px] h-11"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Kembali
              </Button>
            ) : (
              <div /> // Spacer agar tombol Lanjut tetap di kanan
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                className="min-w-[130px] h-11 font-semibold ml-auto"
              >
                Lanjut
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="min-w-[160px] h-11 font-semibold ml-auto"
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
