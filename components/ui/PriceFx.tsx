"use client";

import { useFxCurrency } from "@/lib/fxCurrency";
import { formatFxAmount } from "@/lib/fxFormat";
import { useFxRates } from "@/lib/useFxRates";
import { cn } from "@/lib/utils";

/** Отображение цены в валюте, выбранной глобально в шапке (курс из API к ₸). */
export function PriceFx({ amountKzt, className }: { amountKzt: number; className?: string }) {
  const { currency } = useFxCurrency();
  const { rates } = useFxRates();

  return (
    <span className={cn("font-semibold tabular-nums text-foreground", className)}>
      {formatFxAmount(amountKzt, currency, rates)}
    </span>
  );
}
