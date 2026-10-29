"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

const noopSubscribe = () => () => {};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, isLocked, toggleTheme } = useTheme();

  // Deteksi status mount klien dengan useSyncExternalStore tanpa memicu cascading render
  const isMounted = React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  // Jangan tampilkan toggle di halaman yang dikunci ke tema terang
  if (isLocked) {
    return null;
  }

  // Fallback selama SSR / sebelum mount untuk mencegah mismatch hidrasi
  if (!isMounted) {
    return (
      <button
        type="button"
        disabled
        aria-hidden="true"
        tabIndex={-1}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-control text-muted opacity-60 cursor-default ${className}`}
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark";
  const label = isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-control text-muted hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-foreground transition-transform hover:-rotate-12" aria-hidden="true" />
      )}
    </button>
  );
}
