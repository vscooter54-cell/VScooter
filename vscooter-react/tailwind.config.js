/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#EF4444",
        "primary-dark": "#DC2626",
        "primary-light": "#FCA5A5",
        secondary: "#0F172A",
        accent: "#F97316",
        "background-light": "#FFFFFF",
        "background-dark": "#0F0F0F",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
