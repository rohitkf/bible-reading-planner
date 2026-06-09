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
        bible: {
          bg: "#11100c",
          surface: "#1a1814",
          card: "#1e1c15",
          border: "#2c2920",
          "border-light": "#3d3a2c",
          gold: "#c8963c",
          "gold-light": "#d4a848",
          "gold-muted": "#7a5c22",
          text: "#ddd5b8",
          muted: "#8a8068",
          dim: "#534e42",
          success: "#4a8a60",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-crimson)", "Georgia", "serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
