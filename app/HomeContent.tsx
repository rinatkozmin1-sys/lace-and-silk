"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Hero } from "@/components/layout/Hero";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import type { CatalogPillFilter } from "@/lib/catalogPillFilter";
import { products as fallbackProducts, type LocalizedText, type Material, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

type ProductApiRow = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
};

function localizeName(name: string): LocalizedText {
  return {
    ru: name,
    en: name,
    de: name,
    kk: name,
    uk: name,
    uz: name,
  };
}

function toUiProduct(row: ProductApiRow, index: number): Product {
  const titleFromDb = typeof row.name === "string" ? row.name.trim() : "";
  const categoryFromDb = typeof row.category === "string" ? row.category.trim() : "";
  let priceVal =
    typeof row.price === "number" && Number.isFinite(row.price)
      ? row.price
      : Number.parseFloat(String(row.price ?? "").replace(",", "."));
  if (!Number.isFinite(priceVal)) priceVal = 0;

  const idStr =
    row.id !== undefined && row.id !== null && String(row.id) !== ""
      ? String(row.id)
      : `product-${index}`;

  const normalizedCategory = categoryFromDb as Material;

  return {
    id: idStr,
    name: localizeName(titleFromDb),
    image: typeof row.image === "string" ? row.image : "",
    price: priceVal,
    category: normalizedCategory,
    material: normalizedCategory,
    badge: null,
  };
}

export function HomeContent() {
  const { addItem } = useCart();
  const [pillFilter, setPillFilter] = useState<CatalogPillFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<Material | null>(null);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
        const json = (await res.json()) as { products?: ProductApiRow[]; error?: string };
        if (!active) return;
        if (!res.ok || !json.products) {
          setProductsError(json.error ?? "Не удалось загрузить товары из Supabase.");
          setProducts(fallbackProducts);
        } else {
          setProducts(json.products.map((row, i) => toUiProduct(row, i)));
          setProductsError(null);
        }
      } catch {
        if (!active) return;
        setProductsError("Не удалось загрузить товары из Supabase.");
        setProducts(fallbackProducts);
      } finally {
        if (active) setIsLoadingProducts(false);
      }
    };
    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const handleSelectPill = useCallback((pill: CatalogPillFilter) => {
    setPillFilter(pill);
    setSelectedCategory(null);
  }, []);

  return (
    <div className="space-y-10">
      <Hero
        belowCatalog={
          <CategoryPills selected={pillFilter} onSelect={handleSelectPill} />
        }
      />
      {productsError && (
        <div className="mx-auto w-full max-w-screen-xl px-4 text-sm text-red-600 sm:px-6 lg:px-8">
          {productsError}
        </div>
      )}
      <Suspense fallback={<div></div>}>
        <ProductGrid
          allProducts={products}
          pillFilter={pillFilter}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onBackToTypes={() => setSelectedCategory(null)}
          onAddToCart={addItem}
        />
      </Suspense>
      {isLoadingProducts && (
        <div className="pb-6 text-center text-sm text-primary/60">Загрузка товаров...</div>
      )}
    </div>
  );
}
