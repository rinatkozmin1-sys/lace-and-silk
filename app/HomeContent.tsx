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

function toUiProduct(row: ProductApiRow): Product {
  const normalizedCategory = row.category as Material;
  return {
    id: String(row.id),
    name: localizeName(row.name),
    image: row.image,
    price: Number(row.price),
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
        const res = await fetch("/api/products", { cache: "no-store" });
        const json = (await res.json()) as { products?: ProductApiRow[]; error?: string };
        if (!active) return;
        if (!res.ok || !json.products) {
          setProductsError(json.error ?? "Не удалось загрузить товары из Supabase.");
          setProducts(fallbackProducts);
        } else {
          setProducts(json.products.map(toUiProduct));
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
