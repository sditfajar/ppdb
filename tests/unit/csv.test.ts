import { describe, it, expect } from "vitest";
import {
  sanitizeCsvCell,
  escapeCsvValue,
  serializeRegistrationToCsvRow,
  generateRegistrationsCsv,
  CSV_HEADERS,
  RegistrationRow,
} from "@/lib/csv";

describe("sanitizeCsvCell - Anti Formula Injection", () => {
  it("membiarkan string normal tanpa perubahan", () => {
    expect(sanitizeCsvCell("Ahmad Dahlan")).toBe("Ahmad Dahlan");
    expect(sanitizeCsvCell("SDIT Fajar")).toBe("SDIT Fajar");
    expect(sanitizeCsvCell("12345")).toBe("12345");
  });

  it("menangani nilai null dan undefined menjadi string kosong", () => {
    expect(sanitizeCsvCell(null)).toBe("");
    expect(sanitizeCsvCell(undefined)).toBe("");
  });

  it("PENGECUALIAN KRUSIAL: membiarkan nilai persis '-' apa adanya", () => {
    expect(sanitizeCsvCell("-")).toBe("-");
  });

  it("menetralisir sel berawalan '-' jika bukan tanda hubung tunggal", () => {
    expect(sanitizeCsvCell("--")).toBe("'--");
    expect(sanitizeCsvCell("-100")).toBe("'-100");
    expect(sanitizeCsvCell("-calc")).toBe("'-calc");
  });

  it("menetralisir sel berawalan '='", () => {
    expect(sanitizeCsvCell("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
    expect(sanitizeCsvCell("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0");
  });

  it("menetralisir sel berawalan '+'", () => {
    expect(sanitizeCsvCell("+6281234567890")).toBe("'+6281234567890");
    expect(sanitizeCsvCell("+1+1")).toBe("'+1+1");
  });

  it("menetralisir sel berawalan '@'", () => {
    expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
    expect(sanitizeCsvCell("@mention")).toBe("'@mention");
  });

  it("menetralisir sel berawalan tab (\\t) dan carriage return (\\r)", () => {
    expect(sanitizeCsvCell("\tcmd")).toBe("'\tcmd");
    expect(sanitizeCsvCell("\rcmd")).toBe("'\rcmd");
  });
});

describe("escapeCsvValue - RFC 4180 Escaping", () => {
  it("tidak membungkus nilai biasa yang tidak memiliki karakter khusus", () => {
    expect(escapeCsvValue("Budi")).toBe("Budi");
    expect(escapeCsvValue("123456")).toBe("123456");
  });

  it("membungkus nilai dengan koma dalam tanda kutip ganda", () => {
    expect(escapeCsvValue("Depok, Jawa Barat")).toBe('"Depok, Jawa Barat"');
  });

  it("menggandakan tanda kutip ganda di dalam nilai", () => {
    expect(escapeCsvValue('Kata "Halo" dunia')).toBe('"Kata ""Halo"" dunia"');
  });

  it("membungkus nilai dengan baris baru (\\n atau \\r)", () => {
    expect(escapeCsvValue("Baris 1\nBaris 2")).toBe('"Baris 1\nBaris 2"');
    expect(escapeCsvValue("Baris 1\r\nBaris 2")).toBe('"Baris 1\r\nBaris 2"');
  });
});

describe("generateRegistrationsCsv", () => {
  const mockRegistration: RegistrationRow = {
    id: "uuid-1234",
    reg_number: "SPMB-2026-0001",
    academic_year: "2026/2027",
    wave: 1,
    status: "verified",
    student_name: "Muhammad Rizky",
    student_nickname: "Rizky",
    gender: "L",
    birth_place: "Depok",
    birth_date: "2019-05-12",
    siblings_count: 2,
    birth_order: 1,
    student_address: "Jl. Margonda No. 12, RT 01/RW 02",
    contact_phone: "6281234567890",
    hobby: "Membaca, Berenang",
    achievements: "-",
    medical_conditions: "-",
    father_name: "Ahmad Subagio",
    father_education: "s1_s3",
    father_job: "Karyawan Swasta",
    mother_name: "Siti Rahmawati",
    mother_education: "s1_s3",
    mother_job: "Ibu Rumah Tangga",
    parent_address: "Jl. Margonda No. 12, RT 01/RW 02",
    admin_note: "Berkas lengkap dan sesuai.",
    rejection_reason: null,
    reviewed_by: "admin-uuid",
    reviewed_at: "2026-10-27T10:00:00Z",
    payment_proof_path: "proofs/2026/bukti.jpg",
    payment_proof_mime: "image/jpeg",
    payment_proof_size: 204800,
    consented_at: "2026-10-27T09:00:00Z",
    created_at: "2026-10-27T09:00:00Z",
    updated_at: "2026-10-27T10:00:00Z",
  };

  it("menghasilkan CSV yang berawalan UTF-8 BOM (\\uFEFF)", () => {
    const csv = generateRegistrationsCsv([mockRegistration]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
  });

  it("menyertakan header Bahasa Indonesia secara lengkap", () => {
    const csv = generateRegistrationsCsv([mockRegistration]);
    const firstLine = csv.slice(1).split("\r\n")[0];
    expect(firstLine).toBe(CSV_HEADERS.map((h) => escapeCsvValue(h)).join(","));
  });

  it("memformat data pendaftar dan menjaga nilai '-' tanpa tanda kutip berbahaya", () => {
    const row = serializeRegistrationToCsvRow(mockRegistration);
    // Kolom ke-0: reg_number
    expect(row[0]).toBe("SPMB-2026-0001");
    // Kolom ke-2: status terformat Bahasa Indonesia
    expect(row[2]).toBe("Terverifikasi");
    // Kolom ke-13: No HP dengan awalan teks
    expect(row[13]).toBe("'6281234567890");
    // Kolom ke-15: Prestasi bernilai "-"
    expect(row[15]).toBe("-");
    // Kolom ke-16: Riwayat Penyakit bernilai "-"
    expect(row[16]).toBe("-");
    // Kolom ke-18: Pendidikan Ayah
    expect(row[18]).toBe("S1 / S2 / S3");
  });

  it("menetralisir formula injection pada nama atau field teks pendaftar", () => {
    const maliciousReg: RegistrationRow = {
      ...mockRegistration,
      student_name: "=cmd|' /C calc'!A0",
      admin_note: "+12345 rumus",
      achievements: "@lookup(secret)",
    };

    const row = serializeRegistrationToCsvRow(maliciousReg);
    expect(row[5]).toBe("'=cmd|' /C calc'!A0");
    expect(row[25]).toBe("'+12345 rumus");
    expect(row[15]).toBe("'@lookup(secret)");
  });
});
