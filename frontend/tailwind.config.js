/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3C467B",
        secondary: "#50589C",
        third: "#636CCB",
        darkColor: "#3b3b3b"
      },
    },
  },
  plugins: [],
}
