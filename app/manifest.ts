import type { MetadataRoute } from "next";

/** PWA / «Добавить на экран»: иконки — `public/icon.png` (используйте квадрат ≥512 px для лучшего качества). */
const ICON = "/icon.png";

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
        src: ICON,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: ICON,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: ICON,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
