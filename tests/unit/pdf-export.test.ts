import { describe, it, expect } from "vitest";
import { generateRegistrationsPdf } from "@/lib/pdf";
import { RegistrationRow } from "@/lib/csv";
import { PDFDocument } from "pdf-lib";

describe("PDF Export Functionality", () => {
  const mockRegistrations: RegistrationRow[] = [
    {
      id: "uuid-1",
      reg_number: "REG-2026-001",
      academic_year: "2026/2027",
      wave: 1,
      status: "verified",
      student_name: "Muhammad Fajar",
      student_nickname: "Fajar",
      gender: "L",
      birth_place: "Depok",
      birth_date: "2019-06-15",
      siblings_count: 2,
      birth_order: 1,
      student_address: "Jl. Margonda Raya No. 10",
      contact_phone: "6281234567890",
      hobby: "Membaca",
      achievements: "Juara 1 Lomba Tahfidz",
      medical_conditions: "-",
      father_name: "Ahmad Santoso",
      father_education: "s1_s3",
      father_job: "PNS",
      mother_name: "Siti Rahma",
      mother_education: "s1_s3",
      mother_job: "Guru",
      parent_address: "Jl. Margonda Raya No. 10",
      payment_proof_path: "proofs/2026/test.jpg",
      payment_proof_mime: "image/jpeg",
      payment_proof_size: 1024,
      rejection_reason: null,
      admin_note: "Berkas lengkap dan sesuai.",
      reviewed_by: "admin-uuid",
      reviewed_at: "2026-10-01T09:00:00Z",
      consented_at: "2026-10-01T08:00:00Z",
      created_at: "2026-10-01T08:00:00Z",
      updated_at: "2026-10-01T09:00:00Z",
    },
  ];

  it("menghasilkan Uint8Array berkas PDF valid dan ber-header PDF", async () => {
    const pdfBytes = await generateRegistrationsPdf(mockRegistrations, {
      academicYear: "2026/2027",
      filterSummary: "Status: verified",
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);

    // Verifikasi magic header PDF (%PDF-)
    const headerString = String.fromCharCode(...pdfBytes.slice(0, 5));
    expect(headerString).toBe("%PDF-");

    // Dapat di-load kembali oleh PDFDocument
    const pdfDoc = await PDFDocument.load(pdfBytes);
    expect(pdfDoc.getPageCount()).toBeGreaterThanOrEqual(1);

    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    // A4 Landscape: width 841.89, height 595.28
    expect(Math.round(width)).toBe(842);
    expect(Math.round(height)).toBe(595);
  });

  it("dapat memproses data kosong tanpa error", async () => {
    const pdfBytes = await generateRegistrationsPdf([], {
      academicYear: "2026/2027",
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    expect(pdfDoc.getPageCount()).toBe(1);
  });
});
