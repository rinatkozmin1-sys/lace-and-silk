"use client";

import { Suspense, useState } from "react";
import { Hero } from "@/components/layout/Hero";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { products, type Material } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useFxRates } from "@/lib/useFxRates";

export function HomeContent() {
  const { addItem } = useCart();
  /** null — уровень 1 (карточки видов), иначе — товары выбранной категории */
  const [selectedCategory, setSelectedCategory] = useState<Material | null>(null);
  const fx = useFxRates();
  const isHomeShowcase = selectedCategory === null;

  return (
    <div className="space-y-10">
      {isHomeShowcase && <Hero />}
      <Suspense fallback={<div></div>}>
        <ProductGrid
          allProducts={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onBackToTypes={() => setSelectedCategory(null)}
          onAddToCart={addItem}
          fxRates={fx.rates}
        />
      </Suspense>
    </div>
  );
}
