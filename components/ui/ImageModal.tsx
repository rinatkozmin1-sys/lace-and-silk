"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ANIM_MS = 300;

type ImageModalProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
};

/**
 * Полноэкранный просмотр изображения: затемнённый фон, ESC и клик по фону закрывают.
 * Рендер через portal поверх шторок корзины (z выше Kaspi lightbox).
 */
export function ImageModal({ open, onClose, src, alt }: ImageModalProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const id = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setVisible(true));
      });
      return () => window.cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = window.setTimeout(() => setShouldRender(false), ANIM_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shouldRender, onClose]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[260] flex items-center justify-center p-4 transition-[opacity,visibility] duration-300 ease-out",
        visible ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/88 backdrop-blur-[2px] transition-opacity duration-300 ease-out"
        aria-label={t("checkout.kaspi.closeQrBackdrop")}
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-[262] flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-lg ring-1 ring-black/12 transition-all duration-200 ease-out hover:bg-white hover:ring-black/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-5 sm:top-5"
        aria-label={t("checkout.close")}
      >
        <X className="h-7 w-7 stroke-[2]" aria-hidden />
      </button>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 pb-6 pt-16 sm:p-6 sm:pb-8 sm:pt-20">
        <div
          className={cn(
            "pointer-events-auto relative max-h-[min(92vh,100dvh)] w-full max-w-[min(96vw,1100px)] transition-all duration-300 ease-out",
            visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.97] opacity-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-[min(88vh,900px)] w-full max-w-[min(96vw,1100px)]">
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              className="object-contain object-center drop-shadow-lg"
              sizes="96vw"
              priority={visible}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
