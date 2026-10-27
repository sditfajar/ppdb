/**
 * Sanitasi string pencarian agar aman digunakan pada query PostgREST (.or() dan .ilike()).
 *
 * Mencegah filter injection dan kegagalan parsing sintaks PostgREST yang disebabkan
 * oleh karakter pembatas argumen (koma), grup kondisi (kurung), wildcard LIKE (% dan _),
 * serta karakter kutip dan escape (", ', \).
 */
export function sanitizePostgrestSearch(input: string | null | undefined): string {
  if (!input) return "";

  return input
    .replace(/[(),."':\\%_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
