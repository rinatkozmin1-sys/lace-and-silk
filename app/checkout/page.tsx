"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

/** Заказы оформляются во вложенной шторке корзины; страница оставлена для старых ссылок. */
export default function CheckoutPage() {
  const { openCart } = useCart();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-body px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-serif text-2xl font-medium text-primary">{t("checkout.checkoutTitle")}</h1>
        <p className="mt-4 text-sm leading-relaxed text-primary/65">{t("checkout.pageMovedHint")}</p>
        <Button type="button" className="mt-8 w-full py-3 text-base" onClick={() => openCart()}>
          {t("checkout.openCart")}
        </Button>
        <Link
          href="/"
          scroll={false}
          className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          {t("checkout.home")}
        </Link>
      </div>
    </div>
  );
}
