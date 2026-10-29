export const LIGHT_LOCKED_PATHS = ["/", "/ppdb"] as const;

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";

/**
 * Memeriksa apakah suatu pathname dikunci secara eksklusif ke tema terang.
 * Aturan:
 * - Halaman root "/"
 * - Halaman "/ppdb" dan seluruh turunannya ("/ppdb/*")
 *
 * Normalisasi dilakukan untuk mengabaikan trailing slash (kecuali root "/").
 */
export function isLightLockedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const cleanPath = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  return cleanPath === "/" || cleanPath === "/ppdb" || cleanPath.startsWith("/ppdb/");
}
