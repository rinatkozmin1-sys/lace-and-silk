"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ru" | "en" | "de" | "kk" | "uk" | "uz";

export type Dictionary = typeof dictionary;

const STORAGE_KEY = "silk_shop_lang";

export const dictionary = {
  header: {
    nav: {
      cosynki: { ru: "Косынки", en: "Scarves", de: "Tücher", kk: "Орамалдар", uk: "Хустки", uz: "Roʻmol" },
      sharfy: { ru: "Шарфы", en: "Scarves", de: "Schals", kk: "Шарфтар", uk: "Шарфи", uz: "Sharf" },
      zakolki: { ru: "Заколки", en: "Hair clips", de: "Haarklammern", kk: "Қыстырғыштар", uk: "Шпильки", uz: "Soch qisqichlari" },
      novinki: { ru: "Новинки", en: "New", de: "Neu", kk: "Жаңа", uk: "Новинки", uz: "Yangi" },
    },
    search: { ru: "Поиск", en: "Search", de: "Suche", kk: "Іздеу", uk: "Пошук", uz: "Qidiruv" },
    searchPlaceholder: {
      ru: "Поиск товаров...",
      en: "Search products...",
      de: "Produkte suchen...",
      kk: "Тауарларды іздеу...",
      uk: "Пошук товарів...",
      uz: "Tovarlarni qidirish...",
    },
    cart: { ru: "Корзина", en: "Cart", de: "Warenkorb", kk: "Себет", uk: "Кошик", uz: "Savat" },
    language: { ru: "Язык", en: "Language", de: "Sprache", kk: "Тіл", uk: "Мова", uz: "Til" },
    currency: {
      ru: "Валюта",
      en: "Currency",
      de: "Währung",
      kk: "Валюта",
      uk: "Валюта",
      uz: "Valyuta",
    },
  },
  hero: {
    title: {
      ru: "Мир и нежность в каждом образе...",
      en: "Peace and tenderness in every look...",
      de: "Frieden und Sanftmut in jedem Bild...",
      kk: "Әр бейнеде тыныштық пен нәзіктік...",
      uk: "Мир і ніжність у кожному образі...",
      uz: "Har bir obrazda tinchlik va noziklik...",
    },
    subtitle: {
      ru: "Христианские головные уборы и аксессуары",
      en: "Christian headwear and accessories",
      de: "Christliche Kopfbedeckungen und Accessoires",
      kk: "Христиандық бас киімдер мен аксессуарлар",
      uk: "Християнські головні убори та аксесуари",
      uz: "Xristiancha bosh kiyim va aksessuarlar",
    },
    catalog: { ru: "Каталог", en: "Catalog", de: "Katalog", kk: "Каталог", uk: "Каталог", uz: "Katalog" },
    pillAll: {
      ru: "Все",
      en: "All",
      de: "Alle",
      kk: "Барлығы",
      uk: "Усі",
      uz: "Barchasi",
    },
    pillKosynki: {
      ru: "Косынки",
      en: "Kerchiefs",
      de: "Kopftücher",
      kk: "Косынкалар",
      uk: "Косинки",
      uz: "Ro'molchalar",
    },
    pillSharfy: {
      ru: "Шарфы",
      en: "Scarves",
      de: "Schals",
      kk: "Шарфтар",
      uk: "Шарфи",
      uz: "Sharflar",
    },
    pillZauzhennye: {
      ru: "Зауженные",
      en: "Tapered",
      de: "Schmale Schnitte",
      kk: "Тарылған",
      uk: "Заужені",
      uz: "Toraytirilgan",
    },
    pillAksessuary: {
      ru: "Аксессуары",
      en: "Accessories",
      de: "Accessoires",
      kk: "Аксессуарлар",
      uk: "Аксесуари",
      uz: "Aksessuarlar",
    },
  },
  catalog: {
    categories: { ru: "КАТЕГОРИИ", en: "CATEGORIES", de: "KATEGORIEN", kk: "САНАТТАР", uk: "КАТЕГОРІЇ", uz: "TOIFALAR" },
    empty: {
      ru: "По выбранным фильтрам товаров не найдено.",
      en: "No products found for the selected filters.",
      de: "Keine Produkte für die ausgewählten Filter gefunden.",
      kk: "Таңдалған сүзгілер бойынша өнім табылмады.",
      uk: "За вибраними фільтрами товарів не знайдено.",
      uz: "Tanlangan filtrlarga mos mahsulot topilmadi.",
    },
    searchHeading: {
      ru: "Поиск",
      en: "Search",
      de: "Suche",
      kk: "Іздеу",
      uk: "Пошук",
      uz: "Qidiruv",
    },
    addToCart: { ru: "В корзину", en: "Add to cart", de: "In den Warenkorb", kk: "Себетке", uk: "У кошик", uz: "Savatga" },
    backToTypes: {
      ru: "← Назад к видам",
      en: "← Back to types",
      de: "← Zurück zu den Kategorien",
      kk: "← Түрлерге оралу",
      uk: "← Назад до видів",
      uz: "← Turlar orqaga",
    },
  },
  cart: {
    title: { ru: "Корзина", en: "Cart", de: "Warenkorb", kk: "Себет", uk: "Кошик", uz: "Savat" },
    empty: {
      ru: "В корзине пока пусто",
      en: "Your cart is empty",
      de: "Ihr Warenkorb ist leer",
      kk: "Себет әзірше бос",
      uk: "Кошик поки порожній",
      uz: "Savat hozircha bo‘sh",
    },
    total: { ru: "Итого", en: "Total", de: "Summe", kk: "Барлығы", uk: "Разом", uz: "Jami" },
    currency: {
      ru: "Валюта",
      en: "Currency",
      de: "Währung",
      kk: "Валюта",
      uk: "Валюта",
      uz: "Valyuta",
    },
    orderWhatsapp: {
      ru: "Заказать в WhatsApp",
      en: "Order via WhatsApp",
      de: "Per WhatsApp bestellen",
      kk: "WhatsApp арқылы тапсырыс",
      uk: "Замовити в WhatsApp",
      uz: "WhatsApp orqali buyurtma",
    },
    orderTelegram: {
      ru: "Заказать в Telegram",
      en: "Order via Telegram",
      de: "Per Telegram bestellen",
      kk: "Telegram арқылы тапсырыс",
      uk: "Замовити в Telegram",
      uz: "Telegram orqali buyurtma",
    },
    sum: { ru: "Сумма", en: "Subtotal", de: "Zwischensumme", kk: "Сома", uk: "Сума", uz: "Jami" },
  },
  checkout: {
    back: { ru: "← Назад", en: "← Back", de: "← Zurück", kk: "← Артқа", uk: "← Назад", uz: "← Orqaga" },
    openCart: { ru: "В корзину", en: "Cart", de: "Zum Warenkorb", kk: "Себетке", uk: "До кошика", uz: "Savatga" },
    home: { ru: "На главную", en: "Home", de: "Startseite", kk: "Басты бетке", uk: "На головну", uz: "Bosh sahifa" },
    close: { ru: "Закрыть", en: "Close", de: "Schließen", kk: "Жабу", uk: "Закрити", uz: "Yopish" },
    yourOrder: { ru: "Ваш заказ", en: "Your order", de: "Ihre Bestellung", kk: "Сіздің тапсырысыңыз", uk: "Ваше замовлення", uz: "Buyurtmangiz" },
    emptyOrder: {
      ru: "В заказе пока нет товаров — добавьте их из каталога.",
      en: "Your order is empty — add items from the catalog.",
      de: "Keine Artikel — bitte aus dem Katalog hinzufügen.",
      kk: "Тапсырыста тауар жоқ — каталогтан қосыңыз.",
      uk: "У замовленні ще нічого немає — додайте товари з каталогу.",
      uz: "Buyurtmada mahsulot yo‘q — katalogdan qo‘shing.",
    },
    browseCatalog: { ru: "В каталог", en: "Browse catalog", de: "Zum Katalog", kk: "Каталогқа", uk: "До каталогу", uz: "Katalogga" },
    paymentHeading: {
      ru: "Оплата",
      en: "Payment",
      de: "Zahlung",
      kk: "Төлем",
      uk: "Оплата",
      uz: "To‘lov",
    },
  },
  footer: {
    social: {
      ru: "Соцсети",
      en: "Socials",
      de: "Soziale Netzwerke",
      kk: "Әлеуметтік желілер",
      uk: "Соцмережі",
      uz: "Ijtimoiy tarmoqlar",
    },
    paymentAndShipping: {
      ru: "Оплата и Почта",
      en: "Payment and Shipping",
      de: "Zahlung und Versand",
      kk: "Төлем және Жеткізу",
      uk: "Оплата і Доставка",
      uz: "To'lov va Yetkazib berish",
    },
    contacts: {
      ru: "Контакты",
      en: "Contacts",
      de: "Kontakte",
      kk: "Байланыс",
      uk: "Контакти",
      uz: "Kontaktlar",
    },
    worldwideShipping: {
      ru: "🌍 Отправка по всему миру:",
      en: "🌍 Worldwide shipping:",
      de: "🌍 Weltweiter Versand:",
      kk: "🌍 Бүкіл әлемге жеткізу:",
      uk: "🌍 Доставка по всьому світу:",
      uz: "🌍 Butun dunyo bo'ylab yetkazib berish:",
    },
    rights: {
      ru: "© 2026_ A&A_Все права защищены.",
      en: "© 2026_ A&A_All rights reserved.",
      de: "© 2026_ A&A_Alle Rechte vorbehalten.",
      kk: "© 2026_ A&A_Барлық құқықтар қорғалған.",
      uk: "© 2026_ A&A_Усі права захищені.",
      uz: "© 2026_ A&A_Barcha huquqlar himoyalangan.",
    },
  },
} as const;

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored && ["ru", "en", "de", "kk", "uk", "uz"].includes(stored)) setLangState(stored);
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (path: string) => {
      const node = getByPath(dictionary, path);
      const val = node?.[lang] ?? node?.ru ?? path;
      return typeof val === "string" ? val : path;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

