"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function Drawer({
  open,
  onClose,
  children,
  title,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right";
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Панель"}
        className={cn(
          "fixed top-0 z-50 flex h-full w-full max-w-md flex-col bg-body shadow-xl transition-transform duration-300 ease-out",
          side === "right" ? "right-0" : "left-0"
        )}
      >
        {children}
      </div>
    </>
  );
}
