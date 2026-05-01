"use client";

import { Container } from "@/components/layout/Container";
import { CATALOG_CATEGORIES, type CatalogCategoryFilter } from "@/lib/products";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { CATEGORY_LABELS } from "@/lib/categoryLabels";

interface FiltersBarProps {
  activeCategory: CatalogCategoryFilter;
  setActiveCategory: (cat: CatalogCategoryFilter) => void;
}

export function FiltersBar({ activeCategory, setActiveCategory }: FiltersBarProps) {
  const { lang, t } = useI18n();

  return (
    <section className="scroll-mt-24 py-8 border-b">
      <Container>
        <div className="flex items-center gap-4">
          <span className="font-product text-lg font-medium text-muted-foreground whitespace-nowrap">
            {t("catalog.categories")}
          </span>
          <div className="flex flex-wrap gap-2">
            {CATALOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn("category-btn", activeCategory === cat && "active")}
              >
                {CATEGORY_LABELS[cat][lang]}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
