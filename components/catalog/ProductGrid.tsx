"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { CategoryTypeCard } from "./CategoryTypeCard";
import { Container } from "@/components/layout/Container";
import { useI18n } from "@/lib/i18n";
import { CATEGORY_LABELS } from "@/lib/categoryLabels";
import {
  productMatchesCatalogPill,
  type CatalogPillFilter,
} from "@/lib/catalogPillFilter";
import {
  getCategoryCoverImage,
  getCategoryTypesInStock,
  type Material,
  type Product,
} from "@/lib/products";
import { Button } from "@/components/ui/Button";
import {
  applyCatalogScrollY,
  stashCatalogScrollY,
  takeStashedCatalogScrollY,
} from "@/lib/catalogScrollRestore";

const PILL_T_KEYS: Record<Exclude<CatalogPillFilter, "all">, string> = {
  kosynki: "hero.pillKosynki",
  sharfy: "hero.pillSharfy",
  zauzhennye: "hero.pillZauzhennye",
  aksessuary: "hero.pillAksessuary",
};

function matchesSearch(product: Product, normalizedSearch: string): boolean {
  const localizedNames = Object.values(product.name).map((value) =>
    value.toLocaleLowerCase()
  );
  const titles = product.title
    ? Object.values(product.title).map((v) => v.toLocaleLowerCase())
    : [];
  const categoryMatch = product.category.toLocaleLowerCase().includes(normalizedSearch);
  const materialMatch = product.material.toLocaleLowerCase().includes(normalizedSearch);
  const nameMatch = localizedNames.some((name) => name.includes(normalizedSearch));
  const titleMatch = titles.some((x) => x.includes(normalizedSearch));
  return categoryMatch || materialMatch || nameMatch || titleMatch;
}

export function ProductGrid({
  allProducts,
  pillFilter,
  selectedCategory,
  onSelectCategory,
  onBackToTypes,
  onAddToCart,
}: {
  allProducts: Product[];
  pillFilter: CatalogPillFilter;
  selectedCategory: Material | null;
  onSelectCategory: (category: Material) => void;
  onBackToTypes: () => void;
  onAddToCart: (p: Product) => void;
}) {
  const { t, lang } = useI18n();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpeningImage, setIsOpeningImage] = useState(false);
  const [isClosingImage, setIsClosingImage] = useState(false);
  const [isCatalogScrolled, setIsCatalogScrolled] = useState(false);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  /** Позиция скролла до открытия оверлея фото (та же вкладка + sessionStorage в stash) */
  const scrollBeforeLightboxRef = useRef<number | null>(null);

  const searchQuery = searchParams.get("search")?.trim() ?? "";
  const normalizedSearch = searchQuery.toLocaleLowerCase();
  const isSearching = normalizedSearch.length > 0;

  const pillFiltered = useMemo(() => {
    if (pillFilter === "all") return allProducts;
    return allProducts.filter((p) => productMatchesCatalogPill(p, pillFilter));
  }, [allProducts, pillFilter]);

  const filteredProducts = useMemo(() => {
    if (!isSearching) return pillFiltered;
    return pillFiltered.filter((p) => matchesSearch(p, normalizedSearch));
  }, [pillFiltered, isSearching, normalizedSearch]);

  const typeCards = useMemo(
    () => getCategoryTypesInStock(filteredProducts),
    [filteredProducts]
  );

  const productsInGrid = useMemo(() => {
    if (pillFilter !== "all") {
      return filteredProducts;
    }
    if (isSearching && !selectedCategory) {
      return filteredProducts;
    }
    if (isSearching && selectedCategory) {
      return filteredProducts.filter((p) => p.category === selectedCategory);
    }
    if (!isSearching && selectedCategory) {
      return filteredProducts.filter((p) => p.category === selectedCategory);
    }
    /* «Все», без поиска и без выбранного типа: обычно показываем только сетку типов.
       Если типов нет (например категории из бота не совпадают с фиксированным списком Material),
       показываем все товары карточками. */
    if (typeCards.length === 0 && filteredProducts.length > 0) {
      return filteredProducts;
    }
    return [];
  }, [filteredProducts, pillFilter, isSearching, selectedCategory, typeCards.length]);

  const showLevel1Types =
    pillFilter === "all" &&
    !isSearching &&
    selectedCategory === null &&
    typeCards.length > 0;

  const catalogHeading = useMemo(() => {
    if (showLevel1Types) return null;
    if (pillFilter !== "all") {
      return (
        <h2 className="font-product text-2xl font-medium text-primary md:text-3xl">
          {isSearching ? (
            <>
              {t("catalog.searchHeading")}: {searchQuery}
              <span className="mt-1 block text-base font-normal text-primary/70 md:text-lg">
                {t(PILL_T_KEYS[pillFilter])}
              </span>
            </>
          ) : (
            t(PILL_T_KEYS[pillFilter])
          )}
        </h2>
      );
    }
    if (isSearching) {
      return (
        <h2 className="font-product text-2xl font-medium text-primary md:text-3xl">
          {t("catalog.searchHeading")}: {searchQuery}
        </h2>
      );
    }
    if (selectedCategory) {
      return (
        <h2 className="font-product text-2xl font-medium text-primary md:text-3xl">
          {CATEGORY_LABELS[selectedCategory][lang]}
        </h2>
      );
    }
    return null;
  }, [
    showLevel1Types,
    pillFilter,
    isSearching,
    searchQuery,
    selectedCategory,
    lang,
    t,
  ]);

  useEffect(() => {
    if (!selectedCategory || pillFilter !== "all") {
      setIsCatalogScrolled(false);
      return;
    }
    const onScroll = () => setIsCatalogScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selectedCategory, pillFilter]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTopButton(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!selectedCategory || pillFilter !== "all") return;

    const scrollCatalogToTopInstant = () => {
      const el = document.getElementById("catalog");
      if (!el) return;
      const headerOffset = 72;
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset);
      const html = document.documentElement;
      const body = document.body;
      const prevHtml = html.style.scrollBehavior;
      const prevBody = body.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      body.style.scrollBehavior = "auto";
      window.scrollTo({ top, left: 0, behavior: "instant" as ScrollBehavior });
      html.style.scrollBehavior = prevHtml;
      body.style.scrollBehavior = prevBody;
    };

    const id = window.requestAnimationFrame(scrollCatalogToTopInstant);
    return () => cancelAnimationFrame(id);
  }, [selectedCategory, pillFilter]);

  const closeSelectedImage = () => {
    setIsClosingImage(true);
    window.setTimeout(() => {
      setSelectedImage(null);
      setIsClosingImage(false);
      const fromRef = scrollBeforeLightboxRef.current;
      scrollBeforeLightboxRef.current = null;
      let y: number | null = null;
      if (fromRef !== null) {
        takeStashedCatalogScrollY();
        y = fromRef;
      } else {
        y = takeStashedCatalogScrollY();
      }
      if (y !== null) {
        requestAnimationFrame(() => applyCatalogScrollY(y));
      }
    }, 520);
  };

  const openSelectedImage = (url: string | null) => {
    if (!url) return;
    const y = window.scrollY;
    scrollBeforeLightboxRef.current = y;
    stashCatalogScrollY();
    setIsClosingImage(false);
    setIsOpeningImage(true);
    setSelectedImage(url);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsOpeningImage(false));
    });
  };

  const switchCatalogView = (nextCategory: Material | null) => {
    if (isViewTransitioning) return;
    setIsViewTransitioning(true);
    window.setTimeout(() => {
      if (nextCategory === null) {
        onBackToTypes();
      } else {
        onSelectCategory(nextCategory);
      }
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsViewTransitioning(false));
      });
    }, 300);
  };

  const scrollCatalogToTopSmooth = () => {
    const el = document.getElementById("catalog");
    if (!el) return;
    const headerOffset = 72;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {selectedImage && (
        <div
          className={`fixed inset-0 z-50 flex cursor-default items-center justify-center bg-black/80 p-4 transition-opacity duration-500 ease-out ${
            isClosingImage || isOpeningImage ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeSelectedImage}
          role="presentation"
        >
          <div
            className={`relative h-[min(92vh,100dvh)] w-[min(96vw,100dvw)] max-h-full max-w-full transform-gpu transition-all duration-500 ease-out ${
              isClosingImage || isOpeningImage ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={closeSelectedImage}
          >
            <Image
              src={selectedImage}
              alt=""
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 1200px) 96vw, 1152px"
            />
          </div>
        </div>
      )}
      <section id="catalog" className="scroll-mt-20 bg-body py-10 md:py-14">
        <Container>
          {showLevel1Types ? (
            <div
              className={`grid transform-gpu grid-cols-2 gap-3 transition-all duration-500 ease-out md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 ${
                isViewTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              {typeCards.map((material) => {
                const cover = getCategoryCoverImage(material, filteredProducts);
                return (
                  <CategoryTypeCard
                    key={material}
                    imageSrc={cover}
                    title={CATEGORY_LABELS[material][lang]}
                    onSelect={() => switchCatalogView(material)}
                  />
                );
              })}
            </div>
          ) : (
            <div
              className={`transform-gpu transition-all duration-500 ease-out ${
                isViewTransitioning ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              {pillFilter === "all" && selectedCategory && (
                <div className="sticky top-16 z-20 mb-6">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => switchCatalogView(null)}
                    className={`w-full px-8 py-3 text-lg text-white shadow-sm transition-opacity duration-500 ease-out hover:shadow-md sm:w-auto ${
                      isCatalogScrolled ? "opacity-55" : "opacity-100"
                    }`}
                  >
                    {t("catalog.backToTypes")}
                  </Button>
                </div>
              )}
              {catalogHeading}
              <div
                className={`grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 ${
                  catalogHeading ? "mt-6" : ""
                }`}
              >
                {productsInGrid.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    setSelectedImage={openSelectedImage}
                  />
                ))}
              </div>
              {productsInGrid.length === 0 && (
                <p className="py-12 text-center font-serif text-lg text-primary/70">
                  {t("catalog.empty")}
                </p>
              )}
            </div>
          )}

          {showLevel1Types && typeCards.length === 0 && (
            <p className="py-12 text-center font-serif text-lg text-primary/70">
              {t("catalog.empty")}
            </p>
          )}
        </Container>
      </section>
      {showScrollTopButton && (
        <button
          type="button"
          onClick={scrollCatalogToTopSmooth}
          aria-label="Наверх"
          className="fixed bottom-28 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-gray-200 text-gray-700 shadow-md transition-all duration-300 hover:bg-gray-300 hover:shadow-lg"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
