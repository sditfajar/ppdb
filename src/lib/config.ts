import { z } from "zod";

/**
 * Informasi dan konstanta resmi sekolah SDIT Fajar
 * Sumber: PRD Lampiran A
 */
export const SCHOOL_CONFIG = {
  name: "SDIT Fajar",
  fullName: "Sekolah Dasar Islam Terpadu Fajar",
  address: "Depok, Jawa Barat",
  defaultAcademicYear: "2026/2027",
  contacts: {
    fadil: {
      name: "Ustadz M Fadil Riswandi",
      phone: "087737860657",
      display: "0877-3786-0657",
      waLink: "https://wa.me/6287737860657",
    },
    viny: {
      name: "Ustadzah Viny Virzana",
      phone: "082249627864",
      display: "0822-4962-7864",
      waLink: "https://wa.me/6282249627864",
    },
    email: {
      address: "sditfajar@gmail.com",
      mailto: "mailto:sditfajar@gmail.com",
    },
    instagram: {
      handle: "@sdit_fajar",
      url: "https://instagram.com/sdit_fajar",
    },
    youtube: {
      channel: "SDIT Fajar Depok",
      url: "https://www.youtube.com/results?search_query=SDIT+Fajar+Depok",
    },
  },
  waves: {
    1: {
      name: "Gelombang 1",
      period: "September – Februari",
    },
    2: {
      name: "Gelombang 2",
      period: "Maret – Juni",
    },
  },
} as const;

// Skema variabel lingkungan publik (dapat diakses di browser & server)
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: "NEXT_PUBLIC_SUPABASE_URL harus berupa URL Supabase yang valid",
  }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, {
    message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY wajib diisi",
  }),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1, {
    message: "NEXT_PUBLIC_TURNSTILE_SITE_KEY wajib diisi",
  }),
  NEXT_PUBLIC_SITE_URL: z.string().url({
    message: "NEXT_PUBLIC_SITE_URL harus berupa URL yang valid (mis. http://localhost:3000)",
  }),
});

// Skema variabel lingkungan server (hanya boleh diakses di sisi server)
const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SECRET_KEY: z.string().min(1, {
    message: "SUPABASE_SECRET_KEY wajib diisi di server",
  }),
  TURNSTILE_SECRET_KEY: z.string().min(1, {
    message: "TURNSTILE_SECRET_KEY wajib diisi di server",
  }),
  CRON_SECRET: z.string().min(1, {
    message: "CRON_SECRET wajib diisi di server",
  }),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validasi env publik (aman dipanggil di browser & server)
 */
export function getPublicEnv(): PublicEnv {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => ` - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `[CONFIG] Variabel lingkungan publik tidak valid atau belum diisi:\n${formattedErrors}`
    );
  }

  return result.data;
}

/**
 * Validasi env server (hanya dipanggil di sisi server)
 */
export function getServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
  });

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => ` - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `[CONFIG] Variabel lingkungan server tidak valid atau belum diisi:\n${formattedErrors}`
    );
  }

  return result.data;
}
