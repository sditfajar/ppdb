import { test, expect } from "@playwright/test";

test.describe("Skenario Pendaftaran Ditutup (AC-13)", () => {
  test("Ketika pendaftaran aktif, form tampil dan banner tutup tidak tampil", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Di mode default aktif, tombol lanjut formulir wizard tampil di semua ukuran layar
    const nextBtn = page.getByRole("button", { name: "Lanjut" });
    const isFormOpen = await nextBtn.isVisible();

    if (isFormOpen) {
      // Form tampil
      await expect(nextBtn).toBeVisible();
      // Banner penutupan tidak tampil
      await expect(page.getByText("Pendaftaran Saat Ini Sedang Ditutup")).not.toBeVisible();
    } else {
      // Jika tertutup, banner penutupan dan kontak panitia wajib tampil
      await expect(page.getByText("Pendaftaran Saat Ini Sedang Ditutup")).toBeVisible();
      await expect(page.getByText(/Butuh Bantuan\? Hubungi Panitia PPDB/i)).toBeVisible();
    }
  });
});
