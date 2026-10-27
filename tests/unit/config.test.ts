import { describe, it, expect, beforeEach } from "vitest";
import { SCHOOL_CONFIG, getPublicEnv, getServerEnv } from "@/lib/config";

describe("SCHOOL_CONFIG", () => {
  it("memiliki nama dan kontak resmi SDIT Fajar", () => {
    expect(SCHOOL_CONFIG.name).toBe("SDIT Fajar");
    expect(SCHOOL_CONFIG.contacts.fadil.phone).toBe("087737860657");
    expect(SCHOOL_CONFIG.contacts.viny.phone).toBe("082249627864");
    expect(SCHOOL_CONFIG.contacts.email.address).toBe("sditfajar@gmail.com");
  });
});

describe("Environment Validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("gagal cepat jika env publik hilang", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getPublicEnv()).toThrowError(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("berhasil memvalidasi env publik yang lengkap dan valid", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "dummy-pub-key";
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "dummy-turnstile-key";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
  });

  it("gagal cepat jika env server (secret) hilang", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "dummy-pub-key";
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "dummy-turnstile-key";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    delete process.env.SUPABASE_SECRET_KEY;

    expect(() => getServerEnv()).toThrowError(/SUPABASE_SECRET_KEY/);
  });
});
