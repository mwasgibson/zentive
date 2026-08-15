/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D1220",
        paper: "#F3F5F1",
        surface: "#FFFFFF",
        border: "#DADFD8",
        muted: "#5B6472",
        text: "#10151C",
        signal: {
          DEFAULT: "#E2711D", // decorative/large accents only — fails WCAG contrast as text or under light text
          dark: "#9C4A10", // WCAG AA-safe (~5.6:1 on paper) — use for text and button hover states
        },
        wire: {
          DEFAULT: "#0F6E5D", // secondary accent — success/compliance
          light: "#E4F1EE",
        },
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};