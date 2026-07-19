import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Apple-inspired light system
        paper: "#F5F5F7", // page background
        surface: "#FFFFFF", // card / panel background
        ink: "#1D1D1F", // primary text
        secondary: "#6E6E73", // secondary / body text
        tertiary: "#86868B", // small captions, metadata labels
        hairline: "#D2D2D7", // borders
        accent: "#0071E3", // Apple blue — links, hover states, CTAs
        accentDark: "#0058B0",
        success: "#1D8F3B",
        warn: "#B25000",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Inter", "-apple-system", "BlinkMacSystemFont", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Inter", "-apple-system", "BlinkMacSystemFont", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["88px", { lineHeight: "1.03", letterSpacing: "-0.025em", fontWeight: "600" }],
        hero: ["72px", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "600" }],
        pagetitle: ["48px", { lineHeight: "1.08", letterSpacing: "-0.015em", fontWeight: "600" }],
        sectiontitle: ["32px", { lineHeight: "1.15", letterSpacing: "-0.005em", fontWeight: "600" }],
        phonename: ["40px", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "600" }],
        bodylg: ["20px", { lineHeight: "1.6", fontWeight: "400" }],
        meta: ["18px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["16px", { lineHeight: "1.5", fontWeight: "500" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        cardHover: "0 4px 12px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.10)",
        subtle: "0 1px 2px rgba(0,0,0,0.04)",
        glass: "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px rgba(0,0,0,0.06)",
        float: "0 12px 40px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
      },
      maxWidth: {
        content: "1120px",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadein: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeup: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scalein: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        fadein: "fadein 0.6s cubic-bezier(0.16,1,0.3,1)",
        fadeup: "fadeup 0.7s cubic-bezier(0.16,1,0.3,1) both",
        scalein: "scalein 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
