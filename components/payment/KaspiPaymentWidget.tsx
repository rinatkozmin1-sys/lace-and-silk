"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Check, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const KASPI_PHONE_DISPLAY = "+7 705 416 16 14";
const KASPI_PHONE_COPY = KASPI_PHONE_DISPLAY.replace(/\s/g, "");

export type KaspiPaymentVariant = "default" | "compact" | "checkout";

function KaspiQrLightbox({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 transition-[opacity,visibility] duration-300 ease-out",
        open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
      )}
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-primary/70 backdrop-blur-[2px] transition-opacity duration-300"
        aria-label={t("checkout.kaspi.closeQrBackdrop")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("checkout.kaspi.qrDialogAria")}
        className={cn(
          "relative z-10 flex max-h-[min(92dvh,900px)] w-full max-w-[min(92vw,520px)] flex-col rounded-2xl bg-white p-3 shadow-xl transition-all duration-300 ease-out sm:p-4",
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.97] opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-primary/10 pb-2">
          <p className="font-serif text-sm font-medium text-primary sm:text-base">
            {t("checkout.kaspi.qrLightboxHeading")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-primary/12 bg-body/90 px-3 py-1.5 text-xs font-medium text-primary/85 transition-colors hover:border-accent/35 hover:bg-accent/5"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            {t("checkout.close")}
          </button>
        </div>
        <div className="relative mt-3 flex min-h-0 flex-1 items-center justify-center rounded-xl bg-cream/30 p-2">
          <Image
            src="/kaspi-qr.jpg"
            alt={t("checkout.kaspi.qrImageAlt")}
            width={900}
            height={900}
            className="h-auto max-h-[min(78dvh,720px)] w-full object-contain"
            sizes="(max-width: 768px) 90vw, 520px"
            priority={open}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

export function KaspiPaymentWidget({ variant = "default" }: { variant?: KaspiPaymentVariant }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = useCallback(() => setLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const copyPhone = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(KASPI_PHONE_COPY);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  const title =
    variant === "checkout" || variant === "compact"
      ? t("checkout.kaspi.titleQr")
      : t("checkout.kaspi.titleVia");

  const phoneBlock = (
    <div className="rounded-xl border border-primary/10 bg-body/70 px-3 py-3 sm:px-4 sm:py-4">
      <p className="text-center text-xs leading-relaxed text-primary/60 sm:text-sm">
        {t("checkout.kaspi.phoneTransferHint")}
      </p>
      <div className="mt-2.5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
        <div className="text-center sm:text-left">
          <p className="font-mono text-sm font-medium tracking-wide text-primary sm:text-base">
            {KASPI_PHONE_DISPLAY}
          </p>
          <p className="mt-0.5 text-[11px] text-primary/50">{t("checkout.kaspi.recipientName")}</p>
        </div>
        <button
          type="button"
          onClick={copyPhone}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 sm:px-3 sm:text-xs",
            "border-primary/12 bg-white text-primary/75 hover:border-accent/35 hover:bg-accent/5 hover:text-primary",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-1 focus:ring-offset-white"
          )}
          aria-label={t("checkout.kaspi.copyPhoneAria")}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-primary/65" aria-hidden />
              {t("checkout.kaspi.copied")}
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-primary/55" aria-hidden />
              {t("checkout.kaspi.copyNumber")}
            </>
          )}
        </button>
      </div>
    </div>
  );

  const qrThumb = (
    <button
      type="button"
      onClick={openLightbox}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-xl border border-primary/12 bg-cream/50 shadow-sm transition-all duration-200",
        "hover:border-accent/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/35 focus:ring-offset-2 focus:ring-offset-white",
        variant === "compact" ? "h-[88px] w-[88px]" : "h-[96px] w-[96px] sm:h-[100px] sm:w-[100px]"
      )}
      aria-label={t("checkout.kaspi.openQrFullscreenAria")}
    >
      <Image
        src="/kaspi-qr.jpg"
        alt=""
        width={200}
        height={200}
        className="h-full w-full object-contain p-0.5 transition-transform duration-200 group-hover:scale-[1.02]"
        sizes="100px"
      />
    </button>
  );

  if (variant === "compact") {
    return (
      <>
        <KaspiQrLightbox open={lightboxOpen} onClose={closeLightbox} />
        <section
          className="rounded-xl border border-primary/10 bg-white p-3 shadow-sm sm:p-4"
          aria-labelledby="kaspi-compact-heading"
        >
          <h3
            id="kaspi-compact-heading"
            className="font-serif text-sm font-medium tracking-tight text-primary sm:text-base"
          >
            {title}
          </h3>
          <div className="mt-3 flex gap-3">
            {qrThumb}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
              <p className="text-xs leading-snug text-primary/55">{t("checkout.kaspi.tapToEnlargeQr")}</p>
              <button
                type="button"
                onClick={openLightbox}
                className="w-full max-w-[160px] rounded-lg border border-primary/15 bg-body/80 py-2 text-xs font-medium text-primary/85 transition-all duration-200 hover:border-accent/35 hover:bg-accent/5"
              >
                {t("checkout.kaspi.showQr")}
              </button>
            </div>
          </div>
          <div className="mt-3">{phoneBlock}</div>
        </section>
      </>
    );
  }

  /* default & checkout */
  return (
    <>
      <KaspiQrLightbox open={lightboxOpen} onClose={closeLightbox} />
      <section
        className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm sm:p-5"
        aria-labelledby="kaspi-widget-heading"
      >
        <h3
          id="kaspi-widget-heading"
          className="font-serif text-base font-medium tracking-tight text-primary sm:text-lg"
        >
          {title}
        </h3>

        <div className="mt-4 flex flex-col items-center sm:mt-5">
          {qrThumb}
          <p className="mt-2 text-center text-[11px] text-primary/50 sm:text-xs">
            {t("checkout.kaspi.tapToEnlargeQr")}
          </p>
          <p className="mt-3 max-w-sm text-center text-xs leading-relaxed text-primary/60 sm:text-sm">
            {t("checkout.kaspi.scanQrInApp")}
          </p>
        </div>

        <div className="mt-4 sm:mt-5">{phoneBlock}</div>
      </section>
    </>
  );
}
