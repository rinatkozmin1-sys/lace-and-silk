"use client";

import Image from "next/image";
import { Product } from "@/lib/products";
import { PriceFx } from "@/components/ui/PriceFx";
import { useI18n } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  setSelectedImage: (url: string | null) => void;
}

export function ProductCard({ product, onAddToCart, setSelectedImage }: ProductCardProps) {
  const { lang, t } = useI18n();
  const name = product.name[lang] ?? product.name.ru;
  return (
    <div className="group flex flex-col">
      {/* Изображение */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100">
        {product.image && (
          <button
            type="button"
            onClick={() => setSelectedImage(product.image)}
            className="relative block h-full w-full cursor-pointer overflow-hidden p-0 text-left"
            aria-label="Увеличить фото"
          >
            <Image
              src={product.image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={100}
            />
          </button>
        )}
      </div>

      {/* Инфо */}
      <div className="mt-4 space-y-1">
        <h3 className="font-product text-sm font-medium leading-tight text-foreground md:text-base lg:text-lg">
          {name}
        </h3>

        <PriceFx amountKzt={product.price} className="text-xs md:text-sm" />
      </div>

      {/* Кнопка: светлая рамка и рабочая логика */}
      <button
        onClick={() => onAddToCart(product)}
        className="mt-4 w-full py-2 px-4 bg-transparent border border-primary/20 text-primary text-sm font-medium rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
      >
        {t("catalog.addToCart")}
      </button>
    </div>
  );
}