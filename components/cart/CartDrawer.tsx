"use client";

import { X } from "lucide-react";
import { useCart, type CartItem as CartLine } from "@/lib/cart";
import { Drawer } from "@/components/ui/Drawer";
import { CartItem } from "./CartItem";
import Link from "next/link";
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
  const {
    items,
    totalPrice,
    isOpen,
    closeCart,
    increment,
    decrement,
    removeItem,
  } = useCart();

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
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {items.length > 0 && (
        <div className="relative z-10 shrink-0 border-t border-primary/10 bg-body p-4">
          <div className="flex items-center justify-between text-lg font-medium">
            <span>{t("cart.total")}</span>
            <PriceFx amountKzt={totalPrice} className="text-lg font-medium" />
          </div>

          <div className="mt-4">
            <KaspiPaymentWidget variant="compact" />
          </div>

          <Link
            href="/checkout"
            onClick={() => closeCart()}
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-primary/15 bg-white py-3 text-sm font-medium text-primary shadow-sm transition-all duration-200 hover:border-accent/35 hover:bg-accent/5"
          >
            Перейти к оформлению
          </Link>

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
    </Drawer>
  );
}
