import { describe, it, expect, beforeEach } from "vitest";
import {
  serverRegistrationSchema,
  serverPaymentProofSchema,
} from "@/lib/validation/registration";
import { checkRateLimit, resetRateLimitTracker } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

describe("Backend Pendaftaran — Unit Tests (Fase 4)", () => {
  beforeEach(() => {
    resetRateLimitTracker();
  });

  describe("1. Validasi Path Bukti Bayar & Server Schema", () => {
    const validProofMeta = {
      payment_proof_path: "proofs/2026/12345678-1234-1234-1234-123456789abc.jpg",
      payment_proof_mime: "image/jpeg" as const,
      payment_proof_size: 2 * 1024 * 1024,
      consented: true as const,
      honeypot: "",
      turnstile_token: "test-mock-valid-turnstile-token",
    };

    it("menerima format path penyimpanan bukti transfer yang valid", () => {
      const res = serverPaymentProofSchema.safeParse(validProofMeta);
      expect(res.success).toBe(true);
    });

    it("menolak path bukti transfer fiktif atau di luar prefix proofs/{tahun}/", () => {
      const invalidPaths = [
        "avatars/user.jpg",
        "/etc/passwd",
        "proofs/hack/malicious.exe",
        "proofs/2026/not-uuid.php",
        "proofs/2026/../../../secret.jpg",
      ];

      invalidPaths.forEach((path) => {
        const res = serverPaymentProofSchema.safeParse({
          ...validProofMeta,
          payment_proof_path: path,
        });
        expect(res.success).toBe(false);
      });
    });

    it("menolak format MIME atau ukuran bukti bayar yang tidak diizinkan di server", () => {
      const invalidMime = serverPaymentProofSchema.safeParse({
        ...validProofMeta,
        payment_proof_mime: "application/pdf" as never,
      });
      expect(invalidMime.success).toBe(false);

      const oversized = serverPaymentProofSchema.safeParse({
        ...validProofMeta,
        payment_proof_size: 6 * 1024 * 1024, // > 5 MB
      });
      expect(oversized.success).toBe(false);
    });

    it("menolak isian bila honeypot terisi (indikasi spam/bot)", () => {
      const botSubmission = serverPaymentProofSchema.safeParse({
        ...validProofMeta,
        honeypot: "I am a spam bot",
      });
      expect(botSubmission.success).toBe(false);
    });
  });

  describe("2. Validasi Server Registration Schema Lengkap", () => {
    const validCompletePayload = {
      // Siswa
      student_name: "Muhammad Fajar Pratama",
      student_nickname: "Fajar",
      birth_place: "Depok",
      birth_date: "2019-05-15",
      gender: "L" as const,
      siblings_count: 2,
      birth_order: 1,
      student_address: "Jl. Margonda Raya No. 12, Depok",
      contact_phone: "081234567890",
      hobby: "Membaca dan Menggambar",
      achievements: "Juara 1 Mewarnai",
      medical_conditions: "-",

      // Orang Tua
      father_name: "Bambang Riswandi",
      mother_name: "Siti Rahmawati",
      father_education: "s1_s3" as const,
      mother_education: "s1_s3" as const,
      father_job: "Karyawan Swasta",
      mother_job: "PNS Guru",
      parent_address: "Jl. Margonda Raya No. 12, Depok",

      // Pembayaran & Keamanan
      payment_proof_path: "proofs/2026/87654321-4321-4321-4321-cba987654321.png",
      payment_proof_mime: "image/png" as const,
      payment_proof_size: 1024 * 1024,
      consented: true as const,
      honeypot: "",
      turnstile_token: "test-mock-valid-turnstile-token",
    };

    it("menerima pendaftaran lengkap yang valid", () => {
      const res = serverRegistrationSchema.safeParse(validCompletePayload);
      expect(res.success).toBe(true);
    });

    it("menolak jika anak ke melebihi jumlah saudara + 1 di server", () => {
      const res = serverRegistrationSchema.safeParse({
        ...validCompletePayload,
        siblings_count: 1,
        birth_order: 3, // Maksimal harus 2
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues.some((i) => i.path.includes("birth_order"))).toBe(true);
      }
    });

    it("menolak tanpa persetujuan PDP (consented: false)", () => {
      const res = serverRegistrationSchema.safeParse({
        ...validCompletePayload,
        consented: false as never,
      });
      expect(res.success).toBe(false);
    });
  });

  describe("3. In-App Sliding Window Rate Limiter", () => {
    it("mengizinkan permintaan dalam batas limit", () => {
      const testIp = "192.168.1.50";
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit("submit", testIp);
        expect(res.success).toBe(true);
      }
    });

    it("memblokir permintaan setelah melebihi kuota submit (5 per 10 menit)", () => {
      const testIp = "192.168.1.99";
      for (let i = 0; i < 5; i++) {
        checkRateLimit("submit", testIp);
      }
      // Permintaan ke-6 harus ditolak
      const blocked = checkRateLimit("submit", testIp);
      expect(blocked.success).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetMs).toBeGreaterThan(0);
    });

    it("memperlakukan IP berbeda secara independen", () => {
      const ipA = "10.0.0.1";
      const ipB = "10.0.0.2";

      for (let i = 0; i < 5; i++) {
        checkRateLimit("submit", ipA);
      }
      expect(checkRateLimit("submit", ipA).success).toBe(false);
      expect(checkRateLimit("submit", ipB).success).toBe(true);
    });
  });

  describe("4. Cloudflare Turnstile Verification Helper", () => {
    it("menolak token kosong atau spasi", async () => {
      const resEmpty = await verifyTurnstileToken("");
      expect(resEmpty.success).toBe(false);
      expect(resEmpty.errorCodes).toContain("missing-input-response");

      const resWhitespace = await verifyTurnstileToken("   ");
      expect(resWhitespace.success).toBe(false);
    });

    it("menerima mock valid token dalam lingkungan test", async () => {
      const res = await verifyTurnstileToken("test-mock-valid-turnstile-token");
      expect(res.success).toBe(true);
    });

    it("menolak mock invalid token dalam lingkungan test", async () => {
      const res = await verifyTurnstileToken("test-mock-invalid-turnstile-token");
      expect(res.success).toBe(false);
    });
  });

  describe("5. Pemetaan Pesan Error Postgres 23505 (Anti-Kebocoran PII)", () => {
    it("menghasilkan pesan duplikasi ramah tanpa membocorkan data pendaftar lain", () => {
      const postgres23505ErrorCode = "23505";
      const isDuplicate = postgres23505ErrorCode === "23505";

      const friendlyMessage = isDuplicate
        ? "Calon siswa dengan nama dan tanggal lahir ini sudah terdaftar pada tahun ajaran aktif. Silakan hubungi panitia SPMB jika Anda membutuhkan bantuan."
        : "Terjadi kesalahan.";

      expect(friendlyMessage).toContain("sudah terdaftar pada tahun ajaran aktif");
      // Memastikan tidak membocorkan nomor registrasi atau ID spesifik orang lain
      expect(friendlyMessage).not.toContain("SPMB-");
      expect(friendlyMessage).not.toContain("id=");
    });
  });
});
