"use client";

import * as React from "react";
import { Edit3, User, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EDUCATION_OPTIONS, type RegistrationFormData } from "@/lib/validation/registration";
import { formatIdPhone } from "@/lib/phone";

export interface ReviewSummaryProps {
  data: Partial<RegistrationFormData>;
  onEditStep: (stepNumber: number) => void;
  className?: string;
}

export function ReviewSummary({ data, onEditStep, className }: ReviewSummaryProps) {
  const getEducationLabel = (val?: string) => {
    return EDUCATION_OPTIONS.find((opt) => opt.value === val)?.label || val || "-";
  };

  const getGenderLabel = (g?: string) => {
    if (g === "L") return "Laki-laki";
    if (g === "P") return "Perempuan";
    return "-";
  };

  return (
    <div className={`space-y-4 text-left ${className || ""}`}>
      {/* Bagian Data Siswa */}
      <div className="rounded-card bg-surface shadow-border p-4 sm:p-5 transition-all">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-muted/15">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Data Calon Siswa</h4>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            className="text-xs h-8 text-accent hover:text-accent/80 hover:bg-accent/10 px-2.5"
            aria-label="Ubah data calon siswa"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            Ubah
          </Button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt className="text-muted font-medium">Nama Lengkap</dt>
            <dd className="font-semibold text-foreground text-sm mt-0.5">
              {data.student_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Nama Panggilan</dt>
            <dd className="text-foreground mt-0.5">{data.student_nickname || "-"}</dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Tempat, Tanggal Lahir</dt>
            <dd className="text-foreground mt-0.5 tabular-nums">
              {data.birth_place ? `${data.birth_place}, ` : ""}
              {data.birth_date || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Jenis Kelamin</dt>
            <dd className="text-foreground mt-0.5">{getGenderLabel(data.gender)}</dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Anak Ke / Jumlah Saudara</dt>
            <dd className="text-foreground mt-0.5 tabular-nums">
              Anak ke-{data.birth_order ?? "-"} dari {data.siblings_count ?? 0} bersaudara
            </dd>
          </div>
          <div>
            <dt className="text-muted font-medium">No. WhatsApp / HP</dt>
            <dd className="text-foreground font-medium mt-0.5 tabular-nums">
              {data.contact_phone ? formatIdPhone(data.contact_phone) : "-"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted font-medium">Alamat Tempat Tinggal</dt>
            <dd className="text-foreground mt-0.5 text-pretty leading-relaxed">
              {data.student_address || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Hobi</dt>
            <dd className="text-foreground mt-0.5">{data.hobby || "-"}</dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Prestasi</dt>
            <dd className="text-foreground mt-0.5">{data.achievements || "-"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted font-medium">Riwayat Penyakit Berat</dt>
            <dd className="text-foreground mt-0.5">{data.medical_conditions || "-"}</dd>
          </div>
        </dl>
      </div>

      {/* Bagian Data Orang Tua */}
      <div className="rounded-card bg-surface shadow-border p-4 sm:p-5 transition-all">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-muted/15">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-foreground">Data Orang Tua</h4>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(2)}
            className="text-xs h-8 text-accent hover:text-accent/80 hover:bg-accent/10 px-2.5"
            aria-label="Ubah data orang tua"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            Ubah
          </Button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt className="text-muted font-medium">Nama Ayah</dt>
            <dd className="font-semibold text-foreground text-sm mt-0.5">
              {data.father_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Pendidikan & Pekerjaan Ayah</dt>
            <dd className="text-foreground mt-0.5">
              {getEducationLabel(data.father_education)} • {data.father_job || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Nama Ibu</dt>
            <dd className="font-semibold text-foreground text-sm mt-0.5">
              {data.mother_name || "-"}
            </dd>
          </div>
          <div>
            <dt className="text-muted font-medium">Pendidikan & Pekerjaan Ibu</dt>
            <dd className="text-foreground mt-0.5">
              {getEducationLabel(data.mother_education)} • {data.mother_job || "-"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted font-medium">Alamat Orang Tua</dt>
            <dd className="text-foreground mt-0.5 text-pretty leading-relaxed">
              {data.parent_address || "-"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
