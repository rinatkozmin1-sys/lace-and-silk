"use client";

import { useEffect } from "react";

/** Разворачивает Telegram Mini App на весь экран после загрузки (скрипт — в root layout). */
export function TelegramMiniAppExpand() {
  useEffect(() => {
    window.Telegram?.WebApp?.expand();
  }, []);

  return null;
}
