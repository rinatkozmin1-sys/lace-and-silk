"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { CartItem } from "@/components/cart/CartItem";
import { KaspiPaymentWidget } from "@/components/payment/KaspiPaymentWidget";
import { PriceFx } from "@/components/ui/PriceFx";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const TRANSITION_MS = 320;

type OverlayCheckoutProps = {
  open: boolean;
  onBackToCart: () => void;
  onCloseCart: () => void;
  onBeforeNavigateHome: () => void;
};

export function OverlayCheckout({
  open,
  onBackToCart,
  onCloseCart,
  onBeforeNavigateHome,
}: OverlayCheckoutProps) {
  const { t } = useI18n();
  const {
    items,
    totalPrice,
    increment,
    decrement,
    removeItem,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<"pickup" | "courier" | "post">("pickup");

  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setEntered(true));
      });
      return () => window.cancelAnimationFrame(id);
    }
    setEntered(false);
    const t = window.setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  const onHandleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  }, []);

  const onHandleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return;
      const y = e.changedTouches[0]?.clientY;
      if (y !== undefined && y - touchStartY.current > 56) {
        onBackToCart();
      }
      touchStartY.current = null;
    },
    [onBackToCart]
  );

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[45] flex flex-col justify-end"
      aria-hidden={!open}
    >
      <div
        className={cn(
          "pointer-events-auto flex max-h-[92%] min-h-0 w-full flex-col overflow-hidden rounded-t-2xl border border-white/70 bg-gradient-to-b from-[#f4f9fd] to-[#e8f2fa] shadow-[0_-12px_48px_rgba(28,52,84,0.14)] transition-transform duration-300 ease-out",
          entered ? "translate-y-0" : "translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-checkout-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 flex-col items-center border-b border-primary/[0.08] bg-white/40 pb-2 pt-3"
          onTouchStart={onHandleTouchStart}
          onTouchEnd={onHandleTouchEnd}
        >
          <div
            className="h-1 w-11 rounded-full bg-primary/25"
            aria-hidden
          />
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-primary/35">
            {t("checkout.swipeDownHint")}
          </p>
        </div>

        <nav className="relative flex shrink-0 items-center gap-2 border-b border-primary/[0.06] bg-white/30 px-3 py-2.5">
          <button
            type="button"
            onClick={onBackToCart}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4 opacity-80" aria-hidden />
            {t("checkout.backToCart")}
          </button>

          <Link
            href="/"
            scroll={false}
            onClick={onBeforeNavigateHome}
            className="absolute left-1/2 top-1/2 max-w-[46%] -translate-x-1/2 -translate-y-1/2 truncate text-center text-sm font-medium text-primary underline-offset-2 transition-colors hover:text-accent hover:underline"
          >
            {t("checkout.returnHome")}
          </Link>

          <IconButton
            aria-label={t("checkout.close")}
            onClick={onCloseCart}
            className="ml-auto shrink-0 text-primary/55 hover:text-primary"
          >
            <X className="h-5 w-5" />
          </IconButton>
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-4">
          <h2
            id="overlay-checkout-title"
            className="font-serif text-lg font-medium tracking-tight text-primary"
          >
            {t("checkout.checkoutTitle")}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-primary/58">
            {t("checkout.checkoutIntro")}
          </p>

          <section
            className={cn(
              "mt-5 rounded-2xl border border-primary/10 bg-white/75 p-4 shadow-sm",
              "ring-1 ring-primary/[0.03]"
            )}
            aria-labelledby="overlay-order-heading"
          >
            <div className="flex items-baseline justify-between gap-2 border-b border-primary/10 pb-3">
              <h3 id="overlay-order-heading" className="font-product text-base font-medium text-primary">
                {t("checkout.yourOrder")}
              </h3>
              {items.length > 0 && (
                <span className="text-[11px] font-medium uppercase tracking-wide text-primary/45">
                  {items.reduce((n, i) => n + i.quantity, 0)} {t("checkout.piecesSuffix")}
                </span>
              )}
            </div>

            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-primary/65">{t("checkout.emptyOrder")}</p>
            ) : (
              <>
                <ul className="mt-1">
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
                <div className="mt-3 flex items-end justify-between border-t border-primary/10 pt-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-primary/45">
                    {t("cart.total")}
                  </span>
                  <PriceFx
                    amountKzt={totalPrice}
                    className="font-product text-lg font-medium text-primary"
                  />
                </div>
              </>
            )}
          </section>

          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="overlay-checkout-email" className="block text-sm font-medium text-primary/80">
                {t("checkout.emailLabel")}
              </label>
              <input
                id="overlay-checkout-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("checkout.emailPlaceholder")}
                className="mt-2 w-full rounded-xl border border-primary/12 bg-white px-4 py-3 text-sm text-primary shadow-sm placeholder:text-primary/35 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-primary/80">{t("checkout.deliveryMethod")}</legend>
              <div className="space-y-2 rounded-xl border border-primary/10 bg-white/85 p-4 shadow-sm">
                {(
                  [
                    {
                      id: "pickup" as const,
                      label: t("checkout.deliveryPickup"),
                      hint: t("checkout.deliveryPickupHint"),
                    },
                    {
                      id: "courier" as const,
                      label: t("checkout.deliveryCourier"),
                      hint: t("checkout.deliveryCourierHint"),
                    },
                    {
                      id: "post" as const,
                      label: t("checkout.deliveryPost"),
                      hint: t("checkout.deliveryPostHint"),
                    },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-lg border p-3 transition-all duration-200",
                      delivery === opt.id
                        ? "border-accent/40 bg-accent/5 shadow-sm"
                        : "border-transparent hover:border-primary/10 hover:bg-body/80"
                    )}
                  >
                    <input
                      type="radio"
                      name="overlay-delivery"
                      value={opt.id}
                      checked={delivery === opt.id}
                      onChange={() => setDelivery(opt.id)}
                      className="mt-1 h-4 w-4 shrink-0 border-primary/25 text-accent focus:ring-accent/40"
                    />
                    <span>
                      <span className="block text-sm font-medium text-primary">{opt.label}</span>
                      <span className="mt-0.5 block text-xs text-primary/55">{opt.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-primary/50">
                {t("checkout.paymentHeading")}
              </h3>
              <KaspiPaymentWidget variant="checkout" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
