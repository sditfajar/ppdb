"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface IconSwapProps {
  icon: React.ReactNode;
  swapKey: string | number;
  className?: string;
}

/**
 * Pertukaran ikon kontekstual (mis. Salin -> Centang, Buka -> Tutup)
 * dengan animasi opacity + scale (0.25 -> 1) + blur (4px -> 0), spring ~300ms bounce 0.
 * Mengacu pada filosofi jakub.kr & PRD §13.1 #3.
 */
export function IconSwap({ icon, swapKey, className }: IconSwapProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={swapKey}
          initial={{ opacity: 0.25, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0.25, scale: 0.25, filter: "blur(4px)" }}
          transition={{
            type: "spring",
            duration: 0.3,
            bounce: 0,
          }}
          className="inline-flex items-center justify-center"
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
