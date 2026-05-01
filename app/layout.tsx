import type { Metadata, Viewport } from "next";
import { Marck_Script, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { IntroScreen } from "@/components/IntroScreen";
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

export const metadata: Metadata = {
  title: "Lace & Silk — Косынки и шарфы",
  description: "Эксклюзивные косынки и шарфы из натуральных тканей",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
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
      <body className="min-h-screen bg-body text-primary font-sans antialiased">
        <IntroScreen />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
