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
    installApp: {
      ru: "Установить на экран",
      en: "Add to Home Screen",
      de: "Zum Startbildschirm",
      kk: "Экранға орнату",
      uk: "На головний екран",
      uz: "Asosiy ekranga",
    },
    installAppShort: {
      ru: "На экран",
      en: "Install",
      de: "Installieren",
      kk: "Орнату",
      uk: "На екран",
      uz: "O‘rnatish",
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
    enlargeImage: {
      ru: "Увеличить фото",
      en: "Enlarge photo",
      de: "Foto vergrößern",
      kk: "Фотоны үлкейту",
      uk: "Збільшити фото",
      uz: "Rasmni kattalashtirish",
    },
    decreaseQuantity: {
      ru: "Уменьшить количество",
      en: "Decrease quantity",
      de: "Menge verringern",
      kk: "Санын азайту",
      uk: "Зменшити кількість",
      uz: "Miqdorni kamaytirish",
    },
    increaseQuantity: {
      ru: "Увеличить количество",
      en: "Increase quantity",
      de: "Menge erhöhen",
      kk: "Санын арттыру",
      uk: "Збільшити кількість",
      uz: "Miqdorni oshirish",
    },
    removeItem: {
      ru: "Удалить из корзины",
      en: "Remove from cart",
      de: "Aus dem Warenkorb entfernen",
      kk: "Себеттен жою",
      uk: "Видалити з кошика",
      uz: "Savatdan olib tashlash",
    },
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
    backToCart: {
      ru: "← В Корзину",
      en: "← To cart",
      de: "← Zum Warenkorb",
      kk: "← Себетке",
      uk: "← До кошика",
      uz: "← Savatga",
    },
    returnHome: {
      ru: "Вернуться на Главную",
      en: "Back to Home",
      de: "Zur Startseite",
      kk: "Басты бетке оралу",
      uk: "Повернутися на головну",
      uz: "Bosh sahifaga qaytish",
    },
    placeOrder: {
      ru: "Оформить заказ",
      en: "Checkout",
      de: "Bestellen",
      kk: "Тапсырыс беру",
      uk: "Оформити замовлення",
      uz: "Buyurtma berish",
    },
    checkoutTitle: {
      ru: "Оформление заказа",
      en: "Checkout",
      de: "Bestellung",
      kk: "Тапсырыс рәсімдеу",
      uk: "Оформлення замовлення",
      uz: "Buyurtmani rasmiylashtirish",
    },
    checkoutIntro: {
      ru: "Укажите контакты и способ доставки. Оплату можно провести через Kaspi.",
      en: "Enter your details and delivery option. Pay via Kaspi.",
      de: "Bitte Kontakte und Lieferart angeben. Zahlung über Kaspi.",
      kk: "Контактілер мен жеткізуді көрсетіңіз. Kaspi арқылы төлеуге болады.",
      uk: "Вкажіть контакти та доставку. Оплата через Kaspi.",
      uz: "Kontaktlar va yetkazib berishni kiriting. Kaspi orqali to‘lash mumkin.",
    },
    swipeDownHint: {
      ru: "Свайп вниз — в корзину",
      en: "Swipe down — back to cart",
      de: "Nach unten wischen — zum Warenkorb",
      kk: "Төмен сүйреңіз — себетке",
      uk: "Свайп вниз — до кошика",
      uz: "Pastga suring — savatga",
    },
    pageMovedHint: {
      ru: "Оформление заказа открывается из корзины — нажмите «Оформить заказ» внизу панели.",
      en: "Checkout opens from the cart — tap «Checkout» at the bottom of the drawer.",
      de: "Die Bestellung öffnet sich im Warenkorb — auf „Bestellen“ tippen.",
      kk: "Тапсырыс себеттен ашылады — төменгі «Тапсырыс беру» түймесін басыңыз.",
      uk: "Оформлення відкривається з кошика — натисніть «Оформити замовлення» внизу.",
      uz: "Buyurtma savatdan ochiladi — pastdagi tugmani bosing.",
    },
    emailLabel: {
      ru: "E-mail",
      en: "Email",
      de: "E-Mail",
      kk: "Электрондық пошта",
      uk: "Електронна пошта",
      uz: "Elektron pochta",
    },
    emailPlaceholder: {
      ru: "name@example.com",
      en: "name@example.com",
      de: "name@example.com",
      kk: "name@example.com",
      uk: "name@example.com",
      uz: "name@example.com",
    },
    deliveryMethod: {
      ru: "Способ доставки",
      en: "Delivery method",
      de: "Lieferart",
      kk: "Жеткізу тәсілі",
      uk: "Спосіб доставки",
      uz: "Yetkazib berish usuli",
    },
    deliveryPickup: {
      ru: "Самовывоз",
      en: "Pickup",
      de: "Abholung",
      kk: "Өзі алып кету",
      uk: "Самовивіз",
      uz: "O‘zingiz olib ketish",
    },
    deliveryPickupHint: {
      ru: "Согласуем адрес в мессенджере",
      en: "We'll confirm the address in your messenger",
      de: "Die Adresse klären wir im Messenger",
      kk: "Мекенжайды мессенджерде келісеміз",
      uk: "Адресу узгодимо в месенджері",
      uz: "Manzilni messenjerda kelishamiz",
    },
    deliveryCourier: {
      ru: "Курьер по городу",
      en: "City courier",
      de: "Stadtkurier",
      kk: "Қала бойынша курьер",
      uk: "Кур’єр по місту",
      uz: "Shahar bo‘ylab kuryer",
    },
    deliveryCourierHint: {
      ru: "Стоимость уточним после заказа",
      en: "We'll confirm the cost after you order",
      de: "Die Kosten klären wir nach der Bestellung",
      kk: "Бағасын тапсырыстан кейін нақтылаймыз",
      uk: "Вартість уточнимо після замовлення",
      uz: "Narxni buyurtmadan keyin aniqlaymiz",
    },
    deliveryPost: {
      ru: "Почта / СДЭК",
      en: "Post / CDEK",
      de: "Post / SDEK",
      kk: "Пошта / СДЭК",
      uk: "Пошта / СДЕК",
      uz: "Pochta / SDEK",
    },
    deliveryPostHint: {
      ru: "Отправка по Казахстану и РФ",
      en: "Shipping within Kazakhstan and Russia",
      de: "Versand nach Kasachland und Russland",
      kk: "Қазақстан және РФ бойынша жөнелту",
      uk: "Відправлення по Казахстану та РФ",
      uz: "Qozog‘iston va RF bo‘ylab yuborish",
    },
    piecesSuffix: {
      ru: "шт.",
      en: "pcs",
      de: "Stk.",
      kk: "дана",
      uk: "шт.",
      uz: "dona",
    },
    orderMessageGreeting: {
      ru: "Здравствуйте! Хочу оформить заказ:",
      en: "Hello! I'd like to place an order:",
      de: "Hallo! Ich möchte eine Bestellung aufgeben:",
      kk: "Сәлеметсіз бе! Тапсырыс бергім келеді:",
      uk: "Вітаю! Хочу оформити замовлення:",
      uz: "Salom! Buyurtma bermoqchiman:",
    },
    kaspi: {
      titleQr: {
        ru: "Оплата Kaspi QR",
        en: "Pay with Kaspi QR",
        de: "Zahlung mit Kaspi-QR",
        kk: "Kaspi QR төлемі",
        uk: "Оплата Kaspi QR",
        uz: "Kaspi QR orqali to‘lov",
      },
      titleVia: {
        ru: "Оплата через Kaspi",
        en: "Pay via Kaspi",
        de: "Zahlung über Kaspi",
        kk: "Kaspi арқылы төлем",
        uk: "Оплата через Kaspi",
        uz: "Kaspi orqali to‘lov",
      },
      closeQrBackdrop: {
        ru: "Закрыть просмотр QR",
        en: "Close QR view",
        de: "QR-Ansicht schließen",
        kk: "QR көрінісін жабу",
        uk: "Закрити перегляд QR",
        uz: "QR ko‘rinishini yopish",
      },
      qrDialogAria: {
        ru: "QR-код Kaspi",
        en: "Kaspi QR code",
        de: "Kaspi-QR-Code",
        kk: "Kaspi QR коды",
        uk: "QR-код Kaspi",
        uz: "Kaspi QR kodi",
      },
      qrLightboxHeading: {
        ru: "QR для оплаты в Kaspi",
        en: "QR code for Kaspi payment",
        de: "QR-Code für Kaspi-Zahlung",
        kk: "Kaspi төлеміне арналған QR",
        uk: "QR для оплати в Kaspi",
        uz: "Kaspi ilovasida toʻlash uchun QR",
      },
      qrImageAlt: {
        ru: "QR-код Kaspi",
        en: "Kaspi QR code",
        de: "Kaspi-QR-Code",
        kk: "Kaspi QR коды",
        uk: "QR-код Kaspi",
        uz: "Kaspi QR kodi",
      },
      phoneTransferHint: {
        ru: "Если вы с телефона, вы можете сделать перевод по номеру:",
        en: "On your phone you can transfer using this number:",
        de: "Vom Smartphone aus können Sie per Überweisung auf diese Nummer zahlen:",
        kk: "Телефоннан нөмір бойынша аударым жасауға болады:",
        uk: "З телефону можна переказати за номером:",
        uz: "Telefondan ushbu raqamga o‘tkazma qilishingiz mumkin:",
      },
      recipientName: {
        ru: "ИП Анастасия",
        en: "IE Anastasia",
        de: "Einzelunternehmerin Anastasia",
        kk: "ЖК Анастасия",
        uk: "ФОП Анастасія",
        uz: "YA Anastasiya",
      },
      copyPhoneAria: {
        ru: "Скопировать номер телефона",
        en: "Copy phone number",
        de: "Telefonnummer kopieren",
        kk: "Телефон нөмірін көшіру",
        uk: "Скопіювати номер телефону",
        uz: "Telefon raqamidan nusxa olish",
      },
      copied: {
        ru: "Скопировано",
        en: "Copied",
        de: "Kopiert",
        kk: "Көшірілді",
        uk: "Скопійовано",
        uz: "Nusxa olindi",
      },
      copyNumber: {
        ru: "Скопировать номер",
        en: "Copy number",
        de: "Nummer kopieren",
        kk: "Нөмірді көшіру",
        uk: "Скопіювати номер",
        uz: "Raqamdan nusxa olish",
      },
      openQrFullscreenAria: {
        ru: "Открыть QR-код на весь экран",
        en: "Open QR code full screen",
        de: "QR-Code im Vollbild öffnen",
        kk: "QR кодты толық экранға ашу",
        uk: "Відкрити QR-код на весь екран",
        uz: "QR kodni to‘liq ekranda ochish",
      },
      tapToEnlargeQr: {
        ru: "Нажмите, чтобы увеличить QR",
        en: "Tap to enlarge the QR code",
        de: "Tippen, um den QR-Code zu vergrößern",
        kk: "QR үлкейту үшін басыңыз",
        uk: "Натисніть, щоб збільшити QR",
        uz: "QR kodni kattalashtirish uchun bosing",
      },
      showQr: {
        ru: "Показать QR",
        en: "Show QR",
        de: "QR anzeigen",
        kk: "QR көрсету",
        uk: "Показати QR",
        uz: "QR koʻrsatish",
      },
      scanQrInApp: {
        ru: "Отсканируйте QR-код в приложении Kaspi.kz",
        en: "Scan the QR code in the Kaspi.kz app",
        de: "QR-Code in der Kaspi.kz-App scannen",
        kk: "Kaspi.kz қолданбасында QR кодты сканерлеңіз",
        uk: "Відскануйте QR-код у застосунку Kaspi.kz",
        uz: "Kaspi.kz ilovasida QR kodni skanerlang",
      },
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

