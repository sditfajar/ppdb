"use client";

import * as React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary",
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Tangani saat pengguna menekan tombol ESC bawaan dialog
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!loading) {
      onClose();
    }
  };

  // Tangani klik pada backdrop dialog
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current && !loading) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className={cn(
        "p-0 max-w-sm w-[calc(100%-2rem)] mx-auto rounded-card bg-surface text-foreground shadow-2xl shadow-border outline-none",
        "backdrop:bg-black/50 backdrop:backdrop-blur-xs backdrop:transition-opacity",
        "open:animate-enter"
      )}
    >
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-foreground text-balance">
          {title}
        </h3>
        <p className="text-sm text-muted text-pretty">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
