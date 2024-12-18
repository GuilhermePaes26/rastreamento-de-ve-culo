import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        default: "#242526",
        main: "#ffcd00",
        error: "#f35759",
        success: "#366912",
      },
      textColor: {
        primary: "#242526",
        contrast: "#ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
