import { NextRequest, NextResponse } from "next/server";
import { migrateLegacyProductsToSupabase } from "@/lib/migrateLegacyProducts";

export const dynamic = "force-dynamic";

/**
 * Временная миграция: перенос жёстко заданного каталога из `lib/products.ts` (`products`)
 * в таблицу `public.products` через service role.
 *
 * Защита: query `secret` должен совпадать с `MIGRATE_LEGACY_PRODUCTS_SECRET` в env.
 *
 * Пример в браузере:
 *   /api/dev/migrate-legacy-products?secret=<секрет>&replaceAll=false
 *
 * `replaceAll=true` — сначала удаляет ВСЕ строки из `products`, затем вставляет наследие.
 * Без этого повторный запуск добавит дубликаты.
 *
 * Важно: секрет в URL попадает в логи прокси/сервера — после миграции удалите роут и секрет.
 *
 * Картинки: пока как в коде (`/…jpg` или URL). Массовый перенос в Storage — см. `lib/migrateLegacyProducts.ts`.
 */

export async function GET(request: NextRequest) {
  const expected = process.env.MIGRATE_LEGACY_PRODUCTS_SECRET;
  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не задан MIGRATE_LEGACY_PRODUCTS_SECRET — добавьте в .env.local и перезапустите сервер.",
      },
      { status: 503 }
    );
  }

  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== expected) {
    return NextResponse.json(
      { ok: false, error: "Неверный или отсутствующий параметр secret в URL" },
      { status: 401 }
    );
  }

  const replaceAllParam = request.nextUrl.searchParams.get("replaceAll");
  const replaceAll = replaceAllParam === "true" || replaceAllParam === "1";

  try {
    const { inserted } = await migrateLegacyProductsToSupabase({ replaceAll });
    return NextResponse.json({
      ok: true,
      inserted,
      replaceAll,
      source: "lib/products.ts → export products",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
