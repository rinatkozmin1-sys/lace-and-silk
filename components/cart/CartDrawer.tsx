"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCart, type CartItem as CartLine } from "@/lib/cart";
import { Drawer } from "@/components/ui/Drawer";
import { CartItem } from "./CartItem";
import { OverlayCheckout } from "./OverlayCheckout";
import { KaspiPaymentWidget } from "@/components/payment/KaspiPaymentWidget";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { PriceFx } from "@/components/ui/PriceFx";
import { CurrencySwitcher } from "@/components/layout/CurrencySwitcher";
import { formatFxAmount } from "@/lib/fxFormat";
import type { FxRates } from "@/lib/fx";
import { useFxCurrency, type FxCurrency } from "@/lib/fxCurrency";
import { useFxRates } from "@/lib/useFxRates";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function buildOrderMessage(
  items: CartLine[],
  totalPrice: number,
  lang: Lang,
  currency: FxCurrency,
  rates: FxRates | null
) {
  const orderLines = items
    .map((item) => {
      const name = item.product.name[lang] ?? item.product.name.ru;
      const unit = formatFxAmount(item.product.price, currency, rates);
      return `- ${name} (${unit}) × ${item.quantity}`;
    })
    .join("\n");
  const total = formatFxAmount(totalPrice, currency, rates);
  return `Здравствуйте! Хочу оформить заказ:\n${orderLines}\n\nИтого: ${total}`;
}

export function CartDrawer() {
  const { t, lang } = useI18n();
  const { currency } = useFxCurrency();
  const { rates } = useFxRates();
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  const {
    items,
    totalPrice,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
  } = useCart();

  useEffect(() => {
    if (!isOpen) setIsCheckoutVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (items.length === 0) setIsCheckoutVisible(false);
  }, [items.length]);

  const closeCheckout = () => setIsCheckoutVisible(false);

  const openOrderLink = (baseUrl: string) => {
    const message = buildOrderMessage(items, totalPrice, lang, currency, rates);
    const url = `${baseUrl}${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <Drawer open={isOpen} onClose={closeCart} title={t("cart.title")} side="right">
      <div className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-primary/10 px-4">
        <h2 className="min-w-0 flex-1 truncate font-serif text-lg font-medium text-primary">
          {t("cart.title")}
        </h2>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="hidden whitespace-nowrap text-xs font-medium text-primary/70 sm:inline">
            {t("cart.currency")}
          </span>
          <CurrencySwitcher />
          <IconButton aria-label="Закрыть" onClick={closeCart}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          role="presentation"
          className={cn(
            "absolute inset-0 z-[38] bg-primary/45 transition-opacity duration-300 ease-out",
            isCheckoutVisible ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={closeCheckout}
          aria-hidden={!isCheckoutVisible}
        />

        <div
          className={cn(
            "relative z-0 flex min-h-0 flex-1 flex-col transition-opacity duration-300 ease-out",
            isCheckoutVisible && "pointer-events-none opacity-[0.38]"
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
            {items.length === 0 ? (
              <p className="py-12 text-center text-primary/70">{t("cart.empty")}</p>
            ) : (
              <ul className="py-4 pb-6">
                {items.map((item) => (
                  <li key={item.product.id}>
                    <CartItem
                      item={item}
                      onIncrement={() => increment(item.product.id)}
                      onDecrement={() => decrement(item.product.id)}
                      onRemove={() => removeItem(item.product.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div
              className={cn(
                "relative z-10 shrink-0 rounded-t-3xl bg-white px-4 pb-5 pt-3",
                "shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04]"
              )}
            >
              <div
                className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300/60"
                aria-hidden
              />
              <div className="flex items-center justify-between text-lg font-medium text-primary">
                <span>{t("cart.total")}</span>
                <PriceFx amountKzt={totalPrice} className="text-lg font-medium" />
              </div>

              <div className="mt-4">
                <KaspiPaymentWidget variant="compact" />
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutVisible(true)}
                className="mt-4 flex w-full items-center justify-center rounded-xl border border-primary/15 bg-white py-3 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:border-accent/35 hover:bg-accent/5"
              >
                {t("checkout.placeOrder")}
              </button>

              <div className="mt-4 flex w-full flex-col gap-3">
                <Button
                  className="w-full bg-[#25D366] py-3 text-base text-white transition-colors hover:bg-[#20b858]"
                  onClick={() => openOrderLink("https://wa.me/77054161614?text=")}
                >
                  {t("cart.orderWhatsapp")}
                </Button>

                <Button
                  className="w-full bg-[#0088cc] py-3 text-base text-white transition-colors hover:bg-[#0077b3]"
                  onClick={() => openOrderLink("https://t.me/Шарфики_Косынки?text=")}
                >
                  {t("cart.orderTelegram")}
                </Button>
              </div>
            </div>
          )}
        </div>

        <OverlayCheckout
          open={isCheckoutVisible}
          onBackToCart={closeCheckout}
          onCloseCart={() => {
            closeCheckout();
            closeCart();
          }}
          onBeforeNavigateHome={() => {
            closeCheckout();
            closeCart();
          }}
        />
      </div>
    </Drawer>
  );
}
