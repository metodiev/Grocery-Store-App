/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#16A34A",
          secondary: "#22C55E",
          dark: "#166534",
          bg: "#F8FAFC"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(22, 101, 52, 0.08)"
      }
    }
  },
  plugins: []
};
