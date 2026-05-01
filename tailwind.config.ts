import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        formBg: "#E8E5F1",
        cardBorder: "#DADCE0",
        accent: "#673AB7",
        accentHover: "#5E35B1",
        muted: "#5F6368",
        required: "#D93025",
      },
      fontFamily: {
        sans: ['"Google Sans"', "Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
