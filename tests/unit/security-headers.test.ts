import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("Security Headers Configuration (Fase 8)", () => {
  it("mendefinisikan header keamanan HTTP lengkap di next.config.ts", async () => {
    expect(nextConfig.headers).toBeDefined();
    if (!nextConfig.headers) return;

    const headersConfig = await nextConfig.headers();
    expect(headersConfig).toBeInstanceOf(Array);
    expect(headersConfig.length).toBeGreaterThan(0);

    const rootRule = headersConfig.find((r) => r.source === "/:path*");
    expect(rootRule).toBeDefined();
    if (!rootRule) return;

    const headerMap = new Map(rootRule.headers.map((h) => [h.key, h.value]));

    // 1. Verifikasi header keamanan dasar
    expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headerMap.get("X-Frame-Options")).toBe("DENY");
    expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headerMap.get("Strict-Transport-Security")).toContain("max-age=63072000");
    expect(headerMap.get("Permissions-Policy")).toContain("camera=()");

    // 2. Verifikasi Content-Security-Policy (CSP)
    const csp = headerMap.get("Content-Security-Policy");
    expect(csp).toBeDefined();
    if (!csp) return;

    // Directives penting
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src");
    expect(csp).toContain("https://challenges.cloudflare.com");
    expect(csp).toContain("img-src 'self' blob: data: https://*.supabase.co");
    expect(csp).toContain("connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com");
    expect(csp).toContain("frame-src 'self' https://challenges.cloudflare.com");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
  });
});
