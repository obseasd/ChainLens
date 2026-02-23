import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3fde8",
          100: "#e4fac8",
          200: "#c9f597",
          300: "#a8eb5a",
          400: "#88cc10",
          500: "#7ab80e",
          600: "#5f900b",
          700: "#496e08",
          800: "#3a5807",
          900: "#2a3f05",
        },
      },
    },
  },
  plugins: [],
};

export default config;
