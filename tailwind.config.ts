import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand tokens — use these everywhere; do NOT inline hex values in components
        "emerald-deep":  "#0d4a3a", // dark sections, headlines
        "emerald-mid":   "#10755A", // secondary CTA, hover states
        coral:           "#F26A75", // PRIMARY CTA — use sparingly, accent only
        "coral-deep":    "#D9505C", // coral hover
        blush:           "#F4C4CC", // soft pink dividers, tags
        sand:            "#F5EFE4", // PAGE BACKGROUND
        cream:           "#FCFAF5", // card bg on sand
        ink:             "#1A2E2A", // near-black body text
        stone:           "#6B7B74", // muted text
        gold:            "#f59e0b", // small accents
        navy:            "#1a3a52", // footer ONLY
        "royal-deep":   "#1F2D86", // dark royal blue headlines
        "hero-sky":      "#FCE8DC", // hero peach gradient top
      },
      fontFamily: {
        serif:  ["var(--font-fraunces)", "Georgia", "serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
} satisfies Config;
