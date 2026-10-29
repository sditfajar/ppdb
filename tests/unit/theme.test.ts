import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { isLightLockedPath, LIGHT_LOCKED_PATHS, THEME_STORAGE_KEY } from "@/lib/theme";

describe("Theme Management - Path Locking & Logic", () => {
  it("mendefinisikan LIGHT_LOCKED_PATHS dan THEME_STORAGE_KEY secara konsisten", () => {
    expect(LIGHT_LOCKED_PATHS).toContain("/");
    expect(LIGHT_LOCKED_PATHS).toContain("/spmb");
    expect(THEME_STORAGE_KEY).toBe("theme");
  });

  it("isLightLockedPath mengidentifikasi rute terkunci terang ('/' dan '/spmb/*')", () => {
    // Root
    expect(isLightLockedPath("/")).toBe(true);

    // /spmb dan variasinya
    expect(isLightLockedPath("/spmb")).toBe(true);
    expect(isLightLockedPath("/spmb/")).toBe(true);
    expect(isLightLockedPath("/spmb/formulir")).toBe(true);
    expect(isLightLockedPath("/spmb/step/1")).toBe(true);

    // /ppdb dan variasinya (kompatibilitas redirect)
    expect(isLightLockedPath("/ppdb")).toBe(true);
    expect(isLightLockedPath("/ppdb/")).toBe(true);
  });

  it("isLightLockedPath tidak mengunci rute selain '/' dan '/spmb/*'", () => {
    expect(isLightLockedPath("/admin")).toBe(false);
    expect(isLightLockedPath("/admin/")).toBe(false);
    expect(isLightLockedPath("/admin/login")).toBe(false);
    expect(isLightLockedPath("/admin/pendaftar")).toBe(false);
    expect(isLightLockedPath("/admin/pengaturan")).toBe(false);
    expect(isLightLockedPath("/berhasil/e7b9520a-8bf3-4fb0-ba76-2f7d98341234")).toBe(false);
    expect(isLightLockedPath("/dev/ui")).toBe(false);

    // Edge cases
    expect(isLightLockedPath(null)).toBe(false);
    expect(isLightLockedPath(undefined)).toBe(false);
    expect(isLightLockedPath("")).toBe(false);
  });
});

describe("Theme Management - globals.css Rules Verification", () => {
  const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("tidak lagi memuat blok @media (prefers-color-scheme: dark)", () => {
    expect(cssContent).not.toContain("@media (prefers-color-scheme: dark)");
  });

  it("mendefinisikan @custom-variant dark untuk Tailwind CSS v4", () => {
    expect(cssContent).toMatch(/@custom-variant\s+dark/);
    expect(cssContent).toContain('[data-theme="dark"]');
  });

  it("mendeklarasikan properti native color-scheme pada root dan selector tema", () => {
    expect(cssContent).toContain("color-scheme: light;");
    expect(cssContent).toContain("color-scheme: dark;");
  });
});
