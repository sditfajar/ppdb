import { describe, it, expect } from "vitest";
import { studentSchema } from "@/lib/validation/registration";
import { normalizeIdPhone, formatIdPhone } from "@/lib/phone";
import { getActiveWave } from "@/lib/wave";
import { sanitizeCsvCell, escapeCsvValue, generateRegistrationsCsv, type RegistrationRow } from "@/lib/csv";
import { sanitizePostgrestSearch } from "@/lib/sanitize";

describe("QA Edge Cases & Boundary Conditions (Fase 7)", () => {
  describe("1. Batas Usia & Skema Siswa", () => {
    const baseValidStudent = {
      student_name: "Ahmad Farhan",
      student_nickname: "Farhan",
      birth_place: "Jakarta",
      birth_date: "2019-05-10",
      gender: "L" as const,
      siblings_count: 2,
      birth_order: 1,
      student_address: "Jl. Margonda Raya No. 10, Depok",
      contact_phone: "081234567890",
      hobby: "Membaca",
      achievements: "-",
      medical_conditions: "-",
    };

    it("menerima nama siswa dengan apostrof atau tanda petik (misal: Syafi'i, Ma'ruf)", () => {
      const res = studentSchema.safeParse({
        ...baseValidStudent,
        student_name: "Muhammad Syafi'i Nur",
      });
      expect(res.success).toBe(true);
    });

    it("menerima nama panjang dengan gelar atau nama keluarga (misal: Raden Mas Dananjaya)", () => {
      const res = studentSchema.safeParse({
        ...baseValidStudent,
        student_name: "Raden Mas Dananjaya Kusumaningrat Adipati",
      });
      expect(res.success).toBe(true);
    });

    it("menolak jumlah saudara negatif atau melebihi 20", () => {
      const resNegative = studentSchema.safeParse({
        ...baseValidStudent,
        siblings_count: -1,
      });
      expect(resNegative.success).toBe(false);

      const resOver = studentSchema.safeParse({
        ...baseValidStudent,
        siblings_count: 21,
      });
      expect(resOver.success).toBe(false);
    });

    it("menerima jumlah saudara 0 (anak tunggal)", () => {
      const res = studentSchema.safeParse({
        ...baseValidStudent,
        siblings_count: 0,
        birth_order: 1,
      });
      expect(res.success).toBe(true);
    });
  });

  describe("2. Normalisasi Format Nomor Telepon Ekstrem", () => {
    it("menangani format awalan +62 dengan benar", () => {
      expect(normalizeIdPhone("+62 812-3456-7890")).toBe("6281234567890");
      expect(normalizeIdPhone("+6281234567890")).toBe("6281234567890");
    });

    it("menangani format awalan 62 tanpa plus", () => {
      expect(normalizeIdPhone("6281234567890")).toBe("6281234567890");
    });

    it("menangani format lokal 08 dengan spasi dan strip berlebih", () => {
      expect(normalizeIdPhone("0812 - 3456 - 7890")).toBe("6281234567890");
    });

    it("menolak nomor telepon terlalu pendek (< 10 digit)", () => {
      expect(() => normalizeIdPhone("0812345")).toThrow();
    });

    it("menolak nomor telepon terlalu panjang (> 15 digit)", () => {
      expect(() => normalizeIdPhone("081234567890123456")).toThrow();
    });

    it("formatIdPhone mengembalikan representasi 08xx-xxxx-xxxx yang rapi", () => {
      expect(formatIdPhone("6281234567890")).toBe("0812-3456-7890");
      expect(formatIdPhone("081234567890")).toBe("0812-3456-7890");
    });
  });

  describe("3. Formula CSV Injection Ekstrem & RFC 4180", () => {
    it("menetralisir berbagai varian formula berbahaya dengan awalan apostrof (')", () => {
      expect(sanitizeCsvCell("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
      expect(sanitizeCsvCell("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0");
      expect(sanitizeCsvCell("+123456789")).toBe("'+123456789");
      expect(sanitizeCsvCell("-5+10")).toBe("'-5+10");
      expect(sanitizeCsvCell("@SUM(A1)")).toBe("'@SUM(A1)");
      expect(sanitizeCsvCell("\t=1+1")).toBe("'\t=1+1");
      expect(sanitizeCsvCell("\r=1+1")).toBe("'\r=1+1");
    });

    it("TIDAK menambahkan apostrof pada tanda hubung tunggal '-' (AC-12)", () => {
      expect(sanitizeCsvCell("-")).toBe("-");
    });

    it("menangani nilai null dan undefined menjadi string kosong", () => {
      expect(sanitizeCsvCell(null)).toBe("");
      expect(sanitizeCsvCell(undefined)).toBe("");
    });

    it("meng-escape karakter khusus tanda kutip, koma, dan newline sesuai RFC 4180", () => {
      expect(escapeCsvValue('Data dengan "kutip"')).toBe('"Data dengan ""kutip"""');
      expect(escapeCsvValue("Data, dengan koma")).toBe('"Data, dengan koma"');
      expect(escapeCsvValue("Data\nbaris baru")).toBe('"Data\nbaris baru"');
      expect(escapeCsvValue("Teks normal")).toBe("Teks normal");
    });

    it("generateRegistrationsCsv menghasilkan file dengan awalan UTF-8 BOM", () => {
      const mockRows: RegistrationRow[] = [
        {
          id: "11111111-1111-1111-1111-111111111111",
          reg_number: "REG-2026-G1-001",
          academic_year: "2026/2027",
          wave: 1,
          status: "pending",
          student_name: "Budi Santoso",
          student_nickname: "Budi",
          birth_place: "Depok",
          birth_date: "2019-01-01",
          gender: "L",
          siblings_count: 2,
          birth_order: 1,
          student_address: "Jl. Melati No. 5",
          contact_phone: "6281234567890",
          hobby: "Membaca",
          achievements: "-",
          medical_conditions: "-",
          father_name: "Santoso",
          father_education: "s1_s3",
          father_job: "PNS",
          mother_name: "Siti",
          mother_education: "s1_s3",
          mother_job: "Ibu Rumah Tangga",
          parent_address: "Jl. Melati No. 5",
          payment_proof_path: "proofs/2026/test.jpg",
          payment_proof_mime: "image/jpeg",
          payment_proof_size: 1024,
          rejection_reason: null,
          admin_note: null,
          reviewed_by: null,
          reviewed_at: null,
          consented_at: "2026-10-01T08:00:00Z",
          created_at: "2026-10-01T08:00:00Z",
          updated_at: "2026-10-01T08:00:00Z",
        },
      ];

      const csv = generateRegistrationsCsv(mockRows);
      // UTF-8 BOM adalah \uFEFF (0xEF, 0xBB, 0xBF)
      expect(csv.startsWith("\uFEFF")).toBe(true);
      expect(csv).toContain("REG-2026-G1-001");
      expect(csv).toContain("Budi Santoso");
    });
  });

  describe("4. Penentuan Gelombang & Batas Waktu WIB", () => {
    it("mengembalikan Gelombang 1 pada bulan September hingga Februari", () => {
      // 1 September 2026 00:00:00 UTC (07:00:00 WIB)
      expect(getActiveWave(new Date("2026-09-01T00:00:00Z"))).toBe(1);
      // 28 Februari 2027 16:59:59 UTC (23:59:59 WIB)
      expect(getActiveWave(new Date("2027-02-28T16:59:59Z"))).toBe(1);
    });

    it("mengembalikan Gelombang 2 pada bulan Maret hingga Juni", () => {
      // 1 Maret 2027 00:00:00 WIB
      expect(getActiveWave(new Date("2027-03-01T00:00:00+07:00"))).toBe(2);
      // 30 Juni 2027 23:59:59 WIB
      expect(getActiveWave(new Date("2027-06-30T23:59:59+07:00"))).toBe(2);
    });

    it("mengembalikan null (tutup) pada bulan Juli dan Agustus", () => {
      expect(getActiveWave(new Date("2027-07-15T12:00:00+07:00"))).toBeNull();
      expect(getActiveWave(new Date("2027-08-31T23:59:59+07:00"))).toBeNull();
    });

    it("menangani tahun kabisat (29 Februari)", () => {
      // 2028 adalah tahun kabisat
      expect(getActiveWave(new Date("2028-02-29T12:00:00+07:00"))).toBe(1);
    });
  });

  describe("5. Sanitasi Pencarian Admin dari Karakter Liar", () => {
    it("menetralisir karakter wildcard SQL (% dan _)", () => {
      const sanitized = sanitizePostgrestSearch("budi%santoso_depok");
      expect(sanitized).not.toContain("%");
      expect(sanitized).not.toContain("_");
      expect(sanitized).toBe("budi santoso depok");
    });

    it("menghilangkan tanda kurung, koma, dan kutip berbahaya untuk PostgREST", () => {
      const sanitized = sanitizePostgrestSearch("('Ahmad', 'Fauzi')");
      expect(sanitized).not.toContain("(");
      expect(sanitized).not.toContain(")");
      expect(sanitized).not.toContain(",");
      expect(sanitized).not.toContain("'");
      expect(sanitized).toBe("Ahmad Fauzi");
    });

    it("menangani string kosong, null, atau spasi berlebih", () => {
      expect(sanitizePostgrestSearch("")).toBe("");
      expect(sanitizePostgrestSearch(null)).toBe("");
      expect(sanitizePostgrestSearch("   budi    santoso   ")).toBe("budi santoso");
    });
  });
});
