import { describe, it, expect } from "vitest";
import {
  formatDateIndo,
  formatPhoneDisplay,
  formatFileSize,
  formatEducationLevel,
} from "@/lib/format";

describe("formatDateIndo", () => {
  it("memformat tanggal ke Bahasa Indonesia", () => {
    const formatted = formatDateIndo("2026-05-15T10:30:00.000Z", { longMonth: true });
    expect(formatted).toContain("15");
    expect(formatted).toContain("Mei");
    expect(formatted).toContain("2026");
  });

  it("menangani input kosong atau tanggal tidak valid", () => {
    expect(formatDateIndo(null)).toBe("-");
    expect(formatDateIndo("invalid-date")).toBe("-");
  });
});

describe("formatPhoneDisplay", () => {
  it("memformat nomor HP 628xx menjadi 08xx-xxxx-xxxx", () => {
    expect(formatPhoneDisplay("6281234567890")).toBe("0812-3456-7890");
    expect(formatPhoneDisplay("081234567890")).toBe("0812-3456-7890");
  });

  it("menangani input kosong", () => {
    expect(formatPhoneDisplay(null)).toBe("-");
    expect(formatPhoneDisplay("")).toBe("-");
  });
});

describe("formatFileSize", () => {
  it("memformat byte ke KB dan MB", () => {
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(2 * 1024 * 1024)).toBe("2.00 MB");
  });

  it("menangani 0 atau input tidak valid", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(null)).toBe("0 B");
  });
});

describe("formatEducationLevel", () => {
  it("menerjemahkan enum pendidikan ke label Indonesia", () => {
    expect(formatEducationLevel("sd_mi")).toBe("SD/MI Sederajat");
    expect(formatEducationLevel("smp_mts")).toBe("SMP/MTS Sederajat");
    expect(formatEducationLevel("sma_smk_ma")).toBe("SMA/SMK/MA Sederajat");
    expect(formatEducationLevel("d1_d3")).toBe("D1 / D2 / D3");
    expect(formatEducationLevel("s1_s3")).toBe("S1 / S2 / S3");
  });
});
