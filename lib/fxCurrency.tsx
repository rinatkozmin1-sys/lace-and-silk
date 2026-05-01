"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFxRates } from "@/lib/useFxRates";

function FxRatesWarmup() {
  useFxRates();
  return null;
}

export type FxCurrency = "USD" | "EUR" | "RUB" | "KZT";

const STORAGE_KEY = "silk_shop_currency";

/** Порядок в выпадающем списке шапки */
export const FX_OPTIONS: FxCurrency[] = ["USD", "EUR", "RUB", "KZT"];

type FxCurrencyContextValue = {
  currency: FxCurrency;
  setCurrency: (c: FxCurrency) => void;
};

const FxCurrencyContext = createContext<FxCurrencyContextValue | null>(null);

export function FxCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<FxCurrency>("KZT");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as FxCurrency | null;
      if (stored && FX_OPTIONS.includes(stored)) setCurrencyState(stored);
    } catch {
      // ignore
    }
  }, []);

  const setCurrency = useCallback((c: FxCurrency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);
  return (
    <FxCurrencyContext.Provider value={value}>
      <FxRatesWarmup />
      {children}
    </FxCurrencyContext.Provider>
  );
}

export function useFxCurrency() {
  const ctx = useContext(FxCurrencyContext);
  if (!ctx) throw new Error("useFxCurrency must be used within FxCurrencyProvider");
  return ctx;
}
