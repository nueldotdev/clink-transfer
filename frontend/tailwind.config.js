/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#41CBBF",
        darkest: "#0A3342",
        dark: "#164E63",
        mid: "#BEC9DF",
        light: "#DDE2EE",
        lightest: "#FFFFFF"
        // darkest: "#0D101A",
      },
    },
  },
  plugins: [],
}