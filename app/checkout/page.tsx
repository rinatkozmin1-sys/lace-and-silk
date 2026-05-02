"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, X } from "lucide-react";
import { KaspiPaymentWidget } from "@/components/payment/KaspiPaymentWidget";
import { CartItem } from "@/components/cart/CartItem";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { PriceFx } from "@/components/ui/PriceFx";
import { IconButton } from "@/components/ui/IconButton";

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    items,
    totalPrice,
    openCart,
    increment,
    decrement,
    removeItem,
  } = useCart();

  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<"pickup" | "courier" | "post">("pickup");

  return (
    <div className="min-h-screen bg-body pb-16 pt-6 sm:pb-20 sm:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl border border-primary/10 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-5 sm:py-4">
          <IconButton
            aria-label={t("checkout.close")}
            onClick={() => router.back()}
            className="absolute right-3 top-3 text-primary/55 hover:text-primary sm:right-4 sm:top-4"
          >
            <X className="h-5 w-5" />
          </IconButton>

          <div className="flex flex-wrap items-center gap-2 pr-10 sm:gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white/90 px-3.5 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:border-primary/25 hover:bg-stone-50/95"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 opacity-80" />
              {t("checkout.back")}
            </button>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white/90 px-3.5 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:border-accent/35 hover:bg-accent/[0.06]"
            >
              <ShoppingBag className="h-4 w-4 shrink-0 opacity-80" />
              {t("checkout.openCart")}
            </button>
            <Link
              href="/"
              scroll={false}
              className="inline-flex items-center rounded-full border border-transparent bg-primary/[0.06] px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/[0.1]"
            >
              {t("checkout.home")}
            </Link>
          </div>
        </div>

        <h1 className="mt-6 font-serif text-2xl font-medium tracking-tight text-primary sm:mt-8 sm:text-3xl">
          Оформление заказа
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary/60">
          Укажите контакты и способ доставки. Оплату можно провести через Kaspi — виджет ниже или справа на больших экранах.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="flex flex-col gap-8">
            <section
              className={cn(
                "rounded-2xl border border-primary/10 bg-white/85 p-4 shadow-sm sm:p-6",
                "ring-1 ring-primary/[0.04]"
              )}
              aria-labelledby="checkout-order-heading"
            >
              <div className="flex items-baseline justify-between gap-3 border-b border-primary/10 pb-4">
                <h2
                  id="checkout-order-heading"
                  className="font-product text-lg font-medium text-primary sm:text-xl"
                >
                  {t("checkout.yourOrder")}
                </h2>
                {items.length > 0 && (
                  <span className="text-xs font-medium uppercase tracking-wide text-primary/45">
                    {items.reduce((n, i) => n + i.quantity, 0)} шт.
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm leading-relaxed text-primary/65">{t("checkout.emptyOrder")}</p>
                  <Link
                    href="/"
                    scroll={false}
                    className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                  >
                    {t("checkout.browseCatalog")}
                  </Link>
                </div>
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
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-primary/10 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-primary/45">
                      {t("cart.total")}
                    </p>
                    <PriceFx
                      amountKzt={totalPrice}
                      className="font-product text-xl font-medium text-primary sm:text-2xl"
                    />
                  </div>
                </>
              )}
            </section>

            <div className="space-y-8">
              <div>
                <label htmlFor="checkout-email" className="block text-sm font-medium text-primary/80">
                  E-mail
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-2 w-full rounded-xl border border-primary/12 bg-white px-4 py-3 text-sm text-primary shadow-sm transition-shadow duration-200 placeholder:text-primary/35 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/25"
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-primary/80">Способ доставки</legend>
                <div className="space-y-2 rounded-xl border border-primary/10 bg-white/80 p-4 shadow-sm">
                  {(
                    [
                      { id: "pickup" as const, label: "Самовывоз", hint: "Согласуем адрес в мессенджере" },
                      { id: "courier" as const, label: "Курьер по городу", hint: "Стоимость уточним после заказа" },
                      { id: "post" as const, label: "Почта / СДЭК", hint: "Отправка по Казахстану и РФ" },
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
                        name="delivery"
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
            </div>

            <div className="lg:hidden">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-primary/50">
                {t("checkout.paymentHeading")}
              </h2>
              <KaspiPaymentWidget variant="checkout" />
            </div>
          </div>

          <div className="hidden lg:block">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-primary/50">
              {t("checkout.paymentHeading")}
            </h2>
            <KaspiPaymentWidget variant="checkout" />
          </div>
        </div>
      </div>
    </div>
  );
}
