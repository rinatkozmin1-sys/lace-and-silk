/**
 * Публичный HTTPS URL сайта (каталог, Telegram Mini App / WebApp).
 * Задаётся в Vercel: NEXT_PUBLIC_SITE_URL=https://lace-and-silk.vercel.app
 */
export function getPublicShopUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/+$/, "");
  }
  return "https://lace-and-silk.vercel.app";
}
