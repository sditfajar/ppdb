import { headers } from "next/headers";

/**
 * In-App Sliding Window Rate Limiter
 * 
 * Digunakan untuk Server Actions (requestUploadUrl & createRegistration).
 * Menyimpan riwayat timestamp permintaan per identitas (IP).
 * Tidak memerlukan dependensi Redis eksternal untuk pengujian lokal & unit tests.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const LIMITS: Record<"upload" | "submit", RateLimitConfig> = {
  upload: {
    maxRequests: 10,
    windowMs: 10 * 60 * 1000, // 10 menit
  },
  submit: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000, // 10 menit
  },
};

// Map penyimpanan timestamp per `action:ip`
const tracker = new Map<string, number[]>();

/**
 * Memeriksa apakah suatu IP melebihi kuota permintaan dalam jendela waktu aktif.
 */
export function checkRateLimit(
  action: "upload" | "submit",
  identifier: string
): { success: boolean; remaining: number; resetMs: number } {
  const config = LIMITS[action];
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = `${action}:${identifier}`;

  const timestamps = tracker.get(key) || [];
  // Bersihkan entri di luar jendela waktu
  const activeTimestamps = timestamps.filter((t) => t > windowStart);

  if (activeTimestamps.length >= config.maxRequests) {
    const oldest = activeTimestamps[0];
    const resetMs = Math.max(0, oldest + config.windowMs - now);
    return {
      success: false,
      remaining: 0,
      resetMs,
    };
  }

  activeTimestamps.push(now);
  tracker.set(key, activeTimestamps);

  return {
    success: true,
    remaining: config.maxRequests - activeTimestamps.length,
    resetMs: config.windowMs,
  };
}

/**
 * Membersihkan tracker (berguna saat unit testing)
 */
export function resetRateLimitTracker(): void {
  tracker.clear();
}

/**
 * Ekstraksi alamat IP klien dari HTTP headers
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const cfIp = headerList.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for dapat berupa daftar berurutan "client, proxy1, proxy2"
    return forwarded.split(",")[0].trim();
  }

  const realIp = headerList.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
