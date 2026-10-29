import { test, expect } from "@playwright/test";
import * as path from "node:path";

test.describe("Alur Pendaftaran Publik & Validasi Langkah (AC-1, AC-2, AC-3, AC-4, AC-5, AC-7, AC-14)", () => {
  test.beforeEach(async ({ page }) => {
    // Bersihkan draf localStorage sebelum setiap test
    await page.goto("/ppdb");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector("h1");
  });

  test("AC-2: Klik 'Lanjut' saat field wajib kosong menolak navigasi dan menampilkan error", async ({ page }) => {
    const nextButton = page.getByRole("button", { name: "Lanjut" });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Harus tetap di Langkah 1 (field nama siswa masih tampil)
    await expect(page.getByPlaceholder("Sesuai akta kelahiran")).toBeVisible();

    // Pesan ringkasan error atau pesan inline wajib muncul
    const errorAlert = page.getByRole("alert").first();
    await expect(errorAlert).toBeVisible();
  });

  test("AC-3: Pilih 'Lainnya' pada jumlah saudara menampilkan input angka tambahan (0-20)", async ({ page }) => {
    // Klik chip "Lainnya" melalui labelnya
    const lainnyaLabel = page.locator("label", { hasText: "Lainnya" });
    await expect(lainnyaLabel).toBeVisible();
    await lainnyaLabel.click();

    // Input custom siblings muncul
    const customSiblingInput = page.getByPlaceholder("Ketik 0 jika anak tunggal");
    await expect(customSiblingInput).toBeVisible();

    // Masukkan nilai tidak valid > 20
    await customSiblingInput.fill("25");
    await customSiblingInput.blur();
    const nextBtn = page.getByRole("button", { name: "Lanjut" });
    await nextBtn.click();

    await expect(page.getByText(/maksimal 20/i)).toBeVisible();

    // Isi nilai valid 3
    await customSiblingInput.fill("3");
    await customSiblingInput.blur();
  });

  test("AC-4 & AC-5: Upload bukti transfer - validasi tipe berkas dan pratinjau thumbnail", async ({ page }) => {
    // Isi langkah 1 secara valid
    await page.getByPlaceholder("Sesuai akta kelahiran").fill("Muhammad Rayhan");
    await page.getByPlaceholder("Contoh: Fatih").fill("Rayhan");
    await page.getByPlaceholder("Kota kelahiran, mis. Depok").fill("Depok");
    await page.locator('input[type="date"]').first().fill("2019-05-15");
    await page.locator("label", { hasText: "Laki-laki" }).click();
    await page.locator("label", { hasText: "1" }).first().click(); // anak ke 1
    await page.getByPlaceholder("Alamat domisili tempat tinggal calon siswa saat ini...").fill("Jl. Melati No. 12, RT 01/RW 02, Pancoran Mas, Depok");
    await page.getByPlaceholder("08xxxxxxxxxx").fill("081234567890");
    await page.getByPlaceholder("Contoh: Membaca buku, robotik, renang").fill("Membaca dan berenang");

    // Lanjut ke Langkah 2
    await page.getByRole("button", { name: "Lanjut" }).click();

    // Isi langkah 2 secara valid
    await expect(page.getByPlaceholder("Sesuai KTP / KK").first()).toBeVisible();
    await page.getByPlaceholder("Sesuai KTP / KK").first().fill("Bambang Hermanto");
    await page.locator("select").nth(0).selectOption("s1_s3");
    await page.getByPlaceholder("Contoh: Karyawan Swasta, PNS, Wiraswasta").fill("Karyawan Swasta");

    await page.getByPlaceholder("Sesuai KTP / KK").nth(1).fill("Siti Aminah");
    await page.locator("select").nth(1).selectOption("s1_s3");
    await page.getByPlaceholder("Contoh: Ibu Rumah Tangga, Guru, Dokter").fill("Guru");

    await page.getByPlaceholder("Alamat domisili orang tua saat ini...").fill("Jl. Melati No. 12, RT 01/RW 02, Pancoran Mas, Depok");

    // Lanjut ke Langkah 3
    await page.getByRole("button", { name: "Lanjut" }).click();

    // Di Langkah 3: Pengujian Bukti Transfer
    await expect(page.getByText(/Instruksi Pembayaran/i)).toBeVisible();

    // 1. Coba pilih file tidak valid (PDF) - AC-4
    const fileInput = page.locator('input[type="file"]');
    const invalidPdfPath = path.resolve(process.cwd(), "tests/fixtures/sample-invalid.pdf");
    await fileInput.setInputFiles(invalidPdfPath);

    // Harus muncul error format foto tidak didukung
    await expect(page.getByText(/format foto tidak didukung/i)).toBeVisible();

    // 2. Pilih file gambar JPG valid - AC-5
    const validJpgPath = path.resolve(process.cwd(), "tests/fixtures/sample-proof.jpg");
    await fileInput.setInputFiles(validJpgPath);

    // Thumbnail pratinjau harus tampil
    const previewImg = page.locator('img[alt="Pratinjau bukti transfer"]');
    await expect(previewImg).toBeVisible();

    // Tautan buka di tab baru harus ada target _blank
    const openLink = page.getByLabel("Buka bukti pembayaran ukuran penuh di tab baru");
    await expect(openLink).toBeVisible();
    await expect(openLink).toHaveAttribute("target", "_blank");

    // 3. Verifikasi Ringkasan Isian (Review Summary)
    await expect(page.getByText("Muhammad Rayhan")).toBeVisible();
    await expect(page.getByText("Bambang Hermanto")).toBeVisible();
  });

  test("AC-7: Tab ditutup / di-refresh, isian draf terpulihkan dari localStorage", async ({ page }) => {
    // Isi sebagian data di Langkah 1
    const nameInput = page.getByPlaceholder("Sesuai akta kelahiran");
    await nameInput.fill("Ananda Kirana Putri");
    await nameInput.blur();

    const nickInput = page.getByPlaceholder("Contoh: Fatih");
    await nickInput.fill("Kirana");
    await nickInput.blur();

    // Tunggu autosave debounce
    await page.waitForTimeout(600);

    // Refresh halaman
    await page.reload();
    await page.waitForSelector("h1");

    // Data harus terpulihkan di form
    await expect(page.getByPlaceholder("Sesuai akta kelahiran")).toHaveValue("Ananda Kirana Putri");
    await expect(page.getByPlaceholder("Contoh: Fatih")).toHaveValue("Kirana");
  });

  test("AC-14: Viewport 360px tidak menghasilkan scroll horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto("/");
    await page.waitForSelector("h1");

    // Periksa apakah scrollWidth melebihi clientWidth
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
});
