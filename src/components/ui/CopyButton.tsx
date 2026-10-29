"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconSwap } from "@/components/ui/IconSwap";

export interface CopyButtonProps {
  /**
   * Teks yang akan disalin ke papan klip (clipboard).
   */
  text: string;
  /**
   * Jika true, nomor rekening akan dibersihkan dari tanda strip (-) dan spasi
   * agar langsung siap ditempel pada aplikasi mobile banking. Default: true.
   */
  cleanNumeric?: boolean;
  /**
   * Kelas CSS tambahan untuk tombol.
   */
  className?: string;
  /**
   * Tooltip penjelas tombol. Default: "Salin nomor rekening".
   */
  title?: string;
  /**
   * Label aksesibilitas untuk screen reader. Default: "Salin nomor rekening".
   */
  ariaLabel?: string;
  /**
   * Ukuran ikon: "sm" (14px) atau "md" (16px). Default: "sm".
   */
  size?: "sm" | "md";
  /**
   * Callback opsional yang dipanggil saat penyalinan berhasil.
   */
  onCopied?: () => void;
}

/**
 * Normalisasi teks nomor rekening: menghapus tanda hubung dan spasi jika ada.
 */
export function normalizeAccountNoForCopy(rawText: string, cleanNumeric: boolean = true): string {
  if (!cleanNumeric) return rawText;
  // Hapus semua tanda strip (-) dan spasi
  return rawText.replace(/[-\s]/g, "");
}

/**
 * Salin teks ke papan klip dengan fallback untuk lingkungan peramban lawas / iframe tanpa permission.
 */
export async function copyToClipboard(textToCopy: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    }
  } catch (err) {
    console.warn("[CopyButton] navigator.clipboard gagal, mencoba fallback execCommand:", err);
  }

  // Fallback via textarea tersembunyi
  try {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.setAttribute("aria-hidden", "true");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error("[CopyButton] Gagal menyalin ke clipboard:", fallbackErr);
    return false;
  }
}

/**
 * Tombol salin berbasis ikon saja (tanpa teks) dengan animasi transisi ke centang (Check)
 * saat berhasil disalin dan pembersihan format nomor rekening otomatis.
 */
export function CopyButton({
  text,
  cleanNumeric = true,
  className,
  title = "Salin nomor rekening",
  ariaLabel = "Salin nomor rekening",
  size = "sm",
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const textToCopy = normalizeAccountNoForCopy(text, cleanNumeric);
    const success = await copyToClipboard(textToCopy);

    if (success) {
      setCopied(true);
      if (onCopied) {
        onCopied();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const iconSizeClass = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Nomor rekening berhasil disalin" : ariaLabel}
      title={copied ? "Tersalin ke papan klip!" : title}
      className={cn(
        "inline-flex items-center justify-center p-1.5 rounded-control transition-all duration-200 outline-none cursor-pointer select-none",
        "focus-visible:ring-2 focus-visible:ring-accent",
        copied
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 active:scale-95",
        className
      )}
    >
      <IconSwap
        swapKey={copied ? "copied" : "idle"}
        className="flex items-center justify-center"
        icon={
          copied ? (
            <Check className={cn(iconSizeClass, "text-emerald-600 dark:text-emerald-400")} aria-hidden="true" />
          ) : (
            <Copy className={iconSizeClass} aria-hidden="true" />
          )
        }
      />
    </button>
  );
}
