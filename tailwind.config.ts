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
        brandBg: "#fafaf8",
        brandBorder: "#eeece8",
        brandText: "#1c1c1c",
        brandText2: "#5a5a5a",
        brandText3: "#999999",
        brandAccent: {
          DEFAULT: "#d97706",
          light: "#fff8ed",
          mid: "#f59e0b",
          subtle: "#fef3c7",
          dark: "#b45309"
        },
        brandRed: "#c0182b",
        brandGreen: "#16a34a",
        brandDark: "#1c1c1c",
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      maxWidth: {
        site: "1280px",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        pill: "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        cardHover: "0 4px 16px rgba(0,0,0,0.08)",
        dropdown: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }
    },
  },
  plugins: [],
};
export default config;
