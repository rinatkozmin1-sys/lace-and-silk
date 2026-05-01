import type { Product } from "@/lib/products";

/** Пилюли: «Все» (уровень 1) или фильтр по подстроке в данных товара */
export type CatalogPillFilter =
  | "all"
  | "kosynki"
  | "sharfy"
  | "zauzhennye"
  | "aksessuary";

export const CATALOG_PILL_ORDER: CatalogPillFilter[] = [
  "all",
  "kosynki",
  "sharfy",
  "zauzhennye",
  "aksessuary",
];

const PILL_KEYWORDS: Record<Exclude<CatalogPillFilter, "all">, readonly string[]> = {
  kosynki: ["косынк"],
  sharfy: ["шарф"],
  zauzhennye: ["зауженн"],
  /** В т.ч. EN «accessories» из описаний и возможные «заколки» */
  aksessuary: ["аксессуар", "accessories", "accessoire", "заколк"],
};

export function productMatchesCatalogPill(product: Product, filter: CatalogPillFilter): boolean {
  if (filter === "all") return true;
  const keywords = PILL_KEYWORDS[filter];
  const haystacks: string[] = [
    ...Object.values(product.name),
    product.category,
    product.material,
    ...(product.title ? Object.values(product.title) : []),
  ].map((s) => s.toLowerCase());
  return haystacks.some((h) => keywords.some((kw) => h.includes(kw)));
}
