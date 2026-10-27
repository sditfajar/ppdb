"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (options: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, message, type = "info", duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam <ToastProvider>");
  }
  return context;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm md:w-full"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="h-5 w-5 text-danger shrink-0" aria-hidden="true" />,
    info: <Info className="h-5 w-5 text-accent shrink-0" aria-hidden="true" />,
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-3.5 rounded-card bg-surface shadow-border shadow-lg transition-all duration-200 animate-enter",
        "w-full text-foreground"
      )}
    >
      {icons[item.type || "info"]}
      <div className="flex-1 text-sm leading-tight">
        {item.title && (
          <p className="font-semibold text-foreground mb-0.5 text-balance">
            {item.title}
          </p>
        )}
        <p className="text-muted text-pretty">{item.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="p-1 -mr-1 -mt-1 text-muted hover:text-foreground rounded-control transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
