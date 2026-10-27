import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Audit Aksesibilitas WCAG 2.1 AA (Axe-Core)", () => {
  test("halaman formulir utama (/) bebas pelanggaran serious & critical", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");
    // Tunggu animasi masuk bertahap (stagger entrance) selesai sempurna
    await page.waitForTimeout(1200);

    const scanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const seriousOrCritical = scanResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    expect(seriousOrCritical, JSON.stringify(seriousOrCritical, null, 2)).toHaveLength(0);
  });

  test("halaman admin login (/admin/login) bebas pelanggaran serious & critical", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForSelector("h1");

    const scanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const seriousOrCritical = scanResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    expect(seriousOrCritical, JSON.stringify(seriousOrCritical, null, 2)).toHaveLength(0);
  });
});
