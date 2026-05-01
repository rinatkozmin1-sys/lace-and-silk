"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export function Hero() {
  const { t } = useI18n();
  const scrollToCatalog = () => {
    const catalog = document.getElementById('catalog');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Декоративный фон */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
      </div>

      {/* Основной контент */}
      <Container className="relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1
              className={`${cormorant.className} mb-6 text-4xl font-medium italic tracking-[0.02em] text-stone-700 md:text-6xl`}
            >
              {t("hero.title")}
            </h1>
            <p
              className={`${cormorant.className} mb-10 text-lg italic tracking-[0.01em] text-stone-600 md:text-xl`}
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
      </Container>
    </section>
  );
}