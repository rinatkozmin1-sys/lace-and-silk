/** Ключ sessionStorage для восстановления скролла каталога после оверлея фото / перерисовки сетки */

const STORAGE_KEY = "lace-silk-catalog-scroll-y";

export function stashCatalogScrollY(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(window.scrollY));
  } catch {
    /* quota / private mode */
  }
}

/** Читает сохранённую позицию и удаляет ключ */
export function takeStashedCatalogScrollY(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    const y = Number.parseFloat(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

export function applyCatalogScrollY(y: number): void {
  window.scrollTo({ top: Math.max(0, y), left: 0, behavior: "instant" as ScrollBehavior });
}
