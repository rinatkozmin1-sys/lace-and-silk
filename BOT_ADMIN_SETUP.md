# Telegram админ-панель товаров

## 1) Supabase

1. Создайте проект в Supabase и выполните SQL из `supabase/schema.sql` (таблица `products`, RLS на чтение для anon).

2. Создайте бакет Storage для картинок товаров — выполните `supabase/storage-products.sql` (бакет `products`, публичное чтение). Бот загружает файлы через **service role** (RLS Storage для записи не нужен).

3. В переменных окружения деплоя и в `.env.local` задайте:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**Service role** нужен только серверу (Route Handlers): загрузка в Storage, вставка и удаление строк в `products`. На клиент и в репозиторий ключ не выкладывайте.

Сайт получает каталог через `GET /api/products` — запрос к Supabase выполняется на сервере с тем же service role.

Для `next/image` хост Storage подставляется из `NEXT_PUBLIC_SUPABASE_URL` при сборке (`next.config.mjs`).

## 2) Где указать админов

Откройте файл `app/api/telegram/webhook/route.ts` и заполните:

```ts
const ADMIN_IDS: number[] = [123456789, 987654321];
```

Если `from.id` не входит в этот массив, команды админки отвечают: «Извините, у вас нет прав доступа к этой команде».

## 3) Токен бота

В `.env.local` добавьте:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_бота
```

## 4) Включить webhook

После деплоя выполните в браузере (подставьте значения):

`https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<YOUR_DOMAIN>/api/telegram/webhook`

## 5) Команды

- `/start` — короткое приветствие для всех; подсказка админам открыть `/admin`.

- `/admin` — только для ID из `ADMIN_IDS`: панель с кнопками **«Добавить новый товар»** и **«Удалить товар»**.

- Отправить **фото** + подпись (только админам):  
  `Название | Цена | Категория`  
  Фото скачивается с серверов Telegram и загружается в Supabase Storage (`products`), в таблицу попадает публичный URL файла.

- `/delete` или `/delete <id>` — только админам: список на удаление или удаление по id.

## 6) Откуда сайт читает товары

Через `GET /api/products` из таблицы Supabase `products`. Поле `image` — публичный URL из Storage. Файл `data/products.json` для этого потока не используется.
