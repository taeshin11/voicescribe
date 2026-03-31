import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          bg: "#F8FAFB",
          "bg-dark": "#0F172A",
        },
        secondary: {
          bg: "#EEF2F6",
          "bg-dark": "#1E293B",
        },
        accent: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        border: "#E2E8F0",
        "border-dark": "#334155",
        "text-primary": "#1A202C",
        "text-secondary": "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
