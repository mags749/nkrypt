/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/App.{js,jsx,ts,tsx}", "./src/**/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Rubik-Regular"', ...defaultTheme.fontFamily.sans],
        display: ['"Aargh-Regular"'],
      },
    },
  },
  plugins: [],
};
