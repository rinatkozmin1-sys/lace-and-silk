"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Hero } from "@/components/layout/Hero";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import type { CatalogPillFilter } from "@/lib/catalogPillFilter";
import { products as fallbackProducts, type Material, type Product } from "@/lib/products";
import { loadCatalogProductRows } from "@/lib/catalogProductQuery";
import { productRowsToUiProducts } from "@/lib/catalogProductMapper";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useCart } from "@/lib/cart";
import { applyCatalogScrollY } from "@/lib/catalogScrollRestore";

export function HomeContent() {
  const { addItem } = useCart();
  const [pillFilter, setPillFilter] = useState<CatalogPillFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<Material | null>(null);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;
      const { data, error } = await loadCatalogProductRows(supabase);
      if (cancelled) return;
      if (error || !data.length) return;
      const scrollY = window.scrollY;
      setProducts(productRowsToUiProducts(data));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => applyCatalogScrollY(scrollY));
      });
    };
    void run();
    return () => {
      cancelled = true;
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
