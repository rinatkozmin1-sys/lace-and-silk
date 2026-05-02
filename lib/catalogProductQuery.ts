import type { SupabaseClient } from "@supabase/supabase-js";

export type ProductRow = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

function normalizePrice(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const n = Number.parseFloat(String(raw ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function rowFromDb(row: Record<string, unknown>): ProductRow {
  return {
    id: Number(row.id),
    name: typeof row.name === "string" ? row.name : String(row.name ?? ""),
    price: normalizePrice(row.price),
    image: typeof row.image === "string" ? row.image : String(row.image ?? ""),
    category: typeof row.category === "string" ? row.category : String(row.category ?? ""),
  };
}

/** Чтение каталога через любой SupabaseClient (anon в браузере или service role на сервере). */
export async function loadCatalogProductRows(supabase: SupabaseClient): Promise<{
  data: ProductRow[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, category")
    .order("image", { ascending: true })
    .order("id", { ascending: true });

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as Record<string, unknown>[];
  return { data: rows.map(rowFromDb), error: null };
}

export async function loadRecentProductRows(
  supabase: SupabaseClient,
  limit: number
): Promise<{ data: ProductRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, category")
    .order("id", { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as Record<string, unknown>[];
  return { data: rows.map(rowFromDb), error: null };
}
