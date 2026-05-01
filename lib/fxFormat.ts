import type { FxRates } from "@/lib/fx";
import type { FxCurrency } from "./fxCurrency";

type FxRatesCode = keyof FxRates;

export function formatFxAmount(amountKzt: number, currency: FxCurrency, rates: FxRates | null): string {
  if (currency === "KZT") {
    return `${amountKzt.toLocaleString("ru-KZ")} ₸`;
  }
  if (!rates) {
    return `${amountKzt.toLocaleString("ru-KZ")} ₸`;
  }
  const code = currency as FxRatesCode;
  const value = amountKzt * rates[code];
  const locale = currency === "RUB" ? "ru-RU" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RUB" ? 0 : 2,
  }).format(value);
}
