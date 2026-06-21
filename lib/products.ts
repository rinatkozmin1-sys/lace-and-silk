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
  | "Шарф в фактурный горошек"
  | "Аксессуары";

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
  /** Габариты изделия в сантиметрах, например `85х45` */
  size?: string;

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
  "Аксессуары",
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
  "Аксессуары",
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
  Аксессуары: "/akses/akses{02}.jpg",
};

/** Размеры по видам (см). */
export const MATERIAL_SIZES: Partial<Record<Material, string>> = {
  "Атлас гофре принт": "85х45",
  "Атлас принт": "70х70",
  "Гофре принт": "85х45",
  "Шифон гофре горох": "85х45",
  "Шифон гофре цветок": "85х45",
  "Зауженный атлас": "9х110",
  "Зауженный гофре": "10х110",
  "Зауженная жатка": "9х110",
  "Зауженные с проблеском": "9х110",
  "Зауженный шифон": "9х110",
  "Косынка в фактурный горошек": "65х65",
  "Косынка ромб гофре": "85х45",
  "Шарф в фактурный горошек": "25х100",
};

const SHIFON_COLOR_TRANSLATIONS: Record<string, Omit<LocalizedText, "ru">> = {
  "Пример": { en: "Example", de: "Beispiel", kk: "Үлгі", uk: "Приклад", uz: "Namuna" },
  "Пудра": { en: "Powder", de: "Puder", kk: "Пудра", uk: "Пудра", uz: "Pudra" },
  "Белый": { en: "White", de: "Weiß", kk: "Ақ", uk: "Білий", uz: "Oq" },
  "Бежевый": { en: "Beige", de: "Beige", kk: "Беж", uk: "Бежевий", uz: "Bej" },
  "Чёрный": { en: "Black", de: "Schwarz", kk: "Қара", uk: "Чорний", uz: "Qora" },
  "Чёрный 1": { en: "Black 1", de: "Schwarz 1", kk: "Қара 1", uk: "Чорний 1", uz: "Qora 1" },
  "Чёрный 2": { en: "Black 2", de: "Schwarz 2", kk: "Қара 2", uk: "Чорний 2", uz: "Qora 2" },
  "Чёрный 3": { en: "Black 3", de: "Schwarz 3", kk: "Қара 3", uk: "Чорний 3", uz: "Qora 3" },
  "Светло серый": { en: "Light gray", de: "Hellgrau", kk: "Ашық сұр", uk: "Світло-сірий", uz: "Och kulrang" },
  "Кофейный": { en: "Coffee", de: "Kaffee", kk: "Кофе", uk: "Кавовий", uz: "Qahva rang" },
  "Коралловый": { en: "Coral", de: "Koralle", kk: "Маржан", uk: "Кораловий", uz: "Marjon" },
  "Серо голубой": { en: "Gray-blue", de: "Grau-Blau", kk: "Сұр-көк", uk: "Сіро-блакитний", uz: "Kulrang-ko'k" },
  "Оливковый": { en: "Olive", de: "Oliv", kk: "Зәйтүн", uk: "Оливковий", uz: "Zaytun rang" },
  "Серый": { en: "Gray", de: "Grau", kk: "Сұр", uk: "Сірий", uz: "Kulrang" },
  "Бежево розовый": { en: "Beige pink", de: "Beige-Rosa", kk: "Беж-қызғылт", uk: "Бежево-рожевий", uz: "Bej-pushti" },
  "Тёмно синий": { en: "Dark blue", de: "Dunkelblau", kk: "Қою көк", uk: "Темно-синій", uz: "To'q ko'k" },
  "Шоколадный": { en: "Chocolate", de: "Schokolade", kk: "Шоколад", uk: "Шоколадний", uz: "Shokolad rang" },
  "Розовый": { en: "Pink", de: "Rosa", kk: "Қызғылт", uk: "Рожевий", uz: "Pushti" },
  "Хвойный": { en: "Pine", de: "Tannengrün", kk: "Қылқан", uk: "Хвойний", uz: "Ignabargli yashil" },
  "Капучино": { en: "Cappuccino", de: "Cappuccino", kk: "Капучино", uk: "Капучино", uz: "Kapuchino" },
  "Светло сиреневый": {
    en: "Light lilac",
    de: "Helllila",
    kk: "Ашық сирень",
    uk: "Світло-бузковий",
    uz: "Och binafsha",
  },
  "Небесно серый": { en: "Sky gray", de: "Himmelgrau", kk: "Аспан-сұр", uk: "Небесно-сірий", uz: "Osmon-kulrang" },
  "Голубой": { en: "Sky blue", de: "Hellblau", kk: "Көгілдір", uk: "Блакитний", uz: "Havorang" },
  "Светло бежевый": { en: "Light beige", de: "Hellbeige", kk: "Ашық беж", uk: "Світло-бежевий", uz: "Och bej" },
  "Молочный": { en: "Milky", de: "Milchig", kk: "Сүт түсті", uk: "Молочний", uz: "Sut rang" },
  "Сиреневый": { en: "Lilac", de: "Lila", kk: "Сирень", uk: "Бузковий", uz: "Siren" },
  "Кремовый": { en: "Cream", de: "Creme", kk: "Крем", uk: "Кремовий", uz: "Krem rang" },
  "Светло розовый": { en: "Light pink", de: "Hellrosa", kk: "Ашық қызғылт", uk: "Світло-рожевий", uz: "Och pushti" },
};

function localizeShifonColorName(ruName: string): LocalizedText {
  const tx = SHIFON_COLOR_TRANSLATIONS[ruName];
  if (!tx) {
    return { ru: ruName, en: ruName, de: ruName, kk: ruName, uk: ruName, uz: ruName };
  }
  return { ru: ruName, ...tx };
}

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
const SHIFON_GOFRE_GOROH_RU_NAMES = [
  "Пример",
  "Пудра",
  "Белый",
  "Бежевый",
  "Чёрный",
  "Светло серый",
  "Кофейный",
  "Коралловый",
  "Серо голубой",
  "Оливковый",
] as const;

function gofreGorohProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  const shifonNum = (n - 1).toString().padStart(2, "0");
  const imageName = n === 1 ? "gofre_goroh_01.jpg" : `shifon_gofre_gorox_${shifonNum}.jpg`;
  const ruName = SHIFON_GOFRE_GOROH_RU_NAMES[n - 1] ?? `Шифон гофре горох ${n}`;
  const localizedName = localizeShifonColorName(ruName);
  return {
    id: `gofre-goroh-${num}`,
    name: localizedName,
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
const SHIFON_GOFRE_ODNOTON_RU_NAMES = [
  "Пример",
  "Серый",
  "Бежево розовый",
  "Белый",
  "Чёрный",
  "Тёмно синий",
  "Кофейный",
  "Шоколадный",
  "Пудра",
  "Розовый",
  "Хвойный",
  "Капучино",
  "Светло сиреневый",
  "Светло серый",
  "Небесно серый",
  "Голубой",
  "Светло бежевый",
] as const;

function shifonGofreOdnotonProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  const ruName = SHIFON_GOFRE_ODNOTON_RU_NAMES[n - 1] ?? `Шифон гофре однотон ${n}`;
  const localizedName = localizeShifonColorName(ruName);
  return {
    id: `shifon-gofre-odnoton-${num}`,
    name: localizedName,
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
const SHIFON_GOFRE_CVETOK_RU_NAMES = [
  "Пример",
  "Серый",
  "Чёрный 1",
  "Молочный",
  "Голубой",
  "Сиреневый",
  "Чёрный 2",
  "Бежевый",
  "Кремовый",
  "Белый",
  "Светло розовый",
  "Чёрный 3",
  "Бежевый",
  "Голубой",
  "Кремовый",
  "Серый",
] as const;

function gofreCvetokProduct(n: number): Product {
  const num = n.toString().padStart(2, "0");
  const imageName =
    n <= 11 ? `gofre_cvetok_${num}.jpg` : `shifon_gofre_cvetok_${num}.jpg`;
  const ruName = SHIFON_GOFRE_CVETOK_RU_NAMES[n - 1] ?? `Шифон гофре цветок ${n}`;
  const localizedName = localizeShifonColorName(ruName);
  return {
    id: `gofre-cvetok-${num}`,
    name: localizedName,
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

const AKSES_NAME_TRANSLATIONS: Record<string, Omit<LocalizedText, "ru">> = {
  Крабик: {
    en: "Hair claw",
    de: "Haarklammer",
    kk: "Шаш түйреуі",
    uk: "Крабик",
    uz: "Soch qisqichi",
  },
  "Заколка цветочек": {
    en: "Flower clip",
    de: "Blumen-Haarklammer",
    kk: "Гülді заколка",
    uk: "Заколка з квіткою",
    uz: "Gulli soch qisqichi",
  },
  "Заколка в цветочек": {
    en: "Flower clip",
    de: "Blumen-Haarklammer",
    kk: "Гülді заколка",
    uk: "Заколка з квіткою",
    uz: "Gulli soch qisqichi",
  },
  "Набор крабиков": {
    en: "Set of hair claws",
    de: "Set Haarklammern",
    kk: "Кrabikter жиынтығы",
    uk: "Набір крабиків",
    uz: "Soch qisqichlari to'plami",
  },
  Набор: {
    en: "Set",
    de: "Set",
    kk: "Жиынтық",
    uk: "Набір",
    uz: "To'plam",
  },
  "Набор заколок цветочек": {
    en: "Set of flower clips",
    de: "Set Blumen-Haarklammern",
    kk: "Гülді заколкalar жиынтығы",
    uk: "Набір заколок з квіткою",
    uz: "Gulli soch qisqichlari to'plami",
  },
  Невидимки: {
    en: "Bobby pins",
    de: "Haarnadeln",
    kk: "Шаш токасы",
    uk: "Невидимки",
    uz: "Soch to'g'nalari",
  },
};

function localizeAksesName(nameRu: string): LocalizedText {
  const tx = AKSES_NAME_TRANSLATIONS[nameRu];
  if (!tx) {
    return { ru: nameRu, en: nameRu, de: nameRu, kk: nameRu, uk: nameRu, uz: nameRu };
  }
  return { ru: nameRu, ...tx };
}

const AKSES_ITEMS: { num: number; nameRu: string; price: number; size?: string }[] = [
  { num: 2, nameRu: "Крабик", price: 1100 },
  { num: 4, nameRu: "Заколка цветочек", price: 1100 },
  { num: 6, nameRu: "Крабик", price: 1100 },
  { num: 8, nameRu: "Крабик", price: 1100 },
  { num: 10, nameRu: "Заколка цветочек", price: 1100 },
  { num: 12, nameRu: "Заколка цветочек", price: 1100 },
  { num: 14, nameRu: "Заколка цветочек", price: 1100 },
  { num: 16, nameRu: "Заколка цветочек", price: 1100 },
  { num: 18, nameRu: "Заколка цветочек", price: 1100 },
  { num: 20, nameRu: "Крабик", price: 1100 },
  { num: 22, nameRu: "Заколка цветочек", price: 1100 },
  { num: 24, nameRu: "Крабик", price: 1100 },
  { num: 26, nameRu: "Крабик", price: 1100 },
  { num: 28, nameRu: "Заколка цветочек", price: 1100 },
  { num: 30, nameRu: "Заколка в цветочек", price: 1100 },
  { num: 32, nameRu: "Набор крабиков", price: 1100 },
  { num: 34, nameRu: "Набор", price: 2000 },
  { num: 36, nameRu: "Набор крабиков", price: 1100 },
  { num: 38, nameRu: "Набор заколок цветочек", price: 1100 },
  { num: 40, nameRu: "Набор заколок цветочек", price: 1100 },
  { num: 42, nameRu: "Невидимки", price: 650, size: "3,6" },
  { num: 44, nameRu: "Невидимки", price: 600, size: "5" },
  { num: 46, nameRu: "Невидимки", price: 600, size: "7" },
  { num: 48, nameRu: "Невидимки", price: 600, size: "7" },
  { num: 50, nameRu: "Невидимки", price: 500, size: "3" },
  { num: 52, nameRu: "Невидимки", price: 600, size: "6" },
  { num: 54, nameRu: "Невидимки", price: 600, size: "6" },
  { num: 56, nameRu: "Невидимки", price: 600, size: "6" },
  { num: 58, nameRu: "Невидимки", price: 800, size: "5,5" },
  { num: 60, nameRu: "Невидимки", price: 800, size: "5,5" },
  { num: 62, nameRu: "Невидимки", price: 800, size: "5,5" },
  { num: 64, nameRu: "Невидимки", price: 1500, size: "7" },
];

function aksesProduct(item: (typeof AKSES_ITEMS)[number]): Product {
  const num = item.num.toString().padStart(2, "0");
  return {
    id: `akses-${num}`,
    name: localizeAksesName(item.nameRu),
    image: `/akses/akses{${num}}.jpg`,
    price: item.price,
    category: "Аксессуары",
    material: "Аксессуары",
    size: item.size,
    badge: "New",
  };
}

const AKSES_32: Product[] = AKSES_ITEMS.map(aksesProduct);

/** Категории без демо-карточки «Пример» (все товары продаются) */
const CATEGORIES_WITHOUT_EXAMPLE = new Set<Material>(["Аксессуары"]);

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

export function markFirstProductAsExample(allProducts: Product[]): Product[] {
  const seen = new Set<Material>();
  return allProducts.map((product) => {
    const size = product.size ?? MATERIAL_SIZES[product.category];
    if (CATEGORIES_WITHOUT_EXAMPLE.has(product.category)) {
      return size ? { ...product, size } : product;
    }
    if (seen.has(product.category)) return size ? { ...product, size } : product;
    seen.add(product.category);
    return { ...product, isExample: true, size };
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
  ...AKSES_32,
]);

const STATIC_NAME_BY_IMAGE = new Map<string, LocalizedText>(
  products.map((p) => [p.image, p.name])
);

const STATIC_NAME_BY_CATEGORY_RU = new Map<string, LocalizedText>(
  products.map((p) => [`${p.category}\0${p.name.ru}`, p.name])
);

/** Переводы из статического каталога (для строк Supabase с тем же image или RU-названием). */
export function resolveStaticLocalizedName(
  image: string,
  category: string,
  nameRu: string
): LocalizedText | undefined {
  const byImage = STATIC_NAME_BY_IMAGE.get(image);
  if (byImage) return byImage;
  return STATIC_NAME_BY_CATEGORY_RU.get(`${category}\0${nameRu.trim()}`);
}
