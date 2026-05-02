"use client";

import { Suspense, useCallback, useState } from "react";
import { Hero } from "@/components/layout/Hero";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import type { CatalogPillFilter } from "@/lib/catalogPillFilter";
import { products as fallbackProducts, type Material, type Product } from "@/lib/products";
import type { HomeCatalogPayload } from "@/lib/catalogProductMapper";
import { useCart } from "@/lib/cart";

export function HomeContent({ catalogPayload }: { catalogPayload: HomeCatalogPayload }) {
  const { addItem } = useCart();
  const [pillFilter, setPillFilter] = useState<CatalogPillFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<Material | null>(null);

  const [products] = useState<Product[]>(() =>
    catalogPayload.ok ? catalogPayload.products : fallbackProducts
  );

  const productsError = catalogPayload.ok ? null : catalogPayload.message;

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
    </div>
  );
}
