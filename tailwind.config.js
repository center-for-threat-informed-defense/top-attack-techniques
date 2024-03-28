/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ctid: {
          "primary-purple": "#5C6FC6",
          navy: "#212C5E",
          black: "#0B2338",
          "light-purple": "#BCA9DD",
        },
      },
    },
  },
  plugins: [],
};
