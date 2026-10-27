"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { EDUCATION_OPTIONS, type RegistrationFormData } from "@/lib/validation/registration";

export function StepParent() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const studentAddress = watch("student_address");
  const parentAddress = watch("parent_address");

  const [sameAddressChecked, setSameAddressChecked] = React.useState<boolean>(() => {
    return !!studentAddress && studentAddress === parentAddress;
  });

  const handleSameAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSameAddressChecked(isChecked);
    if (isChecked) {
      setValue("parent_address", studentAddress || "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Data Ayah */}
      <div className="space-y-4 rounded-card bg-surface/50 shadow-border p-4 sm:p-5">
        <h4 className="text-sm font-semibold text-foreground border-b border-muted/15 pb-2">
          Data Ayah Kandung / Wali
        </h4>

        <Field
          label="Nama Lengkap Ayah"
          required
          error={errors.father_name?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              {...register("father_name")}
              placeholder="Sesuai KTP / KK"
              autoComplete="name"
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Pendidikan Tertinggi Ayah"
            required
            error={errors.father_education?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <Select
                id={id}
                placeholder="Pilih tingkat pendidikan..."
                options={EDUCATION_OPTIONS}
                {...register("father_education")}
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>

          <Field
            label="Pekerjaan Ayah"
            required
            error={errors.father_job?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <TextInput
                id={id}
                {...register("father_job")}
                placeholder="Contoh: Karyawan Swasta, PNS, Wiraswasta"
                enterKeyHint="next"
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>
        </div>
      </div>

      {/* Data Ibu */}
      <div className="space-y-4 rounded-card bg-surface/50 shadow-border p-4 sm:p-5">
        <h4 className="text-sm font-semibold text-foreground border-b border-muted/15 pb-2">
          Data Ibu Kandung / Wali
        </h4>

        <Field
          label="Nama Lengkap Ibu"
          required
          error={errors.mother_name?.message}
        >
          {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
            <TextInput
              id={id}
              {...register("mother_name")}
              placeholder="Sesuai KTP / KK"
              autoComplete="name"
              enterKeyHint="next"
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Pendidikan Tertinggi Ibu"
            required
            error={errors.mother_education?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <Select
                id={id}
                placeholder="Pilih tingkat pendidikan..."
                options={EDUCATION_OPTIONS}
                {...register("mother_education")}
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>

          <Field
            label="Pekerjaan Ibu"
            required
            error={errors.mother_job?.message}
          >
            {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
              <TextInput
                id={id}
                {...register("mother_job")}
                placeholder="Contoh: Ibu Rumah Tangga, Guru, Dokter"
                enterKeyHint="next"
                aria-describedby={ariaDescribedby}
                aria-invalid={ariaInvalid}
              />
            )}
          </Field>
        </div>
      </div>

      {/* Alamat Orang Tua */}
      <Field
        label="Alamat Lengkap Orang Tua"
        required
        error={errors.parent_address?.message}
      >
        {({ id, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalid }) => (
          <div className="space-y-2">
            <Checkbox
              label="Sama dengan alamat siswa"
              checked={sameAddressChecked}
              onChange={handleSameAddressToggle}
              className="py-1"
            />
            <Textarea
              id={id}
              rows={3}
              placeholder="Alamat domisili orang tua saat ini..."
              {...register("parent_address", {
                onChange: () => setSameAddressChecked(false),
              })}
              aria-describedby={ariaDescribedby}
              aria-invalid={ariaInvalid}
            />
          </div>
        )}
      </Field>
    </div>
  );
}
