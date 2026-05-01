"use client";

import Image from "next/image";
import { Mail, Phone } from 'lucide-react';
import { Container } from './Container';
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-primary/10 bg-body py-12 md:py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* 1. СОЦСЕТИ */}
          <div>
            <h3 className="font-serif text-lg font-medium text-primary">{t("footer.social")}</h3>
            <ul className="mt-4 flex gap-4">
              <li>
                <a href="https://wa.me/77054161614" target="_blank" rel="noreferrer">
                  <Image
                    src="/whatsapp.jpg"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover transition-opacity hover:opacity-80"
                  />
                </a>
              </li>
              <li>
                <a href="https://t.me/kosynki_sharfiki_almaty" target="_blank" rel="noreferrer">
                  <Image
                    src="/telegram.jpg"
                    alt="Telegram"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover transition-opacity hover:opacity-80"
                  />
                </a>
              </li>
            </ul>
          </div>

          {/* 2. ОПЛАТА И ДОСТАВКА */}
          <div>
            <h3 className="font-serif text-lg font-medium text-primary">{t("footer.paymentAndShipping")}</h3>
            <div className="mt-4 space-y-4 text-sm text-primary/70">
              <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-primary/10 transition-all hover:bg-white hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <img
                    src="/kaspi.jpg"
                    alt="Kaspi"
                    className="h-6 w-auto object-contain"
                  />
                  <span className="text-base font-medium text-primary">Kaspi Pay</span>
                </div>
                <a
                  href="tel:+77054161614"
                  className="mt-1 inline-block text-base font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
                >
                  +7(705)-416-16-14
                </a>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium text-base text-primary">{t("footer.worldwideShipping")}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Image
                      src="/kazpost.jpg"
                      alt="Казпочта"
                      width={96}
                      height={24}
                      className="h-8 w-auto object-contain"
                    />
                    <Image
                      src="/cdek.jpg"
                      alt="СДЭК"
                      width={84}
                      height={24}
                      className="h-8 w-auto object-contain"
                    />
                    <Image
                      src="/pek.jpg"
                      alt="ПЭК"
                      width={72}
                      height={24}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. КОНТАКТЫ */}
          <div>
            <h3 className="font-serif text-lg font-medium text-primary">{t("footer.contacts")}</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:nastakozmina4@gmail.com" className="hover:underline">
                  nastakozmina4@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+77054161614" className="hover:underline">
                  +7 (705) 416-16-14
                </a>
              </li>
            </ul>
          </div>

        </div>

       {/* НИЖНЯЯ ПАНЕЛЬ */}
       <div className="mt-12 border-t border-primary/10 pt-8 text-center text-sm text-primary/50">
          <p>{t("footer.rights")}</p>
        </div>
      </Container>
    </footer>
  );
}