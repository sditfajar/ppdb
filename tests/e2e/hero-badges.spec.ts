import { test, expect } from "@playwright/test";

test.describe("HomeHero Trust Badges - Responsive & Auto-Scroll", () => {
  test("Mobile Viewport (< 640px): Badges are displayed in marquee container and visible", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Marquee container on mobile is visible
    const mobileMarquee = page.locator(".animate-marquee-slow");
    await expect(mobileMarquee).toBeVisible();

    // Verify all 4 badge texts are present
    const marqueeText = await mobileMarquee.textContent();
    expect(marqueeText).toContain("Akreditasi A Unggul");
    expect(marqueeText).toContain("Tahfidz Metode Mutqin");
    expect(marqueeText).toContain("Pendidikan Karakter Adab");
    expect(marqueeText).toContain("50+ Prestasi Kota & Provinsi");

    // Verify desktop static badges are hidden
    const desktopBadges = page.locator(".hidden.sm\\:flex");
    await expect(desktopBadges).toBeHidden();

    // Verify no page-level horizontal overflow
    const dimensions = await page.evaluate(() => {
      return {
        windowInnerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.windowInnerWidth + 1);
  });

  test("Desktop Viewport (>= 640px): Badges are displayed statically and marquee is hidden", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    // Marquee container is hidden on desktop
    const mobileContainer = page.locator("div.sm\\:hidden.relative.w-full.overflow-hidden");
    await expect(mobileContainer).toBeHidden();

    // Desktop badges are visible
    const desktopBadges = page.locator(".hidden.sm\\:flex");
    await expect(desktopBadges).toBeVisible();

    const desktopText = await desktopBadges.textContent();
    expect(desktopText).toContain("Akreditasi A Unggul");
    expect(desktopText).toContain("Tahfidz Metode Mutqin");
    expect(desktopText).toContain("Pendidikan Karakter Adab");
    expect(desktopText).toContain("50+ Prestasi Kota & Provinsi");
  });
});

