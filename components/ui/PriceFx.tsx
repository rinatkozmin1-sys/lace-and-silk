"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FxRates } from "@/lib/fx";

export type FxCurrency = "USD" | "EUR" | "RUB";

function currencyLabel(c: FxCurrency) {
  if (c === "USD") return "USD ($)";
  if (c === "EUR") return "EUR (€)";
  return "RUB (₽)";
}

function formatMoney(value: number, currency: FxCurrency) {
  const locale = currency === "RUB" ? "ru-RU" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RUB" ? 0 : 2,
  }).format(value);
}

export function PriceFx({
  amountKzt,
  rates,
  selectedCurrency,
  onSelectCurrency,
  className,
}: {
  amountKzt: number;
  rates: FxRates | null;
  selectedCurrency?: FxCurrency | null;
  onSelectCurrency?: (c: FxCurrency) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnId = useId();
  const panelId = `${btnId}-panel`;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const converted = useMemo(() => {
    if (!rates) return null;
    return {
      USD: amountKzt * rates.USD,
      EUR: amountKzt * rates.EUR,
      RUB: amountKzt * rates.RUB,
    } satisfies Record<FxCurrency, number>;
  }, [amountKzt, rates]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) setOpen(false);
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

  const kztText = `${amountKzt.toLocaleString("ru-KZ")} ₸`;

  const selectedText =
    selectedCurrency && converted
      ? formatMoney(converted[selectedCurrency], selectedCurrency)
      : null;

  return (
    <div ref={rootRef} className={`relative inline-block ${className ?? ""}`.trim()}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md text-xs font-semibold text-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:text-sm"
      >
        <span>{kztText}</span>
        <ChevronDown
          className={`h-4 w-4 text-primary/70 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {selectedText && <div className="mt-0.5 text-[11px] text-primary/70 tabular-nums md:text-xs">{selectedText}</div>}

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Пересчёт цены"
          className="absolute left-0 mt-2 w-48 rounded-xl border border-primary/15 bg-white/95 backdrop-blur-sm shadow-lg shadow-black/10 ring-1 ring-black/5"
        >
          <div className="px-3 py-2">
            <div className="text-[11px] font-medium tracking-wide text-primary/70">
              Цена по курсу
            </div>

            {!converted ? (
              <div className="mt-2 text-xs text-muted-foreground">
                Не удалось загрузить курс
              </div>
            ) : (
              <div className="mt-2 space-y-1">
                {(["USD", "EUR", "RUB"] as FxCurrency[]).map((c) => {
                  const isSelected = selectedCurrency === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        onSelectCurrency?.(c);
                        setOpen(false);
                      }}
                      className={`flex w-full items-baseline justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                        onSelectCurrency
                          ? isSelected
                            ? "bg-primary/5"
                            : "hover:bg-primary/5"
                          : "cursor-default"
                      }`}
                      disabled={!onSelectCurrency}
                    >
                      <span className="text-xs text-primary/70">{currencyLabel(c)}</span>
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {formatMoney(converted[c], c)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

