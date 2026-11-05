import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        brandBg: "#fbf8f4",
        brandBorder: "#ebe3d8",
        brandText: "#18110f",
        brandText2: "#574b45",
        brandText3: "#8c7e77",
        // Aligned directly with the VISHNU Crimson Red logo + Coastal Saffron Gold highlights
        brandAccent: {
          DEFAULT: "#c81d25",
          light: "#fff4f2",
          mid: "#dc2626",
          subtle: "#fde6e4",
          dark: "#991b1b",
        },
        brandGold: {
          DEFAULT: "#d97706",
          light: "#fffBEB",
          mid: "#f59e0b",
        },
        brandRed: "#c81d25",
        brandGreen: "#15803d",
        brandDark: "#160f0d",
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
        price: ["'Inter'", "'Poppins'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        num: ["'Inter'", "'Poppins'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
      borderRadius: {
        card: "16px",
        button: "10px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 10px rgba(24, 17, 15, 0.04), 0 1px 3px rgba(24, 17, 15, 0.03)",
        cardHover: "0 14px 30px -6px rgba(200, 29, 37, 0.12), 0 4px 12px -2px rgba(24, 17, 15, 0.06)",
        dropdown: "0 16px 36px -6px rgba(24, 17, 15, 0.14), 0 8px 14px -6px rgba(24, 17, 15, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
