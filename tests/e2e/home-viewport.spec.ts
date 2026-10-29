import { test, expect } from "@playwright/test";

const viewports = [
  { name: "Mobile Kecil Portrait (320x568)", width: 320, height: 568 },
  { name: "Mobile Standar Portrait (375x667)", width: 375, height: 667 },
  { name: "Mobile Modern Portrait (390x844)", width: 390, height: 844 },
  { name: "Mobile Kecil Landscape (568x320)", width: 568, height: 320 },
  { name: "Mobile Standar Landscape (667x375)", width: 667, height: 375 },
  { name: "Mobile Modern Landscape (844x390)", width: 844, height: 390 },
  { name: "Tablet Portrait (768x1024)", width: 768, height: 1024 },
  { name: "Tablet Landscape (1024x768)", width: 1024, height: 768 },
  { name: "Desktop Standar (1280x720)", width: 1280, height: 720 },
  { name: "Desktop HD (1920x1080)", width: 1920, height: 1080 },
];

test.describe("Halaman Beranda (Home) - Full Viewport & No-Scroll Guarantee", () => {
  for (const vp of viewports) {
    test(`Viewport ${vp.name}: Pas satu layar tanpa scroll, kedua tombol terbaca & tidak terpotong`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForSelector("h1");

      // 1. Verifikasi overflow hidden pada html atau body
      const overflows = await page.evaluate(() => {
        const htmlStyle = window.getComputedStyle(document.documentElement);
        const bodyStyle = window.getComputedStyle(document.body);
        return {
          htmlOverflow: htmlStyle.overflow,
          bodyOverflow: bodyStyle.overflow,
          htmlOverflowY: htmlStyle.overflowY,
          bodyOverflowY: bodyStyle.overflowY,
        };
      });
      expect(
        overflows.htmlOverflow === "hidden" ||
          overflows.bodyOverflow === "hidden" ||
          overflows.htmlOverflowY === "hidden" ||
          overflows.bodyOverflowY === "hidden"
      ).toBe(true);

      // 2. Verifikasi tidak ada overflow dimensi vertikal maupun horizontal (toleransi sub-pixel 1.5px)
      const dimensions = await page.evaluate(() => {
        const root = document.documentElement;
        return {
          windowInnerHeight: window.innerHeight,
          windowInnerWidth: window.innerWidth,
          scrollHeight: root.scrollHeight,
          scrollWidth: root.scrollWidth,
        };
      });

      expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.windowInnerHeight + 1.5);
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.windowInnerWidth + 1.5);

      // 3. Verifikasi upaya scrolling tidak mengubah scrollY / scrollX
      await page.evaluate(() => {
        window.scrollTo(50, 100);
      });
      const scrollPos = await page.evaluate(() => ({
        x: window.scrollX,
        y: window.scrollY,
      }));
      expect(scrollPos.x).toBe(0);
      expect(scrollPos.y).toBe(0);

      // 4. Verifikasi tombol "Daftar SPMB" terlihat dan berada di dalam viewport
      const ctaButton = page.getByRole("link", { name: "Daftar SPMB" });
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toBeInViewport();

      // 5. Verifikasi tombol "Konsultasi WhatsApp" terlihat dan berada di dalam viewport
      const waButton = page.getByRole("link", { name: "Konsultasi WhatsApp" });
      await expect(waButton).toBeVisible();
      await expect(waButton).toBeInViewport();

      // 6. Verifikasi judul dan teks terbaca serta berada di dalam viewport
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
      await expect(heading).toBeInViewport();
    });
  }

  test("Hanya ada 1 hero section, tanpa navbar, footer, atau section lainnya", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Hanya ada 1 section utama
    const sections = page.locator("section");
    await expect(sections).toHaveCount(1);

    // Tidak ada nav / navbar
    const navs = page.locator("nav");
    await expect(navs).toHaveCount(0);

    // Tidak ada footer
    const footers = page.locator("footer");
    await expect(footers).toHaveCount(0);
  });

  test("Tombol 'Konsultasi WhatsApp' memiliki tautan ke nomor 6287737860657 dengan template pesan", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    const waButton = page.getByRole("link", { name: "Konsultasi WhatsApp" });
    await expect(waButton).toBeVisible();

    const href = await waButton.getAttribute("href");
    expect(href).toContain("https://wa.me/6287737860657");
    expect(href).toContain("text=");
    expect(href).toContain("konsultasi");

    // Keamanan external link
    await expect(waButton).toHaveAttribute("target", "_blank");
    await expect(waButton).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("Klik tombol 'Daftar SPMB' mengarah ke rute /spmb", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    const ctaButton = page.getByRole("link", { name: "Daftar SPMB" });
    await expect(ctaButton).toHaveAttribute("href", "/spmb");

    await ctaButton.click();
    await expect(page).toHaveURL(/\/spmb/);
    await expect(page.locator("h1")).toContainText(/Formulir Pendaftaran/i);
  });
});
