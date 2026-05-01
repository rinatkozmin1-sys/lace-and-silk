"use client";

import {
  CATALOG_PILL_ORDER,
  type CatalogPillFilter,
} from "@/lib/catalogPillFilter";
import { useI18n } from "@/lib/i18n";
import { cormorantDisplay } from "@/lib/cormorantDisplay";
import { cn } from "@/lib/utils";

const PILL_T_KEYS: Record<CatalogPillFilter, string> = {
  all: "hero.pillAll",
  kosynki: "hero.pillKosynki",
  sharfy: "hero.pillSharfy",
  zauzhennye: "hero.pillZauzhennye",
  aksessuary: "hero.pillAksessuary",
};

export function CategoryPills({
  selected,
  onSelect,
}: {
  selected: CatalogPillFilter;
  onSelect: (pill: CatalogPillFilter) => void;
}) {
  const { t } = useI18n();

  const scrollCatalogIntoView = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div
      className={cn(
        "w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-2 pb-1 pt-1",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      )}
    >
      <div className="flex w-max max-w-none flex-nowrap gap-2 px-0.5 py-0.5 pr-2">
        {CATALOG_PILL_ORDER.map((pill) => {
          const active = selected === pill;
          return (
            <button
              key={pill}
              type="button"
              onClick={() => {
                onSelect(pill);
                scrollCatalogIntoView();
              }}
              className={cn(
                cormorantDisplay.className,
                "snap-start shrink-0 rounded-full border px-4 py-2 text-sm font-medium leading-none tracking-[0.015em] text-gray-800 subpixel-antialiased shadow-sm transition-colors duration-150",
                "border-gray-200 bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 focus-visible:ring-offset-body",
                active && "border-gray-800 bg-gray-300 text-gray-800 shadow-md"
              )}
            >
              {t(PILL_T_KEYS[pill])}
            </button>
          );
        })}
      </div>
    </div>
  );
}
