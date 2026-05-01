import { Cormorant_Garamond } from "next/font/google";

/** Тот же дисплейный шрифт, что у заголовка и подзаголовка Hero — для пилюль и др. */
export const cormorantDisplay = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
