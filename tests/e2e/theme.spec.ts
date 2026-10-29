import { test, expect } from "@playwright/test";

test.describe("Manajemen Tema (Terang / Gelap) & Penguncian Halaman", () => {
  test("halaman beranda ('/') terkunci ke tema terang tanpa tombol toggle", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    const htmlTheme = await page.locator("html").getAttribute("data-theme");
    expect(htmlTheme).toBe("light");

    // Tombol toggle tidak boleh muncul di halaman root
    const toggle = page.locator("button[aria-label*='Ganti ke tema']");
    await expect(toggle).toHaveCount(0);
  });

  test("halaman formulir ('/spmb') terkunci ke tema terang tanpa tombol toggle", async ({ page }) => {
    await page.goto("/spmb");
    await page.waitForSelector("h1");

    const htmlTheme = await page.locator("html").getAttribute("data-theme");
    expect(htmlTheme).toBe("light");

    // Tombol toggle tidak boleh muncul di /spmb
    const toggle = page.locator("button[aria-label*='Ganti ke tema']");
    await expect(toggle).toHaveCount(0);
  });

  test("halaman non-terkunci ('/admin/login') default terang dan memiliki toggle aksesibel", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForSelector("h1");

    // Default tema terang pada kunjungan pertama
    const htmlTheme = await page.locator("html").getAttribute("data-theme");
    expect(htmlTheme).toBe("light");

    // Tombol toggle harus ada dengan aria-label yang jelas
    const toggle = page.locator("button[aria-label='Ganti ke tema gelap']");
    await expect(toggle).toBeVisible();

    // Klik toggle untuk berganti ke mode gelap
    await toggle.click();

    // Elemen html harus berubah menjadi dark
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Label toggle berubah menjadi ganti ke tema terang
    const toggleDark = page.locator("button[aria-label='Ganti ke tema terang']");
    await expect(toggleDark).toBeVisible();

    // Preferensi tersimpan di localStorage
    const savedTheme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(savedTheme).toBe("dark");

    // Refresh halaman: tema gelap tetap bertahan tanpa FOUC
    await page.reload();
    await page.waitForSelector("h1");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("navigasi ke '/' tidak menimpa localStorage dan tema gelap kembali aktif saat kembali ke '/admin/login'", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForSelector("h1");

    // Aktifkan mode gelap
    const toggle = page.locator("button[aria-label='Ganti ke tema gelap']");
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Pindah ke beranda (/)
    await page.goto("/");
    await page.waitForSelector("h1");

    // Halaman beranda wajib tema terang
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("button[aria-label*='Ganti ke tema']")).toHaveCount(0);

    // localStorage TIDAK boleh ditimpa saat berada di beranda
    const themeInStorage = await page.evaluate(() => localStorage.getItem("theme"));
    expect(themeInStorage).toBe("dark");

    // Pindah ke formulir /spmb: tetap tema terang dan localStorage tidak berubah
    await page.goto("/spmb");
    await page.waitForSelector("h1");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Kembali ke /admin/login: mode gelap langsung aktif kembali
    await page.goto("/admin/login");
    await page.waitForSelector("h1");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("pengaturan OS prefers-color-scheme: dark tidak mengaktifkan mode gelap otomatis", async ({ page }) => {
    // Emulasi OS dalam mode gelap
    await page.emulateMedia({ colorScheme: "dark" });

    // Kunjungan pertama kali tanpa localStorage
    await page.goto("/admin/login");
    await page.waitForSelector("h1");

    // Tetap harus default terang
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Halaman / dan /spmb juga tetap terang
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.goto("/spmb");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
