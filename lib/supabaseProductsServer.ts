import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { ProductRow } from "@/lib/catalogProductQuery";
import { loadCatalogProductRows, loadRecentProductRows } from "@/lib/catalogProductQuery";

export type { ProductRow };

/**
 * Все товары каталога из Supabase (service role). Только SDK, без fetch к своему API.
 */
export async function fetchAllProducts(): Promise<{
  data: ProductRow[];
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      data: [],
      error:
        "Supabase не настроен для сервера: задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
  return loadCatalogProductRows(supabase);
}

/** @deprecated имя сохранено для совместимости; используйте `fetchAllProducts`. */
export const fetchAllProductsFromDb = fetchAllProducts;

export async function fetchRecentProductsFromDb(limit: number): Promise<{
  data: ProductRow[];
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      data: [],
      error:
        "Supabase не настроен для сервера: задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY.",
    };
  }
  return loadRecentProductRows(supabase, limit);
}

export async function insertProductRow(input: {
  name: string;
  price: number;
  image: string;
  category: string;
}): Promise<{ id: string | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      id: null,
      error:
        "Supabase не настроен для сервера: задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      price: input.price,
      image: input.image,
      category: input.category,
    })
    .select("id")
    .single();

  if (error) return { id: null, error: error.message };
  const id = data?.id != null ? String(data.id) : null;
  return { id, error: null };
}

export async function deleteProductById(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      error:
        "Supabase не настроен для сервера: задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return { error: "Некорректный id товара." };
  }

  const { error } = await supabase.from("products").delete().eq("id", numericId);
  if (error) return { error: error.message };
  return { error: null };
}
