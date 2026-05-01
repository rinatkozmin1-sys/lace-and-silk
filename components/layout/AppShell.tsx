"use client";

import { Suspense } from "react";
import { CartProvider } from "@/lib/cart";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { I18nProvider } from "@/lib/i18n";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <CartProvider>
        <Suspense fallback={<div></div>}>
          <Header />
        </Suspense>
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </I18nProvider>
  );
}
