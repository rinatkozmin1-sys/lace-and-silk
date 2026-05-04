import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Marck_Script, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { IntroScreen } from "@/components/IntroScreen";
import { TelegramMiniAppExpand } from "@/components/TelegramMiniAppExpand";
import { getPublicShopUrl } from "@/lib/siteUrl";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const productFont = Marck_Script({
  subsets: ["latin", "cyrillic"],
  variable: "--font-product",
  weight: "400",
  display: "swap",
});

/** Пудровый фон сайта (tailwind `body`) — строка состояния и PWA в том же тоне */
const THEME_COLOR = "#F4E8F6";

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

/** Абсолютные URL иконок (Safari / «На экран» иногда надёжнее берут полный путь). */
const ICON = "/icon.png";

export const metadata: Metadata = {
  metadataBase: new URL(getPublicShopUrl()),
  title: "Lace & Silk — Косынки и шарфы",
  description: "Эксклюзивные косынки и шарфы из натуральных тканей",
  icons: {
    icon: [
      { url: ICON, sizes: "32x32", type: "image/png" },
      { url: ICON, sizes: "192x192", type: "image/png" },
      { url: ICON, sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: ICON, type: "image/png" }],
    apple: [
      { url: ICON, sizes: "180x180", type: "image/png" },
      { url: ICON, sizes: "152x152", type: "image/png" },
      { url: ICON, sizes: "167x167", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Lace & Silk",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${playfair.variable} ${sourceSans.variable} ${productFont.variable}`}
    >
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-body text-primary font-sans antialiased">
        <TelegramMiniAppExpand />
        <IntroScreen />
        <AppShell>{children}</AppShell>
        <Script
          src="https://code.jivo.ru/widget/w1bRqjEKZI"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
