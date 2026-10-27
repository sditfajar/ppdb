import { describe, it, expect } from "vitest";
import { normalizeIdPhone, formatIdPhone } from "@/lib/phone";

describe("phone utilities", () => {
  describe("normalizeIdPhone", () => {
    it("menormalkan awalan 08 menjadi 628", () => {
      expect(normalizeIdPhone("08123456789")).toBe("628123456789");
      expect(normalizeIdPhone("087737860657")).toBe("6287737860657");
    });

    it("menormalkan awalan +62 menjadi 628", () => {
      expect(normalizeIdPhone("+6281234567890")).toBe("6281234567890");
      expect(normalizeIdPhone("+62 822-4962-7864")).toBe("6282249627864");
    });

    it("menormalkan awalan 628 yang sudah kanonik", () => {
      expect(normalizeIdPhone("628123456789")).toBe("628123456789");
    });

    it("menghapus spasi, strip, tanda kurung, dan titik", () => {
      expect(normalizeIdPhone("0812-3456-7890")).toBe("6281234567890");
      expect(normalizeIdPhone(" (0812) 3456 7890 ")).toBe("6281234567890");
      expect(normalizeIdPhone("0812.3456.7890")).toBe("6281234567890");
    });

    it("menolak nomor kosong atau non-string", () => {
      expect(() => normalizeIdPhone("")).toThrow("Nomor telepon tidak boleh kosong");
      // @ts-expect-error test non-string input
      expect(() => normalizeIdPhone(null)).toThrow("Nomor telepon tidak boleh kosong");
    });

    it("menolak nomor telepon non-seluler atau kode negara lain", () => {
      expect(() => normalizeIdPhone("0211234567")).toThrow("Format nomor telepon tidak valid");
      expect(() => normalizeIdPhone("+12025550123")).toThrow("Format nomor telepon tidak valid");
      expect(() => normalizeIdPhone("0712345678")).toThrow("Format nomor telepon tidak valid");
    });

    it("menolak nomor yang terlalu pendek atau terlalu panjang", () => {
      expect(() => normalizeIdPhone("0812345")).toThrow("Format nomor telepon tidak valid");
      expect(() => normalizeIdPhone("081234567890123456")).toThrow("Format nomor telepon tidak valid");
    });

    it("menolak karakter alfabet atau simbol tidak wajar", () => {
      expect(() => normalizeIdPhone("08123456abc")).toThrow("Format nomor telepon tidak valid");
    });
  });

  describe("formatIdPhone", () => {
    it("memformat nomor 628... menjadi 08xx-xxxx-xxxx", () => {
      expect(formatIdPhone("6281234567890")).toBe("0812-3456-7890");
      expect(formatIdPhone("087737860657")).toBe("0877-3786-0657");
    });

    it("memformat nomor 11 digit", () => {
      expect(formatIdPhone("628123456789")).toBe("0812-3456-789");
    });

    it("mengembalikan string asli jika tidak valid", () => {
      expect(formatIdPhone("bukan-nomor")).toBe("bukan-nomor");
    });
  });
});
