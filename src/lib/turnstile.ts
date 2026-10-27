/**
 * Verifikasi Server-Side Cloudflare Turnstile
 * Sesuai dokumentasi resmi Cloudflare Turnstile Siteverify API
 */

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
  hostname?: string;
  action?: string;
}

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<TurnstileVerificationResult> {
  // 1. Validasi token format dasar
  if (!token || typeof token !== "string" || token.trim() === "") {
    return {
      success: false,
      errorCodes: ["missing-input-response"],
    };
  }

  // Dukungan untuk unit testing
  if (process.env.NODE_ENV === "test" && token === "test-mock-valid-turnstile-token") {
    return { success: true };
  }

  if (process.env.NODE_ENV === "test" && token === "test-mock-invalid-turnstile-token") {
    return { success: false, errorCodes: ["invalid-input-response"] };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error("[TURNSTILE] TURNSTILE_SECRET_KEY belum dikonfigurasi di server.");
    return {
      success: false,
      errorCodes: ["missing-secret-key"],
    };
  }

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token.trim());
  if (remoteIp && remoteIp !== "127.0.0.1") {
    formData.append("remoteip", remoteIp);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        success: false,
        errorCodes: [`http-status-${res.status}`],
      };
    }

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
      hostname?: string;
      action?: string;
    };

    return {
      success: Boolean(data.success),
      errorCodes: data["error-codes"],
      hostname: data.hostname,
      action: data.action,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("[TURNSTILE] Gagal menghubungi layanan verifikasi Cloudflare:", error);
    return {
      success: false,
      errorCodes: ["network-timeout-or-error"],
    };
  }
}
