"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FX_OPTIONS, useFxCurrency, type FxCurrency } from "@/lib/fxCurrency";
import { useI18n } from "@/lib/i18n";

const LABELS: Record<FxCurrency, string> = {
  USD: "USD ($)",
  EUR: "EUR (€)",
  RUB: "RUB (₽)",
  KZT: "KZT (₸)",
};

export function CurrencySwitcher() {
  const { t } = useI18n();
  const { currency, setCurrency } = useFxCurrency();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root || !(e.target instanceof Node)) return;
      if (!root.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        id={btnId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("header.currency")}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1 rounded-full border border-primary/15 bg-white/70 px-2.5 text-xs font-medium tracking-wide text-primary/85 backdrop-blur-sm transition-colors hover:bg-stone-100/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 sm:h-9 sm:px-3"
      >
        <span className="tabular-nums">{currency}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 text-primary/55 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-labelledby={btnId}
          className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[9.25rem] rounded-xl border border-primary/25 bg-white py-1 shadow-xl shadow-black/15 ring-1 ring-black/[0.06]"
        >
          {FX_OPTIONS.map((c) => (
            <li key={c} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={currency === c}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-left text-xs font-medium tracking-wide text-primary transition-colors hover:bg-stone-100",
                  currency === c && "bg-stone-100 font-semibold text-primary"
                )}
                onClick={() => {
                  setCurrency(c);
                  setOpen(false);
                }}
              >
                {LABELS[c]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
