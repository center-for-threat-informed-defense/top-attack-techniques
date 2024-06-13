/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ctid: {
          navy: "#212C5E",
          black: "#0B2338",
          "primary-purple": "#7450B2",
          "light-purple": "#CEBEEA",
          blue: "#005B94",
          "dark-navy": "#0B2338",
          "light-gray": "#BCBCBC",
        },
      },
    },
  },
  plugins: [],
};
