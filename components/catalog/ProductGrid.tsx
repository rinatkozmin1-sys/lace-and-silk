"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { CategoryTypeCard } from "./CategoryTypeCard";
import { Container } from "@/components/layout/Container";
import type { FxRates } from "@/lib/fx";
import { useI18n } from "@/lib/i18n";
import { CATEGORY_LABELS } from "@/lib/categoryLabels";
import {
  getCategoryCoverImage,
  getCategoryTypesInStock,
  type Material,
  type Product,
} from "@/lib/products";
import { Button } from "@/components/ui/Button";

export function ProductGrid({
  allProducts,
  selectedCategory,
  onSelectCategory,
  onBackToTypes,
  onAddToCart,
  fxRates,
}: {
  allProducts: Product[];
  selectedCategory: Material | null;
  onSelectCategory: (category: Material) => void;
  onBackToTypes: () => void;
  onAddToCart: (p: Product) => void;
  fxRates: FxRates | null;
}) {
  const { t, lang } = useI18n();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpeningImage, setIsOpeningImage] = useState(false);
  const [isClosingImage, setIsClosingImage] = useState(false);
  const [isCatalogScrolled, setIsCatalogScrolled] = useState(false);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const searchQuery = searchParams.get("search")?.trim() ?? "";
  const normalizedSearch = searchQuery.toLocaleLowerCase();
  const isSearching = normalizedSearch.length > 0;

  useEffect(() => {
    if (!selectedCategory) {
      setIsCatalogScrolled(false);
      return;
    }

    const onScroll = () => {
      setIsCatalogScrolled(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selectedCategory]);

  useEffect(() => {
    const onScroll = () => {
      const catalog = document.getElementById("catalog");
      if (!catalog) {
        setShowScrollTopButton(false);
        return;
      }

      const catalogTop = catalog.getBoundingClientRect().top + window.scrollY;
      setShowScrollTopButton(window.scrollY > catalogTop + 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** При открытии вида сразу верх списка без анимации (глобальный scroll-behavior: smooth иначе даёт «пролистывание»). */
  useEffect(() => {
    if (!selectedCategory) {
      return;
    }

    const scrollCatalogToTopInstant = () => {
      const el = document.getElementById("catalog");
      if (!el) {
        return;
      }
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
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!isSearching) {
      return allProducts;
    }

    return allProducts.filter((product) => {
      const localizedNames = Object.values(product.name).map((value) =>
        value.toLocaleLowerCase()
      );
      const categoryMatch = product.category.toLocaleLowerCase().includes(normalizedSearch);
      const nameMatch = localizedNames.some((name) => name.includes(normalizedSearch));

      return categoryMatch || nameMatch;
    });
  }, [allProducts, isSearching, normalizedSearch]);

  const typeCards = useMemo(
    () => getCategoryTypesInStock(filteredProducts),
    [filteredProducts]
  );

  const productsInCategory = useMemo(() => {
    if (selectedCategory) {
      return filteredProducts.filter((p) => p.category === selectedCategory);
    }
    if (isSearching) {
      return filteredProducts;
    }
    return [];
  }, [filteredProducts, isSearching, selectedCategory]);

  const closeSelectedImage = () => {
    setIsClosingImage(true);
    window.setTimeout(() => {
      setSelectedImage(null);
      setIsClosingImage(false);
    }, 520);
  };

  const openSelectedImage = (url: string | null) => {
    if (!url) {
      return;
    }
    setIsClosingImage(false);
    setIsOpeningImage(true);
    setSelectedImage(url);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsOpeningImage(false);
      });
    });
  };

  const switchCatalogView = (nextCategory: Material | null) => {
    if (isViewTransitioning) {
      return;
    }
    setIsViewTransitioning(true);
    window.setTimeout(() => {
      if (nextCategory === null) {
        onBackToTypes();
      } else {
        onSelectCategory(nextCategory);
      }
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsViewTransitioning(false);
        });
      });
    }, 300);
  };

  const scrollCatalogToTopSmooth = () => {
    const el = document.getElementById("catalog");
    if (!el) {
      return;
    }
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
        {selectedCategory === null && !isSearching ? (
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
            {selectedCategory && (
              <>
                <div className="sticky top-16 z-20 mb-6">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => switchCatalogView(null)}
                    className={`w-full px-8 py-3 text-lg text-white shadow-sm transition-opacity duration-500 ease-out hover:shadow-md sm:w-auto ${
                      isCatalogScrolled ? "opacity-55" : "opacity-100"
                    }`}
                  >
                    ← На главную
                  </Button>
                </div>
                <h2 className="font-product text-2xl font-medium text-primary md:text-3xl">
                  {CATEGORY_LABELS[selectedCategory][lang]}
                </h2>
              </>
            )}
            {isSearching && (
              <h2 className="font-product text-2xl font-medium text-primary md:text-3xl">
                Поиск: {searchQuery}
              </h2>
            )}
            <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
              {productsInCategory.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  fxRates={fxRates}
                  setSelectedImage={openSelectedImage}
                />
              ))}
            </div>
            {productsInCategory.length === 0 && (
              <p className="py-12 text-center font-serif text-lg text-primary/70">
                {t("catalog.empty")}
              </p>
            )}
          </div>
        )}

        {selectedCategory === null && !isSearching && typeCards.length === 0 && (
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
        className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-accent/30 text-primary shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-accent/45 hover:shadow-lg"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    )}
    </>
  );
}
