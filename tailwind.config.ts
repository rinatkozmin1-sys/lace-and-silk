import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Нежно розово‑сиреневый пастельный фон
        body: "#F4E8F6",
        primary: "#1D1D1F",
        accent: "#D8A7B1",
        // Кремовый для кнопок/поверхностей
        cream: "#F6F0E6",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        product: ["var(--font-product)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
