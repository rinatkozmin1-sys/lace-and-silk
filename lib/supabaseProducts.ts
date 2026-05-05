"use client";

import { MATERIALS, type LocalizedText, type Material, type Product } from "@/lib/products";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type SupabaseProductRow = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
};

function toLocalizedText(value: string): LocalizedText {
  return {
    ru: value,
    en: value,
    de: value,
    kk: value,
    uk: value,
    uz: value,
  };
}

function isMaterial(value: string): value is Material {
  return MATERIALS.includes(value as Material);
}

function mapRowToProduct(row: SupabaseProductRow): Product | null {
  if (!isMaterial(row.category)) {
    return null;
  }

  const price = Number(row.price);
  if (!Number.isFinite(price)) {
    return null;
  }

  return {
    id: String(row.id),
    name: toLocalizedText(row.name),
    image: row.image,
    price,
    category: row.category,
    material: row.category,
    badge: null,
  };
}

export async function fetchProductsFromSupabase(): Promise<{
  data: Product[];
  error: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      data: [],
      error:
        "Supabase не настроен: задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, category")
    .order("id", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  const products = ((data ?? []) as SupabaseProductRow[])
    .map(mapRowToProduct)
    .filter((item): item is Product => item !== null);

  const seen = new Set<Material>();
  const productsWithExamples = products.map((product) => {
    if (seen.has(product.category)) return product;
    seen.add(product.category);
    return { ...product, isExample: true };
  });

  return { data: productsWithExamples, error: null };
}
