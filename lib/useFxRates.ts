"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ensureFxRates, getFxSnapshot, subscribeFx } from "@/lib/fx";

export function useFxRates() {
  const snap = useSyncExternalStore(subscribeFx, getFxSnapshot, getFxSnapshot);

  useEffect(() => {
    // гарантируем один запрос на сессию
    ensureFxRates();
  }, []);

  return snap;
}

