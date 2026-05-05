export type Material =
  | "Атлас гофре принт"
  | "Атлас принт"
  | "Гофре принт"
  | "Шифон гофре горох"
  | "Шифон гофре однотон"
  | "Гофре в фактурный горошек"
  | "Шифон гофре цветок"
  | "Зауженный атлас"
  | "Зауженный гофре"
  | "Зауженная жатка"
  | "Зауженные с проблеском"
  | "Зауженный шифон"
  | "Косынка в фактурный горошек"
  | "Косынка ромб гофре"
  | "Шарф в фактурный горошек";

export type Badge = "Silk" | "Cashmere" | "New" | null;

export type LocalizedText = {
  ru: string;
  en: string;
  de: string;
  kk: string;
  uk: string;
  uz: string;
};

export interface Product {
  id: string;
  name: LocalizedText;
  /** Опционально: участвует в фильтре пилюль наряду с `name` и `category` */
  title?: LocalizedText;
  image: string;
  price: number;
  /** Категория для фильтра каталога (совпадает с `material` у текущих товаров) */
  category: Material;
  material: Material;
  /** Демонстрационная карточка (пример на манекене) — без цены и кнопки «В корзину» в сетке */
  isExample?: boolean;

  badge: Badge;
}

/** Кнопки фильтра: «Все» + категории */
export const CATALOG_CATEGORIES = [
  "Все",
  "Атлас гофре принт",
  "Атлас принт",
  "Гофре принт",
  "Шифон гофре горох",
  "Шифон гофре однотон",
  "Гофре в фактурный горошек",
  "Шифон гофре цветок",
  "Зауженный атлас",
  "Зауженный гофре",
  "Зауженная жатка",
  "Зауженные с проблеском",
  "Зауженный шифон",
  "Косынка в фактурный горошек",
  "Косынка ромб гофре",
  "Шарф в фактурный горошек",
] as const;

export type CatalogCategoryFilter = (typeof CATALOG_CATEGORIES)[number];

export const MATERIALS: Material[] = [
  "Атлас гофре принт",
  "Атлас принт",
  "Гофре принт",
  "Шифон гофре горох",
  "Шифон гофре однотон",
  "Гофре в фактурный горошек",
  "Шифон гофре цветок",
  "Зауженный атлас",
  "Зауженный гофре",
  "Зауженная жатка",
  "Зауженные с проблеском",
  "Зауженный шифон",
  "Косынка в фактурный горошек",
  "Косынка ромб гофре",
  "Шарф в фактурный горошек",
];


/** Ручные обложки уровня 1; иначе берётся `image` первого товара в категории */
export const CATEGORY_COVER_OVERRIDES: Partial<Record<Material, string>> = {
  "Атлас гофре принт": "/atlas_gofre_print/atlas_gofre_print_01.jpg",
  "Атлас принт": "/atlas_print/atlas_print_01.jpg",
  "Гофре принт": "/gofre_print/gofre_print_01.jpg",
  "Шифон гофре горох": "/gofre_goroh/gofre_goroh_01.jpg",
  "Шифон гофре однотон": "/shifon_gofre_odnoton/shifon_gofre_odnoton_01.jpg",
  "Гофре в фактурный горошек": "/gofre_crap/gofre_krap_01.jpg",
  "Шифон гофре цветок": "/gofre_cvetok/gofre_cvetok_01.jpg",
  "Зауженный атлас": "/zayzh_atlas/zayzh_atlas_01.jpg",
  "Зауженный гофре": "/zayzh_gofre/zayzh_gofre_01.jpg",
  "Зауженная жатка": "/zayzh_zhatka/zayzh_zhatka_01.jpg",
  "Зауженные с проблеском": "/zayzh_problesk/zayzh_problesk_01.jpg",
  "Зауженный шифон": "/zayzh_shifon/zayzh_shifon_01.jpg",
  "Косынка в фактурный горошек": "/kosynka_krap/kosynka_krap_01.jpg",
  "Косынка ромб гофре": "/kosynka_romb_gofre/kosynka_romb_gofre_01.jpg",
  "Шарф в фактурный горошек": "/sharf_krap/sharf_krap_01.jpg",
};

const ATLAS_GOFRE_PRINT_PRICE = 1800;

function atlasGofrePrintProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  const id = `atlas-gofre-print-${num}`;
  return {
    id,
    name: {
      ru: `Атлас гофре принт — вариант ${num}`,
      en: `Atlas gofre print — color ${num}`,
      de: `Atlas-Gofre-Print — Farbe ${num}`,
      kk: `Атлас гофре принт — нұсқа ${num}`,
      uk: `Атлас гофре принт — варіант ${num}`,
      uz: `Atlas gofre print — ${num} variant`,
    },
    image: `/atlas_gofre_print/atlas_gofre_print_${num}.jpg`,
    price: ATLAS_GOFRE_PRINT_PRICE,
    category: "Атлас гофре принт",
    material: "Атлас гофре принт",
    badge: "New",
  };
}

const ATLAS_GOFRE_PRINT_26: Product[] = Array.from({ length: 26 }, (_, i) =>
  atlasGofrePrintProduct(i + 1)
);

const ATLAS_PRINT_PRICE = 1700;

function atlasPrintProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `atlas-print-${num}`,
    name: {
      ru: `Атлас принт — Вариант ${num}`,
      en: `Atlas print — Variant ${num}`,
      de: `Atlas-Print — Variante ${num}`,
      kk: `Атлас принт — Нұсқа ${num}`,
      uk: `Атлас принт — Варіант ${num}`,
      uz: `Atlas print — Variant ${num}`,
    },
    image: `/atlas_print/atlas_print_${num}.jpg`,
    price: ATLAS_PRINT_PRICE,
    category: "Атлас принт",
    material: "Атлас принт",
    badge: "New",
  };
}

const ATLAS_PRINT_06: Product[] = Array.from({ length: 6 }, (_, i) =>
  atlasPrintProduct(i + 1)
);

const GOFRE_PRINT_PRICE = 1500;

function gofrePrintProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `gofre-print-${num}`,
    name: {
      ru: `Гофре принт — Вариант ${num}`,
      en: `Crinkle print — Variant ${num}`,
      de: `Crêpe-Druck — Variante ${num}`,
      kk: `Гофре принт — Нұсқа ${num}`,
      uk: `Гофре принт — Варіант ${num}`,
      uz: `Gofre print — Variant ${num}`,
    },
    image: `/gofre_print/gofre_print_${num}.jpg`,
    price: GOFRE_PRINT_PRICE,
    category: "Гофре принт",
    material: "Гофре принт",
    badge: "New",
  };
}

const GOFRE_PRINT_24: Product[] = Array.from({ length: 24 }, (_, i) =>
  gofrePrintProduct(i + 1)
);

const GOFRE_GOROH_PRICE = 1800;
function gofreGorohProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  const shifonNum = (n - 1).toString().padStart(2, "0");
  const imageName = n === 1 ? "gofre_goroh_01.jpg" : `shifon_gofre_gorox_${shifonNum}.jpg`;
  return {
    id: `gofre-goroh-${num}`,
    name: {
      ru: `Шифон гофре горох - Вариант ${n}`,
      en: `Chiffon polka-dot crinkle - Variant ${n}`,
      de: `Chiffon-Crêpe mit Punkten - Variante ${n}`,
      kk: `Шифон гофре бұршақ - Нұсқа ${n}`,
      uk: `Шифон гофре в горошок - Варіант ${n}`,
      uz: `Shifon nuqtali gofre - Variant ${n}`,
    },
    image: `/gofre_goroh/${imageName}`,
    price: GOFRE_GOROH_PRICE,
    category: "Шифон гофре горох",
    material: "Шифон гофре горох",
    badge: "New",
  };
}

const GOFRE_GOROH_10: Product[] = Array.from({ length: 10 }, (_, i) =>
  gofreGorohProduct(i + 1)
);

const SHIFON_GOFRE_ODNOTON_PRICE = 1800;

function shifonGofreOdnotonProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `shifon-gofre-odnoton-${num}`,
    name: {
      ru: `Шифон гофре однотон - Вариант ${n}`,
      en: `Chiffon crinkle plain - Variant ${n}`,
      de: `Chiffon-Crêpe einfarbig - Variante ${n}`,
      kk: `Шифон гофре бір түсті - Нұсқа ${n}`,
      uk: `Шифон гофре однотон - Варіант ${n}`,
      uz: `Shifon gofre bir rangli - Variant ${n}`,
    },
    image: `/shifon_gofre_odnoton/shifon_gofre_odnoton_${num}.jpg`,
    price: SHIFON_GOFRE_ODNOTON_PRICE,
    category: "Шифон гофре однотон",
    material: "Шифон гофре однотон",
    badge: "New",
  };
}

const SHIFON_GOFRE_ODNOTON_17: Product[] = Array.from({ length: 17 }, (_, i) =>
  shifonGofreOdnotonProduct(i + 1)
);

const GOFRE_KRAP_PRICE = 1800;
const GOFRE_KRAP_RU_NAMES = [
  "Пример",
  "Бордовый",
  "Голубой",
  "Фисташковый",
  "Тёмно серый",
  "Розовый",
  "Пудра",
  "Айвори",
  "Белый",
  "Песочный",
  "Бежевый",
] as const;

function gofreKrapProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `gofre-krap-${num}`,
    name: {
      ru: GOFRE_KRAP_RU_NAMES[n - 1] ?? `Гофре в фактурный горошек ${num}`,
      en: `Speckled crinkle — Variant ${num}`,
      de: `Crêpe mit Sprenkeln — Variante ${num}`,
      kk: `Дақты гофре — Нұсқа ${num}`,
      uk: `Гофре в фактурний горошок — Варіант ${num}`,
      uz: `Nuqtali mayda gofre — Variant ${num}`,
    },
    // Файлы в папке называются gofre_krap_XX.jpg
    image: `/gofre_crap/gofre_krap_${num}.jpg`,
    price: GOFRE_KRAP_PRICE,
    category: "Гофре в фактурный горошек",
    material: "Гофре в фактурный горошек",
    badge: "New",
  };
}

const GOFRE_KRAP_11: Product[] = Array.from({ length: 11 }, (_, i) =>
  gofreKrapProduct(i + 1)
);

const GOFRE_CVETOK_PRICE = 1800;

function gofreCvetokProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  const imageName =
    n <= 11 ? `gofre_cvetok_${num}.jpg` : `shifon_gofre_cvetok_${num}.jpg`;
  return {
    id: `gofre-cvetok-${num}`,
    name: {
      ru: `Шифон гофре цветок - Вариант ${n}`,
      en: `Chiffon floral crinkle - Variant ${n}`,
      de: `Chiffon-Crêpe mit Blumen - Variante ${n}`,
      kk: `Шифон гүлді гофре - Нұсқа ${n}`,
      uk: `Шифон гофре в квіточок - Варіант ${n}`,
      uz: `Shifon gulli gofre - Variant ${n}`,
    },
    image: `/gofre_cvetok/${imageName}`,
    price: GOFRE_CVETOK_PRICE,
    category: "Шифон гофре цветок",
    material: "Шифон гофре цветок",
    badge: "New",
  };
}

const GOFRE_CVETOK_16: Product[] = Array.from({ length: 16 }, (_, i) =>
  gofreCvetokProduct(i + 1)
);

const ZAYZH_ATLAS_PRICE = 1900;
const ZAYZH_ATLAS_RU_NAMES = [
  "Пример",
  "Сиреневый",
  "Сливочный",
  "Белый",
  "Морская волна",
  "Серо бежевый",
  "Серый",
  "Пудра",
  "Голубой",
  "Тёмно красный",
  "Оливково серый",
  "Графит",
  "Светло серый",
  "Капучино",
  "Тёмно синий",
  "Чёрный",
  "Горький шоколад",
] as const;

function zayzhAtlasProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `zayzh-atlas-${num}`,
    name: {
      ru: ZAYZH_ATLAS_RU_NAMES[n - 1] ?? `Зауженный атлас ${num}`,
      en: `Tapered atlas — Variant ${num}`,
      de: `Schmaler Atlas — Variante ${num}`,
      kk: `Тарылған атлас — Нұсқа ${num}`,
      uk: `Заужений атлас — Варіант ${num}`,
      uz: `Toraytirilgan atlas — Variant ${num}`,
    },
    image: `/zayzh_atlas/zayzh_atlas_${num}.jpg`,
    price: ZAYZH_ATLAS_PRICE,
    category: "Зауженный атлас",
    material: "Зауженный атлас",
    badge: "New",
  };
}

const ZAYZH_ATLAS_17: Product[] = Array.from({ length: 17 }, (_, i) =>
  zayzhAtlasProduct(i + 1)
);

const ZAYZH_GOFRE_PRICE = 1900;
const ZAYZH_GOFRE_RU_NAMES = [
  "Пример",
  "Молочный в цветочек",
  "Пример",
  "Чёрный в цветочек",
  "Карамель",
  "Голубой",
  "Коралл в чёрную точку",
  "Тёмный шоколад",
  "Голубой в белую точку",
  "Светло серый",
  "Серый",
  "Изумрудный",
  "Светло розовый",
  "Чёрный в белую точку",
  "Жемчужно серый",
  "Светло голубой",
  "Кремовый",
  "Фисташковый в белую точку",
  "Белый",
  "Тёмно синий",
  "Пудра в белую точку",
  "Пудра в фактурный горошек",
  "Жемчужно бежевый",
  "Светло оливковый",
  "Тёмно синий в фактурный горошек",
  "Бордовый в фактурный горошек",
  "Светло голубой в фактурный горошек",
  "Белый в фактурный горошек",
  "Светло бежевый",
  "Медовый",
] as const;

function zayzhGofreProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `zayzh-gofre-${num}`,
    name: {
      ru: ZAYZH_GOFRE_RU_NAMES[n - 1] ?? `Зауженный гофре ${num}`,
      en: `Tapered crinkle — Variant ${num}`,
      de: `Schmaler Crêpe — Variante ${num}`,
      kk: `Тарылған гофре — Нұсқа ${num}`,
      uk: `Заужений гофре — Варіант ${num}`,
      uz: `Toraytirilgan gofre — Variant ${num}`,
    },
    image: `/zayzh_gofre/zayzh_gofre_${num}.jpg`,
    price: ZAYZH_GOFRE_PRICE,
    category: "Зауженный гофре",
    material: "Зауженный гофре",
    badge: "New",
  };
}

const ZAYZH_GOFRE_30: Product[] = Array.from({ length: 30 }, (_, i) =>
  zayzhGofreProduct(i + 1)
);

const ZAYZH_ZHATKA_PRICE = 1900;
const ZAYZH_ZHATKA_RU_NAMES = [
  "Пример",
  "Чёрный",
  "Молочный",
  "Нежно голубой",
  "Жемчужный",
  "Кремовый",
  "Хаки",
] as const;

function zayzhZhatkaProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `zayzh-zhatka-${num}`,
    name: {
      ru: ZAYZH_ZHATKA_RU_NAMES[n - 1] ?? `Зауженная жатка ${num}`,
      en: `Tapered crinkle weave — Variant ${num}`,
      de: `Schmale Crashstruktur — Variante ${num}`,
      kk: `Тарылған жатка — Нұсқа ${num}`,
      uk: `Заужена жатка — Варіант ${num}`,
      uz: `Toraytirilgan zhatka — Variant ${num}`,
    },
    image: `/zayzh_zhatka/zayzh_zhatka_${num}.jpg`,
    price: ZAYZH_ZHATKA_PRICE,
    category: "Зауженная жатка",
    material: "Зауженная жатка",
    badge: "New",
  };
}

const ZAYZH_ZHATKA_07: Product[] = Array.from({ length: 7 }, (_, i) =>
  zayzhZhatkaProduct(i + 1)
);

const ZAYZH_PROBLESK_PRICE = 1900;
const ZAYZH_PROBLESK_RU_NAMES = [
  "Пример",
  "Капучино",
  "Белый",
] as const;

function zayzhProbleskProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `zayzh-problesk-${num}`,
    name: {
      ru: ZAYZH_PROBLESK_RU_NAMES[n - 1] ?? `Зауженные с проблеском ${num}`,
      en: `Tapered shimmer — Variant ${num}`,
      de: `Schmal mit Schimmer — Variante ${num}`,
      kk: `Жарқылы бар тарылған — Нұсқа ${num}`,
      uk: `Заужені з проблиском — Варіант ${num}`,
      uz: `Yaltirashli toraytirilgan — Variant ${num}`,
    },
    image: `/zayzh_problesk/zayzh_problesk_${num}.jpg`,
    price: ZAYZH_PROBLESK_PRICE,
    category: "Зауженные с проблеском",
    material: "Зауженные с проблеском",
    badge: "New",
  };
}

const ZAYZH_PROBLESK_03: Product[] = Array.from({ length: 3 }, (_, i) =>
  zayzhProbleskProduct(i + 1)
);

const ZAYZH_SHIFON_PRICE = 1900;
const ZAYZH_SHIFON_RU_NAMES = [
  "Пример",
  "Белый",
  "Тёмно синий",
  "Хаки",
] as const;

function zayzhShifonProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `zayzh-shifon-${num}`,
    name: {
      ru: ZAYZH_SHIFON_RU_NAMES[n - 1] ?? `Зауженный шифон ${num}`,
      en: `Tapered chiffon — Variant ${num}`,
      de: `Schmaler Chiffon — Variante ${num}`,
      kk: `Тарылған шифон — Нұсқа ${num}`,
      uk: `Заужений шифон — Варіант ${num}`,
      uz: `Toraytirilgan shifon — Variant ${num}`,
    },
    image: `/zayzh_shifon/zayzh_shifon_${num}.jpg`,
    price: ZAYZH_SHIFON_PRICE,
    category: "Зауженный шифон",
    material: "Зауженный шифон",
    badge: "New",
  };
}

const ZAYZH_SHIFON_04: Product[] = Array.from({ length: 4 }, (_, i) =>
  zayzhShifonProduct(i + 1)
);

const KOSYNKA_KRAP_PRICE = 1800;
const KOSYNKA_KRAP_RU_NAMES = [
  "Бордовый",
  "Светло кремовый",
  "Голубой",
  "Фисташковый",
  "Тёмно синий",
  "Жемчужный",
  "Пудра",
] as const;

function kosynkaKrapProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `kosynka-krap-${num}`,
    name: {
      ru: KOSYNKA_KRAP_RU_NAMES[n - 1] ?? `Косынка в фактурный горошек ${num}`,
      en: `Speckled kerchief — Variant ${num}`,
      de: `Tuch mit Sprenkeln — Variante ${num}`,
      kk: `Дақты косынка — Нұсқа ${num}`,
      uk: `Косинка в крапинку — Варіант ${num}`,
      uz: `Mayda nuqtali ro'molcha — Variant ${num}`,
    },
    image: `/kosynka_krap/kosynka_krap_${num}.jpg`,
    price: KOSYNKA_KRAP_PRICE,
    category: "Косынка в фактурный горошек",
    material: "Косынка в фактурный горошек",
    badge: "New",
  };
}

const KOSYNKA_KRAP_07: Product[] = Array.from({ length: 7 }, (_, i) =>
  kosynkaKrapProduct(i + 1)
);

const KOSYNKA_ROMB_GOFRE_PRICE = 1800;
const KOSYNKA_ROMB_GOFRE_RU_NAMES = [
  "Морская волна",
  "Жемчужно кремовый",
  "Сиреневый",
  "Жёлтый",
  "Кремовый",
  "Мятный",
  "Светло фисташковый",
  "Жемчужный",
] as const;

function kosynkaRombGofreProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  const isPearl = n === 8;
  return {
    id: `kosynka-romb-gofre-${num}`,
    name: {
      ru: KOSYNKA_ROMB_GOFRE_RU_NAMES[n - 1] ?? `Косынка ромб гофре ${num}`,
      en: isPearl ? "Pearl" : `Diamond crinkle kerchief — Variant ${num}`,
      de: isPearl ? "Perlmutt" : `Rauten-Crêpe-Tuch — Variante ${num}`,
      kk: isPearl ? "Інжу" : `Ромб гофре косынка — Нұсқа ${num}`,
      uk: isPearl ? "Перлинний" : `Косинка ромб гофре — Варіант ${num}`,
      uz: isPearl ? "Marvarid" : `Romb gofre ro'molcha — Variant ${num}`,
    },
    image: `/kosynka_romb_gofre/kosynka_romb_gofre_${num}.jpg`,
    price: KOSYNKA_ROMB_GOFRE_PRICE,
    category: "Косынка ромб гофре",
    material: "Косынка ромб гофре",
    badge: "New",
  };
}

const KOSYNKA_ROMB_GOFRE_08: Product[] = Array.from({ length: 8 }, (_, i) =>
  kosynkaRombGofreProduct(i + 1)
);

const SHARF_KRAP_PRICE = 1800;
const SHARF_KRAP_RU_NAMES = [
  "Пример",
  "Жемчужный",
  "Бордовый",
  "Тёмно синий",
  "Фисташковый",
  "Голубой",
  "Светло кремовый",
  "Пудра",
] as const;

function sharfKrapProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  return {
    id: `sharf-krap-${num}`,
    name: {
      ru: SHARF_KRAP_RU_NAMES[n - 1] ?? `Шарф в фактурный горошек ${num}`,
      en: `Speckled scarf — Variant ${num}`,
      de: `Schal mit Sprenkeln — Variante ${num}`,
      kk: `Дақты шарф — Нұсқа ${num}`,
      uk: `Шарф в фактурний горошок — Варіант ${num}`,
      uz: `Mayda nuqtali sharf — Variant ${num}`,
    },
    image: `/sharf_krap/sharf_krap_${num}.jpg`,
    price: SHARF_KRAP_PRICE,
    category: "Шарф в фактурный горошек",
    material: "Шарф в фактурный горошек",
    badge: "New",
  };
}

const SHARF_KRAP_08: Product[] = Array.from({ length: 8 }, (_, i) =>
  sharfKrapProduct(i + 1)
);

/** Категории, в которых есть хотя бы один товар, в порядке CATALOG_CATEGORIES */
export function getCategoryTypesInStock(allProducts: Product[]): Material[] {
  return CATALOG_CATEGORIES.filter(
    (c): c is Material => c !== "Все" && allProducts.some((p) => p.category === c)
  );
}

export function getCategoryCoverImage(material: Material, allProducts: Product[]): string {
  const override = CATEGORY_COVER_OVERRIDES[material];
  if (override) return override;
  return allProducts.find((p) => p.category === material)?.image ?? "";
}

function markFirstProductAsExample(allProducts: Product[]): Product[] {
  const seen = new Set<Material>();
  return allProducts.map((product) => {
    if (seen.has(product.category)) return product;
    seen.add(product.category);
    return { ...product, isExample: true };
  });
}

export const products: Product[] = markFirstProductAsExample([
  ...ATLAS_GOFRE_PRINT_26,
  ...ATLAS_PRINT_06,
  ...GOFRE_PRINT_24,
  ...GOFRE_GOROH_10,
  ...SHIFON_GOFRE_ODNOTON_17,
  ...GOFRE_KRAP_11,
  ...GOFRE_CVETOK_16,
  ...ZAYZH_ATLAS_17,
  ...ZAYZH_GOFRE_30,
  ...ZAYZH_ZHATKA_07,
  ...ZAYZH_PROBLESK_03,
  ...ZAYZH_SHIFON_04,
  ...KOSYNKA_KRAP_07,
  ...KOSYNKA_ROMB_GOFRE_08,
  ...SHARF_KRAP_08,
]);
