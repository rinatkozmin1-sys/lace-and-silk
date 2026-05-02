"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const SHEET_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const SHEET_TRANSITION = `transform 360ms ${SHEET_EASE}`;
const DRAG_CLOSE_PX = 88;

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

  /** Нижняя шторка с Kaspi и мессенджерами: false — только компактная панель «Итого + Оформить» */
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);

  const dragStartY = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const sheetClosingIntentRef = useRef(false);

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
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  useEffect(() => {
    if (!isOpen) setIsCheckoutVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (items.length === 0) setIsCheckoutVisible(false);
  }, [items.length]);

  const closeCheckout = () => setIsCheckoutVisible(false);

  const collapseCheckoutSheet = useCallback(() => {
    sheetClosingIntentRef.current = true;
    setSheetExpanded(false);
    setDragOffset(0);
    dragStartY.current = null;
    setIsDraggingHandle(false);
  }, []);

  const expandCheckoutSheet = useCallback(() => {
    sheetClosingIntentRef.current = false;
    setIsCheckoutOpen(true);
    setDragOffset(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setSheetExpanded(true));
    });
  }, []);

  const onSheetTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (!sheetClosingIntentRef.current) return;
    sheetClosingIntentRef.current = false;
    setIsCheckoutOpen(false);
    setDragOffset(0);
  }, []);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      sheetClosingIntentRef.current = false;
      setSheetExpanded(false);
      setIsCheckoutOpen(false);
      setDragOffset(0);
      dragStartY.current = null;
      setIsDraggingHandle(false);
    }
  }, [isOpen, items.length]);

  const openOrderLink = (baseUrl: string) => {
    const message = buildOrderMessage(items, totalPrice, lang, currency, rates);
    const url = `${baseUrl}${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleHandleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0]?.clientY ?? null;
    setIsDraggingHandle(true);
  };

  const handleHandleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const y = e.touches[0]?.clientY;
    if (y === undefined) return;
    const dy = y - dragStartY.current;
    setDragOffset(Math.max(0, dy));
  };

  const handleHandleTouchEnd = () => {
    dragStartY.current = null;
    const d = dragOffsetRef.current;
    setIsDraggingHandle(false);
    if (d > DRAG_CLOSE_PX) {
      collapseCheckoutSheet();
      return;
    }
    if (d > 0) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setDragOffset(0));
      });
    }
  };

  let sheetTransform: string;
  if (!sheetExpanded) {
    sheetTransform = "translateY(100%)";
  } else if (dragOffset > 0 || isDraggingHandle) {
    sheetTransform = `translateY(${dragOffset}px)`;
  } else {
    sheetTransform = "translateY(0)";
  }

  const transformTransition = isDraggingHandle ? "none" : SHEET_TRANSITION;

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

          {items.length > 0 && !isCheckoutOpen && (
            <button
              type="button"
              onClick={expandCheckoutSheet}
              className={cn(
                "relative z-10 shrink-0 rounded-t-3xl bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 text-left",
                "shadow-[0_-4px_14px_-4px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.05]",
                "transition-[transform,box-shadow] duration-300 ease-out active:scale-[0.995]"
              )}
            >
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-gray-300/45" aria-hidden />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-primary/45">
                    {t("cart.total")}
                  </p>
                  <PriceFx
                    amountKzt={totalPrice}
                    className="font-product text-xl font-medium text-primary"
                  />
                </div>
                <span className="shrink-0 rounded-full bg-primary/[0.08] px-4 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/10">
                  {t("checkout.placeOrder")}
                </span>
              </div>
            </button>
          )}
        </div>

        {items.length > 0 && isCheckoutOpen && (
          <>
            <button
              type="button"
              aria-label={t("checkout.close")}
              className={cn(
                "absolute inset-0 z-[42] bg-neutral-900/28 backdrop-blur-[1px] transition-opacity duration-300 ease-out",
                sheetExpanded ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              onClick={collapseCheckoutSheet}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[43] flex max-h-[min(88vh,100dvh)] flex-col justify-end">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-checkout-sheet-title"
                className={cn(
                  "pointer-events-auto flex max-h-[min(88vh,100dvh)] flex-col overflow-hidden rounded-t-3xl bg-white",
                  "shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06]"
                )}
                style={{
                  transform: sheetTransform,
                  transition: transformTransition,
                }}
                onTransitionEnd={onSheetTransitionEnd}
              >
                <div className="sr-only" id="cart-checkout-sheet-title">
                  {t("checkout.checkoutTitle")}
                </div>

                <button
                  type="button"
                  className="flex w-full shrink-0 flex-col items-center border-b border-primary/[0.06] bg-white pb-2 pt-3 outline-none transition-colors hover:bg-stone-50/90 active:bg-stone-100/80"
                  aria-label={t("checkout.close")}
                  onClick={collapseCheckoutSheet}
                  onTouchStart={handleHandleTouchStart}
                  onTouchMove={handleHandleTouchMove}
                  onTouchEnd={handleHandleTouchEnd}
                >
                  <span className="pointer-events-none mx-auto h-1.5 w-12 rounded-full bg-gray-300/70" />
                  <span className="pointer-events-none mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-primary/35">
                    {t("checkout.swipeDownHint")}
                  </span>
                </button>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-1">
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
              </div>
            </div>
          </>
        )}

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
