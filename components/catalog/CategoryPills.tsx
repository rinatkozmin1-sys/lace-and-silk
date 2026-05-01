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
        "w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-1 pt-1",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      )}
    >
      <div className="flex w-max max-w-none gap-2.5 px-0.5 py-0.5">
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
                "snap-start shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-[0.02em] text-white antialiased shadow-sm transition-colors duration-150",
                "bg-[#4F4F4F] hover:bg-[#454545] active:bg-[#3d3d3d]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-body",
                active && "bg-[#333333] shadow-md ring-1 ring-white/25"
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
