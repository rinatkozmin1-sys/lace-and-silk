"use client";

import { useState } from "react";
import Link from "next/link";
import { KaspiPaymentWidget } from "@/components/payment/KaspiPaymentWidget";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<"pickup" | "courier" | "post">("pickup");

  return (
    <div className="min-h-screen bg-body pb-16 pt-8 sm:pb-20 sm:pt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-primary/55">
          <Link href="/" className="transition-colors hover:text-primary">
            Главная
          </Link>
          <span className="mx-2 text-primary/35">/</span>
          <span className="text-primary/75">Оформление заказа</span>
        </nav>

        <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Оформление заказа
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary/60">
          Укажите контакты и способ доставки. Оплату можно провести через Kaspi — виджет справа.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
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

          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-primary/50">Оплата</h2>
            <KaspiPaymentWidget variant="checkout" />
          </div>
        </div>
      </div>
    </div>
  );
}
