/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090C",
        card: "#0F1117",
        primary: "#D4FF00",
        secondary: "#00F5A0",
        success: "#00F5A0",
        textMuted: "#C5C8D4",
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
