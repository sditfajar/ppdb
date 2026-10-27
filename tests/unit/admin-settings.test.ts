import { describe, it, expect } from "vitest";
import { settingsSchema } from "@/lib/validation/admin";

describe("settingsSchema", () => {
  const validSettings = {
    academic_year: "2026/2027",
    registration_open: true,
    payment_amount: 250000,
    payment_bank: "Bank Syariah Indonesia (BSI)",
    payment_account_no: "712-345-6789",
    payment_account_name: "SDIT Fajar PPDB",
  };

  it("menerima data pengaturan yang lengkap dan valid", () => {
    const result = settingsSchema.safeParse(validSettings);
    expect(result.success).toBe(true);
  });

  it("menolak format tahun ajaran yang tidak sesuai YYYY/YYYY", () => {
    const invalidYears = ["2026", "2026-2027", "26/27", "2026/202", "tahun 2026"];
    for (const yr of invalidYears) {
      const res = settingsSchema.safeParse({ ...validSettings, academic_year: yr });
      expect(res.success).toBe(false);
    }
  });

  it("menerima status pendaftaran terbuka atau tertutup (boolean)", () => {
    const openRes = settingsSchema.safeParse({ ...validSettings, registration_open: true });
    const closedRes = settingsSchema.safeParse({ ...validSettings, registration_open: false });
    expect(openRes.success).toBe(true);
    expect(closedRes.success).toBe(true);
  });

  it("menolak nominal pembayaran negatif atau desimal", () => {
    const negativeRes = settingsSchema.safeParse({ ...validSettings, payment_amount: -5000 });
    expect(negativeRes.success).toBe(false);

    const floatRes = settingsSchema.safeParse({ ...validSettings, payment_amount: 250000.5 });
    expect(floatRes.success).toBe(false);
  });

  it("menolak nama bank atau nomor rekening yang terlalu pendek/kosong", () => {
    const shortBank = settingsSchema.safeParse({ ...validSettings, payment_bank: "B" });
    expect(shortBank.success).toBe(false);

    const shortAccount = settingsSchema.safeParse({ ...validSettings, payment_account_no: "12" });
    expect(shortAccount.success).toBe(false);

    const emptyName = settingsSchema.safeParse({ ...validSettings, payment_account_name: " " });
    expect(emptyName.success).toBe(false);
  });
});
