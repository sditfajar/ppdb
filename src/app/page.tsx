import { SCHOOL_CONFIG } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          PPDB Online
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {SCHOOL_CONFIG.name}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-pretty">
          {SCHOOL_CONFIG.fullName} — Penerimaan Peserta Didik Baru Tahun Ajaran{" "}
          <span className="tabular-nums font-medium text-neutral-900 dark:text-neutral-100">
            {SCHOOL_CONFIG.defaultAcademicYear}
          </span>
          .
        </p>
      </div>
    </main>
  );
}
