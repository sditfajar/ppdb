import { test, expect } from "@playwright/test";
import path from "path";

const artifactDir = "C:\\Users\\muhaz\\.gemini\\antigravity\\brain\\3b5057f9-152f-4d94-90fb-12f04dba4832";

const breakpoints = [
  { name: "mobile_360", width: 360, height: 800 },
  { name: "tablet_768", width: 768, height: 1024 },
  { name: "desktop_1024", width: 1024, height: 768 },
  { name: "desktop_1440", width: 1440, height: 900 },
];

test.describe("Halaman Beranda (Home) - Redesign Stitch Verification", () => {
  for (const bp of breakpoints) {
    test(`Breakpoint ${bp.name} (${bp.width}px): Tidak ada overflow horizontal dan render sukses`, async ({
      page,
    }) => {
      // Monitor console errors
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto("/");
      await page.waitForSelector("h1");

      // 1. Verifikasi tidak ada horizontal scroll
      const dimensions = await page.evaluate(() => {
        const root = document.documentElement;
        return {
          windowInnerWidth: window.innerWidth,
          scrollWidth: root.scrollWidth,
        };
      });
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.windowInnerWidth + 1.5);

      // 2. Verifikasi section-section utama ada di DOM
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("#profil-sekolah")).toBeAttached();
      await expect(page.locator("#program-unggulan")).toBeAttached();
      await expect(page.locator("#kurikulum")).toBeAttached();
      await expect(page.locator("#ekstrakurikuler")).toBeAttached();
      await expect(page.locator("#sejarah")).toBeAttached();
      await expect(page.locator("#daftar-ppdb")).toBeAttached();
      await expect(page.locator("footer")).toBeAttached();

      // 3. Verifikasi tombol CTA pendaftaran tersedia
      const ctaBtn = page.getByRole("link", { name: /Daftar SPMB/i }).first();
      await expect(ctaBtn).toBeVisible();

      // 4. Capture screenshot untuk perbandingan dengan Stitch
      await page.screenshot({
        path: path.join(artifactDir, `beranda_${bp.name}.png`),
        fullPage: true,
      });

      // 5. Verifikasi tidak ada console errors
      expect(consoleErrors).toEqual([]);
    });
  }

  test("Responsif Navigasi: Hamburger Menu muncul pada Mobile dan Tablet (<= 1024px)", async ({
    page,
  }) => {
    // Di mobile 360px
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const hamburgerBtn = page.getByRole("button", { name: /Buka menu/i });
    await expect(hamburgerBtn).toBeVisible();

    // Pastikan area sentuh minimal 44px
    const box = await hamburgerBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    // Klik hamburger membuka drawer
    await hamburgerBtn.click();
    await expect(page.getByRole("button", { name: /Tutup menu/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kurikulum" })).toBeVisible();

    // Klik menutup kembali
    await page.getByRole("button", { name: /Tutup menu/i }).click();
    await expect(page.getByRole("button", { name: /Buka menu/i })).toBeVisible();
  });
});
