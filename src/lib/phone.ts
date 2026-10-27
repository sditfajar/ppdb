/**
/**
 * Utilitas normalisasi dan pemformatan nomor telepon seluler Indonesia
 * Sesuai PRD §8.2 & Lampiran B
 */

/**
 * Menormalkan format nomor telepon Indonesia menjadi format kanonik "628..."
 * Menerima awalan "08...", "+62...", atau "62..."
 * Menghapus spasi, strip, tanda kurung, dan karakter non-digit lainnya.
 *
 * @throws {Error} jika format tidak valid atau bukan nomor seluler Indonesia yang wajar
 */
export function normalizeIdPhone(raw: string): string {
  if (!raw || typeof raw !== "string") {
    throw new Error("Nomor telepon tidak boleh kosong.");
  }

  // Bersihkan karakter pemisah seperti spasi, strip, kurung, titik
  let cleaned = raw.trim().replace(/[\s\-().]/g, "");

  // Hapus awalan '+' jika ada
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }

  // Ubah awalan '08' menjadi '628'
  if (cleaned.startsWith("08")) {
    cleaned = "62" + cleaned.slice(1);
  }

  // Validasi: harus berawalan '628', hanya digit, panjang 10 - 15 digit (standar nomor seluler Indonesia)
  if (!/^628\d{8,12}$/.test(cleaned)) {
    throw new Error(
      "Format nomor telepon tidak valid. Gunakan format nomor HP Indonesia (contoh: 081234567890)."
    );
  }

  return cleaned;
}

/**
 * Memformat nomor telepon Indonesia untuk tampilan yang mudah dibaca pengguna: "08xx-xxxx-xxxx"
 */
export function formatIdPhone(phone: string): string {
  try {
    const normalized = normalizeIdPhone(phone);
    // Ubah "628..." menjadi "08..."
    const local = "0" + normalized.slice(2);

    if (local.length <= 8) {
      return local;
    } else if (local.length <= 11) {
      // 08xx-xxxx-xxx
      return `${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8)}`;
    } else {
      // 08xx-xxxx-xxxx (atau lebih)
      return `${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8, 12)}${
        local.length > 12 ? `-${local.slice(12)}` : ""
      }`;
    }
  } catch {
    // Jika tidak dapat dinormalisasi, kembalikan apa adanya
    return phone;
  }
}
