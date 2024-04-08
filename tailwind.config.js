/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mitre: {
          blue: "#005B94",
          highlighter: "#FFF601",
          "dark-navy": "#0B2338",
          navy: "#0D2F4F",
          "light-blue": "#87DEFF",
          black: "#111921",
          "dark-gray": "#7E8284",
          silver: "#D4D4D3",
          "light-silver": "#F1F3F4",
          "primary-purple": "#5C6FC6",
          "light-purple": "#BCA9DD",
        },
      },
    },
  },
  plugins: [],
};
