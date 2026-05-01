"use client";

import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { cormorantDisplay } from "@/lib/cormorantDisplay";

export function Hero({ belowCatalog }: { belowCatalog?: ReactNode }) {
  const { t } = useI18n();
  const scrollToCatalog = () => {
    const catalog = document.getElementById("catalog");
    if (catalog) catalog.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Декоративный фон */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary blur-3xl"></div>
      </div>

      {/* Основной контент */}
      <Container className="relative z-10 text-center">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-4">
            <h1
              className={`${cormorantDisplay.className} mb-6 text-4xl font-medium italic tracking-[0.02em] text-stone-700 md:text-6xl`}
            >
              {t("hero.title")}
            </h1>
            <p
              className={`${cormorantDisplay.className} mb-10 text-lg italic tracking-[0.01em] text-stone-600 md:text-xl`}
            >
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={scrollToCatalog} className="px-8 py-6 text-lg">
              {t("hero.catalog")}
            </Button>
          </div>
        </div>

        {belowCatalog ? <div className="mt-10 w-full text-left">{belowCatalog}</div> : null}
      </Container>
    </section>
  );
}
