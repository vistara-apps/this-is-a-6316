/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(240 100% 50%)",
        accent: "hsl(180 70% 50%)",
        bg: "hsl(230 15% 96%)",
        surface: "hsl(0 0% 100%)",
        "text-primary": "hsl(220 15% 15%)",
        "text-secondary": "hsl(220 15% 45%)",
      },
      fontSize: {
        display: ["3rem", { lineHeight: "1", fontWeight: "800" }],
        heading: ["1.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        body: ["1rem", { lineHeight: "1.75", fontWeight: "400" }],
        caption: ["0.875rem", { lineHeight: "1.25", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 8px 24px hsla(0, 0%, 0%, 0.12)",
        modal: "0 12px 36px hsla(0, 0%, 0%, 0.16)",
      },
      animation: {
        "fade-in": "fadeIn 250ms cubic-bezier(0.22,1,0.36,1)",
        "slide-up": "slideUp 250ms cubic-bezier(0.22,1,0.36,1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}