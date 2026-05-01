export type FxRates = {
  USD: number;
  EUR: number;
  RUB: number;
};

type FxSnapshot =
  | { status: "idle" | "loading"; rates: null; error: null }
  | { status: "ready"; rates: FxRates; error: null }
  | { status: "error"; rates: null; error: string };

let snapshot: FxSnapshot = { status: "idle", rates: null, error: null };
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function fetchOnce() {
  if (inFlight) return inFlight;
  if (snapshot.status === "ready") return;

  snapshot = { status: "loading", rates: null, error: null };
  notify();

  inFlight = (async () => {
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/KZT", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`FX rates failed: ${res.status}`);
      const data = await res.json();

      const next: FxRates = {
        USD: Number(data?.rates?.USD),
        EUR: Number(data?.rates?.EUR),
        RUB: Number(data?.rates?.RUB),
      };

      if (!Number.isFinite(next.USD) || !Number.isFinite(next.EUR) || !Number.isFinite(next.RUB)) {
        throw new Error("FX rates invalid payload");
      }

      snapshot = { status: "ready", rates: next, error: null };
    } catch (e) {
      snapshot = {
        status: "error",
        rates: null,
        error: e instanceof Error ? e.message : "FX rates error",
      };
    } finally {
      inFlight = null;
      notify();
    }
  })();

  return inFlight;
}

export function subscribeFx(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFxSnapshot(): FxSnapshot {
  return snapshot;
}

export function ensureFxRates() {
  return fetchOnce();
}

