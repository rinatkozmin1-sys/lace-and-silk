"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Кнопка «На экран» для Telegram Mini App (Bot API addToHomeScreen). */
export function TelegramAddToHomeButton() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData;
    const hasContext = typeof initData === "string" && initData.length > 0;
    const canPrompt = typeof tg?.addToHomeScreen === "function";
    setVisible(hasContext && canPrompt);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        window.Telegram?.WebApp?.addToHomeScreen?.();
      }}
      className={cn(
        "inline-flex max-w-[9rem] shrink-0 items-center gap-1 rounded-full border border-primary/[0.09]",
        "bg-gradient-to-b from-white/75 to-[#f8f2fa]/90 px-2 py-1.5 text-primary/68 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
        "backdrop-blur-[2px] transition-[color,background-color,border-color] duration-200",
        "hover:border-accent/22 hover:bg-[#faf6fb] hover:text-primary sm:max-w-none sm:gap-1.5 sm:px-2.5 sm:py-1.5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      )}
      aria-label={t("header.installApp")}
      title={t("header.installApp")}
    >
      <Smartphone className="h-3.5 w-3.5 shrink-0 opacity-[0.72] sm:h-4 sm:w-4" strokeWidth={1.75} aria-hidden />
      <span className="truncate text-[10px] font-medium tracking-wide sm:text-[11px]">{t("header.installAppShort")}</span>
    </button>
  );
}
