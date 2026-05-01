"use client";

import { Suspense, useCallback, useState } from "react";
import { Hero } from "@/components/layout/Hero";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import type { CatalogPillFilter } from "@/lib/catalogPillFilter";
import { products, type Material } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function HomeContent() {
  const { addItem } = useCart();
  const [pillFilter, setPillFilter] = useState<CatalogPillFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<Material | null>(null);

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
