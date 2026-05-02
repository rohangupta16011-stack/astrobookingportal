import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0E0524",
        cosmos: "#1A0B3D",
        royal: "#3D1A78",
        plum: "#5B2A99",
        gold: "#D4AF37",
        goldLight: "#F0D77A",
        cream: "#F8F2E4",
        lavender: "#C9B6E4",
        muted: "#8A7BA8",
        danger: "#FF6B8A",
        success: "#7AE8A6",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-grad": "linear-gradient(135deg, #D4AF37 0%, #F0D77A 50%, #B8902C 100%)",
        "midnight-grad": "linear-gradient(180deg, #0E0524 0%, #1A0B3D 50%, #0E0524 100%)",
        "card-grad": "linear-gradient(145deg, rgba(91,42,153,0.25) 0%, rgba(26,11,61,0.35) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(212,175,55,0.15)",
        glowStrong: "0 0 60px rgba(212,175,55,0.3)",
        card: "0 20px 60px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
