import { describe, it, expect } from "vitest";
import {
  studentSchema,
  parentSchema,
  paymentSchema,
  registrationSchema,
  calculateAge,
} from "@/lib/validation/registration";

// Helper fake File object untuk testing Node / Vitest
function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob(["a".repeat(size)], { type });
  return new File([blob], name, { type });
}

describe("registration validation schemas", () => {
  describe("calculateAge", () => {
    it("menghitung usia secara akurat", () => {
      const ref = new Date("2026-10-27T00:00:00Z");
      expect(calculateAge("2020-10-26", ref)).toBe(6);
      expect(calculateAge("2020-10-28", ref)).toBe(5);
      expect(calculateAge("2019-01-01", ref)).toBe(7);
    });
  });

  describe("studentSchema", () => {
    const validStudent = {
      student_name: "Muhammad Ahmad Al-Fatih",
      student_nickname: "Ahmad",
      birth_place: "Depok",
      birth_date: "2020-05-15",
      gender: "L" as const,
      siblings_count: 2,
      birth_order: 1,
      student_address: "Jl. Margonda Raya No. 123, Beji, Depok",
      contact_phone: "081234567890",
      hobby: "Membaca buku dan berenang",
      achievements: "-",
      medical_conditions: "-",
    };

    it("menerima data siswa yang valid", () => {
      const result = studentSchema.safeParse(validStudent);
      expect(result.success).toBe(true);
    });

    it("menolak nama dengan simbol aneh atau angka", () => {
      const result = studentSchema.safeParse({
        ...validStudent,
        student_name: "Ahmad 123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("hanya boleh mengandung huruf");
      }
    });

    it("menolak tanggal lahir masa depan", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = studentSchema.safeParse({
        ...validStudent,
        birth_date: futureDate.toISOString().split("T")[0],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes("masa depan"))).toBe(true);
      }
    });

    it("menolak usia di bawah 4 tahun atau di atas 12 tahun", () => {
      // Usia 2 tahun
      const tooYoung = studentSchema.safeParse({
        ...validStudent,
        birth_date: "2024-01-01",
      });
      expect(tooYoung.success).toBe(false);

      // Usia 15 tahun
      const tooOld = studentSchema.safeParse({
        ...validStudent,
        birth_date: "2011-01-01",
      });
      expect(tooOld.success).toBe(false);
    });

    it("menolak urutan anak yang melebihi jumlah saudara + 1", () => {
      const result = studentSchema.safeParse({
        ...validStudent,
        siblings_count: 1,
        birth_order: 3, // Maksimal harus 2
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("tidak boleh melebihi jumlah saudara + 1");
      }
    });

    it("menerima anak tunggal (siblings_count = 0, birth_order = 1)", () => {
      const result = studentSchema.safeParse({
        ...validStudent,
        siblings_count: 0,
        birth_order: 1,
      });
      expect(result.success).toBe(true);
    });

    it("menolak nomor telepon non-Indonesia", () => {
      const result = studentSchema.safeParse({
        ...validStudent,
        contact_phone: "12345",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("parentSchema", () => {
    const validParent = {
      father_name: "Abdullah",
      mother_name: "Fatimah",
      father_education: "s1_s3" as const,
      mother_education: "s1_s3" as const,
      father_job: "Karyawan Swasta",
      mother_job: "Guru",
      parent_address: "Jl. Margonda Raya No. 123, Beji, Depok",
    };

    it("menerima data orang tua yang valid", () => {
      const result = parentSchema.safeParse(validParent);
      expect(result.success).toBe(true);
    });

    it("menolak jika nama orang tua terlalu pendek", () => {
      const result = parentSchema.safeParse({
        ...validParent,
        father_name: "Ab",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("minimal 3 karakter");
      }
    });

    it("menolak pendidikan di luar enum", () => {
      const result = parentSchema.safeParse({
        ...validParent,
        father_education: "doktoral",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("paymentSchema", () => {
    it("menerima persetujuan true dan file gambar valid <= 5MB", () => {
      const mockFile = createMockFile("bukti.jpg", 1024 * 1024, "image/jpeg");
      const result = paymentSchema.safeParse({
        consented: true,
        payment_proof_file: mockFile,
        honeypot: "",
      });
      expect(result.success).toBe(true);
    });

    it("menolak jika persetujuan belum dicentang (false)", () => {
      const mockFile = createMockFile("bukti.jpg", 1024 * 1024, "image/jpeg");
      const result = paymentSchema.safeParse({
        consented: false,
        payment_proof_file: mockFile,
      });
      expect(result.success).toBe(false);
    });

    it("menolak file PDF atau tipe selain gambar", () => {
      const mockFile = createMockFile("dokumen.pdf", 500 * 1024, "application/pdf");
      const result = paymentSchema.safeParse({
        consented: true,
        payment_proof_file: mockFile,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Format foto tidak didukung");
      }
    });

    it("menolak file lebih dari 5 MB", () => {
      const mockFile = createMockFile("bukti-besar.png", 6 * 1024 * 1024, "image/png");
      const result = paymentSchema.safeParse({
        consented: true,
        payment_proof_file: mockFile,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Ukuran foto maksimal 5 MB");
      }
    });

    it("menolak bot jika honeypot terisi", () => {
      const mockFile = createMockFile("bukti.jpg", 1024 * 1024, "image/jpeg");
      const result = paymentSchema.safeParse({
        consented: true,
        payment_proof_file: mockFile,
        honeypot: "spam_bot_input",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registrationSchema (combined)", () => {
    it("memvalidasi data keseluruhan dan relasi lintas-langkah", () => {
      const mockFile = createMockFile("bukti.webp", 2 * 1024 * 1024, "image/webp");
      const fullData = {
        student_name: "Maryam Shalihah",
        student_nickname: "Maryam",
        birth_place: "Jakarta",
        birth_date: "2019-08-20",
        gender: "P" as const,
        siblings_count: 3,
        birth_order: 2,
        student_address: "Jl. Sawangan Baru No. 45, Depok",
        contact_phone: "087737860657",
        hobby: "Menggambar dan mewarnai",
        achievements: "-",
        medical_conditions: "-",
        father_name: "Ibrahim",
        mother_name: "Siti",
        father_education: "s1_s3" as const,
        mother_education: "s1_s3" as const,
        father_job: "Wiraswasta",
        mother_job: "Ibu Rumah Tangga",
        parent_address: "Jl. Sawangan Baru No. 45, Depok",
        consented: true as const,
        payment_proof_file: mockFile,
        honeypot: "",
      };

      const result = registrationSchema.safeParse(fullData);
      expect(result.success).toBe(true);
    });
  });
});
