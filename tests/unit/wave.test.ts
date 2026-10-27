import { describe, it, expect } from "vitest";
import { getActiveWave, getJakartaMonth, getWaveLabel } from "@/lib/wave";

describe("wave utilities", () => {
  describe("getJakartaMonth", () => {
    it("mengekstrak bulan dalam zona waktu Asia/Jakarta", () => {
      // 2026-08-31 23:30:00 UTC adalah 2026-09-01 06:30:00 WIB
      const d = new Date("2026-08-31T23:30:00Z");
      expect(getJakartaMonth(d)).toBe(9);
    });
  });

  describe("getActiveWave", () => {
    it("mengembalikan 1 untuk bulan September hingga Februari (Gelombang 1)", () => {
      // September
      expect(getActiveWave(new Date("2026-09-15T10:00:00+07:00"))).toBe(1);
      // Oktober
      expect(getActiveWave(new Date("2026-10-27T18:00:00+07:00"))).toBe(1);
      // Desember
      expect(getActiveWave(new Date("2026-12-31T20:00:00+07:00"))).toBe(1);
      // Januari
      expect(getActiveWave(new Date("2027-01-10T12:00:00+07:00"))).toBe(1);
      // Februari
      expect(getActiveWave(new Date("2027-02-20T08:00:00+07:00"))).toBe(1);
    });

    it("mengembalikan 2 untuk bulan Maret hingga Juni (Gelombang 2)", () => {
      // Maret
      expect(getActiveWave(new Date("2027-03-01T09:00:00+07:00"))).toBe(2);
      // April
      expect(getActiveWave(new Date("2027-04-15T14:00:00+07:00"))).toBe(2);
      // Mei
      expect(getActiveWave(new Date("2027-05-20T11:00:00+07:00"))).toBe(2);
      // Juni
      expect(getActiveWave(new Date("2027-06-30T17:00:00+07:00"))).toBe(2);
    });

    it("mengembalikan null untuk bulan Juli dan Agustus (Tutup)", () => {
      // Juli
      expect(getActiveWave(new Date("2027-07-01T10:00:00+07:00"))).toBe(null);
      expect(getActiveWave(new Date("2027-07-20T12:00:00+07:00"))).toBe(null);
      // Agustus
      expect(getActiveWave(new Date("2027-08-15T15:00:00+07:00"))).toBe(null);
      expect(getActiveWave(new Date("2027-08-31T12:00:00+07:00"))).toBe(null);
    });

    it("menangani batas pergantian bulan di WIB (Februari -> Maret)", () => {
      // 28 Feb 23:59:59 WIB -> Gelombang 1
      const febEnd = new Date("2027-02-28T23:59:59+07:00");
      expect(getActiveWave(febEnd)).toBe(1);

      // 1 Mar 00:00:01 WIB -> Gelombang 2
      const marStart = new Date("2027-03-01T00:00:01+07:00");
      expect(getActiveWave(marStart)).toBe(2);
    });

    it("menangani batas pergantian bulan di WIB (Juni -> Juli)", () => {
      // 30 Jun 23:59:59 WIB -> Gelombang 2
      const junEnd = new Date("2027-06-30T23:59:59+07:00");
      expect(getActiveWave(junEnd)).toBe(2);

      // 1 Jul 00:00:01 WIB -> Tutup (null)
      const julStart = new Date("2027-07-01T00:00:01+07:00");
      expect(getActiveWave(julStart)).toBe(null);
    });

    it("menangani transisi zona waktu UTC ke WIB pada batas Agustus -> September", () => {
      // 31 Agustus 16:59:59 UTC = 23:59:59 WIB -> Masih Agustus -> Tutup (null)
      const stillAugust = new Date("2026-08-31T16:59:59Z");
      expect(getActiveWave(stillAugust)).toBe(null);

      // 31 Agustus 17:00:00 UTC = 00:00:00 WIB (1 September) -> September -> Gelombang 1
      const startSeptember = new Date("2026-08-31T17:00:00Z");
      expect(getActiveWave(startSeptember)).toBe(1);
    });
  });

  describe("getWaveLabel", () => {
    it("mengembalikan label yang tepat", () => {
      expect(getWaveLabel(1)).toContain("Gelombang 1");
      expect(getWaveLabel(2)).toContain("Gelombang 2");
      expect(getWaveLabel(null)).toBe("Pendaftaran Ditutup");
    });
  });
});
