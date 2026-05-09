import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 70px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        hichat: {
          "primary": "#111111",
          "primary-content": "#ffffff",
          "secondary": "#404040",
          "secondary-content": "#ffffff",
          "accent": "#737373",
          "accent-content": "#ffffff",
          "neutral": "#0a0a0a",
          "neutral-content": "#f5f5f5",
          "base-100": "#ffffff",
          "base-200": "#f6f6f6",
          "base-300": "#e7e7e7",
          "base-content": "#111111",
          "info": "#171717",
          "success": "#262626",
          "warning": "#525252",
          "error": "#111111",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "999px",
          "--animation-btn": "0.15s",
          "--btn-text-case": "none",
          "--border-btn": "1px",
        },
      },
      "lofi",
      "black",
    ],
  },
};
