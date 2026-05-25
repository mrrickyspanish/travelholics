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
        "emerald-deep":  "#0d4a3a", // footer, dark sections, headline accents
        "emerald-mid":   "#10755A", // secondary CTA, hover states
        coral:           "#F26A75", // PRIMARY CTA, script underline, key accents
        "coral-deep":    "#D9505C", // coral hover
        blush:           "#F4C4CC", // soft pink dividers, tags, subtle bg
        sand:            "#F5EFE4", // PAGE BACKGROUND
        cream:           "#FCFAF5", // card bg on sand
        ink:             "#2A3B36", // body text
        stone:           "#6B7B74", // muted text
        gold:            "#f59e0b", // small accents — badges, hairline rules
      },
    },
  },
  plugins: [],
} satisfies Config;
