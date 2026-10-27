import { describe, it, expect } from "vitest";
import { generateRegistrationsExcel } from "@/lib/excel";
import { RegistrationRow } from "@/lib/csv";
import ExcelJS from "exceljs";

describe("Excel Export Functionality", () => {
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
    {
      id: "uuid-2",
      reg_number: "REG-2026-002",
      academic_year: "2026/2027",
      wave: 1,
      status: "rejected",
      student_name: "Aisyah Putri",
      student_nickname: "Aisyah",
      gender: "P",
      birth_place: "Jakarta",
      birth_date: "2019-08-20",
      siblings_count: 1,
      birth_order: 2,
      student_address: "Jl. Melati No. 5",
      contact_phone: "6289876543210",
      hobby: "Menggambar",
      achievements: "-",
      medical_conditions: "-",
      father_name: "Budi",
      father_education: "sma_smk_ma",
      father_job: "Wiraswasta",
      mother_name: "Dewi",
      mother_education: "d1_d3",
      mother_job: "Ibu Rumah Tangga",
      parent_address: "Jl. Melati No. 5",
      payment_proof_path: "proofs/2026/test2.jpg",
      payment_proof_mime: "image/jpeg",
      payment_proof_size: 2048,
      rejection_reason: "Foto bukti transfer buram.",
      admin_note: null,
      reviewed_by: "admin-uuid",
      reviewed_at: "2026-10-01T10:00:00Z",
      consented_at: "2026-10-01T09:30:00Z",
      created_at: "2026-10-01T09:30:00Z",
      updated_at: "2026-10-01T10:00:00Z",
    },
  ];

  it("menghasilkan buffer Excel valid dan dapat dibaca kembali oleh ExcelJS", async () => {
    const buffer = await generateRegistrationsExcel(mockRegistrations);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);

    const worksheet = workbook.getWorksheet("Data Pendaftar");
    expect(worksheet).toBeDefined();
    if (!worksheet) return;

    // Baris 1: Header
    expect(worksheet.rowCount).toBe(3); // 1 header + 2 data
    expect(worksheet.getRow(1).getCell(1).value).toBe("No. Registrasi");
    expect(worksheet.getRow(1).getCell(6).value).toBe("Nama Siswa");

    // Baris 2: Data pertama
    expect(worksheet.getRow(2).getCell(1).value).toBe("REG-2026-001");
    expect(worksheet.getRow(2).getCell(3).value).toBe("Terverifikasi");
    expect(worksheet.getRow(2).getCell(6).value).toBe("Muhammad Fajar");

    // Baris 3: Data kedua
    expect(worksheet.getRow(3).getCell(1).value).toBe("REG-2026-002");
    expect(worksheet.getRow(3).getCell(3).value).toBe("Ditolak");
    expect(worksheet.getRow(3).getCell(25).value).toBe("Foto bukti transfer buram.");
  });

  it("menangani data pendaftar kosong tanpa error", async () => {
    const buffer = await generateRegistrationsExcel([]);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);
    const worksheet = workbook.getWorksheet("Data Pendaftar");
    expect(worksheet?.rowCount).toBe(1); // Hanya header
  });
});
