/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060810",
        card: "#11131C",
        primary: "#7C5CFF",
        secondary: "#22D3EE",
        success: "#22C55E",
        textMuted: "#C7C9D3",
        borderMuted: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        code: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
