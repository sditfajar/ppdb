"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { isLightLockedPath, type Theme, THEME_STORAGE_KEY } from "@/lib/theme";

interface ThemeContextType {
  theme: Theme;
  userTheme: Theme;
  isLocked: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const THEME_CHANGE_EVENT = "SPMB-theme-change";

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => { };
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getThemeSnapshot(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  } catch {
    // Abaikan jika localStorage tidak dapat diakses
  }
  return "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function applyThemeToDOM(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLocked = isLightLockedPath(pathname);

  // Gunakan useSyncExternalStore untuk membaca preferensi dari localStorage tanpa setState di dalam useEffect
  const userTheme = React.useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);

  // Tema aktif pada halaman saat ini
  const activeTheme: Theme = isLocked ? "light" : userTheme;

  // Sinkronisasi atribut data-theme, kelas CSS, dan style.colorScheme pada <html>
  React.useEffect(() => {
    applyThemeToDOM(activeTheme);
  }, [activeTheme]);

  const toggleTheme = React.useCallback(() => {
    if (isLightLockedPath(pathname)) return;

    const current = getThemeSnapshot();
    const nextTheme: Theme = current === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    } catch {
      // Abaikan error localStorage
    }
  }, [pathname]);

  const setTheme = React.useCallback(
    (theme: Theme) => {
      if (isLightLockedPath(pathname)) return;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
      } catch {
        // Abaikan error localStorage
      }
    },
    [pathname]
  );

  const value = React.useMemo<ThemeContextType>(
    () => ({
      theme: activeTheme,
      userTheme,
      isLocked,
      toggleTheme,
      setTheme,
    }),
    [activeTheme, userTheme, isLocked, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider");
  }
  return context;
}
