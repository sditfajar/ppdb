"use client";

import * as React from "react";
import { useActionState } from "react";
import { School, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme";
import { signInAdmin, AdminActionState } from "@/lib/actions/admin";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<AdminActionState, FormData>(
    signInAdmin,
    { success: false }
  );

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-background">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm flex flex-col gap-6 animate-enter">
        {/* Identitas SDIT Fajar */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 text-accent font-semibold shadow-xs">
            <School className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-balance">
            SDIT Fajar
          </h1>
          <p className="text-xs sm:text-sm text-muted text-pretty">
            Masuk ke Panel Administrasi SPMB
          </p>
        </div>

        {/* Kartu Form Login */}
        <Card className="p-6 sm:p-7 shadow-border">
          <form action={formAction} className="flex flex-col gap-4">
            {/* Pesan Error Generik */}
            {state?.error && (
              <div
                role="alert"
                className="flex items-center gap-2.5 p-3 rounded-control bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-500/20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Input Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-foreground"
              >
                Email Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@sditfajar.sch.id"
                  className="w-full min-h-[48px] pl-10 pr-3.5 text-base sm:text-sm text-foreground bg-surface rounded-control shadow-border focus:shadow-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-shadow placeholder:text-muted/60"
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-foreground"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full min-h-[48px] pl-10 pr-3.5 text-base sm:text-sm text-foreground bg-surface rounded-control shadow-border focus:shadow-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-shadow placeholder:text-muted/60"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isPending}
              className="w-full min-h-[48px] mt-2 font-semibold"
            >
              Masuk ke Admin
            </Button>
          </form>
        </Card>

        {/* Catatan Bantuan Keamanan */}
        <p className="text-[11px] text-center text-muted text-pretty">
          Hanya untuk panitia dan administrator resmi SDIT Fajar. Seluruh aktivitas akses tercatat dalam sistem.
        </p>
      </div>
    </main>
  );
}
