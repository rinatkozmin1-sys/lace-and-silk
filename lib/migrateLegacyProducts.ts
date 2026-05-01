import type { SupabaseClient } from "@supabase/supabase-js";
import { products as legacyProducts } from "@/lib/products";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Источник «старых» товаров — см. `lib/products.ts`, экспорт `products`.
 * Поля БД: name (RU), price, image (как в коде: относительные пути или URL), category.
 *
 * Массовая замена картинок на Supabase Storage (после того как файлы уже в бакете `products`):
 * - Вариант SQL: обновлять `image` через `UPDATE ... SET image = <новый публичный URL>` по шаблону
 *   или по `id`, если составили таблицу соответствий «старый путь → объект в Storage».
 * - Вариант скрипта: для каждой строки с `image` вида `/public_folder/file.jpg` скачать файл
 *   с боевого сайта (`NEXT_PUBLIC_SITE_URL` + image), загрузить в Storage через service role,
 *   затем `UPDATE products SET image = :publicUrl WHERE id = :id`.
 */

export type LegacyProductInsertRow = {
  name: string;
  price: number;
  image: string;
  category: string;
};

export function legacyProductsToInsertRows(): LegacyProductInsertRow[] {
  return legacyProducts.map((p) => ({
    name: p.name.ru.trim(),
    price: p.price,
    image: p.image.trim(),
    category: String(p.category),
  }));
}

async function deleteAllProductRows(supabase: SupabaseClient): Promise<void> {
  const { data: rows, error: selErr } = await supabase.from("products").select("id");
  if (selErr) throw new Error(selErr.message);
  const ids = (rows ?? []).map((r: { id: number }) => r.id);
  const chunkSize = 200;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const slice = ids.slice(i, i + chunkSize);
    if (slice.length === 0) continue;
    const { error } = await supabase.from("products").delete().in("id", slice);
    if (error) throw new Error(error.message);
  }
}

export async function migrateLegacyProductsToSupabase(options: {
  /** Удалить все существующие строки в `products`, затем вставить наследие (осторожно: сотрёт и товары из бота). */
  replaceAll: boolean;
}): Promise<{ inserted: number }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Нет клиента Supabase: задайте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (options.replaceAll) {
    await deleteAllProductRows(supabase);
  }

  const rows = legacyProductsToInsertRows();
  if (rows.length === 0) {
    return { inserted: 0 };
  }

  const { error } = await supabase.from("products").insert(rows);
  if (error) throw new Error(error.message);

  return { inserted: rows.length };
}
