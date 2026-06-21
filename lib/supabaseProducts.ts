"use client";

import {
  markFirstProductAsExample,
  MATERIALS,
  resolveStaticLocalizedName,
  type LocalizedText,
  type Material,
  type Product,
} from "@/lib/products";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type SupabaseProductRow = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
};

function toLocalizedText(nameRu: string, image: string, category: string): LocalizedText {
  return (
    resolveStaticLocalizedName(image, category, nameRu) ?? {
      ru: nameRu,
      en: nameRu,
      de: nameRu,
      kk: nameRu,
      uk: nameRu,
      uz: nameRu,
    }
  );
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
    name: toLocalizedText(row.name, row.image, row.category),
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

  return { data: markFirstProductAsExample(products), error: null };
}
