/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          secondary: "rgb(var(--brand-secondary) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)",
          bg: "rgb(var(--brand-bg) / <alpha-value>)"
        }
      },
      boxShadow: {
        soft: "0 8px 30px var(--brand-shadow)"
      }
    }
  },
  plugins: []
};
