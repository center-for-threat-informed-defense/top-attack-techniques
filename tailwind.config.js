/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ctid: {
          navy: "#0D2F4F",
          black: "#111921",
          blue: "#005B94",
          "dark-navy": "#0B2338",
          "light-gray": "#BCBCBC",
          "light-blue": "#87DEFF",
        },
      },
    },
  },
  plugins: [],
};
