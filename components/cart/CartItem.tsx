"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem as CartItemType } from "@/lib/cart";
import { IconButton } from "@/components/ui/IconButton";
import { PriceFx } from "@/components/ui/PriceFx";
import { ImageModal } from "@/components/ui/ImageModal";
import { useI18n } from "@/lib/i18n";
import { getCategoryLabel } from "@/lib/categoryLabels";

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  const { lang, t } = useI18n();
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;
  const name = product.name[lang] ?? product.name.ru;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className="flex gap-4 border-b border-primary/10 py-4">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={t("cart.enlargeImage")}
        className="group relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-primary/5 text-left shadow-sm ring-1 ring-black/[0.04] transition-shadow duration-300 ease-out hover:shadow-md hover:ring-primary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <Image
          src={product.image}
          alt=""
          fill
          unoptimized
          sizes="64px"
          className="object-cover transition duration-300 ease-out group-hover:scale-105 group-hover:opacity-90"
          aria-hidden
        />
      </button>
      <ImageModal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={product.image}
        alt={name}
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-product text-xl font-medium leading-tight text-primary md:text-2xl">
          {name}
        </h3>
        <p className="text-sm text-primary/70">{getCategoryLabel(product.material, lang)}</p>
        <div className="mt-1 space-y-0.5">
          <div className="text-primary">
            <PriceFx amountKzt={product.price} className="text-sm md:text-base" />
          </div>
          {quantity > 1 && (
            <div className="text-sm text-primary/70">
              {t("cart.sum")}:{" "}
              <PriceFx amountKzt={lineTotal} className="text-sm font-medium text-primary/90" />
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-primary/20">
            <button
              type="button"
              onClick={onDecrement}
              aria-label={t("cart.decreaseQuantity")}
              className="flex h-8 w-8 items-center justify-center text-primary hover:bg-primary/5"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              aria-label={t("cart.increaseQuantity")}
              className="flex h-8 w-8 items-center justify-center text-primary hover:bg-primary/5"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <IconButton
            aria-label={t("cart.removeItem")}
            onClick={onRemove}
            className="ml-auto text-primary/70 hover:text-primary"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
