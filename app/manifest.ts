import type { MetadataRoute } from "next";

/** Файл: `public/icon-v2.png`; абсолютный URL + ?v= для сброса кэша клиента (Telegram). */
const ICON_ABSOLUTE = "https://lace-and-silk.vercel.app/icon-v2.png?v=2";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A&A",
    short_name: "A&A",
    description: "Косынки, шарфы и аксессуары — Lace & Silk",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F4E8F6",
    theme_color: "#F4E8F6",
    icons: [
      {
        src: ICON_ABSOLUTE,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: ICON_ABSOLUTE,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: ICON_ABSOLUTE,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
