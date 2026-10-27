import { describe, it, expect } from "vitest";
import { sanitizePostgrestSearch } from "@/lib/sanitize";

describe("sanitizePostgrestSearch", () => {
  it("membersihkan karakter khusus sintaks PostgREST (koma, kurung, titik)", () => {
    const raw = "Budi, (Santoso).";
    expect(sanitizePostgrestSearch(raw)).toBe("Budi Santoso");
  });

  it("membersihkan wildcard LIKE SQL (% dan _)", () => {
    const raw = "%test_user%";
    expect(sanitizePostgrestSearch(raw)).toBe("test user");
  });

  it("membersihkan tanda petik dan backslash", () => {
    const raw = `admin' OR "1"="1" \\ injection`;
    expect(sanitizePostgrestSearch(raw)).toBe("admin OR 1 = 1 injection");
  });

  it("menangani input kosong, null, atau undefined", () => {
    expect(sanitizePostgrestSearch("")).toBe("");
    expect(sanitizePostgrestSearch(null)).toBe("");
    expect(sanitizePostgrestSearch(undefined)).toBe("");
    expect(sanitizePostgrestSearch("     ")).toBe("");
  });

  it("mempertahankan teks alfanumerik biasa dan spasi tunggal", () => {
    const raw = "PPDB-2026-0001";
    expect(sanitizePostgrestSearch(raw)).toBe("PPDB-2026-0001");

    const phone = "081234567890";
    expect(sanitizePostgrestSearch(phone)).toBe("081234567890");

    const spaces = "  Muhammad    Fajar  ";
    expect(sanitizePostgrestSearch(spaces)).toBe("Muhammad Fajar");
  });
});
