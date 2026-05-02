import { NextResponse } from "next/server";
import { migrateLegacyProductsToSupabase } from "@/lib/migrateLegacyProducts";

export const dynamic = "force-dynamic";

/**
 * Временная миграция: перенос жёстко заданного каталога из `lib/products.ts` (`products`)
 * в таблицу `public.products` через service role.
 *
 * Защита: заголовок `x-migrate-secret` должен совпадать с `MIGRATE_LEGACY_PRODUCTS_SECRET` в env.
 *
 * Вызов (локально или на деплое):
 *   curl -X POST "https://<host>/api/dev/migrate-legacy-products" \
 *     -H "Content-Type: application/json" \
 *     -H "x-migrate-secret: <секрет>" \
 *     -d "{\"replaceAll\":false}"
 *
 * `replaceAll: true` — сначала удаляет ВСЕ строки из `products`, затем вставляет наследие.
 * Без этого повторный запуск добавит дубликаты.
 *
 * Картинки: пока сохраняются как в коде (`/…jpg` или абсолютные URL). Массовый перенос в Storage — см.
 * комментарий в `lib/migrateLegacyProducts.ts`.
 */

export async function GET(req: Request) {
  const secret = process.env.MIGRATE_LEGACY_PRODUCTS_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не задан MIGRATE_LEGACY_PRODUCTS_SECRET — добавьте в .env.local и перезапустите сервер.",
      },
      { status: 503 }
    );
  }

  const headerSecret = req.headers.get("x-migrate-secret");
  if (headerSecret !== secret) {
    return NextResponse.json({ ok: false, error: "Неверный или отсутствующий x-migrate-secret" }, { status: 401 });
  }

  let body: { replaceAll?: boolean } = {};
  try {
    const raw = await req.text();
    if (raw.trim()) body = JSON.parse(raw) as { replaceAll?: boolean };
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON тела запроса" }, { status: 400 });
  }

  const replaceAll = Boolean(body.replaceAll);

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
