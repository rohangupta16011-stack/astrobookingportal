import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFBF0",
        surface: "#FFFFFF",
        ink: "#2B1810",
        inkSoft: "#4A3829",
        muted: "#8A7560",
        border: "#F0E4C4",
        sun: "#F5B700",
        sunLight: "#FFE89B",
        sunDeep: "#C99000",
        amber: "#E89B00",
        cream: "#FFF5D6",
        danger: "#C0392B",
        success: "#2E7D32",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "sun-grad": "linear-gradient(135deg, #F5B700 0%, #FFE89B 50%, #E89B00 100%)",
        "canvas-grad": "radial-gradient(ellipse at top, #FFF5D6 0%, #FFFBF0 60%, #FFFFFF 100%)",
        "card-grad": "linear-gradient(145deg, #FFFFFF 0%, #FFFCF1 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(245,183,0,0.18)",
        glowStrong: "0 8px 30px rgba(245,183,0,0.35)",
        card: "0 8px 30px -10px rgba(43,24,16,0.12), 0 2px 6px -2px rgba(43,24,16,0.06)",
        soft: "0 2px 8px rgba(43,24,16,0.05)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
