import type { ProductRow } from "@/lib/catalogProductQuery";
import {
  markFirstProductAsExample,
  resolveStaticLocalizedName,
  type LocalizedText,
  type Material,
  type Product,
} from "@/lib/products";

function fallbackLocalizedName(name: string): LocalizedText {
  return {
    ru: name,
    en: name,
    de: name,
    kk: name,
    uk: name,
    uz: name,
  };
}

function resolveLocalizedName(
  image: string,
  category: string,
  nameRu: string
): LocalizedText {
  return (
    resolveStaticLocalizedName(image, category, nameRu) ?? fallbackLocalizedName(nameRu)
  );
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

    const image = typeof row.image === "string" ? row.image : "";
    const normalizedCategory = categoryFromDb as Material;

    return {
      id: idStr,
      name: resolveLocalizedName(image, categoryFromDb, titleFromDb),
      image,
      price: priceVal,
      category: normalizedCategory,
      material: normalizedCategory,
      badge: null,
    };
  });

  return markFirstProductAsExample(mapped);
}

export type HomeCatalogPayload =
  | { ok: true; products: Product[] }
  | { ok: false; message: string };

export function catalogPayloadFromDb(rows: ProductRow[], error: string | null): HomeCatalogPayload {
  if (error !== null) return { ok: false, message: error };
  return { ok: true, products: productRowsToUiProducts(rows) };
}
