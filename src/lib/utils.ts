import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gabungan clsx dan tailwind-merge untuk komposisi class Tailwind yang aman dari konflik.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
