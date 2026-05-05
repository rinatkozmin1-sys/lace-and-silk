import type { ProductRow } from "@/lib/catalogProductQuery";
import { MATERIAL_SIZES, type LocalizedText, type Material, type Product } from "@/lib/products";

function localizeName(name: string): LocalizedText {
  return {
    ru: name,
    en: name,
    de: name,
    kk: name,
    uk: name,
    uz: name,
  };
}

/** Преобразует строки из Supabase в модель каталога для UI. */
export function productRowsToUiProducts(rows: ProductRow[]): Product[] {
  const mapped = rows.map((row, index) => {
    const titleFromDb = typeof row.name === "string" ? row.name.trim() : "";
    const categoryFromDb = typeof row.category === "string" ? row.category.trim() : "";
    let priceVal =
      typeof row.price === "number" && Number.isFinite(row.price)
        ? row.price
        : Number.parseFloat(String(row.price ?? "").replace(",", "."));
    if (!Number.isFinite(priceVal)) priceVal = 0;

    const idStr =
      row.id !== undefined && row.id !== null && String(row.id) !== ""
        ? String(row.id)
        : `product-${index}`;

    const normalizedCategory = categoryFromDb as Material;

    return {
      id: idStr,
      name: localizeName(titleFromDb),
      image: typeof row.image === "string" ? row.image : "",
      price: priceVal,
      category: normalizedCategory,
      material: normalizedCategory,
      badge: null,
    };
  });

  const seen = new Set<Material>();
  return mapped.map((product) => {
    const size = MATERIAL_SIZES[product.category];
    if (seen.has(product.category)) return size ? { ...product, size } : product;
    seen.add(product.category);
    return { ...product, isExample: true, size };
  });
}

export type HomeCatalogPayload =
  | { ok: true; products: Product[] }
  | { ok: false; message: string };

export function catalogPayloadFromDb(rows: ProductRow[], error: string | null): HomeCatalogPayload {
  if (error !== null) return { ok: false, message: error };
  return { ok: true, products: productRowsToUiProducts(rows) };
}
