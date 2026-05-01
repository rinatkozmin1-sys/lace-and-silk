import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  deleteProductById,
  fetchRecentProductsFromDb,
  insertProductRow,
} from "@/lib/supabaseProductsServer";

export const dynamic = "force-dynamic";

/**
 * ID админов Telegram (ваш и мамы).
 * Пример: [123456789, 987654321]
 */
const ADMIN_IDS: number[] = [];

const ACCESS_DENIED = "Извините, у вас нет прав доступа к этой команде";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";

function isAdmin(userId?: number) {
  return typeof userId === "number" && ADMIN_IDS.includes(userId);
}

async function tgApi(method: string, payload: Record<string, unknown>) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: Record<string, unknown>
) {
  await tgApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
  });
}

/** Две кнопки панели из команды /admin */
function adminKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "Добавить новый товар", callback_data: "admin_help_add" }],
      [{ text: "Удалить товар", callback_data: "admin_delete_list" }],
    ],
  };
}

function parseAddCaption(caption: string) {
  const parts = caption.split("|").map((x) => x.trim());
  if (parts.length !== 3) return null;
  const [name, priceRaw, category] = parts;
  const price = Number(priceRaw.replace(",", "."));
  if (!name || !category || !Number.isFinite(price)) return null;
  return { name, price, category };
}

function truncate(str: string, max = 45) {
  return str.length <= max ? str : `${str.slice(0, max - 1)}…`;
}

async function handleAdminDeleteList(chatId: number) {
  const { data: products, error } = await fetchRecentProductsFromDb(10);
  if (error) {
    await sendMessage(chatId, `Ошибка загрузки каталога: ${error}`);
    return;
  }
  if (products.length === 0) {
    await sendMessage(chatId, "Каталог пуст. Удалять пока нечего.");
    return;
  }
  const keyboard = {
    inline_keyboard: products.map((p) => [
      {
        text: `Удалить #${p.id} — ${truncate(p.name, 32)}`,
        callback_data: `admin_delete_${p.id}`,
      },
    ]),
  };
  await sendMessage(chatId, "Выберите товар для удаления:", keyboard);
}

async function handleMessage(update: { message?: Record<string, unknown> }) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat && typeof message.chat === "object" && "id" in message.chat
    ? (message.chat as { id: number }).id
    : undefined;
  const userId =
    message.from && typeof message.from === "object" && "id" in message.from
      ? (message.from as { id: number }).id
      : undefined;

  if (chatId === undefined) return;

  const text: string = typeof message.text === "string" ? message.text : "";

  if (text.startsWith("/start")) {
    await sendMessage(
      chatId,
      "Здравствуйте! Ассортимент смотрите на сайте магазина.\n\n" +
        "Если вы администратор, откройте панель: /admin"
    );
    return;
  }

  if (text.startsWith("/admin")) {
    if (!isAdmin(userId)) {
      await sendMessage(chatId, ACCESS_DENIED);
      return;
    }
    await sendMessage(
      chatId,
      "Панель управления каталогом.\n\n" +
        "<b>Добавить новый товар</b> — нажмите кнопку ниже и отправьте фото с подписью:\n" +
        "<code>Название | Цена | Категория</code>\n\n" +
        "<b>Удалить товар</b> — кнопка ниже или команда <code>/delete</code> / <code>/delete id</code>\n\n" +
        "Изменения сохраняются в Supabase.",
      adminKeyboard()
    );
    return;
  }

  if (text.startsWith("/delete")) {
    if (!isAdmin(userId)) {
      await sendMessage(chatId, ACCESS_DENIED);
      return;
    }
    const [, id] = text.split(/\s+/, 2);
    if (!id) {
      await handleAdminDeleteList(chatId);
      return;
    }
    const { error } = await deleteProductById(id.trim());
    if (error) {
      await sendMessage(chatId, `Не удалось удалить: ${error}`);
      return;
    }
    await sendMessage(chatId, `✅ Товар id=${id.trim()} удалён из Supabase.`);
    return;
  }

  const photos = message.photo as Array<{ file_id: string }> | undefined;
  const caption: string = typeof message.caption === "string" ? message.caption : "";

  if (photos && photos.length > 0 && caption) {
    if (!isAdmin(userId)) {
      await sendMessage(chatId, ACCESS_DENIED);
      return;
    }

    const parsed = parseAddCaption(caption);
    if (!parsed) {
      await sendMessage(
        chatId,
        "Неверный формат подписи.\nИспользуйте:\n<code>Название | Цена | Категория</code>"
      );
      return;
    }

    const biggest = photos[photos.length - 1];
    const fileInfoRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${biggest.file_id}`
    );
    const fileInfoJson = await fileInfoRes.json();
    const filePath = fileInfoJson?.result?.file_path as string | undefined;
    if (!filePath) {
      await sendMessage(chatId, "Не удалось получить фото. Попробуйте ещё раз.");
      return;
    }

    const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    const { id: newId, error } = await insertProductRow({
      name: parsed.name,
      price: parsed.price,
      image: imageUrl,
      category: parsed.category,
    });

    if (error || !newId) {
      await sendMessage(chatId, `Не удалось сохранить товар: ${error ?? "неизвестная ошибка"}`);
      return;
    }

    await sendMessage(
      chatId,
      `✅ Товар добавлен в Supabase:\n` +
        `id: <code>${newId}</code>\n` +
        `Название: ${parsed.name}\n` +
        `Цена: ${parsed.price}\n` +
        `Категория: ${parsed.category}`,
      adminKeyboard()
    );
  }
}

function isAdminCallback(data: string) {
  if (data === "admin_help_add" || data === "admin_delete_list" || data === "admin_list") return true;
  if (data.startsWith("admin_delete_")) return true;
  return false;
}

async function handleCallback(update: { callback_query?: Record<string, unknown> }) {
  const callback = update.callback_query;
  if (!callback) return;

  const chatId =
    callback.message &&
    typeof callback.message === "object" &&
    "chat" in callback.message &&
    callback.message.chat &&
    typeof callback.message.chat === "object" &&
    "id" in callback.message.chat
      ? (callback.message.chat as { id: number }).id
      : undefined;

  const userId =
    callback.from && typeof callback.from === "object" && "id" in callback.from
      ? (callback.from as { id: number }).id
      : undefined;

  const data = typeof callback.data === "string" ? callback.data : "";
  const callbackId =
    callback.id !== undefined ? String(callback.id) : undefined;

  if (chatId === undefined || !callbackId) return;

  await tgApi("answerCallbackQuery", { callback_query_id: callbackId });

  if (isAdminCallback(data) && !isAdmin(userId)) {
    await sendMessage(chatId, ACCESS_DENIED);
    return;
  }

  if (data === "admin_help_add") {
    await sendMessage(
      chatId,
      "Отправьте фото с подписью в формате:\n<code>Название | Цена | Категория</code>"
    );
    return;
  }

  if (data === "admin_list") {
    const { data: products, error } = await fetchRecentProductsFromDb(10);
    if (error) {
      await sendMessage(chatId, `Ошибка: ${error}`);
      return;
    }
    if (products.length === 0) {
      await sendMessage(chatId, "Каталог пока пуст.");
      return;
    }
    const text = products.map((p) => `#${p.id} — ${p.name} — ${p.price} — ${p.category}`).join("\n");
    await sendMessage(chatId, `Последние 10 товаров:\n${text}`, adminKeyboard());
    return;
  }

  if (data === "admin_delete_list") {
    await handleAdminDeleteList(chatId);
    return;
  }

  if (data.startsWith("admin_delete_")) {
    const id = data.replace("admin_delete_", "");
    const { error } = await deleteProductById(id);
    if (error) {
      await sendMessage(chatId, `Не удалось удалить товар id=${id}: ${error}`);
      return;
    }
    await sendMessage(chatId, `🗑 Товар id=${id} удалён из Supabase.`, adminKeyboard());
  }
}

export async function POST(req: Request) {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 500 }
    );
  }

  if (!getSupabaseAdmin()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Supabase не настроен: нужны NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 503 }
    );
  }

  const update = await req.json();
  try {
    await handleCallback(update);
    await handleMessage(update);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
