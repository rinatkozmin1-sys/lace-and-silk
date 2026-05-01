"use client";

import { X } from "lucide-react";
import { useCart, type CartItem as CartLine } from "@/lib/cart";
import { Drawer } from "@/components/ui/Drawer";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useFxRates } from "@/lib/useFxRates";
import type { FxCurrency } from "@/components/ui/PriceFx";
import { useMemo, useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";

function buildOrderMessage(items: CartLine[], totalPrice: number, lang: Lang) {
  const orderLines = items
    .map((item) => {
      const name = item.product.name[lang] ?? item.product.name.ru;
      const unit = item.product.price.toLocaleString("ru-KZ");
      return `- ${name} (${unit} ₸) × ${item.quantity}`;
    })
    .join("%0A");
  const total = totalPrice.toLocaleString("ru-KZ");
  return `Здравствуйте! Хочу оформить заказ:%0A${orderLines}%0A%0AИтого: ${total} ₸`;
}

export function CartDrawer() {
  const { t, lang } = useI18n();
  const {
    items,
    totalPrice,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
  } = useCart();
  const fx = useFxRates();
  const [selectedById, setSelectedById] = useState<Record<string, FxCurrency | null>>({});

  const totalConverted = useMemo(() => {
    const anySelected = Object.values(selectedById).find(Boolean) ?? null;
    if (!anySelected || !fx.rates) return null;
    const rate = fx.rates[anySelected];
    return { currency: anySelected, value: totalPrice * rate };
  }, [fx.rates, selectedById, totalPrice]);

  return (
    <Drawer open={isOpen} onClose={closeCart} title={t("cart.title")} side="right">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-primary/10 px-4">
        <h2 className="font-serif text-lg font-medium text-primary">
          {t("cart.title")}
        </h2>
        <IconButton aria-label="Закрыть" onClick={closeCart}>
          <X className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <p className="py-12 text-center text-primary/70">
            {t("cart.empty")}
          </p>
        ) : (
          <ul className="py-4">
            {items.map((item) => (
              <li key={item.product.id}>
                <CartItem
                  item={item}
                  onIncrement={() => increment(item.product.id)}
                  onDecrement={() => decrement(item.product.id)}
                  onRemove={() => removeItem(item.product.id)}
                  fxRates={fx.rates}
                  selectedCurrency={selectedById[item.product.id] ?? null}
                  onSelectCurrency={(c) =>
                    setSelectedById((prev) => ({ ...prev, [item.product.id]: c }))
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      {items.length > 0 && (
          <div className="shrink-0 border-t border-primary/10 bg-body p-4">
            <div className="flex items-center justify-between text-lg font-medium">
              <span>{t("cart.total")}</span>
              <span className="text-right">
                <div>{totalPrice.toLocaleString("ru-KZ")} ₸</div>
                {totalConverted && (
                  <div className="mt-0.5 text-xs text-primary/70 tabular-nums">
                    ({new Intl.NumberFormat(totalConverted.currency === "RUB" ? "ru-RU" : "en-US", {
                      style: "currency",
                      currency: totalConverted.currency,
                      maximumFractionDigits: totalConverted.currency === "RUB" ? 0 : 2,
                    }).format(totalConverted.value)})
                  </div>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-4 w-full">
              <Button 
                className="w-full bg-[#25D366] hover:bg-[#20b858] text-white py-3 text-base transition-colors" 
                onClick={() => {
                  const message = buildOrderMessage(items, totalPrice, lang);
                  window.open("https://wa.me/77054161614?text=" + message, "_blank");
                }}
              >
                {t("cart.orderWhatsapp")}
              </Button>

              <Button 
                className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white py-3 text-base transition-colors" 
                onClick={() => {
                  const message = buildOrderMessage(items, totalPrice, lang);
                  window.open("https://t.me/Шарфики_Косынки?text=" + message, "_blank");
                }}
              >
                {t("cart.orderTelegram")}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    );
  }