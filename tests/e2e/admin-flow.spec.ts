import { test, expect } from "@playwright/test";

test.describe("Alur Admin, Proteksi Akses & Verifikasi (AC-8, AC-10, AC-11, AC-12)", () => {
  test("AC-8: Mengakses /admin tanpa login langsung diarahkan ke /admin/login", async ({ page }) => {
    // Kunjungi langsung rute terlindungi /admin
    await page.goto("/admin");

    // URL harus dialihkan ke /admin/login
    await expect(page).toHaveURL(/\/admin\/login/);

    // Judul login admin harus tampil
    await expect(page.getByText(/Masuk ke Panel Administrasi/i)).toBeVisible();
    await expect(page.getByLabel(/Email Administrator/i)).toBeVisible();
    await expect(page.getByLabel(/Kata Sandi/i)).toBeVisible();
  });

  test("AC-8: Mengakses /admin/pengaturan tanpa login juga diarahkan ke /admin/login", async ({ page }) => {
    await page.goto("/admin/pengaturan");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("Login admin dengan kredensial tidak valid menampilkan pesan error", async ({ page }) => {
    await page.goto("/admin/login");

    await page.getByLabel(/Email Administrator/i).fill("bukanadmin@sditfajar.sch.id");
    await page.getByLabel(/Kata Sandi/i).fill("passwordsalah123");
    await page.getByRole("button", { name: /Masuk ke Admin/i }).click();

    // Pesan error harus muncul dalam role alert
    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
  });

  test("AC-12: Route ekspor CSV (/admin/export) tanpa sesi admin dialihkan ke /admin/login", async ({ page }) => {
    await page.goto("/admin/export");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
