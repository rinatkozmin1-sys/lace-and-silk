"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  type PanInfo,
} from "framer-motion";
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

/** Закрытие по жесту: px вниз или скорость свайпа (px/s, ось y) */
const DRAG_CLOSE_DISTANCE_PX = 90;
const DRAG_CLOSE_VELOCITY_Y = 520;

/**
 * Нижняя граница drag по оси y (px вниз от покоя).
 * В Motion для шторки нужен bottom > 0, иначе смещение почти не набирается;
 * форма `{ top: 0, bottom: 0 }` из ТЗ здесь заменена рабочим диапазоном.
 */
const SHEET_DRAG_CONSTRAINTS = { top: 0, bottom: 560 } as const;

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

  /** Развёрнутая нижняя шторка оформления (Kaspi и мессенджеры) */
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const dragControls = useDragControls();

  /** Лёгкий тап по ручке без заметного перетаскивания — закрыть шторку */
  const dragGrabRef = useRef<{ startY: number; startT: number } | null>(null);

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

  const closeCheckoutSheet = useCallback(() => {
    setIsCheckoutOpen(false);
  }, []);

  const expandCheckoutSheet = useCallback(() => {
    setIsCheckoutOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setIsCheckoutOpen(false);
    }
  }, [isOpen, items.length]);

  const openOrderLink = (baseUrl: string) => {
    const message = buildOrderMessage(items, totalPrice, lang, currency, rates);
    const url = `${baseUrl}${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const onSheetDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const movedDown = info.offset.y > DRAG_CLOSE_DISTANCE_PX;
      const flickDown = info.velocity.y > DRAG_CLOSE_VELOCITY_Y;
      if (movedDown || flickDown) {
        closeCheckoutSheet();
      }
    },
    [closeCheckoutSheet]
  );

  const startGrabDrag = (e: React.PointerEvent) => {
    dragGrabRef.current = { startY: e.clientY, startT: performance.now() };
    dragControls.start(e);
  };

  const endGrabDrag = (e: React.PointerEvent) => {
    const g = dragGrabRef.current;
    dragGrabRef.current = null;
    if (!g) return;
    const dy = Math.abs(e.clientY - g.startY);
    const dt = performance.now() - g.startT;
    if (dy < 10 && dt < 320) {
      closeCheckoutSheet();
    }
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

        <AnimatePresence>
          {items.length > 0 && isCheckoutOpen ? (
            <>
              <motion.button
                key="cart-checkout-backdrop"
                type="button"
                aria-label={t("checkout.close")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 z-[42] bg-neutral-900/28 backdrop-blur-[1px]"
                onClick={closeCheckoutSheet}
              />

              <div
                key="cart-checkout-sheet-anchor"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[43] flex max-h-[min(88vh,100dvh)] flex-col justify-end"
              >
                <motion.div
                  key="cart-checkout-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="cart-checkout-sheet-title"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{
                    y: "100%",
                    transition: { duration: 0.42, ease: [0.25, 1, 0.3, 1] },
                  }}
                  transition={{
                    type: "spring",
                    damping: 34,
                    stiffness: 340,
                    mass: 0.88,
                  }}
                  drag="y"
                  dragControls={dragControls}
                  dragListener={false}
                  dragConstraints={SHEET_DRAG_CONSTRAINTS}
                  dragElastic={{ top: 0, bottom: 0.14 }}
                  dragMomentum={false}
                  dragTransition={{
                    bounceStiffness: 440,
                    bounceDamping: 30,
                  }}
                  onDragEnd={onSheetDragEnd}
                  className={cn(
                    "pointer-events-auto flex max-h-[min(88vh,100dvh)] w-full flex-col overflow-hidden rounded-t-3xl bg-white",
                    "shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06]"
                  )}
                >
                  <div className="sr-only" id="cart-checkout-sheet-title">
                    {t("checkout.checkoutTitle")}
                  </div>

                  <div
                    role="presentation"
                    className="flex shrink-0 touch-none cursor-grab flex-col items-center border-b border-primary/[0.06] bg-white pb-2 pt-3 outline-none active:cursor-grabbing"
                    onPointerDown={startGrabDrag}
                    onPointerUp={endGrabDrag}
                    onPointerCancel={() => {
                      dragGrabRef.current = null;
                    }}
                  >
                    <span className="mx-auto h-1.5 w-12 rounded-full bg-gray-300/70" aria-hidden />
                    <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-primary/35">
                      {t("checkout.swipeDownHint")}
                    </span>
                  </div>

                  <div
                    className="flex shrink-0 touch-none cursor-grab items-center justify-between border-b border-primary/[0.05] bg-white px-4 pb-3 pt-3 active:cursor-grabbing"
                    onPointerDown={startGrabDrag}
                    onPointerUp={endGrabDrag}
                    onPointerCancel={() => {
                      dragGrabRef.current = null;
                    }}
                  >
                    <span className="text-lg font-medium text-primary">{t("cart.total")}</span>
                    <PriceFx amountKzt={totalPrice} className="text-lg font-medium" />
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
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
                </motion.div>
              </div>
            </>
          ) : null}
        </AnimatePresence>

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
