import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

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

export async function fetchAllProductsFromDb(): Promise<{
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

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, category")
    .order("id", { ascending: true });

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as Record<string, unknown>[];
  return { data: rows.map(rowFromDb), error: null };
}

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

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, category")
    .order("id", { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as Record<string, unknown>[];
  return { data: rows.map(rowFromDb), error: null };
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
